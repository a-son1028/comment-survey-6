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
    questions: [
      {
        appId: {
          type: Schema.Types.ObjectId,
          required: true
        },
        stt: {
          type: Number,
          required: true
        },
        time: {
          type: Number,
          required: true
        },
        responses: Schema.Types.Mixed
      }
    ]
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

export default mongoose.model("answer5", answerSchema);
