<template>
<div id="profile">
    <span>Nom d'utilisateur: <p>{{user.username}}</p></span> 
    <span>Adresse mail: <p>{{user.email}}</p></span>    
    <span>Poste dans l'entreprise: <p>{{user.bio}}</p></span> 
    <button>MODIFER</button>
</div>
</template>

<script>
import {mapState}from 'vuex'
export default{
        name:'Profile',
        mounted:function(){
            console.log(this.$store.state.user);
            if(this.$store.state.user.userId == -1){
                this.$router.push('/');
                return;
            }
            this.$store.dispatch('getUserInfos');
        },
        computed:{
            ...mapState({
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

<style>
#profile {
    margin: 50px auto;
    width: 50%;
    padding: 30px;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 10px;
    color: #FFD7D7;
    font-size: 20px;
}
#profile span{
    display: flex;
    margin: 10px;
}
#profile p{
    color: #fd2d01;
    margin-left: 5px;
}
#profile button{
    margin: 30px;
}
</style>