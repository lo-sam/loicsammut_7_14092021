<template>
<div id="profil">
    <span id="updateP_head">
        <h1 v-if="mode == 'PROFIL'">VOTRE PROFIL:</h1>
        <h1 v-else>MODIFIER VOTRE PROFIL:</h1>
        <button id="cancelUpdate" v-if="mode == 'UPDATE'" @click="switchPROFIL()">
            <div class="cancelUpdate">Annuler</div>
            <i class="fas fa-times-circle"></i>
        </button>
    </span>
    <div v-if="mode == 'PROFIL'" class="ficheProfil">
        <div>
            <span class="userlastname">Prénom: <p>{{user.userlastname}}</p></span> 
            <span class="username">Nom: <p>{{user.username}}</p></span> 
            <span class="bio">Poste dans l'entreprise: <p>{{user.bio}}</p></span> 
            <span class="email">Adresse mail: <p>{{user.email}}</p></span>
        </div>      
        <div v-if="mode == 'PROFIL'" class="photo">
            <span class="profilpic"><img :src="user.profilpic" alt="photo de profil"></span>
        </div>
    </div> 
    <div v-else class="inputProfil">  
        <span>
            <p>Poste: </p>
            <input v-model="bio"  :placeholder="user.bio" type="text" id="bio"/>
        </span>
        <span>
            <p>Photo: </p>
            <input v-model="profilpic" :placeholder="user.profilpic" id="profilpic" class="inputProfilpic" type="text">
            <button  class="btn_upPic">Ajouter</button>
        </span> 
    </div>
    <button class="btn_profil" v-if="mode=='PROFIL'" @click="switchUPDATE()">MODIFER PROFIL</button>
    <button class="btn_profil" v-else @click="update()">MODIFER</button>
</div>
</template>

<script>
import {mapState}from 'vuex'

export default{
        name:'PROFIL',
        data: function(){
    return {
      mode: "PROFIL",
      email: "",
      username: "",
      userlastname:'',
      password: "",
      bio: "",
      profilpic:""
    };

        },
        mounted:function(){
            if(this.$store.state.user.userId == -1){
                this.$router.push('/');
                return;
            }
            this.$store.dispatch('getUserInfos');
            this.$store.dispatch('updateUserInfos')
        },
        computed:{
            ...mapState({
                user:'userInfos',
            })
        },
        methods:{
            switchUPDATE: function () {
                this.mode = "UPDATE";
                },
            switchPROFIL: function () {
            this.mode = "PROFIL";
            },
            deconnexion:function(){
                this.$store.commit('deconnexion');
                this.$router.push('/');
            },
            update: function () {
            const self = this;
            this.$store
                .dispatch("updateUserInfos", {
                email: this.email,
                bio: this.bio,
                profilpic: this.profilpic
                })
                .then(function () {
                self.switchPROFIL();
                })
                .catch(function (err) {
                console.log(err);
                });
            },
        }
}
</script>

<style>

#profil {
    margin: 50px auto;
    width: 70%;
    padding: 30px;
    display: flex;
    flex-direction: column;
    font-size: 20px;
    border-radius: 5px;
    background-color: #fff;
    border: 3px solid #fd2d01;
    color: #000;
}
#updateP_head{
    display: flex;
}
#updateP_head h1{
    font-size: 30px;
    margin-bottom: 20px;
}
#updateP_head button{
    margin: 30px 0 0 35%;
}
#cancelUpdate{
    margin: 20px auto 10px 20px;
    display: flex;
}
#cancelUpdate i{
    font-size: 25px;
    color: #fd2d01;
}
.cancelUpdate{
    margin-right: 5px;
}
#profil span{
    display: flex;
    margin: 10px;
}
#profil p{
    color: #fd2d01;
    margin-left: 5px;
}
.ficheProfil{
display: flex;
}
.photo{
    margin-left: auto;
}
.profilpic{
    height: 120px;
    width: 120px;
    object-fit: cover;
    object-position: center;
    border: 3px solid #fd2d01;
    border-radius: 10px;
}

.inputProfil{
    width: 100%;
    margin: 50px auto;
    padding: 15px;
    display: flex;
    flex-direction: column;
    font-size: 20px;
    background-color: #fff;
    color: #000;
}
.inputProfil span{
    display: flex;
}
.inputProfil p{
    margin-right: 5px;
}
.inputProfil input{
    width: 60%;
    height: 30px;
    font-size: 20px;
    margin: auto 0 20px 0;
    border-radius: 5px;
    padding-left: 1%;
    color: #000;
    border: 1px solid #fd2d01;
}
.inputProfil input:focus {
  outline-color: #fd2d01;
}
#nomUp_prenomUp{
    display: flex;
}

.btn_profil{
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
.btn_upPic{
    margin: 0 0 15px 10px;
    padding: 0 5px;
    text-decoration: none;
    overflow: hidden;
    transition: 0.2s;
    cursor: pointer;
    border: solid 3px #fd2d01;
    border-radius: 5px;
}
.btn_profil:hover,
.btn_upPic:hover{
    color: #000;
  background-color: #fd2d01;
  border-radius: 10px;
  box-shadow: 0 0 10px #fd2d01, 0 0 40px #fd2d01, 0 0 80px #fd2d01;
  transition: 1s;
  transition-delay: 0.1s;
}
</style>