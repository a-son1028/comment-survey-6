import Vue from "vue";
import VueRouter from "vue-router";

import DefaultLayout from "@/layouts/DefaultLayout.vue";
import Question from "@/views/question/Question.vue";
// import Introduce from "@/views/introduce/Introduce.vue";
import NotFound from "@/components/NotFound.vue";
import Login from "@/views/Login.vue";
import SignUp from "@/views/SignUp.vue";
import Success from "@/views/Success.vue";
import Confirm from "@/views/Confirm.vue";
import Step1 from "@/views/Step1.vue";

// midlewares

Vue.use(VueRouter);
import checkAuth from "@/middleware/auth.js";

const routes = [
  {
    path: "*",
    name: "NotFound",
    component: NotFound,
  },
  {
    path: "/",
    component: DefaultLayout,
    beforeEnter: checkAuth,
    children: [
      // {
      //   path: "",
      //   component: Introduce,
      // },
      {
        path: "/",
        component: Question,
      },
      {
        path: "/survey",
        component: Step1,
      },
      {
        path: "/success",
        component: Success,
      },
      {
        path: "/confirm",
        component: Confirm,
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp,
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
