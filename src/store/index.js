import Vue from 'vue';
import Vuex from 'vuex';
import axios from '../axios-auth';
import router from '../router';
import axiosRefresh from '../axios-refresh';

Vue.use(Vuex);

export default new Vuex.Store({
  state:{
    idToken: null
  },
  getters: {
    idToken: state => state.idToken
  },
  mutations:{
    updateIdToken(state, idToken){
      state.idToken = idToken;
    }    
  },
  actions: {
    async autoLogin({commit, dispatch}){
      const idToken = localStorage.getItem('idToken');
      if (!idToken) return;

      const now = new Date();
      const expiryTimeMs = localStorage.getItem('expiryTimeMs');
      const isExpired = now.getTime() >= expiryTimeMs;
      const refreshToken = localStorage.getItem('refreshToken');

      if (isExpired) {
        await dispatch('refreshIdToken', refreshToken);
      } else{
        const expiresInMs = expiryTimeMs - now.getTime();
        setTimeout(()=>{
          dispatch('refreshIdToken', refreshToken);
        }, expiresInMs);
        commit('updateIdToken', idToken);
      }
    },
    login({dispatch}, authData){
      axios.post(
        '/accounts:signInWithPassword?key=AIzaSyAKFXcU6FoPh29PZ4NqhcGAWgg8nypO8YU',
        {
          email:authData.email,
          password:authData.password,
          returnSecureToken:true
        }).then(response=>{
          dispatch('setAuthData', {
            idToken: response.data.idToken,
            expiresIn: response.data.expiresIn,
            refreshToken: response.data.refreshToken
          });
          router.push('/');
        });
    },
    logout({commit}){
      commit('updateIdToken', null);
      localStorage.removeItem('idToken');
      localStorage.removeItem('expiryTimeMs');
      localStorage.removeItem('refreshToken');
      router.replace('/login');
    },
    async refreshIdToken({dispatch}, refreshToken){
      await axiosRefresh.post('/token?key=AIzaSyAKFXcU6FoPh29PZ4NqhcGAWgg8nypO8YU',
        {
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }).then(response=>{
          dispatch('setAuthData', {
            idToken: response.data.idToken,
            expiresIn: response.data.expiresIn,
            refreshToken: response.data.refreshToken
          });
            // commit('updateToken', response.data.id_token);
            // setTimeout(()=>{
            //   dispatch('refreshIdToken', response.data.refresh_token);
            // },response.data.expire_in * 1000);
        });     
    },
    register({dispatch}, authData){
      axios.post(
        '/accounts:signUp?key=AIzaSyAKFXcU6FoPh29PZ4NqhcGAWgg8nypO8YU',
        {
          email:authData.email,
          password:authData.password,
          returnSecureToken:true
        }).then(response=>{
          dispatch('setAuthData', {
            idToken: response.data.idToken,
            expiresIn: response.data.expiresIn,
            refreshToken: response.data.refreshToken
          });          
          // commit('updateToken', response.data.idToken);
          console.log(response);
          router.push('/');
        });
    },
    setAuthData({commit, dispatch}, authData){
          const now = new Date();
          const expiryTimeMs = now.getTime() + authData.expiresIn * 1000;
          commit('updateIdToken', authData.idToken);
          localStorage.setItem('idToken', authData.idToken);
          localStorage.setItem('expiryTimeMs', expiryTimeMs);
          localStorage.setItem('refreshToken', authData.refreshToken);
          //console.log(response);
          setTimeout(() =>{
            dispatch('refreshIdToken', authData.refresh_token);
          }, authData.expiresIn * 1000);
    }
  }
});
