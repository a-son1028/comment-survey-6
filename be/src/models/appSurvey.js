var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var groupSchema = new Schema(
  {
    apps: [
      {
        appId: Schema.Types.ObjectId,
        commentIds: [Schema.Types.ObjectId],
        stt: Number
      }
    ],
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

export default mongoose.model("appSurvey5", groupSchema);
