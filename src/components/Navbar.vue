<template>
  <nav class="navbar" :class="temaClass">
    <div class="navbar-container">

      <!-- Logo -->
      <RouterLink to="/" class="navbar-brand">
        <span class="brand-icon">🌤️</span>
        <span class="brand-text">ClimaApp</span>
      </RouterLink>

      <!-- Links de navegación -->
      <div class="navbar-links">
        <RouterLink to="/" class="nav-link" active-class="nav-link-active" exact>
          🏠 Inicio
        </RouterLink>

        <RouterLink
          v-if="isAuthenticated"
          to="/favoritos"
          class="nav-link"
          active-class="nav-link-active"
        >
          ❤️ Favoritos
          <span v-if="cantidadFavoritos > 0" class="fav-count">{{ cantidadFavoritos }}</span>
        </RouterLink>

        <RouterLink
          v-if="isAuthenticated"
          to="/perfil"
          class="nav-link"
          active-class="nav-link-active"
        >
          👤 Perfil
        </RouterLink>
      </div>

      <!-- Usuario o botón login -->
      <div class="navbar-user">
        <template v-if="isAuthenticated">
          <div class="user-info">
            <div class="user-avatar">{{ iniciales }}</div>
            <span class="user-name">{{ usuarioActual.nombre }}</span>
          </div>
          <button class="btn-logout" @click="cerrarSesion">
            🚪 Salir
          </button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="btn btn-outline btn-sm">
            Iniciar sesión
          </RouterLink>
          <RouterLink to="/registro" class="btn btn-primary btn-sm">
            Registrarse
          </RouterLink>
        </template>
      </div>

    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Navbar',
  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'usuarioActual', 'favoritos']),
    temaClass() {
      return this.usuarioActual?.preferencias?.tema === 'light' ? 'navbar-claro' : 'navbar-oscuro'
    },
    iniciales() {
      if (!this.usuarioActual) return ''
      return this.usuarioActual.nombre.substring(0, 2).toUpperCase()
    },
    cantidadFavoritos() {
      return this.favoritos?.length || 0
    }
  },
  methods: {
    async cerrarSesion() {
      await this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
}

.navbar-oscuro {
  background: rgba(10, 15, 30, 0.85);
}

.navbar-claro {
  background: rgba(239, 246, 255, 0.85);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  flex-shrink: 0;
}

.brand-icon {
  font-size: 24px;
}

.brand-text {
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(135deg, #60A5FA, #818CF8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  justify-content: center;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 10px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all 0.2s ease;
  position: relative;
}

.nav-link:hover {
  background: var(--bg-card);
  color: var(--text-primary);
}

.nav-link-active {
  background: rgba(96, 165, 250, 0.15);
  color: var(--accent) !important;
}

.fav-count {
  background: var(--accent);
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3B82F6, #8B5CF6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: white;
  font-weight: 600;
  border: 2px solid rgba(255, 255, 255, 0.15);
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 10px;
  border: 1px solid rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.08);
  color: var(--danger);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.btn-logout:hover {
  background: rgba(239, 68, 68, 0.15);
  transform: translateY(-1px);
}
</style>