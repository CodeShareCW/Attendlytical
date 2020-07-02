const { UserInputError } = require("apollo-server");
const Notification = require("../../models/notification.model");
const Person = require("../../models/person.model");
const { NotificationgqlParser } = require("./merge");

const checkAuth = require("../../util/check-auth");

module.exports = {
  Query: {
    async getNotifications(_, __, context) {
      const user = checkAuth(context);

      try {
        const searchedNotifications = await Notification.find({
          receiver: user.id,
        }).sort({ createdAt: -1 });
        return searchedNotifications.map((n) => {
          return NotificationgqlParser(n);
        });
      } catch (err) {
        errors.general = err.message;
        throw new UserInputError(err.message, { errors });
      }
    },
    async getNotification(_, { notificationID }, context) {
      const user = checkAuth(context);
      let errors = {};
      try {
        const searchedNotification = await Notification.findById(
          notificationID
        );

        if (!searchedNotification) {
          errors.general = "Notification do not exist";
          throw new UserInputError("Notification do not exist");
        }

        if (searchedNotification.receiver != user.id) {
          errors.general = "Receiver is not the current user";
          throw new UserInputError("Receiver is not the current user");
        }

        return PersongqlParser(searchedNotification);
      } catch (err) {
        errors.general = err.message;
        throw new UserInputError(err.message, { errors });
      }
    },
  },
};
