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
        </div>      
        <div v-if="mode == 'PROFIL'" class="photo">
            <span class="profilpic"><img :src="user.profilpic" alt="photo de profil"></span>
        </div>
    </div> 
    <div v-else class="inputProfil">  
        <span class="ModifProfilPic">
            <p>Poste: </p>
            <input v-model="user.bio" type="text" id="bio"/>
        </span>
        <span class="ModifProfilPic">
            <p>Photo: </p>
            <input v-model="user.profilpic" id="profilpic" class="inputProfilpic" type="text">
            <!-- GIPHY -->
            <div>
                <div id="gif-search">
                    <input id="input_Giphy" class="updateMess" v-model="searchTerm" placeholder="Saisir le Gif recherché" type="text">
                    <button id="button_Giphy" class="updateMess" @click="getGifs()">GIF</button>
                </div>
                <div class="gif-container">
                    <img id="gif" v-for="gif in gifs" :src="gif" :key="gif.id" @click="getGifAddress(gif)">
                </div>
            </div>
                        <!-- PREVIEW -->
            <div v-if="user.profilpic !== ''"  id="preview">
                <p>Aperçu:</p>
                <span class="urlImg">
                    <img v-bind:src="user.profilpic">
                </span> 
            </div>

        </span> 
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
      profilpic:"",
      searchTerm:"",
      gifs:[],
    };

        },
        mounted:function(){
            if(this.$store.state.user.userId == -1){
                this.$router.push('/auth');
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
                this.$router.push('/auth');
            },
            update: function () {
            const self = this;
            this.$store
                .dispatch("updateUserInfos", {
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
            deleteProfile:function(){
            if(confirm('Voulez-vous vraiment supprimer votre compte? \n Ceci est définitif!!!')){
                this.$store.dispatch('deleteUser');
                this.$router.push('/auth');
                }   
            },
            getGifs() {
            let apiKey = "Crvc0H1g5pYBrVkqfyykxGi5a52RreAD";
            let searchEndPoint = "https://api.giphy.com/v1/gifs/search?";
            let limit = 30;
            let url = `${searchEndPoint}&api_key=${apiKey}&q=${
                this.searchTerm
            }&limit=${limit}`;
            fetch(url)
                .then(response => {
                    return response.json();
                })
                .then(json => {
                    console.log(json);
                this.buildGifs(json);
                })
                .catch(err => console.log(err));
        },
        buildGifs(json) {
        this.gifs = json.data.map(gif => gif.id).map(gifId => {
            return `https://media.giphy.com/media/${gifId}/giphy.gif`;
        });
        },
        getGifAddress:function(gif){
            const self = this;
        console.log(gif)
        this.user.profilpic = gif;     
        this.searchTerm = '';
        self.getGifs();
        }


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
.ModifProfilPic{
    display: flex;
    flex-direction: column;
}
.ModifProfilPic input{
    margin: auto;
}
#gif-search{
    display: flex;
    flex-direction: column;
    margin: auto;
}
#gif-search input{
    width: 60%;
    margin: 15px auto;
}
.gif-container{
    margin: auto;
    justify-content: center;
    display: flex;
    flex-wrap: wrap;
}
#gif{
    width: 180px;
    height: 180px;
    margin: 5px;
}

.updateMess{
    margin:auto;
    width: 15%;
    display: inline-block;
    padding: 0px 0px;
    text-decoration: none;
    color: #000;
    cursor: pointer;
    border: solid 1px #fd2d01;
    border-radius: 5px;
}
#preview{
    margin:auto;
    display: flex;
    flex-direction: column;
}
#preview p{
    margin-top: 30px;
    margin-bottom: 10px;
}
#preview span{
    padding: 0;
}
#preview img{
    width: 200px;
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
@media (max-width:900px){
    .ficheProfil{
        flex-direction: column-reverse;
    }
    .photo{
        margin: 0 auto 0 0;
    }
    .btn_profil{
        padding: 10px 5px;
        font-size: 18px;
    }
    .btn_modif,
    .btn_suppr{
        margin: 30px 10px;
    }
    #gif{
        width: 120px;
        height: 120px;
        margin: 5px;
    }

}
@media (max-width:700px)
{
    .userlastname,
    .username,
    .bio{
        display: flex;
        flex-direction: column;
    }
    #profil p{
        margin-left: 0;
    }
    .btn_MProf{
        flex-direction: column;
    }
    #gif{
        width: 80px;
        height: 80px;
        margin: 5px;
    }

    
}
@media (max-width:375px)
{
    #updateP_head button {
    margin: 30px 0 0 55%;
    }
    #updateP_head h1 {
    font-size: 25px;
    }
    #profil{
        padding: 0;
    }
    #updateP_head{
        display: flex;
        flex-direction: column-reverse;
    }
    .ModifProfilPic input{
        margin: 0;
        width: 100%;
    }
    #gif-search input{
        width: 100%;
    }
    .updateMess{
        width: 30%;
    }
    #preview img{
        width: 120px;
    }
    .inputProfil{
        padding: 0;
    }
    #gif{
        width: 80px;
        height: 80px;
        margin: 5px;
    }

}

</style>