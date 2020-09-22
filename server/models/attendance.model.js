const { model, Schema } = require("mongoose");

const attendanceSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    participants: {
      type: [Schema.Types.ObjectId],
      ref: "Person",
    },
    absentees: {
      type: [Schema.Types.ObjectId],
      ref: "Person",
    },
    attendees: {
      type: [Schema.Types.ObjectId],
      ref: "Person",
    }
  },
  { timestamps: true }
);

module.exports = model("Attendance", attendanceSchema);
