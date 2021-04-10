const { model, Schema } = require("mongoose");

const trxSchema = new Schema(
  {
    attendance: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = model("trx", trxSchema);
