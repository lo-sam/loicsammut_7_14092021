<template>
    <div id="creationM">
                <!-- MODE CREATION DE MESSAGE -->
        <span id="createMess_head">
            <h1>Ecrire un message</h1>
            <div id="cancelMessRight">
                <router-link to='/'>
                    <button id="cancelMess">
                        <div class="cancelMess">Annuler</div>
                        <i class="fas fa-times-circle"></i>
                    </button>
                </router-link>
            </div>
        </span>        
        <div id="createMess">
            
            <!-- TITRE DU MESSAGE -->
            <input id="createTitle" v-model="title" placeholder="Titre du message" type="text">

            <!-- CORPS DU MESSAGE -->
            <textarea rows="6" id="createContent" v-model="content" placeholder="Message" type="text"></textarea>
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
            <div  v-if="mode=='GIF'">
                <div id="gif-search">
                    <input v-on:keyup.enter="getGifs()" id="input_Giphy" class="newMess" v-model="searchTerm" placeholder="Saisir le Gif recherché" type="text">
                    <button id="button_Giphy" class="newMess" @click="getGifs()">GIF</button>
                </div>
                <div class="gif-container">
                    <img id="gif" v-for="gif in gifs" :src="gif" :key="gif.id" @click="getGifAddress(gif)">
                </div>
            </div>

            <!-- MEDIA -->
            <div v-else id="urlmedia">
                <input  id="createurlmedia" v-model="urlmedia" placeholder="Entrez l'URL d'une image" type="text">
            </div> 

            <!-- PREVIEW -->
            <div v-if="urlmedia !== ''"  id="preview">
                <p>Aperçu:</p>
                <span class="urlImg">
                    <img v-bind:src="urlmedia">
                </span> 
            </div>


            <!-- BOUTON VALIDER-->
            <div id="btn_center">
                <router-link to='/'>
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
                gifs:[],
            }
        },
         mounted: function(){
            if(this.$store.state.user.userId == -1){
                this.$router.push('/auth');
                return;
            }            
            this.$store.dispatch('getListeMessage');
            },
        computed:{
            ...mapState({
                user:'userInfos',
                messages:'listeMessage',
                commentaires:'listeCommentaires',
                emojis:'emojis'
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
                self.$router.push("/");
            }).catch(function(err){
                console.log(err);
            })
        },
        switchEmoji:function(){
            this.mode='EMOJIS';
        },
        getEmoji(emoji){
            this.content += emoji;
            this.mode='NEWMESSAGE';
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
        this.urlmedia = gif;     
        this.searchTerm = '';
        self.getGifs();
        this.mode='NEWMESSAGE';
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
#createMess .emoji{
    display: flex;
    margin: auto;
    width: 50%;
    flex-wrap: wrap;
}
#urlmedia button{
    margin-left: 20px;
    border: 1px solid #fd2d01;
    border-radius: 5px;
    padding: 1px 2px;
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
.newMess{
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
@media (max-width: 900px)
{
    #createMess input,
    #createMess textarea{
        width: 100%;
    }
    #urlmedia input{
        margin-left: 0;
    }
    #createMess .emoji{
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
    #creationM{
        padding: 5px;
    }
    #creationM h1{
        font-size: 20px;
        padding-top: 30px;
    }
    #createMess_head button{
        margin: 30px 0 0 0;
    }
    #createMess input,
    #createMess textarea{
        width: 100%;
    }
    #urlmedia input{
        margin-left: 0;
    }
    #createMess .emoji{
        width: 100%;
    }
    #gif-search{
        width: 100%;
    }
    #gif{
        width: 90px;
        height: 90px;
    }
}
</style>
