<template>
  <body>
    <main>
      <nav>
        <router-link to="/messages">
          <div id="corp">
            <img id="logo" src="./assets/icon.png" alt="logo Groupomania" />
            <h1>Groupomania</h1>
          </div>
        </router-link>
        <div v-if='user.userlastname' id="burger">
          <input type="checkbox" id="burger-shower" class="burger-shower">
          <label for="burger-shower" class="hamburger">
              <i class="fas fa-bars"></i>        
          </label>
          <ul class="burger-menu sub">
                <li @click="goProfile()" id="ico_user"><label for="burger-shower"><i class="far fa-user"></i>PROFILE</label></li>
                <li @click="goMessage()" id="ico_mess"><label for="burger-shower"><i class="far fa-comments"></i>MESSAGES</label></li>
                <li id="ico_cross" @click="deconnexion()"><label for="burger-shower"><i class="fas fa-times"></i>DECONNEXION</label></li>
          </ul>
        </div>
      </nav>
      <div  v-if='user.userlastname' id="user_menu">
        Bonjour<span class="userLogged">{{user.username}}</span><span class="userlastnameLogged"> {{user.userlastname}}</span><span class="isAdmin" v-if="user.isAdmin == 1">(Administrateur)</span>
      </div>
      <router-view></router-view>
    </main>
  </body>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Profile",
  mounted: function () {
    if (this.$store.state.user.userId == -1) {
      this.$router.push("/");
      return;
    }
    this.$store.dispatch("getUserInfos");
  },
  computed: {
    ...mapState({
      user: "userInfos",
      message:"listeMessage",
    }),
  },
  methods: {
    deconnexion: function () {
      this.$store.commit("deconnexion");
      this.$router.push("/");
    },
    goProfile:function(){
      this.$router.push('/PROFILE');
    },
    goMessage:function(){
      this.$router.push('/messages');
    }
  },
};
</script>



<style>
* {
  font-family: "Poppins", sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  background-color: #fff;
  color: #000;
  justify-content: center;
  align-items: center;
  display: flex;
  min-height: auto;
}

a {
  text-decoration: none;
}

main {
  width: 1200px;
  margin: auto;
}

nav {
  display: flex;
}

#corp {
  display: flex;
}

#logo {
  width: 60px;
  margin: 9px 5% 0 5%;
  height: fit-content;
}

h1 {
  font-size: 40px;
  padding-top: 17px;
  color: #000;
}

#user_menu{
    display: flex;
    margin-left: auto;
    top: 24px;
    padding-left: 5%;
    position: relative;
    font-size: 22px;
    color: #000;
}

#user_menu span{
  color: #FD2D01;
  display: flex;
}

.userLogged,
.userlastnameLogged,
.isAdmin{
  margin-left: 5px;
}
.userlastnameLogged{
  text-transform: uppercase;
}
#burger {
  position: relative;
  margin-left: auto;
  padding: 0;
  list-style: none;
  height: 53px;
  width: 44px;
  top: 12px;
  left: -39px;
}

.burger-shower {
  display: none;
}

.burger-shower:checked ~ .burger-menu {
  display: inline-block;
  padding: 0;
  left: -372%;
  top: 45px;
  color: #000;
  border: 3px solid #FD2D01;
}

.hamburger {
  cursor: pointer;
  display:block;
  width: 3.4em;
  height: 2.4em;
  line-height: .1em;
  padding: 0 .4em .4em;
}

.hamburger i{
  font-size: 40px;
}

.burger-menu {
   display:none;
}

.sub {
  display: none;
  position: absolute;
  border-radius: 10px 0 10px 10px;
}

.sub li {
  list-style: none;
  display: block;
  padding: 20px;
  color: #000;
  cursor: pointer;
  background-color: #fff;
  border-radius: 5px;
}

.sub li i{
  color: #FD2D01;
}

#ico_menu {
  position: relative;
  font-size: 40px;
  color: #000;
  margin: 30px;
  top: 6px;
  left: -25px;
}

#ico_user,
#ico_cross {
  position: relative;
  font-size: 18px;
  color: #000;
}

#ico_user i,
#ico_cross i,
#ico_mess i {
margin-right: 10px;
}

#ico_user{
border-radius: 10px 0 0 0;
}

#ico_cross {
  border-radius:  0 0 10px 10px;
}

#ico_mess {
  border-radius:  0;
}
</style>
