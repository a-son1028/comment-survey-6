var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var findOrCreate = require("mongoose-findorcreate");

var answerSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId
    },
    isHasComment: Schema.Types.Number,
    comment: Schema.Types.String,
    survey: Schema.Types.Mixed,
    training1: Schema.Types.Mixed,
    training1Time: Schema.Types.Number,
    testing1: Schema.Types.Mixed,
    testing1Time: Schema.Types.Number,

    training2: Schema.Types.Mixed,
    training2Time: Schema.Types.Number,
    testing2: Schema.Types.Mixed,
    testing2Time: Schema.Types.Number,

    training3: Schema.Types.Mixed,
    training3Time: Schema.Types.Number,
    testing3: Schema.Types.Mixed,
    testing3Time: Schema.Types.Number,

    training4: Schema.Types.Mixed,
    training4Time: Schema.Types.Number,
    testing4: Schema.Types.Mixed,
    testing4Time: Schema.Types.Number,

    training5: Schema.Types.Mixed,
    training5Time: Schema.Types.Number,
    testing5: Schema.Types.Mixed,
    testing5Time: Schema.Types.Number,
    isSatisfied: Schema.Types.Boolean,
    isHasComment: Schema.Types.Boolean,
    comment: Schema.Types.String
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);
answerSchema.plugin(findOrCreate);

answerSchema.virtual("user", {
  ref: "user",
  localField: "_id",
  foreignField: "userId"
});

export default mongoose.model("answerv2", answerSchema);
