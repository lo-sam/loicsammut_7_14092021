<template>
    <div id="listeMessage">
        <h1>liste des messages<i class="far fa-comments"></i></h1>
        <ul>
            <li v-for="message in messages" :key="message.title">
                <span>auteur: <p>{{message.userId}}</p></span> 
                <span>date: <p>{{message.updatedAt}}</p></span> 
                <span>titre: <p>{{message.title}}</p></span>    
                <span>message: <p>{{message.content}}</p></span> 
                <span><p>{{message.attachment}}</p></span> 
                <span>nb like: <p>{{message.likes}}</p></span> 

            </li>
        </ul>
    </div>
</template>

<script>
import {mapState}from 'vuex'
export default{
        name:'ListeMessage',
        mounted: function(){            
            this.$store.dispatch('getListeMessage');
            this.$store.dispatch('getUserInfos');
            },
        computed:{
            ...mapState({
                messages:'listeMessage',
                user:'userInfos',
            })
        },
        methods:{
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
li{
    list-style: none;
    margin: 20px;
    border: 1px solid #fd2d01;
    border-radius: 5px;
    padding: 5px;
}
li span{
    display: flex;
}
</style>