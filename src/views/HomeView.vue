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

  background:
    radial-gradient(circle at top right,#1e3a8a 0%,transparent 35%),
    radial-gradient(circle at bottom left,#312e81 0%,transparent 35%),
    #020817;
}

.home-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* HERO */

.hero-section {

  padding: 50px;

  border-radius: 30px;

  overflow: hidden;

  background:
    linear-gradient(
      rgba(2,6,23,.75),
      rgba(2,6,23,.9)
    ),
    url('https://images.unsplash.com/photo-1506744038136-46273834b3fb');

  background-size: cover;
  background-position: center;

  border: 1px solid rgba(255,255,255,.08);

  box-shadow:
    0 20px 60px rgba(0,0,0,.35);
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  color: white;
  line-height: 1.1;
  margin-bottom: 12px;
}

.gradient-text {
  background: linear-gradient(
    135deg,
    #60a5fa,
    #818cf8
  );

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: rgba(255,255,255,.75);
  margin-bottom: 30px;
}

/* BUSCADOR */

.search-section {
  position: relative;
}

.search-wrap {

  display: flex;
  align-items: center;

  gap: 12px;

  padding: 10px;

  border-radius: 18px;

  backdrop-filter: blur(25px);

  background:
    rgba(255,255,255,.08);

  border:
    1px solid rgba(255,255,255,.08);
}

.search-icon {
  font-size: 20px;
}

.search-input {

  flex: 1;

  background: transparent;
  border: none;
  outline: none;

  color: white;

  font-size: 16px;
}

.search-input::placeholder {
  color: rgba(255,255,255,.5);
}

.search-btn {
  border-radius: 12px !important;
}

/* SUGERENCIAS */

.sugerencias {

  position: absolute;

  top: calc(100% + 10px);

  left: 0;
  right: 0;

  z-index: 100;

  background:
    #0f172a;

  border-radius: 18px;

  overflow: hidden;

  border:
    1px solid rgba(255,255,255,.08);

  box-shadow:
    0 15px 40px rgba(0,0,0,.4);
}

.sugerencia-item {

  width: 100%;

  padding: 14px 18px;

  background: transparent;

  border: none;

  color: white;

  text-align: left;

  cursor: pointer;

  transition: .25s;
}

.sugerencia-item:hover {

  background:
    rgba(59,130,246,.15);
}

.sugerencia-region {

  margin-left: auto;

  color:
    rgba(255,255,255,.5);

  font-size: .8rem;
}

/* SECCIONES */

.section-title {

  display: flex;
  align-items: center;
  gap: 10px;

  font-size: 1.8rem;

  color: white;
}

.section-icon {
  font-size: 1.5rem;
}

/* CHIPS */

.ciudades-grid {

  display: flex;
  flex-wrap: wrap;

  gap: 12px;
}

.ciudad-chip {

  padding: 12px 22px;

  border-radius: 999px;

  border:
    1px solid rgba(255,255,255,.08);

  background:
    rgba(255,255,255,.05);

  color: white;

  cursor: pointer;

  transition: .3s;
}

.ciudad-chip:hover {

  transform:
    translateY(-3px);

  background:
    linear-gradient(
      135deg,
      #3b82f6,
      #6366f1
    );

  border-color: transparent;
}

/* RESULTADO */

.clima-resultado {

  display: flex;
  flex-direction: column;

  gap: 28px;
}

.pronostico-grid {

  display: grid;

  grid-template-columns:
    repeat(auto-fit,minmax(130px,1fr));

  gap: 12px;
}

.loading-container {

  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 16px;

  padding: 60px;

  color: white;
}

.spinner {

  width: 60px;
  height: 60px;

  border-radius: 50%;

  border: 5px solid rgba(255,255,255,.1);

  border-top-color: #60a5fa;

  animation: spin 1s linear infinite;
}

@keyframes spin {

  to {
    transform: rotate(360deg);
  }
}

@media (max-width:768px){

  .hero-section{
    padding:30px;
  }

  .hero-title{
    font-size:2rem;
  }

}

</style>