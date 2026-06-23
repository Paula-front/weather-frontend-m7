<template>
  <article class="weather-card">
    <div class="weather-main">
      <div>
        <p class="source">Fuente: Open-Meteo</p>

        <h2>{{ ciudad?.nombre }}</h2>
        <p class="country">📍 {{ ciudad?.pais }}</p>

        <div class="temperature">
          <span class="temp-number">{{ temperaturaFormateada }}</span>
          <span class="temp-unit">{{ unidad === 'F' ? '°F' : '°C' }}</span>
        </div>

        <p class="feels">
          Sensación térmica {{ sensacionFormateada }}{{ unidad === 'F' ? '°F' : '°C' }}
        </p>
      </div>

      <div class="weather-icon-box">
        <span class="weather-icon">{{ emoji }}</span>
        <p>{{ descripcion }}</p>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-item">
        <span>💧</span>
        <strong>{{ clima?.humedad }}%</strong>
        <small>Humedad</small>
      </div>

      <div class="stat-item">
        <span>🌬️</span>
        <strong>{{ clima?.viento }} km/h</strong>
        <small>Viento</small>
      </div>

      <div class="stat-item">
        <span>👁️</span>
        <strong>{{ clima?.visibilidad }} km</strong>
        <small>Visibilidad</small>
      </div>

      <div class="stat-item">
        <span>🌡️</span>
        <strong>{{ sensacionFormateada }}°</strong>
        <small>Sensación</small>
      </div>
    </div>

    <button
      class="favorite-btn"
      :class="{ active: esFavorito }"
      @click="toggleFavorito"
    >
      <span v-if="esFavorito">❤️ En favoritos</span>
      <span v-else>🤍 Agregar a favoritos</span>
    </button>
  </article>
</template>

<script>
import { mapGetters } from 'vuex'
import weatherService from '../services/weatherService.js'

export default {
  name: 'WeatherCard',

  props: {
    ciudad: {
      type: Object,
      default: null
    },
    clima: {
      type: Object,
      default: null
    },
    unidad: {
      type: String,
      default: 'C'
    }
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
  background:
    linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #4338ca 100%);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 26px;
  padding: 24px;
  color: white;
  box-shadow: 0 22px 55px rgba(30, 64, 175, 0.25);
}

.weather-main {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: flex-start;
  margin-bottom: 18px;
}

.source {
  font-size: 0.72rem;
  color: #bfdbfe;
  margin-bottom: 8px;
}

.weather-main h2 {
  font-size: 1.8rem;
  margin-bottom: 4px;
}

.country {
  color: #dbeafe;
  font-size: 0.9rem;
  margin-bottom: 14px;
}

.temperature {
  display: flex;
  align-items: flex-start;
  line-height: 1;
}

.temp-number {
  font-size: 4.5rem;
  font-weight: 300;
}

.temp-unit {
  font-size: 1.7rem;
  color: #93c5fd;
  margin-top: 8px;
  margin-left: 4px;
}

.feels {
  color: #c7d2fe;
  font-size: 0.9rem;
  margin-top: 8px;
}

.weather-icon-box {
  min-width: 120px;
  text-align: center;
  padding: 16px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.12);
}

.weather-icon {
  display: block;
  font-size: 3.4rem;
  margin-bottom: 8px;
  filter: drop-shadow(0 8px 18px rgba(255, 255, 255, 0.25));
}

.weather-icon-box p {
  color: #e0f2fe;
  font-size: 0.8rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.stat-item {
  min-height: 86px;
  padding: 12px 8px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.13);
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;
  text-align: center;
}

.stat-item span {
  font-size: 1.3rem;
}

.stat-item strong {
  font-size: 0.95rem;
}

.stat-item small {
  color: #cbd5e1;
  font-size: 0.7rem;
}

.favorite-btn {
  width: 100%;
  margin-top: 16px;
  border: 1px solid rgba(191, 219, 254, 0.5);
  border-radius: 15px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.08);
  color: #bfdbfe;
  font-weight: 800;
  cursor: pointer;
  transition: 0.25s;
}

.favorite-btn:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.16);
}

.favorite-btn.active {
  background: rgba(239, 68, 68, 0.18);
  border-color: rgba(248, 113, 113, 0.7);
  color: #fecaca;
}

@media (max-width: 650px) {
  .weather-main {
    flex-direction: column;
  }

  .weather-icon-box {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .temp-number {
    font-size: 3.6rem;
  }
}
</style>