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
            <span class="userlastname">Nom: <p id="userlastname">{{user.userlastname}}</p><p v-if="user.isAdmin == 1">(Administrateur)</p></span> 
            <span class="username">Prénom: <p>{{user.username}}</p></span> 
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
         <!--   <input  @change="onFileChange()" type="file" ref="file" name="image"  accept=".jpg, .jpeg, .gif, .png" /> -->
    </div>
    <div class="btn_MProf" v-if="mode=='PROFIL'"> 
        <button class="btn_profil btn_modif"  @click="switchUPDATE()">MODIFER PROFIL</button>
        <button class="btn_profil btn_suppr"  @click="deleteProfile()">SUPPRIMER PROFIL</button>
    </div>
    <button class="btn_profil btn_validModif" v-else @click="update()">MODIFER</button>
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
                document.location.reload();
                self.switchPROFIL();
                })
                .catch(function (err) {
                console.log(err);
                });
            },
            deleteProfile:function(){
            if(confirm('Voulez-vous vraiment supprimer votre compte? \n Ceci est définitif!!!')){
                this.$store.dispatch('deleteUser');
                this.$router.push('/');
            }
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
#userlastname{
  text-transform: uppercase;
}

.photo{
    margin-left: auto;
}
.profilpic img{
    height: 120px;
    width: 120px;
    margin: 0 auto;
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
.btn_MProf{
    display: flex;
    justify-content: space-around;
}
.btn_modif,
.btn_suppr{
    margin: 30px;
    }
.btn_validModif{
    margin: 30px auto;
}
.btn_profil{
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