import { createRouter, createWebHashHistory } from 'vue-router'
import store from '../store/index.js'

import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegistroView from '../views/RegistroView.vue'
import FavoritosView from '../views/FavoritosView.vue'
import PerfilView from '../views/PerfilView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { soloInvitados: true }
  },
  {
    path: '/registro',
    name: 'Registro',
    component: RegistroView,
    meta: { soloInvitados: true }
  },
  {
    path: '/favoritos',
    name: 'Favoritos',
    component: FavoritosView,
    meta: { requiereAuth: true }
  },
  {
    path: '/perfil',
    name: 'Perfil',
    component: PerfilView,
    meta: { requiereAuth: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated']

  if (to.meta.requiereAuth && !isAuthenticated) {
    next({ name: 'Login' })
    return
  }

  if (to.meta.soloInvitados && isAuthenticated) {
    next({ name: 'Home' })
    return
  }

  next()
})

export default router