const { model, Schema } = require("mongoose");

const warningSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    count: {
      type: Number,
      default: 1
    },
  },
  { timestamps: true }
);

module.exports = model("Warning", warningSchema);
