var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var findOrCreate = require("mongoose-findorcreate");

var schema = new Schema(
  {
    id: String,
    question: String,
    type: String,
    params: Array
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);
schema.plugin(findOrCreate);
export default mongoose.model("questionv2", schema);
