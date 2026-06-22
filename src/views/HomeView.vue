<template>
  <div class="home-page tema-oscuro">
    <div class="home-container">

      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-text">
          <h1 class="hero-title">
            🌍 El clima del mundo,
            <span class="gradient-text">en tus manos</span>
          </h1>
          <p class="hero-subtitle">
            Busca cualquier ciudad y obtén el clima actual, pronóstico semanal y más
          </p>
        </div>

        <!-- Buscador -->
        <div class="search-section">
          <div class="search-wrap">
            <span class="search-icon">🔍</span>
            <input
              v-model="busqueda"
              type="text"
              class="search-input"
              placeholder="Busca una ciudad... ej: Santiago, Tokio, París"
              @input="onInput"
              @keyup.enter="buscarCiudad"
              autocomplete="off"
            />
            <button
              class="btn btn-primary search-btn"
              @click="buscarCiudad"
              :disabled="cargandoBusqueda || !busqueda.trim()"
            >
              <span v-if="cargandoBusqueda">⏳</span>
              <span v-else>Buscar</span>
            </button>
          </div>

          <!-- Sugerencias de búsqueda -->
          <div v-if="sugerencias.length > 0" class="sugerencias">
            <button
              v-for="s in sugerencias"
              :key="s.lat + s.lon"
              class="sugerencia-item"
              @click="seleccionarSugerencia(s)"
            >
              📍 {{ s.nombre }}, {{ s.pais }}
              <span v-if="s.region" class="sugerencia-region">{{ s.region }}</span>
            </button>
          </div>

          <!-- Error de búsqueda -->
          <div v-if="errorBusqueda" class="alerta alerta-error mt-8">
            ⚠️ {{ errorBusqueda }}
          </div>
        </div>
      </div>

      <!-- Ciudades sugeridas (cuando no hay búsqueda activa) -->
      <div v-if="!climaActual && !cargando" class="ciudades-sugeridas">

        <!-- Chile -->
        <div class="seccion-ciudades">
          <div class="section-header">
            <h3 class="section-title">
              <span class="section-icon">🇨🇱</span>
              Ciudades de Chile
            </h3>
          </div>
          <div class="ciudades-grid">
            <button
              v-for="ciudad in ciudadesChile"
              :key="ciudad.nombre"
              class="ciudad-chip"
              @click="seleccionarCiudad(ciudad)"
            >
              {{ ciudad.nombre }}
            </button>
          </div>
        </div>

        <!-- Mundo -->
        <div class="seccion-ciudades">
          <div class="section-header">
            <h3 class="section-title">
              <span class="section-icon">🌍</span>
              Capitales del Mundo
            </h3>
          </div>
          <div class="ciudades-grid">
            <button
              v-for="ciudad in ciudadesMundo"
              :key="ciudad.nombre"
              class="ciudad-chip"
              @click="seleccionarCiudad(ciudad)"
            >
              {{ ciudad.nombre }}
            </button>
          </div>
        </div>

      </div>

      <!-- Loading -->
      <div v-if="cargando" class="loading-container">
        <div class="spinner"></div>
        <p>Obteniendo clima de {{ ciudadActual?.nombre }}...</p>
      </div>

      <!-- Resultado del clima -->
      <div v-if="climaActual && !cargando" class="clima-resultado">

        <!-- Imagen de la ciudad -->
        <CityImage :ciudad="ciudadActual?.nombre" :pais="ciudadActual?.pais" />

        <!-- Card principal del clima -->
        <WeatherCard
          :ciudad="ciudadActual"
          :clima="climaActual"
          :unidad="unidad"
          @agregar-favorito="agregarAFavoritos"
        />

        <!-- Pronóstico semanal -->
        <div class="pronostico-section">
          <div class="section-header">
            <h3 class="section-title">
              <span class="section-icon">📅</span>
              Pronóstico Semanal
            </h3>
          </div>
          <div class="pronostico-grid">
            <ForecastCard
              v-for="dia in pronostico"
              :key="dia.fecha"
              :dia="dia"
              :unidad="unidad"
            />
          </div>
        </div>

        <!-- Estadísticas de la semana -->
        <WeekStats :pronostico="pronostico" :unidad="unidad" />

        <!-- Alertas -->
        <div v-if="alertas.length > 0" class="alertas-section">
          <div class="section-header">
            <h3 class="section-title">
              <span class="section-icon">⚠️</span>
              Alertas de Clima
            </h3>
          </div>
          <div v-for="alerta in alertas" :key="alerta.tipo" class="alerta alerta-warning">
            {{ alerta.mensaje }}
          </div>
        </div>

        <div v-else class="alerta alerta-success">
          ✅ Sin alertas relevantes. Condiciones climáticas normales.
        </div>

        <!-- Botón volver -->
        <button class="btn btn-secondary btn-full mt-16" @click="limpiarClima">
          ← Buscar otra ciudad
        </button>

      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import weatherService from '../services/weatherService.js'
