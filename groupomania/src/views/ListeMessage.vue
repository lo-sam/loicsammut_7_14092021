<template>
    <div id="listeMessage">
        <span id="createMess_head">
            <h1 v-if="mode == 'MESSAGE'">Ecrire un message</h1>
            <button id="cancelMess" v-if="mode == 'MESSAGE'" @click="switchLISTEMESSAGE()">
                <div class="cancelMess">Annuler</div>
                <i class="fas fa-times-circle"></i>
            </button>
        </span>
        <h1 v-if="mode=='LISTEMESSAGE'">Liste des messages</h1>
        <button v-if="mode == 'LISTEMESSAGE'" @click="switchMESSAGE()" id="ajoutMess">
            <i class="fas fa-plus-circle"></i>
           <div class="ajoutMess">Ajouter un message</div>
        </button>
        <div v-else id="createMess">
            <input id="createTitle" v-if="mode == 'MESSAGE'" v-model="title" placeholder="Titre du message" type="text">
            <textarea rows="10" cols="50"  id="createContent" v-if="mode == 'MESSAGE'" v-model="content" placeholder="Message" type="text"></textarea>
           <span id="urlmedia">
               <input id="createurlmedia" v-if="mode == 'MESSAGE'" v-model="urlmedia" placeholder="Pièce jointe" type="text">
               <button>
                   Ajouter
                </button>
                <input type="file" v-if="mode == 'MESSAGE'" v-on:change="j"  />
           </span> 
            <button id="btn_createMess" v-if="title!='' && content!=''&& mode == 'MESSAGE'" @click="envMessage()">Envoyer message</button>
        </div>
        <div v-if="mode=='LISTEMESSAGE'" id="listeMess">
            <ul >
                <li v-for="message in messages" :key="message.id">
                    <span >

                        <p class="photoP"><img :src="message.User" alt="photo de profil"></p>
                        <p class="auther">Nom de l'auteur{{message.User.userlastname}}</p>
                        <p class="date">{{message.updatedAt}}</p>
                    </span> 
                    <span class="title">titre: <p>{{message.title}}</p></span>    
                    <span class="mess"><p>{{message.content}}</p></span> 
                    <span v-if="message.urlmedia !== null" class="urlImg">
                        <img v-bind:src="message.urlmedia">
                    </span> 
                    <div id="control"> 
                        <span class="like"><i class="far fa-thumbs-up"></i> <p>{{message.likes}}</p></span> 
                        <span class="modif" v-if="user.id == message.UserId"><i class="far fa-edit"></i></span> 
                        <span class="delete" v-if="user.id == message.UserId" @click="deleteMessage()"><i class="far fa-trash-alt"></i></span> 
                    </div>                
                </li>
            </ul>
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
                User: {
                     id: '',
                     username: '',
                     userlastname:'',
                     profilpic: ''
                     }
            }
        },
        mounted: function(){
            if(this.$store.state.user.userId == -1){
                this.$router.push('/');
                return;
            }            
            this.$store.dispatch('getListeMessage');
            // this.$store.dispatch('getUserInfos');
            },
        computed:{
            ...mapState({
                messages:'listeMessage'
               
            }),
        },
        methods:{
            switchMESSAGE: function () {
                this.mode = "MESSAGE";
        },
            switchLISTEMESSAGE: function () {
                this.mode = "LISTEMESSAGE";
        },
        envMessage: function(){
            const self = this;
            this.$store
            .dispatch('message',{
                title: this.title,
                content: this.content,
                urlmedia: this.urlmedia,
            }).then(function(){
                self.switchLISTEMESSAGE();
            }).catch(function(err){
                console.log(err);
            })
        },
            deconnexion:function(){
                this.$store.commit('deconnexion');
                this.$router.push('/');
            }
        }
}
</script>

<style scoped>
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
.photoP img{
    width: 60px;
    height: 60px;
    object-fit: cover;
    object-position: center;
}
#ajoutMess,
#cancelMess{
    margin: 20px auto 10px 20px;
    display: flex;
}
#ajoutMess i,
#cancelMess i{
    font-size: 25px;
    color: #fd2d01;
}
#ajoutMess .ajoutMess{
    margin-left: 5px;
}
#cancelMess .cancelMess{
    margin-right: 5px;
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
.auther{
    margin-left: 5px;
}
.date{
    margin-left: auto;
}
.mess{
    padding: 15px;
    padding-top: 5px;
}
.urlImg{
    border: 1px solid rgb(240, 240, 240);
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
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
    width: 50%;
}
#urlmedia input{
    width: 50%;
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
#btn_createMess:hover{
  color: #000;
  background-color: #fd2d01;
  border-radius: 10px;
  box-shadow: 0 0 10px #fd2d01, 0 0 40px #fd2d01, 0 0 80px #fd2d01;
  transition: 1s;
  transition-delay: 0.1s;
}
</style>