<template>
    <div id="listeMessage">
        <div id="modifMess_head">
            <h1>Modifer le message:</h1>
            <div id="cancelMessRight">
                <router-link to='/'>
                    <button id="cancelMess">
                        <div class="cancelMess">Annuler</div>
                        <i class="fas fa-times-circle"></i>
                    </button>
                </router-link>
            </div>
        </div>
        <div id="modifMess">

            <!-- UPDATE TITRE DU MESSAGE --> 
            <input v-model="message.title" type="text">

            <!-- UPDATE DU CORPS DU MESSAGE -->
            <textarea  rows="6"   id="createContent" v-model="message.content"  type="text"></textarea>
            <div id="add_btn">
                <div id="emoji_btn" @click='switchEmoji()'><i class="far fa-laugh-beam"></i></div>
                <div id="GIF_btn" @click='switchGif()'>GIF</div>
            </div>

            <!-- EMOJIS -->
            <div v-if="mode=='EMOJIS'" class="emoji">
                <div class="unEmoji" v-for="emoji in emojis" :key='emoji.id' @click="getEmoji(emoji.name)">
                    {{emoji.name}}
                </div>
            </div>

            <!-- GIPHY -->
            <div v-if="mode=='GIF'">
                <div id="gif-search">
                    <input id="input_Giphy" class="updateMess" v-model="searchTerm" placeholder="Saisir le Gif recherché" type="text">
                    <button id="button_Giphy" class="updateMess" @click="getGifs()">GIF</button>
                </div>
                <div class="gif-container">
                    <img id="gif" v-for="gif in gifs" :src="gif" :key="gif.id" @click="getGifAddress(gif)">
                </div>
            </div>

            <!-- UPDATE DU MEDIA -->
            <div v-else id="urlmedia">
                <input id="createurlmedia" v-model="message.urlmedia"  type="text">
            </div>

            <!-- PREVIEW -->
            <div v-if="message.urlmedia !== ''"  id="preview">
                <p>Aperçu:</p>
                <span class="urlImg">
                    <img v-bind:src="message.urlmedia">
                </span> 
            </div>



            <!-- BOUTON VALIDER-->
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
                mode:'MODIFMESSAGE',
                title:'',
                content:'',
                urlmedia:'',
                searchTerm:"",
                gifs:[],
                }
        },
         mounted: function(){
            let id = this.$route.params.id;
            if(this.$store.state.user.userId == -1){
                this.$router.push('/auth');
                return;
            }        
            this.$store.dispatch('getOneMessage',id);
            },
       computed:{
            ...mapState({
                user:'userInfos',
                message:'message',
                messages:'listeMessage',
                emojis:'emojis'
            }),
        },
        methods:{
        update: function(id){
            const self = this;
            this.$store.dispatch('updateMessage',{
                id:id,
                message:{
                title: this.message?.title,
                content: this.message?.content,
                urlmedia: this.message?.urlmedia
                }
            }).then(function(){
              self.$router.push("/");
             console.log('apres'+self.message?.title)

                console.log('maj ok');
            }).catch(function(err){
                console.log('maj pas ok',err);
            })
        },
        switchEmoji:function(){
            this.mode='EMOJIS';
        },
        getEmoji(emoji){
            this.message.content += emoji;
            this.mode='MODIFMESSAGE';
        },
        switchGif:function(){
            this.mode='GIF';
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
        this.message.urlmedia = gif;     
        this.searchTerm = '';
        self.getGifs();
        this.mode='MODIFMESSAGE';
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
#modifMess{
    margin-top: 30px;
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
#modifMess textarea,
.updateMess{
    width: 50%;
    font-size: 20px;
    margin: 0 auto 20px auto;
    border-radius: 5px;
    padding-left: 1%;
    color: #000;
    border: 1px solid #fd2d01;
    color: #000;
}
.updateMess{
    margin: auto;
    margin-bottom: 20px;
}
#urlmedia input{
    height: 30px;
    margin-left: 25%;
}
#modifMess input{
    margin-top: 30px;
}
#add_btn{
    display: flex;
}
#emoji_btn,
#GIF_btn{
    margin: 0 0 0 25%;
    width: fit-content;
    border: 1px solid #fd2d01;
    border-radius: 5px;
    padding: 5px;
}
.unEmoji {
		cursor: pointer;
		user-select: none;
		font-size: 1.5rem;
		margin: 0 0.5rem;
		transition: all 0.3s;
}
.unEmoji:hover {
    animation-name: emoji;
    animation-duration: 0.6s;
    animation-direction: forwards;
    animation-timing-function: ease-out;
    animation-iteration-count: 1;
}
/* ANIMATIONS */
@keyframes emoji {
	25% {
		transform: rotateZ(90deg) scale(1.5);
	}
	50% {
		transform: rotateZ(0) scale(2);
	}
	75% {
		transform: rotateZ(-90deg) scale(1.5);
	}
}

#GIF_btn{
    margin-left: 5px;
}
#modifMess .emoji{
    display: flex;
    margin: auto;
    width: 50%;
    flex-wrap: wrap;
}

#gif-search{
    display: flex;
    margin: auto;
    width: 50%;
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
#gif-search #input_Giphy{
    width: 85%;
}
#preview{
    margin-left: 25%;
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
#button_Giphy{
    margin-left: 5px;
    width: 15%;
    display: inline-block;
    padding: 0px 0px;
    text-decoration: none;
    color: #000;
    cursor: pointer;
    border: solid 1px #fd2d01;
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
@media (max-width: 900px)
{
    #modifMess input,
    #modifMess textarea{
        width: 100%;
    }
    #urlmedia input{
        margin-left: 0;
    }
    #modifMess .emoji{
        width: 100%;
    }
    #gif-search{
        width: 100%;
    }
    #gif{
        width: 120px;
        height: 120px;
    }
}
@media (max-width: 500px)
{
    #listeMessage{
        padding: 5px;
    }
    #listeMessage h1{
        font-size: 20px;
        padding-top: 30px;
    }
    #modifMess_head button{
        margin: 30px 0 0 0;
    }
    #modifMess input,
    #modifMess textarea{
        width: 100%;
    }
    #urlmedia input{
        margin-left: 0;
    }
    #modifMess .emoji{
        width: 100%;
    }
    #gif-search{
        width: 100%;
    }
    #gif{
        width: 90px;
        height: 90px;
    }
@media(max-width:375px)
{
    #cancelMessRight{
        margin-right: 1%;
    }

}
}
</style>
