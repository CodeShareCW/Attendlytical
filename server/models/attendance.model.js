const { model, Schema } = require("mongoose");

const attendanceSchema = new Schema(
  {
    course: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = model("Attendance", attendanceSchema);
