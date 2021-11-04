<template>
    <div id="creationM">
                <!-- MODE CREATION DE MESSAGE -->
        <span id="createMess_head">
            <h1>Ecrire un message</h1>
            <div id="cancelMessRight">
                <router-link to='/messages'>
                    <button id="cancelMess">
                        <div class="cancelMess">Annuler</div>
                        <i class="fas fa-times-circle"></i>
                    </button>
                </router-link>
            </div>
        </span>        
        <div id="createMess">
            <input id="createTitle" v-model="title" placeholder="Titre du message" type="text">
            <textarea rows="6" id="createContent" v-model="content" placeholder="Message" type="text"></textarea>
            <span id="urlmedia">
                <input id="createurlmedia" v-model="urlmedia" placeholder="Entrez une URL" type="text">
              <!--  <input @change="urlmedia" type="file" name="image"  accept=".jpg, .jpeg, .gif, .png" />  -->
            </span> 
            <!-- GIPHY -->
            <input v-model="searchTerm" placeholder="Saisir le Gif recherché" type="text">
            <button class="button_Giphy" @click=getGifs()>Chercher un GIF</button>
            <div class="gif-container">
                <img id="gif" v-for="gif in gifs" :src="gif" :key="gif.id" @click=getGifAddress(gif)>
            </div>





            <div id="btn_center">
                <router-link to='/messages'>
                    <button id="btn_createMess" v-if="title!='' && content!=''" @click="envMessage()">
                        Envoyer message
                    </button>
                </router-link>
            </div>
        </div>

    </div>
</template>

<script>

import {mapState}from 'vuex'
export default{
        name:'NEWMESSAGE',
        data: function(){
            return{
                mode: "NEWMESSAGE",
                title:'',
                content:'',
                urlmedia:'',
                message:{},
                searchTerm:"",
                gifs:[]
            }
        },
         mounted: function(){
            if(this.$store.state.user.userId == -1){
                this.$router.push('/');
                return;
            }            
            this.$store.dispatch('getListeMessage');
            },
        computed:{
            ...mapState({
                user:'userInfos',
                messages:'listeMessage',
                commentaires:'listeCommentaires'
            }),
        },
        methods:{
        envMessage: function(){
            const self = this;
            this.$store
            .dispatch('message',{
                title: this.title,
                content: this.content,
                urlmedia: this.urlmedia ,
            }).then(function(){
                self.$router.push("/messages");
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
#creationM{
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

#createMess_head{
    display: flex;
}

#createMess_head button{
    margin: 30px 0 0 40%;
}

#createMess{
    display: flex;
    flex-direction: column;
}

#createMess input,
#createMess textarea{
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

#createMess input{
    margin-top: 30px;
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

#btn_createMess{
  margin: 50px auto 30px auto;
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

#btn_createMess:hover{
  color: #000;
  background-color: #fd2d01;
  border-radius: 10px;
  box-shadow: 0 0 10px #fd2d01, 0 0 40px #fd2d01, 0 0 80px #fd2d01;
  transition: 1s;
  transition-delay: 0.1s;
}

#btn_center{
    margin: auto;
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
    width: 20%;
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
</style>
