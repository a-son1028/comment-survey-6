var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var findOrCreate = require("mongoose-findorcreate");

var userSchema = new Schema(
  {
    email: String,
    fullName: String,
    education: String,
    city: String,
    country: String,
    speciality: String,
    occupation: String,
    age: Number,
    groupSurvey: String,
    isAnswerd: {
      type: Boolean,
      default: false
    },
    gender: {
      type: String,
      enum: ["male", "female"]
    },
    fieldOfWorkType: {
      type: String
    },
    fieldOfWork: {
      type: String
    },
    OSOfDevices: {
      type: String
    },
    currentQuestion: {
      type: Number
    },
    hasExperience: {
      type: String
    },
    commentSurveyId: Schema.Types.ObjectId,
    appSurveyId: Schema.Types.ObjectId,

    isInstruction: {
      type: Boolean,
      default: false
    },
    currentStage: {
      type: String,
      default: "question"
    },
    questionIds: [String]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

userSchema.virtual("answers", {
  ref: "answer",
  localField: "_id",
  foreignField: "userId"
});

userSchema.plugin(findOrCreate);

export default mongoose.model("userv2", userSchema);
