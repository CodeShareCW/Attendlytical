const { UserInputError } = require("apollo-server");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Person = require("../../models/person.model");
const { PersongqlParser } = require("./merge");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validators");

const SECRET_KEY = process.env.SECRET_KEY;

function generateToken(person) {
  const token = jwt.sign(
    {
      id: person.id,
      email: person.email,
      firstName: person.firstName,
      userLevel: person.userLevel,
    },
    SECRET_KEY,
    {
      expiresIn: "1h",
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
          throw new UserInputError("Person not exist");
        }
      } catch (err) {
        let errors = {};
        errors.general = err.message;
        throw new UserInputError(err.message, { errors });
      }
    },
  },
  Mutation: {
    async register(_, args, context) {
      try {
        const { valid, errors } = validateRegisterInput(
          args.personInput.firstName,
          args.personInput.lastName,
          args.personInput.email,
          args.personInput.password,
          args.personInput.confirmPassword
        );

        if (!valid) {
          throw new UserInputError("Errors", { errors });
        }

        const existingPerson = await Person.findOne({
          email: args.personInput.email,
        });
        if (existingPerson) {
          errors.general = "Email already taken";
          throw new UserInputError("User exists already", {
            errors,
          });
        }
        const hashedPassword = await bcrypt.hash(args.personInput.password, 12);

        const newPerson = new Person({
          firstName: args.personInput.firstName,
          lastName: args.personInput.lastName,
          email: args.personInput.email,
          password: hashedPassword,
          createdAt: args.personInput.createdAt,
          userLevel: args.personInput.userLevel,
        });

        const savedPerson = await newPerson.save();
        return PersongqlParser(savedPerson);
      } catch (err) {
        let errors = {};
        errors.general = err.message;
        throw new UserInputError(err.message, { errors });
      }
    },
    login: async (_, { email, password }) => {
      try {
        const { valid, errors } = validateLoginInput(email, password);

        if (!valid) throw new UserInputError("UserInputError", { errors });

        const person = await Person.findOne({ email: email });
        if (!person) {
          errors.general = "Email does not exist";
          throw new UserInputError("Email does not exist!", { errors });
        }
        const isEqual = await bcrypt.compare(password, person.password);
        if (!isEqual) {
          errors.general = "Password is incorrect";
          throw new UserInputError("Password is incorrect!", { errors });
        }
        const token = generateToken(person);
        return PersongqlParser(person, token);
      } catch (err) {
        let errors = {};
        errors.general = err.message;
        throw new UserInputError(err.message, { errors });
      }
    },
  },
};
