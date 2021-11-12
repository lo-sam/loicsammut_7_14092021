<template>
    <div id="listeMessage">
        <!-- MODE LISTE DES MESSAGES -->
        <div id="listeMess">
            <!-- PROFILE 
            <span>
                <img class="photoP" :src="message.User.profilpic" alt="photo de profil">    
                <p class="auther">{{message.User.username}}</p> 
                <p class="date">le {{message.updatedAt.slice(0,10).split('-').reverse().join('/') + ' à ' + message.updatedAt.slice(11,16)}}  </p>
            </span> -->
            <div id="oneMess_head">
                <!-- TITRE DU MESSAGE --> 
                <span  class="title"><p>{{message.title}}</p></span>  
                <div id="cancelMessRight">
                    <router-link to='/messages'>
                        <button id="cancelMess">
                            <i class="fas fa-arrow-circle-left"></i>
                            <div class="cancelMess">Retour</div>
                        </button>
                    </router-link>
                </div>
            </div>
            <!-- MEDIA DU MESSAGE --> 
            <span v-if="message.urlmedia !== null" class="urlImg">
                <img v-bind:src="message.urlmedia">
            </span> 
            <!-- CORPS DU MESSAGE --> 
            <span  class="mess"><p>{{message.content}}</p></span> 
            <div id="control"> 
                <span @click="getUpOneMessage(message.id)" class="modif" v-if="user.id == message.UserId || user.isAdmin == 1"><i class="far fa-edit"></i></span> 
                <span @click="like(message.id)" class="like"><i class="far fa-thumbs-up"></i><p>{{message.likes}}</p></span> 
                <span @click="deleteMessage(message.id)" class="delete" v-if="user.id == message.UserId || user.isAdmin == 1"><i class="far fa-trash-alt"></i></span> 
            </div>
            <!-- COMMENTAIRE DU MESSAGE --> 
            <div id="zoneCom">
                <div id="ajoutCom">
                    <input v-on:keyup.enter="addComment(message.id)" type="text" v-model="commentaire.content" placeholder="ajouter un commentaire ici">
                    <button id="emoji_btn" @click='switchEmoji()'><i class="far fa-laugh-beam"></i></button>
                    <button @click="addComment(message.id)" class="btn--com">Envoyer</button>
                </div>
                    <!-- EMOJIS -->
                    <div v-if="mode=='EMOJIS'" class="emoji">
                        <div class="unEmoji" v-for="emoji in emojis" :key='emoji.id' @click="getEmoji(emoji.name)">
                            {{emoji.name}}
                        </div>
                    </div>

                <ul>
                    <li class="listCom" v-for="commentaire in commentaires" :key="commentaire.id">
                        <span class="info_commentaires">
                            <p class="nomCom">{{commentaire.User.username}} : </p>
                            <p class="timeCom">
                                le {{commentaire.updatedAt.slice(0,10).split('-').reverse().join('/')}}
                                à {{commentaire.updatedAt.slice(11,16)}}
                            </p>
                        </span>
                        <div class="commentaires">
                            <p v-show="!commentaire.show"  class="commentaire">{{commentaire.content}}</p>
                            <p v-show="commentaire.show"  id="modifCom" >
                                <input v-on:keyup.enter="modifCom(commentaire)"  v-show="commentaire.show" v-model="commentaire.content" type="text">
                            </p>
                            <p @click="modifCom(commentaire)" class="modifOK" v-show="commentaire.show"><i class="far fa-check-circle"></i></p>  
                            <p @click="switchCOM(commentaire)" class="modifNO" v-show="commentaire.show"><i class="far fa-times-circle"></i></p>
                        
                            <div class="commandeCommentaire">
                                <p @click="switchModif(commentaire)"   v-if="user.id == commentaire.UserId || user.isAdmin == 1" class="modifCom">
                                    <i class="far fa-edit"></i>
                                </p>
                                <p @click="deleteCom(commentaire.id)" v-if="user.id == commentaire.UserId || user.isAdmin == 1" class="deleteCom">
                                    <i class="far fa-trash-alt"></i>
                                </p>
                                <p v-if="user.id !== commentaire.UserId" class="pas_modifCom">
                                    <i class="far fa-edit"></i>
                                </p>
                                <p v-if="user.id !== commentaire.UserId" class="pas_deleteCom">
                                    <i class="far fa-trash-alt"></i>
                                </p>
                            </div>
                        </div>
                    </li>   
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState}from 'vuex'
export default{
        name:'message',
        data () {
            return {
                mode: 'COMMENTAIRE',
                commentaire:{
                content:'',
                show: false
                }
            }        
        }, 
        mounted: function(){
            let id = this.$route.params.id;
            if(this.$store.state.user.userId == -1){
                this.$router.push('/');
                return;
            }      
            this.$store.dispatch('getOneMessage', id);  
            this.$store.dispatch('getListeCom', id);
        },
       computed:{
            ...mapState({
                user:'userInfos',
                messages: 'listeMessage',
                message: 'message',
                commentaires:'listeCommentaires',
                emojis:'emojis'
            }),
        },
        methods:{
        switchEmoji:function(){
            this.mode='EMOJIS';
        },
        getEmoji(emoji){
            this.commentaire.content += emoji;
            this.mode='COMMENTAIRE';
        },
        switchModif: function(commentaire){
                commentaire.show = true;
                console.log(commentaire.show);
        },
        switchCOM: function(commentaire){
            commentaire.show = false;
        },
        addComment:function(id){
            this.$store.dispatch("commentaire", {
                messageId:id,
                content:this.commentaire?.content
            });
         },
         modifCom:function(commentaire){
             this.$store.dispatch('updateCom',{
                id:commentaire.id,
                commentaire:{
                    content:commentaire?.content
                }
             }).then(function () {
                commentaire.show = false;
             })
         },
        getUpOneMessage(id){
            this.$router.push(`/message/modif/${id}`);
        },
        deleteMessage:function(id){
            if(confirm('Voulez-vous vraiment supprimer le message?')){
                this.$store.dispatch('deleteMessage',id);
                this.$router.push('/messages');
            }
        },
        deleteCom:function(id){
            if(confirm('Voulez-vous vraiment supprimer le commentaire?')){
                this.$store.dispatch('deleteCom',id);
            }
        },
        deconnexion:function(){
            this.$store.commit('deconnexion');
            this.$router.push('/');
        },
        like: function(id){
            console.log('like');
            this.$store.dispatch('like',id);
        }
    }
}
</script>

