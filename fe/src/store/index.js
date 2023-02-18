import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import question from './modules/question'
Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
      user,
      question
    },
    state: {
      
    },
  });

export default store