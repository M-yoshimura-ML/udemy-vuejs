import Vue from 'vue';
import App from './App.vue';
import axios from 'axios';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

axios.defaults.baseURL = "https://firestore.googleapis.com/v1/projects/vuejs-axios-d1ebd/databases/(default)/documents";
//axios.defaults.headers.common["Authorization"]="adjiyuioghjkl;"
//axios.defaults.headers.get["accept"]="application/json;"

store.dispatch('autoLogin').then(()=>{
  new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount('#app')
});

