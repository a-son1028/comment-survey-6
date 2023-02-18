import Vue from 'vue'
import Toast from "vue-toastification";
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import App from './App.vue'
import router from './router'
import store from './store'


import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@/assets/fonts/font-awesome-4.7.0/css/font-awesome.min.css'
import '@/assets/styles/util.css'
import '@/assets/styles/main.css'
import "vue-toastification/dist/index.css";

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(Toast, {});

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
