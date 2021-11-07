<template>
    <div id="listeMessage">
        <!-- MODE LISTE DES MESSAGES -->
        <h1>Liste des messages</h1>
        <router-link to='/message/new'>
            <button @click="switchMESSAGE()" id="ajoutMess">
                <i class="fas fa-plus-circle"></i>
            <div class="ajoutMess">Ajouter un message</div>
            </button>
        </router-link>
        <div id="listeMess">
            <ul >
                <li :key="key" v-for="(message, key) in messages" >
                    <div @click="getOneMessage(message.id)"> 
                        <span>
                            <img class="photoP" :src="message.User.profilpic" alt="photo de profil">    
                            <p class="auther">{{message.User.username}}</p> 
                            <p class="date">le {{message.createdAt.slice(0,10).split('-').reverse().join('/') + ' à ' + message.createdAt.slice(11,16)}}  </p>
                        </span> 
                        <!-- TITRE DU MESSAGE --> 
                        <span v-if="mode == 'LISTEMESSAGE'" class="title"><p>{{message.title}}</p></span>  
                        <!-- UPDATE TITRE DU MESSAGE --> 
                        <span v-if="mode == 'UPDATE'" class="updateMess"><input v-model="message.title" type="text"></span>  
                        <!-- MEDIA DU MESSAGE --> 
                        <span v-if="message.urlmedia !== null" class="urlImg">
                            <img v-bind:src="message.urlmedia">
                        </span> 
                        <!-- UPDATE DU MEDIA -->
                        <span class="updateMessMedia" v-if="mode == 'UPDATE'" id="urlmedia">
                        <input class="updateMess" v-if="mode == 'UPDATE'" id="createurlmedia" v-model="message.urlmedia"  type="text">
                        <input class="updateMess" v-if="mode == 'UPDATE'" type="file" accept="image/*"  @change="urlmedia" />
                        </span> 
                        <!-- CORPS DU MESSAGE --> 
                        <span v-if="mode == 'LISTEMESSAGE'" class="mess"><p>{{message.content}}</p></span> 
                        </div>  
                        <!-- UPDATE DU CORPS DU MESSAGE -->
                        <span  class="update"><textarea class="updateMess" rows="3"   id="createContent" v-if="mode == 'UPDATE'" v-model="message.content"  type="text"></textarea></span>
                        <div v-if="mode=='LISTEMESSAGE'" id="control"> 
                            <span @click="getUpOneMessage(message.id)" class="modif" v-if="user.id == message.UserId"><i class="far fa-edit"></i></span> 
                            <span class="like"><i class="far fa-thumbs-up"></i> <p>{{message.likes}}</p></span> 
                            <span class="delete" v-if="user.id == message.UserId" @click="deleteMessage(message.id)"><i class="far fa-trash-alt"></i></span> 
                        </div>
                        <!-- VALID / CANCEL UPDATE -->
                        <div id="controlUpdate" v-else>
                            <span id="cancelUpdate" @click="switchLISTEMESSAGE()">
                                <i class="fas fa-times-circle"></i>
                            </span>
                            <span id="validUpdate">
                                <i class="fas fa-check-circle" @click="update()"></i>
                            </span>
                        </div>                     
                </li>
            </ul>
        </div>
        <div>

        </div>
    </div>
</template>

<script>
import {mapState}from 'vuex'
export default{
        name:'LISTEMESSAGE',
        data: function(){
            return{
                mode: "LISTEMESSAGE",
                title:'',
                content:'',
                urlmedia:'',
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
            }),
        },
        methods:{
            getOneMessage(id){
                this.$router.push(`/message/${id}`);
            },
            getUpOneMessage(id){
                this.$router.push(`/message/modif/${id}`);
            },
            switchMESSAGE: function () {
                this.mode = "MESSAGE";
        },
            switchLISTEMESSAGE: function () {
                this.mode = "LISTEMESSAGE";
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
li{
    list-style: none;
    margin: 20px;
    margin-bottom: 30px;
    border-top: 1px solid rgb(240, 240, 240);
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    padding: 15px;
}
li span{
    display: flex;
    color: #fd2d01;
    padding: 0 15px;
    margin: 20px 0;
}
li p{
    color: #000;
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
    max-height: 300px;
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