import { SIGNUP, LOGIN, GET_USER_INFO, UPDATE_INSTRUCTION, UPDATE_SURVEY } from "./action.type";
import api from "@/services/api";

export default {
  [SIGNUP](store, payload) {
    return api({}).post("/auth/signup", payload);
  },
  [LOGIN](store, email) {
    return api({})
      .post("/auth/login", {
        email: email,
      })
      .then((response) => {
        store.commit("setUserInfo", response.data);
        localStorage.userInfo = JSON.stringify(response.data);
        localStorage.token = response.data.token;
      });
  },
  [GET_USER_INFO](store) {
    return api({
      headers: { Authorization: localStorage.token },
    })
      .get("/user/info")
      .then((response) => {
        store.commit("setUserInfo", response.data);

        store.commit("setQuestionId", response.data.currentQuestion);
      });
  },
  [UPDATE_INSTRUCTION](store) {
    return api({
      headers: { Authorization: localStorage.token },
    })
      .put("/instruction")
      .then((response) => {
        store.commit("setUserInfo", response.data);
      });
  },
  [UPDATE_SURVEY](store, survey) {
    return api({
      headers: { Authorization: localStorage.token },
    }).put("/survey", { survey });
  },
};
