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
    font-size: 20px;
    border-radius: 5px;
    background-color: #fff;
    border: 3px solid #fd2d01;
    color: #000;
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