<template>
    <div id="listeMessage">
        <!-- MODE LISTE DES MESSAGES -->
        <h1>Liste des messages</h1>
        <router-link to='/message/new'>
            <button id="ajoutMess">
                <i class="fas fa-plus-circle"></i>
            <div class="ajoutMess">Ajouter un message</div>
            </button>
        </router-link>
        <div id="listeMess">
            <ul>
                <li :key="key" v-for="(message, key) in messages" >
                    <div @click="getOneMessage(message.id)"> 
                        <span>
                            <img class="photoP" :src="message.User.profilpic" alt="photo de profil">    
                            <p class="auther">{{message.User.username}}</p> 
                            <p class="date">le {{message.createdAt.slice(0,10).split('-').reverse().join('/') + ' à ' + message.updatedAt.slice(11,16)}}  </p>
                        </span> 
                        <!-- TITRE DU MESSAGE --> 
                        <span class="title"><p>{{message.title}}</p></span>  
                        <!-- MEDIA DU MESSAGE --> 
                        <span v-if="message.urlmedia !== ''" class="urlImg">
                            <img v-bind:src="message.urlmedia">
                        </span> 
                        <!-- CORPS DU MESSAGE --> 
                        <span class="mess"><p>{{message.content}}</p></span> 
                    </div>  
                    <div id="control"> 
                        <span @click="getUpOneMessage(message.id)" class="modif" v-if="user.id == message.UserId || user.isAdmin == 1"><i class="far fa-edit"></i></span> 
                        <span @click="like(message.id)" class="like"><i class="far fa-heart"></i><p>{{message.likes}}</p></span> 
                        <span class="delete" v-if="user.id == message.UserId || user.isAdmin == 1" @click="deleteMessage(message.id)"><i class="far fa-trash-alt"></i></span> 
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
                Likes:'Likes'
            }),
        },
        methods:{
        getOneMessage(id){
            this.$router.push(`/message/${id}`);
            },
        getUpOneMessage(id){
            this.$router.push(`/message/modif/${id}`);
            },
        deleteMessage:function(id){
            if(confirm('Voulez-vous vraiment supprimer le message?')){
                this.$store.dispatch('deleteMessage',id);
                this.$router.push('/');
            }
        },
        like: function(id){
            console.log('like');
            this.$store.dispatch('like',id);
        },
    }
}
</script>

<style scoped>
/* CSS LISTE MESSAGE */
#listeMessage{
    color: #000;
    display: flex;
    flex-direction: column;
    margin: 50px auto;
    padding: 30px;
    font-size: 20px;
    width: 90%;
    border: 3px solid #fd2d01;
    border-radius: 5px;
    background-color: #fff;
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
    border: 3px solid rgb(240, 240, 240);
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
@media (max-width: 500px)
{
    #listeMessage{
        padding: 2%;
    }
    #listeMess li{
        padding: 0;
        margin: 10px 0;
    }
    li span{
        flex-direction: column;
        margin: 5px;
    }
    .auther{
        margin-top: 5px;
    }
    .date{
        margin: 5px 0 25px 5px;
    }
    li .urlImg{
        border: none;
        padding: 0 10px;
    }
    .urlImg img{
        border-radius: 15px;
    }
    .like{
        flex-direction: row;
    }
}
</style>