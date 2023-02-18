import _ from "lodash";

export default {
  setQuestions(state, questions) {
    state.questions = questions;
  },
  setComments(state, comments) {
    state.comments = comments;
  },
  setQuestionId(state, questionId) {
    state.questionId = questionId;
  },
  setAnswer(state, answer) {
    state.answer = answer;
  },
  setQuestionAnsweringByKey(state, { key, value }) {
    _.set(state.questionAnswering, key, value);
    // state.questionAnswering[key] = value;
  },
};
