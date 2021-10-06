<template>
    <h1>PROFILE</h1>
</template>

<script>
export default{
        name:'Profile',
        mounted:function(){
            console.log(this.$store.state.user);
            if(this.$store.state.user.userId == -1){
                this.$router.push('/');
                return;
            }
            this.$store.dispatch('getUserInfos');
        }
}
</script>
