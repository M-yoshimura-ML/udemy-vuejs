import Vue from 'vue';
import App from './App.vue';
import axios from 'axios';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

axios.defaults.baseURL = "https://firestore.googleapis.com/v1/projects/YOUR_PROJECT_ID/databases/(default)/documents";

store.dispatch('autoLogin').then(()=>{
  new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount('#app')
});

