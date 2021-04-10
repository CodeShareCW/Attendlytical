const { UserInputError } = require("apollo-server");
const Notification = require("../../models/notification.model");
const Person = require("../../models/person.model");
const { NotificationgqlParser, NotificationsgqlParser } = require("./merge");

const checkAuth = require("../../util/check-auth");

module.exports = {
  Query: {
    async getNotifications(_, { cursor, limit }, context) {
      const user = checkAuth(context);

      try {
        let searchedNotifications;
        if (!cursor) {
          searchedNotifications = await Notification.find({
            receiver: user._id,
          })
            .limit(limit)
            .sort({ _id: -1 });
        } else {
          searchedNotifications = await Notification.find({
            receiver: user._id,
            _id: { $lt: cursor },
          })
            .limit(limit)
            .sort({ _id: -1 });
        }

        if (searchedNotifications) {
          await searchedNotifications.map(async (n) => {
            if (n.checked != true)
              await Notification.updateOne(n, { $set: { checked: true } });
          });
        }

        let hasNextPage = true;

        if (searchedNotifications.length < limit) hasNextPage = false;

        return NotificationsgqlParser(searchedNotifications, hasNextPage);
      } catch (err) {
        throw err;
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

        if (searchedNotification.receiver != user._id) {
          errors.general = "Receiver is not the current user";
          throw new UserInputError("Receiver is not the current user");
        }

        return NotificationgqlParser(searchedNotification);
      } catch (err) {
        throw err;
      }
    },
    async getUncheckedNotificationsCount(_, __, context) {
      const user = checkAuth(context);
      let errors = {};
      try {
        const uncheckedNotifications = await Notification.find(
          {
            receiver: user._id,
            checked: false,
          },
          ["id"]
        );
        return uncheckedNotifications.length;
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {},
};
