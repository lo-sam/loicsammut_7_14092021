<template>
    <div id="listeMessage">
        <!-- MODE LISTE DES MESSAGES -->
        <div id="listeMess">
            <!-- PROFILE
            <span>
                <img class="photoP" :src="message.User.profilpic" alt="photo de profil">    
                <p class="auther">{{message.User.username}}</p> 
                <p class="date">le {{message.createdAt.slice(0,10).split('-').reverse().join('/') + ' à ' + message.createdAt.slice(11,16)}}  </p>
            </span> -->

            <!-- TITRE DU MESSAGE --> 
            <span  class="title"><p>{{message.title}}</p></span>  
            <!-- MEDIA DU MESSAGE --> 
            <span v-if="urlmedia !== null" class="urlImg">
                <img v-bind:src="message.urlmedia">
            </span> 
            <!-- CORPS DU MESSAGE --> 
            <span  class="mess"><p>{{message.content}}</p></span> 
            <div id="control"> 
                <span class="like"><i class="far fa-thumbs-up"></i> <p>{{message.likes}}</p></span> 
                <span @click="getUpOneMessage(message.id)" class="modif" v-if="user.id == message.UserId"><i class="far fa-edit"></i></span> 
                <span class="delete" v-if="user.id == message.UserId" @click="deleteMessage(message.id)"><i class="far fa-trash-alt"></i></span> 
            </div>
            <!-- COMMENTAIRE DU MESSAGE --> 
            <div id="zoneCom">
                <div id="ajoutCom">
                <input type="text" placeholder="ajouter un commentaire ici">
                <button @click="addComment(message.id)" class="btn--com">Envoyer</button>
                </div>
                <ul>
                    <li class="listCom" v-for="commentaire in commentaires" :key="commentaire.id">
                        <span><p class="commentaire">{{commentaire.content}}</p><p class="timeCom">le {{commentaire.createdAt.slice(0,10).split('-').reverse().join('/') + ' à ' + commentaire.createdAt.slice(11,16)}}</p></span>
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
            title:'',
            content:'',
            urlmedia:'',
            }        
        }, 
        mounted: function(){
            let id = this.$route.params.id;
            if(this.$store.state.user.userId == -1){
                this.$router.push('/');
                return;
            }      
            this.$store.dispatch('getOneMessage', id);  
            this.$store.dispatch('getListeMessage');
            this.$store.dispatch('getListeCom', id);
        },
       computed:{
            ...mapState({
                user:'userInfos',
                message: 'message',
                commentaire:'commentaire',
                commentaires:'listeCommentaires'
            }),
        },
        methods:{
             switchMESSAGE: function () {
                this.mode = "MESSAGE";
        },
            switchUPDATE: function(){
                this.mode = "UPDATE";
        },
        addComment:function(id){
            this.$store.dispatch("getListeMessage");
            this.$store.dispatch("commentaire", {
                id: id,
                message: this.message,
            });
            this.commentaire.content = "";
            this.$store.dispatch("getListeCom");
            this.$store.dispatch("getOneMessage", this.message.id); 
         },
        getUpOneMessage(id){
            this.$router.push(`/message/modif/${id}`);
        },
        update: function () {
        const self = this;
        this.$store
            .dispatch("updateMessage", {
                title: this.title,
                content: this.content,
                urlmedia: this.file,
            }).then(function(){
                self.switchLISTEMESSAGE();
            }).catch(function(err){
                console.log(err);
            });
        },
        deleteMessage:function(id){
            if(confirm('Voulez-vous vraiment supprimer le message?')){
                this.$store.dispatch('deleteMessage',id);
                this.$router.push('/messages');
            }
        },
        deconnexion:function(){
            this.$store.commit('deconnexion');
            this.$router.push('/');
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
}
.timeCom{
    margin-left: auto;
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