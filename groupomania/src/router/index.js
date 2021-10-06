import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ListeMessage from '../views/ListeMessage.vue'
import Profile from '../views/Profile.vue'


const routes = [
    { path: '/', component: Home, name: 'HOME' },
    { path: '/MESSAGES', component: ListeMessage, name: 'LISTEMESSAGE' },
    { path: '/PROFILE', component: Profile, name: 'PROFILE' }
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router