<template>
  <div>
    <h2>登録</h2>
    <label for="email">Email</label>
    <input id="email" type="email" v-model="email">
    <br><br>
    <label for="password">Password</label>
    <input id="password" type="password" v-model="password">
    <br><br>
    <button @click="register">登録</button>

  </div>
</template>

<script>
// import axios from '../axios-auth';
export default {
  data(){
    return{
      email:'',
      password:''
    }
  },
  methods:{
    register(){
      this.$store.dispatch('register', {
        email: this.email,
        password: this.password
      });      
      // axios.post(
      //   '/accounts:signUp?key=AIzaSyAKFXcU6FoPh29PZ4NqhcGAWgg8nypO8YU',
      //   {
      //     email:this.email,
      //     password:this.password,
      //     returnSecureToken:true
      //   }).then(response=>{
      //     console.log(response);
      //   });
      this.email='';
      this.password='';
    }
  }
}
</script>

