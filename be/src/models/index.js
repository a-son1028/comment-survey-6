import userModel from "./user.model";
import answerModel from "./answer.model";
import commentModel from "./comment";
import commentSurvey from "./commentSurvey";
import appSurvey from "./appSurvey";

import commentMeta from "./commentMeta";
import App from "./app.model";
import App1 from "./app1.model";
import Question from "./question.model";
class Model {
  constructor() {
    this.User = userModel;
    this.Answer = answerModel;
    this.Comment = commentModel;
    this.CommentSurvey = commentSurvey;
    this.AppSurvey = appSurvey;
    this.CommentMeta = commentMeta;
    this.App = App;
    this.App1 = App1;
    this.Question = Question;
  }
}
export default new Model();