<style scoped>
/* CSS LISTE MESSAGE */
#listeMess{
    color: #000;
    display: flex;
    flex-direction: column;
    margin: 50px auto;
    list-style: none;
    padding: 30px;
    font-size: 20px;
    width: 90%;
    margin-bottom: 30px;
    border-top: 1px solid rgb(240, 240, 240);
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}
#listeMess span{
    display: flex;
    color: #fd2d01;
    padding: 0 15px;
    margin: 20px 0;
}
#listeMess p{
    color: #000;
}
#oneMess_head{
    display: flex;
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
    font-size: 25px;
    color: #fd2d01;
}

#cancelMess .cancelMess{
    margin-left: 5px;
}

.photoP{
    width: 60px;
    height: 60px;
    border: 3px solid #fd2d01;
    border-radius: 10px;
}
.auther{
    margin-top: 30px;
    font-size: 30px;
    margin-left: 5px;
}
.date{
    margin-top: 35px;
    font-size: 16px;
    margin-left: auto;
}
.title{
    text-transform: uppercase;
}
.mess{
    padding: 15px;
    padding-top: 5px;
}
.urlImg{
    border: 3px solid rgb(240, 240, 240);
    border-radius: 10px;
    margin-bottom: 10px;
}
.urlImg img{
    padding: 10px;
    max-height: 250px;
    max-width: 100%;
    margin: auto;
}
#control{
    display: flex;
    justify-content: space-around;
}
.like,.modif,.delete{
    cursor: pointer;
}
#control .like i{
    margin-right: 5px;
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
#zoneCom .emoji{
    display: flex;
    margin: auto;
    width: 80%;
    flex-wrap: wrap;
}
.listCom{
    list-style: none;
}
.listCom span{
    width: 100%;
}
#listeMess .info_commentaires{
    margin: 20px 0 0 0;
}
#listeMess .commentaires{
width: 100%;
display: flex;
padding: 0 15px;
}
.commentaire{
    width: 90%;
}
#modifCom{
    width: 65%;
}
#listeMess .nomCom{
    padding-right: 5px;
    color: #fd2d01;
}
.listCom #modifCom input{
    margin-right: auto;
    border-radius: 10px;
}
 .modifOK,
 .modifNO{
    margin: auto 3px;
}
 .modifOK i,
 .modifNO i{
    font-size: 25px;
    cursor: pointer;
    color: #fd2d01;
}
.commentaire,
.nomCom{
    margin: auto 0;
    display: flex;
    flex-wrap: wrap;
}
.timeCom{
    margin: auto 0 auto auto;
    font-size: 15px;
}
#listeMess .timeCom .timeCom_date,
#listeMess .timeCom .timeCom_heure{
    color: #000;
    margin: 0;
    padding: 0;
}
.commandeCommentaire{
    margin-left: auto;
    padding: 5px;
    display: flex;
}
.modifCom,
.deleteCom,
.pas_modifCom, 
.pas_deleteCom{
    margin:auto 0;
    padding: 5px;
}
.modifCom i,
.deleteCom i{
    color: #fd2d01;
}
.pas_modifCom i,
.pas_deleteCom i{
    color:#fff;
}

#zoneCom{
    display: flex;
    flex-direction: column;
}

#zoneCom li{
    box-shadow: none;
    border: 1px solid rgba(0, 0, 0, 0.151);
    width: 90%;
    margin: 5px auto;
}
#ajoutCom{
    display: flex;
    width: 85%;
    margin: 20px auto;
}
.commentaires #emoji_btn,
#ajoutCom #emoji_btn{
    border: 1px solid rgba(0,0,0,0.151);
    padding: 0 5px;
    font-size: 30px;
}
#ajoutCom .btn--com{
    color: #000;
    font-size: 20px;
    width: 10%;
    height: 40px;
    border: 1px solid rgba(0,0,0,0.151);
    border-radius: 0 10px 10px 0;
    outline: none;
    padding: 0 5px;
    margin: auto;
    box-sizing: border-box;
}
#ajoutCom .btn--com:hover{
  color: rgba(253, 45, 1);
  transition: 1s;
  transition-delay: 0.1s;
}
#zoneCom input{
    color: #000;
    font-size: 20px;
    width: 90%;
    height: 40px;
    border: 1px solid rgba(0,0,0,0.151);
    border-radius: 10px 0 0 10px;
    outline: none;
    padding-left: 5px;
    margin: auto;
    box-sizing: border-box;
}
</style>