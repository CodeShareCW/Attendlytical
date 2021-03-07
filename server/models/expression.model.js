const { model, Schema } = require("mongoose");

const expressionSchema = new Schema(
  {
    attendance: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      required: true,   
    },
    expression: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = model("Expression", expressionSchema);
