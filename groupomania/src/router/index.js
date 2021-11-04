import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ListeMessage from '../views/ListeMessage.vue'
import Profile from '../views/Profile.vue'
import NewMessage from '../views/NewMessage.vue'
import ModifMessage from '../views/ModifMessage.vue'
import OneMessage from '../views/OneMessage.vue'



const routes = [
    { path: '/', component: Home, name: 'HOME' },
    { path: '/messages', component: ListeMessage, name: 'LISTEMESSAGE' },
    { path: '/message/modif/:id', component: ModifMessage, name: 'MODIFMESSAGE' },
    { path: '/PROFILE', component: Profile, name: 'PROFILE' },
    { path: '/message/new', component: NewMessage, name: 'NEWMESSAGE' },
    { path: '/message/:id', props: true, component: OneMessage, name: 'ONEMESSAGE' },
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router