import actions from './actions';
import mutations from './mutations';
import getters from './getters';

const userInfo = JSON.parse(localStorage.getItem('userInfo'));

export function initialState() {
  return {
    token: null,
    userInfo: userInfo
  };
}

const state = initialState();

export default {
  state,
  actions,
  getters,
  mutations,
};