import WeatherCard from '../components/WeatherCard.vue'
import ForecastCard from '../components/ForecastCard.vue'
import CityImage from '../components/CityImage.vue'
import WeekStats from '../components/WeekStats.vue'

export default {
  name: 'HomeView',
  components: { WeatherCard, ForecastCard, CityImage, WeekStats },
  data() {
    return {
      busqueda: '',
      sugerencias: [],
      errorBusqueda: '',
      cargandoBusqueda: false,
      ciudadesChile: weatherService.ciudadesChile,
      ciudadesMundo: weatherService.ciudadesMundo,
      alertas: []
    }
  },
  computed: {
    ...mapGetters('weather', ['climaActual', 'ciudadActual', 'pronostico', 'cargando', 'error']),
    ...mapGetters('auth', ['isAuthenticated', 'preferencias']),
    unidad() {
      return this.preferencias?.unidad || 'C'
    },
    cargando() {
      return this.$store.getters['weather/loading']
    }
  },
  watch: {
    climaActual(nuevo) {
      if (nuevo) {
        this.alertas = weatherService.generarAlertas(nuevo, this.pronostico)
      }
    }
  },
  methods: {
    ...mapActions('weather', ['buscarClima']),
    ...mapActions('auth', ['agregarFavorito']),

    async onInput() {
      this.errorBusqueda = ''
      if (this.busqueda.trim().length < 2) {
        this.sugerencias = []
        return
      }
      try {
        this.sugerencias = await weatherService.buscarCiudad(this.busqueda)
      } catch {
        this.sugerencias = []
      }
    },

    async buscarCiudad() {
      if (!this.busqueda.trim()) return
      this.errorBusqueda = ''
      this.cargandoBusqueda = true
      try {
        const resultados = await weatherService.buscarCiudad(this.busqueda)
        if (resultados.length > 0) {
          await this.seleccionarSugerencia(resultados[0])
        }
      } catch (error) {
        this.errorBusqueda = error.message
      } finally {
        this.cargandoBusqueda = false
        this.sugerencias = []
      }
    },

    async seleccionarSugerencia(ciudad) {
      this.busqueda = ciudad.nombre
      this.sugerencias = []
      await this.buscarClima(ciudad)
    },

    async seleccionarCiudad(ciudad) {
      this.busqueda = ciudad.nombre
      await this.buscarClima(ciudad)
    },

    agregarAFavoritos(ciudad) {
      if (!this.isAuthenticated) {
        this.$router.push('/login')
        return
      }
      this.agregarFavorito(ciudad)
    },

    limpiarClima() {
      this.$store.commit('weather/LIMPIAR_CLIMA')
      this.busqueda = ''
      this.alertas = []
    }
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  padding: 32px 24px;
}

.home-container {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.hero-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
  margin-bottom: 8px;
}

.gradient-text {
  background: linear-gradient(135deg, #60A5FA, #818CF8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 16px;
  color: var(--text-secondary);
}

.search-section {
  position: relative;
}

.search-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(96, 165, 250, 0.3);
  border-radius: 16px;
  padding: 8px 8px 8px 16px;
}

.search-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-size: 15px;
  font-family: inherit;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-btn {
  flex-shrink: 0;
  border-radius: 10px !important;
  padding: 10px 20px !important;
}

.sugerencias {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: #0D1B3E;
  border: 1px solid rgba(96, 165, 250, 0.2);
  border-radius: 12px;
  overflow: hidden;
  z-index: 50;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.sugerencia-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: background 0.2s;
}

.sugerencia-item:last-child {
  border-bottom: none;
}

.sugerencia-item:hover {
  background: rgba(96, 165, 250, 0.1);
}

.sugerencia-region {
  font-size: 12px;
  color: var(--text-muted);
  margin-left: auto;
}

.ciudades-sugeridas {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.seccion-ciudades {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ciudades-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ciudad-chip {
  padding: 8px 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(96, 165, 250, 0.2);
  border-radius: 20px;
  color: var(--text-secondary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.ciudad-chip:hover {
  background: rgba(96, 165, 250, 0.15);
  color: var(--accent);
  border-color: var(--accent);
  transform: translateY(-2px);
}

.clima-resultado {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.pronostico-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pronostico-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.alertas-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@media (max-width: 768px) {
  .hero-title { font-size: 1.6rem; }
  .pronostico-grid { grid-template-columns: repeat(4, 1fr); }
}

@media (max-width: 480px) {
  .pronostico-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>