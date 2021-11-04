<template>
    <div id="listeMessage">
        <!-- MODE LISTE DES MESSAGES -->
        <div id="modifMess_head">
            <h1>Modifer le message:</h1>
            <div id="cancelMessRight">
                <router-link to='/messages'>
                    <button id="cancelMess">
                        <div class="cancelMess">Annuler</div>
                        <i class="fas fa-times-circle"></i>
                    </button>
                </router-link>
            </div>
        </div>
        <div id="modifMess">
                    <!-- UPDATE TITRE DU MESSAGE --> 
                    <input class="updateMess" v-model="message.title" type="text">
                    <!-- UPDATE DU CORPS DU MESSAGE -->
                    <textarea class="updateMess" rows="3"   id="createContent" v-model="message.content"  type="text"></textarea>
                    <!-- UPDATE DU MEDIA -->
                    <span class="updateMessMedia" id="urlmedia">
                    <input class="updateMess" id="createurlmedia" v-model="message.urlmedia"  type="text">
                   <!-- <input class="updateMess" type="file" accept="image/*"  @change="urlmedia" />-->
                    </span> 
                    <!-- GIPHY -->
                    <input v-model="searchTerm" placeholder="Saisir le Gif recherché" type="text">
                    <button class="button_Giphy" @click="getGifs()">Chercher un GIF</button>
                    <div class="gif-container">
                        <img id="gif" v-for="gif in gifs" :src="gif" :key="gif.id" @click="getGifAddress(gif)">
                    </div>

                  
                    <div id="btn_center">
                        <button id="btn_updateMess" @click="update(message.id)">
                            Envoyer message
                        </button>
                    </div>

                        
            
        </div> 
    </div>
</template>

<script>
import {mapState}from 'vuex'
export default{
        name:'MODIFMESSAGE',
        data: function(){
            return{
                title:'',
                content:'',
                urlmedia:'',
                searchTerm:"",
                gifs:[]
                }
        },
         mounted: function(){
            let id = this.$route.params.id;
            if(this.$store.state.user.userId == -1){
                this.$router.push('/');
                return;
            }        
            this.$store.dispatch('getOneMessage',id);
            },
       computed:{
            ...mapState({
                user:'userInfos',
                message:'message',
                messages:'listeMessage',
            }),
        },
        methods:{
        update: function (id) {
        const self = this;
        this.$store.dispatch('updateMessage', id,{
            title: this.title,
            content: this.content,
            urlmedia: this.urlmedia
        }).then(function(){
            self.$router.push("/messages");
            console.log('cool');
        }).catch(function(err){
            console.log(err);
        })
        },
        deconnexion:function(){
            this.$store.commit('deconnexion');
            this.$router.push('/');
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
        this.urlmedia = gif;     
        this.searchTerm = '';
        self.getGifs()
        }
      },
}
</script>

<style scoped>
/* CSS LISTE MESSAGE */
#listeMessage{
    margin: 50px auto;
    width: 90%;
    padding: 30px;
    display: flex;
    flex-direction: column;
    font-size: 20px;
    border-radius: 5px;
    background-color: #fff;
    border: 3px solid #fd2d01;
    color: #000;
}
a{
    color: #000;
}
#modifMess_head{
    display: flex;
}

#modifMess_head button{
    margin: 30px 0 0 40%;
}

#cancelMessRight{
margin-left: auto;
margin-right: 5%;
}

#cancelMess{
    margin: 20px auto 10px 20px;
    display: flex;
    color: #000;
}

#cancelMess i{
    font-size: 25px;
    color: #fd2d01;
}

#cancelMess .cancelMess{
    margin-right: 5px;
}
#modifMess{
    margin-top: 20px;
}
.photoP{
    width: 60px;
    height: 60px;
    border: 3px solid #fd2d01;
    border-radius: 10px;
}
#ajoutMess{
    margin: 20px auto 10px 20px;
    display: flex;
    color: #000;
}
#ajoutMess i,
#cancelMess i{
    font-size: 25px;
    color: #fd2d01;
}
#ajoutMess .ajoutMess{
    margin-left: 5px;
}
.auther, .date{
    margin-top: 35px;
}
.title{
    text-transform: uppercase;
}
.auther{
    margin-left: 5px;
}
.date{
    font-size: 16px;
    margin-left: auto;
}
.mess{
    padding: 15px;
    padding-top: 5px;
}
.urlImg{
    border: 1px solid rgb(240, 240, 240);
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 10px;
}
.urlImg img{
    max-width: 100%;
    margin: auto;
}
#control{
    display: flex;
}
.like,.modif,.delete{
    cursor: pointer;
}
.like i{
    margin-right: 5px;
}
.modif{
    margin-left: 40%;
}
.delete{
    margin-left: 40%;
}

/* CSS UPDATE */
#modifMess{
    display: flex;
    flex-direction: column;
}

.update{
    margin: auto;
    margin-bottom: 20px;
}
#modifMess input,
#modifMess textarea{
    width: 50%;
    font-size: 20px;
    margin: auto;
    margin-bottom: 20px;
    border-radius: 5px;
    padding-left: 1%;
    color: #000;
    border: 1px solid #fd2d01;
    color: #000;
}
#urlmedia input{
    height: 30px;
    margin-left: 25%;
}
#urlmedia button{
    margin-left: 20px;
    border: 1px solid #fd2d01;
    border-radius: 5px;
    padding: 1px 2px;
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
.button_Giphy{
    margin: auto;
    width: 25%;
    position: relative;
    display: inline-block;
    padding: 15px 30px;
    text-decoration: none;
    color: #000;
    overflow: hidden;
    transition: 0.2s;
    cursor: pointer;
    border: solid 3px #fd2d01;
    border-radius: 5px;
}
#btn_center{
    margin: auto;
}
#btn_center #btn_updateMess{
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
#btn_updateMess:hover{
  color: #000;
  background-color: #fd2d01;
  border-radius: 10px;
  box-shadow: 0 0 10px #fd2d01, 0 0 40px #fd2d01, 0 0 80px #fd2d01;
  transition: 1s;
  transition-delay: 0.1s;
}
</style>
