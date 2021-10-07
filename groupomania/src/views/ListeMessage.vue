<template>
    <div id="listeMessage">
        <h1>Messages</h1>
        <button v-if="mode == 'LISTEMESSAGE'" @click="switchMESSAGE()" id="ajoutMess"><i class="fas fa-plus-circle"></i></button>
        <div v-else id="createMess">
            <input v-if="mode == 'MESSAGE'" v-model="title" placeholder="Titre du message" type="text">
            <input v-if="mode == 'MESSAGE'" v-model="content" placeholder="Message" type="text">
            <input v-if="mode == 'MESSAGE'" v-model="attachment" placeholder="Pièce jointe" type="text">
            <button v-if="mode == 'MESSAGE'" @click="envMessage()">Envoyer message</button>
        </div>
        <div v-if="mode=='LISTEMESSAGE'" id="listeMess">
            <ul >
                <li v-for="message in messages" :key="message.id">
                    <span>Nom de l'auteur<p>{{message.userId}}</p></span> 
                    <span>date: <p>{{message.updatedAt}}</p></span> 
                    <span>titre: <p>{{message.title}}</p></span>    
                    <span>message: <p>{{message.content}}</p></span> 
                    <span v-if='message.attachment'><img src="{{messsage.attachment}}"/></span> 
                    <span>nb like: <p>{{message.likes}}</p></span> 
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
                attachment:'',
            }
        },
        mounted: function(){
            if(this.$store.state.user.userId == -1){
                this.$router.push('/');
                return;
            }            
            this.$store.dispatch('getListeMessage');
            this.$store.dispatch('getUserInfos');
            },
        computed:{
            ...mapState({
                messages:'listeMessage',
                user:'userInfos',
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
                attachment: this.attachment,
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

#ajoutMess{
    margin: 20px auto 10px 20px;
}

#ajoutMess i{
    font-size: 40px;
    color: #fd2d01;
}

li{
    list-style: none;
    margin: 20px;
    border: 1px solid #fd2d01;
    border-radius: 5px;
    padding: 5px;
}
li span{
    display: flex;
    color: #fd2d01;
}
li p{
    color: #000;
}
</style>