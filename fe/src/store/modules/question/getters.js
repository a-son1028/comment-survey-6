export default {
  getQuestions(state) {
    return state.questions;
  },
  getComments(state) {
    return state.comments;
  },
  getAnswer(state) {
    return state.answer;
  },
  getQuestionAnswered(state) {
    return (state?.answer?.questions || []).find((item) => item.stt === state.questionId);
  },

  getSurvey(state) {
    return state?.answer?.survey;
  },
  getQuestion(state) {
    return state.questions.find((item) => item.stt === state.questionId);
  },
  getQuestionId(state) {
    return state.questionId;
  },
  getQuestionAnswering(state) {
    return state.questionAnswering;
  },
};
