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
                <span @click="getUpOneMessage(message.id)" class="modif" v-if="user.id == message.UserId"><i class="far fa-edit"></i></span> 
                <span @click="like(message.id)" class="like"><i class="far fa-thumbs-up"></i><p>{{message.likes}}</p></span> 
                <span @click="deleteMessage(message.id)" class="delete" v-if="user.id == message.UserId"><i class="far fa-trash-alt"></i></span> 
            </div>
            <!-- COMMENTAIRE DU MESSAGE --> 
            <div id="zoneCom">
                <div id="ajoutCom">
                    <input v-on:keyup.enter="addComment(message.id)" type="text" v-model="commentaire.content" placeholder="ajouter un commentaire ici">
                    <button @click="addComment(message.id)" class="btn--com">Envoyer</button>
                </div>
                <ul>
                    <li class="listCom" v-for="commentaire in message.Commentaires" :key="commentaire.id">
                        <span>
                            <p v-show="!commentaire.show"  class="commentaire">{{commentaire.content}}</p>
                            <p v-show="commentaire.show"  id="modifCom" >
                                <input v-show="commentaire.show" v-model="commentaire.content" type="text">
                            </p>
                            <p @click="modifCom(commentaire)" class="modifOK" v-show="commentaire.show"><i class="far fa-check-circle"></i></p>  
                            <p @click="switchCOM(commentaire)" class="modifNO" v-show="commentaire.show"><i class="far fa-times-circle"></i></p>
                            <p class="timeCom">
                                le {{commentaire.createdAt.slice(0,10).split('-').reverse().join('/') + ' à ' + commentaire.createdAt.slice(11,16)}}
                            </p>
                            <p @click="switchModif(commentaire)"   v-show="!commentaire.show" class="modifCom">
                                <i class="far fa-edit"></i>
                            </p>
                            <p @click="deleteCom(commentaire.id)" v-if="user.id == commentaire.UserId" class="deleteCom">
                                <i class="far fa-trash-alt"></i>
                            </p>
                        </span>
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
            }),
        },
        methods:{
        switchModif: function(commentaire){
                commentaire.show = true;
              // this.mode = 'MODIF';
                console.log(commentaire.show);
        },
        switchCOM: function(commentaire){
            commentaire.show = false;
            //document.location.reload();
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
                //document.location.reload();
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
.auther{
    margin-top: 30px;
}
.date{
    margin-top: 35px;
}
.title{
    text-transform: uppercase;
}
.auther{
    font-size: 30px;
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
.listCom{
    list-style: none;
}
.commentaire{
    margin-right: auto;
    flex-wrap: wrap;
    max-width: 65%;
}
#modifCom{
    width: 65%;
}
.listCom #modifCom input{
    margin-right: auto;
    border-radius: 10px;
}
 .modifOK i,
 .modifNO i{
    margin: 0 3px;
    font-size: 25px;
    cursor: pointer;
    color: #fd2d01;
}
.timeCom{
    margin-left: auto;
}
.modifCom,
.deleteCom{
    margin-left: 1%;
}
.modifCom i,
.deleteCom i{
    color: #fd2d01;
}
/* CSS UPDATE */

.update{
    margin: auto;
    margin-bottom: 20px;
}
.updateMess{
    width: 50%;
    padding-left: 1%;
    color: #000;
    font-size: 20px;
    border: 1px solid #fd2d01;
    border-radius: 5px;
    color: #000;

}
.updateMessMedia{
    flex-direction: column;
    margin: auto;
    margin-bottom: 20px;
}
#urlmedia button{
    margin-left: 20px;
    border: 1px solid #fd2d01;
    border-radius: 5px;
    padding: 1px 2px;
}
#btn_updateMess{
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

#controlUpdate{
    display: flex;
    margin: auto;
}
#controlUpdate #cancelUpdate,
#controlUpdate #validUpdate{
    border: 1px solid rgb(240, 240, 240);
    border-radius: 15px;
    box-shadow: rgba(0, 0, 0, 0.35) 0 5px 15px;
    box-sizing: border-box;
    padding: 20px 20px;
}

#controlUpdate #cancelUpdate{
   margin: 20px auto 20px 20%;
}

#controlUpdate #validUpdate{
    margin-right: 20%;
}

#controlUpdate #validUpdate i{
    color: green;
}

#controlUpdate #validUpdate i,
#controlUpdate #cancelUpdate i{
    padding: 0 15px;
    font-size: 25px;
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
    width: 90%;
    margin: 20px auto;
}

#ajoutCom .btn--com{
    color: #000;
    font-size: 20px;
    width: 10%;
    height: 40px;
    border: 1px solid rgb(240, 240, 240);
    border-radius: 0 10px 10px 0;
    outline: none;
    padding: 0 5px;
    margin: auto;
    box-sizing: border-box;
    box-shadow: rgba(0, 0, 0, 0.35) 0 5px 15px;
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
    border: 1px solid rgb(240, 240, 240);
    border-radius: 10px 0 0 10px;
    outline: none;
    padding-left: 5px;
    margin: auto;
    box-sizing: border-box;
    box-shadow: rgba(0, 0, 0, 0.35) 0 5px 15px;
}
</style>