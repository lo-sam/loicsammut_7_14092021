<template>
    <div id="connex">
      <h1 id="connex__title" v-if = "mode == 'CONNEXION'">Connexion</h1>
      <h1 id="connex__title" v-else>Inscription</h1>
      <p class="quest_compte" v-if="mode == 'CONNEXION'">Vous n'avez pas de compte?<span id="switchIncrip" @click="switchINSCRIPTION()"> Créer un compte</span></p>
      <p class="quest_compte" v-else>Vous avez déjà un compte?<span id="switchConnex" @click="switchCONNEXION()"> Se connecter</span></p>
      <input v-model="email" placeholder="E-mail" type="mail" id="email">
      <input v-model="username" v-if="mode=='INSCRIPTION'" placeholder="Nom" type="text" id="username">
      <input v-model="password" placeholder="Mot de passe" type="password" id="password">
      <input v-model="bio" v-if="mode=='INSCRIPTION'" placeholder="Poste" type="text" id="bio">
      <div class="err_connex" v-if="mode=='CONNEXION' && status=='error_login'">E-mail et/ou mot de passe incorrect</div>
      <button v-if="mode=='CONNEXION'" id="btn_connex" @click="connexion()">
          CONNEXION
      </button>
      <button v-else id="btn_inscrip" @click="inscription()">
            CREER UN COMPTE
      </button>

    <router-view></router-view>
    </div>

</template>

<script>
import {mapState} from 'vuex'

export default{
  name:'CONNEXION',
  data : function(){
    return{
      mode:'CONNEXION',
      email:'',
      username:'',
      password:'',
      bio:''
    }
  },
  computed:{
    ...mapState(['status'])
  },
  methods:{
    switchINSCRIPTION: function(){
      this.mode = 'INSCRIPTION';
    },
    switchCONNEXION: function(){
      this.mode = 'CONNEXION';
    },    
    connexion: function(){
      const self=this;
      this.$store.dispatch('connexion',{
        email: this.email,
        password:this.password,
      }).then(function(){
        self.$router.push('/PROFILE');
      }).catch(function(err){
        console.log(err);
      })
    },
    inscription: function(){
      const self=this;
      this.$store.dispatch('inscription',{
        email: this.email,
        username:this.username,
        password:this.password,
        bio:this.bio
      }).then(function(){
        self.connexion();
      }).catch(function(err){
        console.log(err);
      })
    }
  }

}
</script>



<style>
#switchIncrip,
#switchConnex{
  cursor: pointer;
}
#inscrip__title,
#connex__title{
  margin: 0 auto 30px auto;
  padding: 0;
  color: #FFD7D7;
}

.quest_compte{
  margin: 20px auto;
}

.quest_compte span{
  text-decoration: underline;
}

#inscrip,
#connex {
    margin: 50px auto;
    width: 50%;
    padding: 30px;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 5%;
    color: #FFD7D7;
    font-size: 20px;
}

#inscrip label,
#connex label {
    margin: auto;
    margin-bottom: 5px;
}

#inscrip input,
#connex input {
    max-width: 70%;
    height: 30px;
    font-size: 20px;
    margin: auto;
    margin-bottom: 20px;
    border: #FFD7D7;
    border-radius: 10px;
    color: #fff;
    background-color: #FFD7D7;
    padding-left: 1%;
}

input::placeholder {
  color: #FD2D01;
}

#inscrip input:focus,
#connex input:focus {
    outline-color: #FD2D01;
}

#btn_inscrip,
#btn_connex {
    margin: 30px auto;
    position: relative;
    display: inline-block;
    padding: 15px 30px;
    text-decoration: none;
    overflow: hidden;
    transition: 0.2s;
    cursor: pointer;
}

#btn_inscrip span,
#btn_connex span {
    position: absolute;
    display: block;
}

#btn_inscrip:hover,
#btn_connex:hover {
    color: #fff;
    background-color: #FFD7D7;
    border-radius: 10px;
    box-shadow: 0 0 10px #FFD7D7, 0 0 40px #FFD7D7, 0 0 80px #FFD7D7;
    transition: 1s;
    transition-delay: 0.1s;
}

button,
input[type="submit"],
input[type="reset"] {
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
}
.err_connex{
  margin: 0 auto;
  color: #FD2D01;
}
</style>