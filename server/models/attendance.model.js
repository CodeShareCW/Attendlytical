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
    start: {
      type: String,
      required: true,
    },
    end: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    gPhoto: {
      type: [Schema.Types.ObjectId],
      ref: "GroupPhoto",
    },
    attendees: {
      type: [Schema.Types.ObjectId],
      ref: "Person",
    },
    absentees: {
      type: [Schema.Types.ObjectId],
      ref: "Person",
    },
  },
  { timestamps: true }
);

module.exports = model("Attendance", attendanceSchema);
