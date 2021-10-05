const home = {
    template: `
    <p>
        page d'accueil
    </p>`,
    name: 'HOME'
}

const inscription = {
    template: `
    <div id="inscrip">
        <label for="email">E-mail</label><input type="mail" id="email">
        <label for="username">Nom d'utilisateur</label><input type="text" id="username">
        <label for="pass">Password</label><input type="text" id="pass">
        <label for="bio">Poste</label><input type="text" id="bio">
        <button id="btn_inscrip" v-on:click="inscription()">
            INSCRIPTION
        </button>
    </div>`,
    name: 'INSCRIPTION'
}

const connexion = {
    template: `                
    <div id="connex">
        <label for="email">E-mail</label><input type="mail" id="email">
        <label for="pass">Password</label><input type="text" id="pass">
        <button id="btn_connex" v-on:click="connexion()">
            CONNEXION
        </button>
    </div>`,
    name: 'CONNEXION'
}

const listeMessage = {
    template: '',
    name: 'LISTEMESSAGE'
}

//Router
const router = new VueRouter({
    routes: [
        { path: '/', component: home, name: 'HOME' },
        { path: '/users/register', component: inscription, name: 'INSCRIPTION' },
        { path: '/users/login', component: connexion, name: 'CONNEXION' },
        { path: '/messages', component: listeMessage, name: 'LISTEMESSAGE' }
    ]
})

/*
//test GET
const message = new VueMess({
    el: '#message',
    data: {
        messages: []
    },
    methods: {
        affMessage() {
            axios.get('http://localhost:8080/api/messages')
                .then(response => this.messages = response.data)
                .catch(err => console.log(err));
        }
    }
}).$mont('#message');*/

const vue = new Vue({
    router
}).$mount('#app');