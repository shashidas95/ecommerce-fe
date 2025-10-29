import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Auth/Login.vue'
import Profile from '@/views/Profile.vue'
import Home from '@/views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', Name: 'login', component: Login },
    { path: '/profile', Name: 'profile', component: Profile },
    { path: '/', Name: 'home', component: Home },



  ],
})

export default router
