<template>
    <div id="creationM">
                <!-- MODE CREATION DE MESSAGE -->
        <span id="createMess_head">
            <h1>Ecrire un message</h1>
            <div id="cancelMessRight">
                <router-link to='/MESSAGES'>
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
                <input id="createurlmedia" v-model="urlmedia" placeholder="Pièce jointe" type="text">
                <input @change="urlmedia" type="file" name="image"  accept=".jpg, .jpeg, .gif, .png" />
            </span> 
            <div id="btn_center">
                <router-link to='/MESSAGES'>
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
                }
        },
         mounted: function(){
            if(this.$store.state.user.userId == -1){
                this.$router.push('/');
                return;
            }            
            this.$store.dispatch('getListeMessage');
            //this.$store.dispatch('getListeCom');
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
                urlmedia: this.file,
            }).then(function(){
                self.$router.push("/MESSAGES");
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
  margin: 30px auto;
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

</style>
