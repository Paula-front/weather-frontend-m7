<template>
  <div :class="['app-wrapper', tema]">
    <Navbar v-if="mostrarNavbar" />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Navbar from './components/Navbar.vue'

export default {
  name: 'App',
  components: { Navbar },
  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'usuarioActual']),
    tema() {
      if (this.usuarioActual?.preferencias?.tema === 'light') return 'tema-claro'
      return 'tema-oscuro'
    },
    mostrarNavbar() {
      const rutasSinNavbar = ['/login', '/registro']
      return !rutasSinNavbar.includes(this.$route.path)
    }
  }
}
</script>

<style>
.app-wrapper {
  min-height: 100vh;
  transition: background 0.3s ease;
}

.tema-oscuro {
  background: linear-gradient(160deg, #0A0F1E 0%, #0D1B3E 50%, #0A1628 100%);
  color: #F8FAFC;
}

.tema-claro {
  background: linear-gradient(160deg, #EFF6FF 0%, #DBEAFE 50%, #EFF6FF 100%);
  color: #1E293B;
}

.main-content {
  min-height: 100vh;
}
</style>