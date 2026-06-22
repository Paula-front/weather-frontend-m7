<template>
  <div class="perfil-page tema-oscuro">
    <div class="perfil-container">

      <!-- Header perfil -->
      <div class="perfil-hero card">
        <div class="perfil-avatar-wrap">
          <div class="perfil-avatar">{{ iniciales }}</div>
          <div class="perfil-avatar-ring"></div>
        </div>
        <div class="perfil-info">
          <h2 class="perfil-nombre">{{ usuarioActual?.nombre }}</h2>
          <p class="perfil-email">{{ usuarioActual?.email }}</p>
          <span class="badge badge-accent mt-8">✨ Usuario activo</span>
        </div>
        <div class="perfil-stats">
          <div class="perfil-stat">
            <span class="stat-num">{{ favoritos.length }}</span>
            <span class="stat-lbl">Favoritos</span>
          </div>
        </div>
      </div>

      <!-- Preferencias -->
      <div class="preferencias-section">
        <h3 class="section-title mb-16">
          <span class="section-icon">⚙️</span>
          Preferencias
        </h3>

        <!-- Unidad de temperatura -->
        <div class="pref-card card">
          <div class="pref-row">
            <div class="pref-left">
              <span class="pref-icon">🌡️</span>
              <div>
                <p class="pref-nombre">Unidad de temperatura</p>
                <p class="pref-detalle">Afecta todas las vistas de la app</p>
              </div>
            </div>
            <div class="toggle-group">
              <button
                class="toggle-option"
                :class="{ activo: preferencias.unidad === 'C' }"
                @click="cambiarUnidad('C')"
              >
                °C
              </button>
              <button
                class="toggle-option"
                :class="{ activo: preferencias.unidad === 'F' }"
                @click="cambiarUnidad('F')"
              >
                °F
              </button>
            </div>
          </div>
        </div>

        <!-- Tema visual -->
        <div class="pref-card card">
          <div class="pref-row">
            <div class="pref-left">
              <span class="pref-icon">🎨</span>
              <div>
                <p class="pref-nombre">Tema visual</p>
                <p class="pref-detalle">Apariencia general de la app</p>
              </div>
            </div>
            <div class="toggle-group">
              <button
                class="toggle-option"
                :class="{ activo: preferencias.tema === 'light' }"
                @click="cambiarTema('light')"
              >
                ☀️ Claro
              </button>
              <button
                class="toggle-option"
                :class="{ activo: preferencias.tema === 'dark' }"
                @click="cambiarTema('dark')"
              >
                🌙 Oscuro
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- Mis favoritos resumen -->
      <div v-if="favoritos.length > 0" class="favoritos-resumen">
        <div class="section-header">
          <h3 class="section-title">
            <span class="section-icon">❤️</span>
            Mis favoritos
          </h3>
          <RouterLink to="/favoritos" class="btn btn-outline btn-sm">
            Ver todos
          </RouterLink>
        </div>
        <div class="favoritos-chips">
          <div
            v-for="ciudad in favoritos"
            :key="ciudad.nombre"
            class="favorito-chip"
          >
            📍 {{ ciudad.nombre }}, {{ ciudad.pais }}
          </div>
        </div>
      </div>

      <!-- Alerta guardado -->
      <div v-if="guardado" class="alerta alerta-success">
        ✅ Preferencias guardadas correctamente
      </div>

      <!-- Botón cerrar sesión -->
      <button class="btn btn-danger btn-full btn-lg" @click="cerrarSesion">
        🚪 Cerrar sesión
      </button>

    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'PerfilView',
  data() {
    return {
      guardado: false
    }
  },
  computed: {
    ...mapGetters('auth', ['usuarioActual', 'favoritos', 'preferencias']),
    iniciales() {
      if (!this.usuarioActual) return ''
      return this.usuarioActual.nombre.substring(0, 2).toUpperCase()
    }
  },
  methods: {
    ...mapActions('auth', ['actualizarPreferencias', 'logout']),

    async cambiarUnidad(unidad) {
      await this.actualizarPreferencias({ unidad })
      this.mostrarGuardado()
    },

    async cambiarTema(tema) {
      await this.actualizarPreferencias({ tema })
      this.mostrarGuardado()
    },

    mostrarGuardado() {
      this.guardado = true
      setTimeout(() => {
        this.guardado = false
      }, 2000)
    },

    async cerrarSesion() {
      await this.logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.perfil-page {
  min-height: 100vh;
  padding: 32px 24px;
}

.perfil-container {
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.perfil-hero {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px !important;
  background: linear-gradient(135deg, rgba(30, 58, 95, 0.8), rgba(45, 27, 78, 0.8)) !important;
  border-color: rgba(96, 165, 250, 0.2) !important;
}

.perfil-avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.perfil-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3B82F6, #8B5CF6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: white;
  font-weight: 700;
  position: relative;
  z-index: 1;
}

.perfil-avatar-ring {
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  background: linear-gradient(135deg, #60A5FA, #818CF8);
  z-index: 0;
  opacity: 0.4;
}

.perfil-info {
  flex: 1;
}

.perfil-nombre {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.perfil-email {
  font-size: 14px;
  color: var(--text-muted);
}

.perfil-stats {
  display: flex;
  gap: 20px;
  flex-shrink: 0;
}

.perfil-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-num {
  font-size: 24px;
  font-weight: 700;
  color: var(--accent);
}

.stat-lbl {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.preferencias-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pref-card {
  padding: 16px 20px !important;
}

.pref-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.pref-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.pref-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.pref-nombre {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
}

.pref-detalle {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
}

.favoritos-resumen {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.favoritos-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.favorito-chip {
  padding: 6px 14px;
  background: rgba(96, 165, 250, 0.08);
  border: 1px solid rgba(96, 165, 250, 0.2);
  border-radius: 20px;
  font-size: 13px;
  color: var(--text-secondary);
}

@media (max-width: 600px) {
  .perfil-hero {
    flex-direction: column;
    text-align: center;
  }
  .pref-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>