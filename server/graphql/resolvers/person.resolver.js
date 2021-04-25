const { UserInputError } = require('apollo-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { cloudinary } = require('../../util/cloudinary');

const Person = require('../../models/person.model');
const Notification = require('../../models/notification.model');

const { PersongqlParser } = require('./merge');
const {
  validateRegisterInput,
  validateLoginInput,
} = require('../../util/validators');

const checkAuth = require('../../util/check-auth');

const { sendEmail } = require('../../util/mail');

//global mail type naming
const { MAIL_TEMPLATE_TYPE } = require('../../globalData');

const SECRET_KEY = process.env.SECRET_KEY;

function generateToken(person) {
  const token = jwt.sign(
    {
      _id: person.id,
      email: person.email,
      firstName: person.firstName,
      lastName: person.lastName,
      cardID: person.cardID,
      userLevel: person.userLevel,
      profilePictureURL: person.profilePictureURL,
    },
    SECRET_KEY,
    {
      expiresIn: '8h',
    }
  );
  return token;
}

module.exports = {
  Query: {
    async getPeople() {
      try {
        const searchedPeople = await Person.find().sort({ createdAt: -1 });
        return searchedPeople.map((person) => {
          return PersongqlParser(person);
        });
      } catch (err) {
        throw err;
      }
    },
    async getPerson(_, { personID }) {
      try {
        const person = await Person.findById(personID);
        if (person) {
          return PersongqlParser(person);
        } else {
          throw new UserInputError('Person not exist');
        }
      } catch (err) {
        let errors = {};
        errors.general = err.message;
        throw new UserInputError(err.message, { errors });
      }
    },
  },
  Mutation: {
    async register(
      _,
      {
        personInput: {
          firstName,
          lastName,
          email,
          cardID,
          password,
          confirmPassword,
          userLevel,
        },
      },
      context
    ) {
      try {
        const { valid, errors } = validateRegisterInput(
          firstName,
          lastName,
          email,
          cardID,
          password,
          confirmPassword
        );

        if (!valid) {
          throw new UserInputError('Errors', { errors });
        }

        const existingPerson = await Person.findOne({
          email,
        });
        if (existingPerson) {
          errors.email = 'Email already taken';
          throw new UserInputError('Email exists already', {
            errors,
          });
        }
        const hashedPassword = await bcrypt.hash(password, 12);

        const newPerson = new Person({
          firstName,
          lastName,
          email,
          cardID,
          password: hashedPassword,
          userLevel,
        });

        //for student
        if (newPerson.userLevel === 0) {
          const notification = new Notification({
            receiver: newPerson.id,
            title: 'Welcome To Attendlytical',
            content:
              'Please remember to upload your face photograph for attendance verification',
          });
          await notification.save();
        }
        const savedPerson = await newPerson.save();

        //send email
        await sendEmail(email, firstName, MAIL_TEMPLATE_TYPE.Welcome);

        const token = generateToken(savedPerson);
        return PersongqlParser(savedPerson, token);
      } catch (err) {
        throw err;
      }
    },
    login: async (_, { email, password }) => {
      try {
        const { valid, errors } = validateLoginInput(email, password);

        if (!valid) throw new UserInputError('UserInputError', { errors });

        const person = await Person.findOne({ email: email });
        if (!person) {
          errors.general = 'Email does not exist';
          throw new UserInputError('Email does not exist!', { errors });
        }

        const isEqual = await bcrypt.compare(password, person.password);

        if (person.googleID && !isEqual) {
          throw new UserInputError('Please sign in using Google', { errors });
        }

        if (!person.googleID && !isEqual) {
          errors.general = 'Password is incorrect';
          throw new UserInputError('Password is incorrect!', { errors });
        }

        await Person.updateOne(person, { $set: { lastLogin: Date.now() } });

        const token = generateToken(person);
        return PersongqlParser(person, token);
      } catch (err) {
        throw err;
      }
    },

    googleSignIn: async (
      _,
      {
        googlePersonInput: {
          googleID,
          googleEmail,
          googleFirstName,
          googleLastName,
          googleProfilePicture,
        },
      }
    ) => {
      try {
        const person = await Person.findOne({ email: googleEmail });
        //register new one if not exist
        if (!person) {
          const newPerson = new Person({
            googleID,
            firstName: googleFirstName,
            lastName: googleLastName,
            email: googleEmail,
            cardID: 'none',
            password: 'dummyPass',
            profilePictureURL: googleProfilePicture,
            userLevel: -1,
          });

          const savedPerson = await newPerson.save();
          //send email
          await sendEmail(
            savedPerson.email,
            savedPerson.firstName,
            MAIL_TEMPLATE_TYPE.Welcome
          );
          const token = generateToken(savedPerson);
          return PersongqlParser(savedPerson, token);
        } else {
          //check if google id null first
          if (!person.googleID) {
            await Person.updateOne(person, { $set: { googleID: googleID } });
          }

          await Person.updateOne(person, { $set: { lastLogin: Date.now() } });

          const foundPerson = await Person.findOne({ email: googleEmail });

          const token = generateToken(person);
          return PersongqlParser(foundPerson, token);
        }
      } catch (err) {
        throw err;
      }
    },

    async editCardIDAndUserLevel(_, { cardID, userLevel }, context) {
      const currUser = checkAuth(context);
      let errors = {};
      try {
        await Person.findByIdAndUpdate(currUser._id, {
          $set: {
            userLevel,
            cardID,
          },
        });
        const updatedPerson = await Person.findById(currUser._id);

        if (!updatedPerson) {
          errors.general = 'User do not exist';
          throw new UserInputError('User do not exist!', { errors });
        }

        //for student
        if (updatedPerson.userLevel === 0) {
          const notification = new Notification({
            receiver: updatedPerson.id,
            title: 'Welcome To Attendlytical',
            content:
              'Please remember to upload your face photograph for attendance verification',
          });
          await notification.save();
        }

        const token = generateToken(updatedPerson);
        return PersongqlParser(updatedPerson, token);
      } catch (err) {
        throw err;
      }
    },
    async editProfile(
      _,
      { firstName, lastName, cardID, profilePicture },
      context
    ) {
      const currUser = checkAuth(context);
      let errors = {};

      try {
        //if profilePicture exist
        if (profilePicture) {
          const uploadedResponse = await cloudinary.uploader.upload(
            profilePicture,
            { upload_preset: 'attendlytical_profilepicture' }
          );

          const oldPerson = await Person.findByIdAndUpdate(currUser._id, {
            $set: {
              firstName,
              lastName,
              cardID,
              profilePictureURL: uploadedResponse.secure_url,
              profilePicturePublicID: uploadedResponse.public_id,
            },
          });
          if (oldPerson.profilePicturePublicID)
            await cloudinary.uploader.destroy(oldPerson.profilePicturePublicID);
        } else {
          await Person.findByIdAndUpdate(currUser._id, {
            $set: {
              firstName,
              lastName,
              cardID,
            },
          });
        }
        const updatedPerson = await Person.findById(currUser._id);

        if (!updatedPerson) {
          errors.general = 'User do not exist';
          throw new UserInputError('User do not exist!', { errors });
        }

        const token = generateToken(updatedPerson);
        return PersongqlParser(updatedPerson, token);
      } catch (err) {
        throw err;
      }
    },
  },
};
