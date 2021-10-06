<template>
<div id="profile">
    <h1>PROFILE</h1>
    <p>Nom d'utilisateur: {{user.username}}</p>
    <p>Adresse mail: {{user.email}}</p>
    <p>Poste dans l'entreprise: {{user.bio}}</p>
    <button @click="deconnexion">BOUTON DECONNEXION</button>
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
