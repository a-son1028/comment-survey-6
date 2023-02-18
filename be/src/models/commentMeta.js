var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var groupSchema = new Schema(
  {
    commentId: Schema.Types.ObjectId,
    key: String,
    value: String
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

export default mongoose.model("commentMeta", groupSchema);
