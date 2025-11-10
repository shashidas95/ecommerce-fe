import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Auth/Login.vue'
import Profile from '@/views/Profile.vue'
import Home from '@/views/Home.vue'
import Wishlist from '@/views/Wishlist.vue'
import Cart from '@/views/Cart.vue'
import MyAccount from '@/views/dashboard/MyAccount.vue'
import { useAuth } from '@/stores/auth'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: Login },
    { path: '/profile', name: 'profile', component: Profile, meta: { requireAuth: true } },
    { path: '/', name: 'home', component: Home },
    { path: '/wishlist', name: 'wishlist', component: Wishlist, meta: { requireAuth: true } },
    { path: '/cart', name: 'cart', component: Cart, meta: { requireAuth: true } },
    { path: '/dashboard/my-account', Name: 'my-account', component: MyAccount, meta: { requireAuth: true } },

  ],
})
router.beforeEach((to) => {
  const auth = useAuth()
  if (to.meta.requireAuth && !auth.isAuthenticated) return { name: 'login' }
})
export default router
