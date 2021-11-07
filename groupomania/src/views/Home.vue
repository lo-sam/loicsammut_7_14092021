<template>
  <div id="connex">
    <h1 id="connex__title" v-if="mode == 'CONNEXION'">Connexion</h1>
    <h1 id="connex__title" v-else>Inscription</h1>
    <p class="quest_compte" v-if="mode == 'CONNEXION'">
      Vous n'avez pas de compte?
      <span  id="switchIncrip" @click="switchINSCRIPTION()">
        Créer un compte
      </span>
    </p>
    <p class="quest_compte" v-else>
      Vous avez déjà un compte?
      <span id="switchConnex" @click="switchCONNEXION()">
        Se connecter
        </span>
    </p>
    <input v-model="email" placeholder="E-mail" type="mail" id="email" />
    <span id="nom_prenom">  
      <input v-model="username" v-if="mode == 'INSCRIPTION'" placeholder="Prénom" type="text" id="username"/>
      <input v-model="userlastname" v-if="mode == 'INSCRIPTION'" placeholder="Nom" type="text" id="userlastname"/>
    </span>
    <input v-model="bio" v-if="mode == 'INSCRIPTION'" placeholder="Poste" type="text" id="bio"/>
    <input v-model="password" placeholder="Mot de passe" type="password" id="password"/>
    <div class="err_connex" v-if="mode == 'CONNEXION' && status == 'error_login'">
      E-mail et/ou mot de passe incorrect
    </div>
    <button v-if="mode == 'CONNEXION'" id="btn_connex" @click="connexion()">
      CONNEXION
    </button>
    <button v-else id="btn_inscrip" @click="inscription()">
      CREER UN COMPTE
    </button>

    <router-view></router-view>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "CONNEXION",
  data: function () {
    return {
      mode: "CONNEXION",
      email: "",
      username: "",
      userlastname:'',
      password: "",
      bio: "",
      profilpic:""
    };
  },
  mounted: function () {
    if (this.$store.state.user.userId != -1) {
      this.$router.push("/");
      return;
    }
  },
  computed: {
    ...mapState(["status"]),
  },
  methods: {
    switchINSCRIPTION: function () {
      this.mode = "INSCRIPTION";
    },
    switchCONNEXION: function () {
      this.mode = "CONNEXION";
    },
    connexion: function () {
      const self = this;
      this.$store
        .dispatch("connexion", {
          email: this.email,
          password: this.password,
        })
        .then(function () {
          self.$router.push("/MESSAGES");
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    inscription: function () {
      const self = this;
      this.$store
        .dispatch("inscription", {
          email: this.email,
          username: this.username,
          userlastname: this.userlastname,
          password: this.password,
          bio: this.bio,
          profilpic: this.profilpic
        })
        .then(function () {
          self.connexion();
        })
        .catch(function (err) {
          console.log(err);
        });
    },
  },
};
</script>



<style>
#switchIncrip,
#switchConnex {
  cursor: pointer;
}

#inscrip__title,
#connex__title {
  margin: 0 auto 30px auto;
  padding: 0;
  color: #000;
}

.quest_compte {
  margin: 20px auto;
}

.quest_compte span {
  text-decoration: underline;
}

#connex {
  margin: 50px auto;
  width: 50%;
  padding: 30px;
  display: flex;
  border: 3px solid #fd2d01;
  flex-direction: column;
  border-radius: 5px;
  font-size: 20px;
  background-color: #fff;
  color: #000;
}

#connex label {
  margin: auto;
  margin-bottom: 5px;
}

#connex input {
  width: 90%;
  height: 30px;
  font-size: 20px;
  margin: auto;
  margin-bottom: 20px;
  border-radius: 5px;
  padding-left: 1%;
  color: #000;
  border: 1px solid #fd2d01;
}

#connex input:focus {
  outline-color: #fd2d01;
}
#nom_prenom{
  display: flex;
}
#nom_prenom input{
  width: 40%;
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
  border: solid 3px #fd2d01;
  border-radius: 5px;
}

#btn_inscrip span,
#btn_connex span {
  position: absolute;
  display: block;
}

#btn_inscrip:hover,
#btn_connex:hover {
  color: #000;
  background-color: #fd2d01;
  border-radius: 10px;
  box-shadow: 0 0 10px #fd2d01, 0 0 40px #fd2d01, 0 0 80px #fd2d01;
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
.err_connex {
  margin: 0 auto;
  color: #fd2d01;
}
</style>