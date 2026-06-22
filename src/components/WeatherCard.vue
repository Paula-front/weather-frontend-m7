<template>
  <div class="weather-card card card-accent">

    <!-- Header ciudad -->
    <div class="wc-header">
      <div class="wc-ciudad-info">
        <h2 class="wc-ciudad">{{ ciudad?.nombre }}</h2>
        <p class="wc-pais">📍 {{ ciudad?.pais }}</p>
        <p class="wc-fuente">Fuente: Open-Meteo</p>
      </div>
      <div class="wc-emoji-wrap">
        <span class="wc-emoji">{{ emoji }}</span>
        <p class="wc-desc">{{ descripcion }}</p>
      </div>
    </div>

    <!-- Temperatura principal -->
    <div class="wc-temp-section">
      <div class="wc-temp-main">
        <span class="wc-temp-num">{{ temperaturaFormateada }}</span>
        <span class="wc-temp-unit">{{ unidad === 'F' ? '°F' : '°C' }}</span>
      </div>
      <p class="wc-sensacion">
        Sensación térmica {{ sensacionFormateada }}{{ unidad === 'F' ? '°F' : '°C' }}
      </p>
    </div>

    <!-- Stats -->
    <div class="wc-stats grid-4">
      <div class="wc-stat">
        <span class="wc-stat-icon">💧</span>
        <span class="wc-stat-val">{{ clima?.humedad }}%</span>
        <span class="wc-stat-lbl">Humedad</span>
      </div>
      <div class="wc-stat">
        <span class="wc-stat-icon">🌬️</span>
        <span class="wc-stat-val">{{ clima?.viento }} km/h</span>
        <span class="wc-stat-lbl">Viento</span>
      </div>
      <div class="wc-stat">
        <span class="wc-stat-icon">👁️</span>
        <span class="wc-stat-val">{{ clima?.visibilidad }} km</span>
        <span class="wc-stat-lbl">Visibilidad</span>
      </div>
      <div class="wc-stat">
        <span class="wc-stat-icon">🌡️</span>
        <span class="wc-stat-val">{{ sensacionFormateada }}°</span>
        <span class="wc-stat-lbl">Sensación</span>
      </div>
    </div>

    <!-- Botón favorito -->
    <div class="wc-footer">
      <button
        class="btn btn-outline btn-full"
        :class="{ 'btn-favorito-activo': esFavorito }"
        @click="toggleFavorito"
      >
        <span v-if="esFavorito">❤️ En favoritos</span>
        <span v-else>🤍 Agregar a favoritos</span>
      </button>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import weatherService from '../services/weatherService.js'

export default {
  name: 'WeatherCard',
  props: {
    ciudad: { type: Object, default: null },
    clima: { type: Object, default: null },
    unidad: { type: String, default: 'C' }
  },
  emits: ['agregar-favorito'],
  computed: {
    ...mapGetters('auth', ['favoritos', 'isAuthenticated']),
    emoji() {
      return weatherService.obtenerEmoji(this.clima?.codigo)
    },
    descripcion() {
      return weatherService.obtenerDescripcion(this.clima?.codigo)
    },
    temperaturaFormateada() {
      if (!this.clima) return '--'
      if (this.unidad === 'F') {
        return weatherService.celsiusAFahrenheit(this.clima.temperatura)
      }
      return this.clima.temperatura
    },
    sensacionFormateada() {
      if (!this.clima) return '--'
      if (this.unidad === 'F') {
        return weatherService.celsiusAFahrenheit(this.clima.sensacionTermica)
      }
      return this.clima.sensacionTermica
    },
    esFavorito() {
      if (!this.ciudad) return false
      return this.favoritos.some(f => f.nombre === this.ciudad.nombre)
    }
  },
  methods: {
    toggleFavorito() {
      if (this.esFavorito) {
        this.$store.dispatch('auth/eliminarFavorito', this.ciudad.nombre)
      } else {
        this.$emit('agregar-favorito', this.ciudad)
      }
    }
  }
}
</script>

<style scoped>
.weather-card {
  background: linear-gradient(135deg,
    rgba(30, 58, 95, 0.8) 0%,
    rgba(26, 31, 78, 0.8) 60%,
    rgba(45, 27, 78, 0.8) 100%) !important;
  padding: 28px !important;
}

.wc-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.wc-ciudad {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.wc-pais {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.wc-fuente {
  font-size: 11px;
  color: var(--text-muted);
}

.wc-emoji-wrap {
  text-align: center;
}

.wc-emoji {
  font-size: 56px;
  display: block;
  filter: drop-shadow(0 0 20px rgba(96, 165, 250, 0.4));
  line-height: 1;
  margin-bottom: 6px;
}

.wc-desc {
  font-size: 13px;
  color: var(--text-secondary);
}

.wc-temp-section {
  margin-bottom: 24px;
}

.wc-temp-main {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  line-height: 1;
  margin-bottom: 8px;
}

.wc-temp-num {
  font-size: 72px;
  font-weight: 300;
  color: var(--text-primary);
}

.wc-temp-unit {
  font-size: 32px;
  color: var(--accent);
  margin-top: 12px;
}

.wc-sensacion {
  font-size: 14px;
  color: var(--text-muted);
}

.wc-stats {
  margin-bottom: 24px;
  gap: 10px !important;
}

.wc-stat {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 14px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
}

.wc-stat-icon {
  font-size: 22px;
}

.wc-stat-val {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.wc-stat-lbl {
  font-size: 11px;
  color: var(--text-muted);
}

.btn-favorito-activo {
  background: rgba(239, 68, 68, 0.1) !important;
  border-color: rgba(239, 68, 68, 0.4) !important;
  color: #F87171 !important;
}

@media (max-width: 600px) {
  .wc-temp-num { font-size: 56px; }
  .wc-ciudad { font-size: 22px; }
  .wc-emoji { font-size: 44px; }
}
</style>