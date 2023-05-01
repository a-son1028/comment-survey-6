var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var groupSchema = new Schema(
  {
    questionIds: [],
    type1: [],
    type2: [],
    type3: [],
    type4: [],
    type5: [],
    isDone: {
      type: Boolean,
      default: false
    },
    isSelected: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

export default mongoose.model("appSurveyv2", groupSchema);
