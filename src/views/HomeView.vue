<template>
  <div class="home-page">
    <section class="hero">
      <div class="hero-content">
        <p class="hero-kicker">🌦️ ClimaApp</p>

        <h1>Consulta el clima actual y semanal de tus ciudades favoritas</h1>

        <p class="hero-subtitle">
          Busca una ciudad, revisa temperatura, viento, humedad, alertas y guarda tus lugares favoritos.
        </p>

        <div class="search-box">
          <span class="search-icon">🔍</span>

          <input
            v-model="busqueda"
            type="text"
            placeholder="Ej: Santiago, Tokio, París..."
            @input="onInput"
            @keyup.enter="buscarCiudad"
          />

          <button
            @click="buscarCiudad"
            :disabled="cargandoBusqueda || !busqueda.trim()"
          >
            {{ cargandoBusqueda ? 'Buscando...' : 'Buscar' }}
          </button>
        </div>

        <div v-if="sugerencias.length" class="sugerencias">
          <button
            v-for="s in sugerencias"
            :key="s.lat + s.lon"
            @click="seleccionarSugerencia(s)"
          >
            📍 {{ s.nombre }}, {{ s.pais }}
            <small v-if="s.region">{{ s.region }}</small>
          </button>
        </div>

        <p v-if="errorBusqueda" class="error-msg">
          ⚠️ {{ errorBusqueda }}
        </p>
      </div>
    </section>

    <section class="features-section">
      <div class="feature-card">
        <span>🌡️</span>
        <h3>Clima en tiempo real</h3>
        <p>Consulta temperatura, humedad, viento y sensación térmica.</p>
      </div>

      <div class="feature-card">
        <span>📅</span>
        <h3>Pronóstico semanal</h3>
        <p>Revisa la evolución del clima durante los próximos días.</p>
      </div>

      <div class="feature-card">
        <span>⭐</span>
        <h3>Favoritos</h3>
        <p>Guarda tus ciudades preferidas al iniciar sesión.</p>
      </div>

      <div class="feature-card">
        <span>🌎</span>
        <h3>Chile y mundo</h3>
        <p>Explora ciudades chilenas y capitales internacionales.</p>
      </div>
    </section>

    <section
      v-if="isAuthenticated && favoritos.length"
      class="favorites-section"
    >
      <div class="favorites-card">
        <h2>⭐ Tus ciudades favoritas</h2>

        <div class="favorites-list">
          <button
            v-for="favorito in favoritos"
            :key="favorito.nombre"
            class="favorite-city"
            @click="seleccionarCiudad(favorito)"
          >
            📍 {{ favorito.nombre }}
          </button>
        </div>
      </div>
    </section>

    <section v-if="!climaActual && !loading" class="quick-section">
      <div class="quick-card">
        <h2>🇨🇱 Ciudades de Chile</h2>

        <div class="chips">
          <button
            v-for="ciudad in ciudadesChile"
            :key="ciudad.nombre"
            @click="seleccionarCiudad(ciudad)"
          >
            {{ ciudad.nombre }}
          </button>
        </div>
      </div>

      <div class="quick-card">
        <h2>🌍 Capitales del mundo</h2>

        <div class="chips">
          <button
            v-for="ciudad in ciudadesMundo"
            :key="ciudad.nombre"
            @click="seleccionarCiudad(ciudad)"
          >
            {{ ciudad.nombre }}
          </button>
        </div>
      </div>
    </section>

    <section v-if="loading" class="loading-box">
      <div class="spinner"></div>
      <p>Obteniendo clima de {{ ciudadActual?.nombre || 'la ciudad' }}...</p>
    </section>

    <section v-if="climaActual && !loading" class="result-layout">
      <div class="result-left">
        <CityImage
          :ciudad="ciudadActual?.nombre"
          :pais="ciudadActual?.pais"
        />

        <div class="map-card">
          <div>
            <h3>📍 Ubicación</h3>
            <p>{{ ciudadActual?.nombre }}, {{ ciudadActual?.pais }}</p>
          </div>

          <div class="map-frame">
            <iframe
              :src="mapUrl"
              width="100%"
              height="230"
              style="border: 0"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div class="coords">
            <p>Lat: {{ ciudadActual?.lat }}</p>
            <p>Lon: {{ ciudadActual?.lon }}</p>
          </div>
        </div>
      </div>

      <div class="result-right">
        <WeatherCard
          :ciudad="ciudadActual"
          :clima="climaActual"
          :unidad="unidad"
          @agregar-favorito="agregarAFavoritos"
        />

        <div class="section-card">
          <h3>📅 Pronóstico semanal</h3>

          <div class="forecast-grid">
            <ForecastCard
              v-for="dia in pronostico"
              :key="dia.fecha"
              :dia="dia"
              :unidad="unidad"
            />
          </div>
        </div>

        <WeekStats
          v-if="pronostico.length"
          :pronostico="pronostico"
          :unidad="unidad"
        />

        <div class="alerts">
          <div
            v-for="alerta in alertas"
            :key="alerta.tipo"
            class="alert warning"
          >
            ⚠️ {{ alerta.mensaje }}
          </div>

          <div v-if="!alertas.length" class="alert success">
            ✅ Sin alertas relevantes. Condiciones normales.
          </div>
        </div>

        <button class="back-btn" @click="limpiarClima">
          ← Buscar otra ciudad
        </button>
      </div>
    </section>
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

  components: {
    WeatherCard,
    ForecastCard,
    CityImage,
    WeekStats
  },

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
    ...mapGetters('weather', [
      'climaActual',
      'ciudadActual',
      'pronostico',
      'error',
      'loading'
    ]),

    ...mapGetters('auth', [
      'isAuthenticated',
      'preferencias',
      'favoritos'
    ]),

    unidad() {
      return this.preferencias?.unidad || 'C'
    },

    mapUrl() {
      if (!this.ciudadActual?.lat || !this.ciudadActual?.lon) return ''

      const lat = Number(this.ciudadActual.lat)
      const lon = Number(this.ciudadActual.lon)

      return `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.25},${lat - 0.25},${lon + 0.25},${lat + 0.25}&layer=mapnik&marker=${lat},${lon}`
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
        } else {
          this.errorBusqueda = 'No se encontró la ciudad buscada.'
        }
      } catch (error) {
        this.errorBusqueda = error.message || 'No se pudo buscar la ciudad.'
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
      this.sugerencias = []
      this.errorBusqueda = ''
      this.alertas = []
    }
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  padding: 32px 24px 60px;
  background:
    radial-gradient(circle at 15% 10%, rgba(56, 189, 248, 0.28), transparent 28%),
    radial-gradient(circle at 90% 20%, rgba(99, 102, 241, 0.25), transparent 30%),
    linear-gradient(135deg, #e0f2fe 0%, #eef2ff 45%, #f8fafc 100%);
}

.hero {
  max-width: 1180px;
  margin: 0 auto 28px;
  border-radius: 34px;
  padding: 48px;
  overflow: visible;
  position: relative;
  color: white;
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.82), rgba(30, 64, 175, 0.72)),
    url('https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1600&q=80');
  background-size: cover;
  background-position: center;
  box-shadow: 0 24px 70px rgba(30, 64, 175, 0.28);
}

.hero-content {
  max-width: 850px;
  position: relative;
}

.hero-kicker {
  font-weight: 700;
  color: #bfdbfe;
  margin-bottom: 10px;
}

.hero h1 {
  font-size: clamp(2.2rem, 5vw, 4.3rem);
  line-height: 1.05;
  margin-bottom: 18px;
}

.hero-subtitle {
  font-size: 1.15rem;
  color: rgba(255, 255, 255, 0.86);
  margin-bottom: 28px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(18px);
  border-radius: 18px;
  padding: 10px;
}

.search-icon {
  font-size: 1.3rem;
  padding-left: 8px;
}

.search-box input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 1rem;
}

.search-box input::placeholder {
  color: rgba(255, 255, 255, 0.72);
}

.search-box button,
.back-btn {
  border: none;
  border-radius: 14px;
  padding: 13px 22px;
  font-weight: 700;
  cursor: pointer;
  color: white;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  transition: 0.25s;
}

.search-box button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.search-box button:hover:not(:disabled),
.back-btn:hover {
  transform: translateY(-2px);
}

.sugerencias {
  position: absolute;
  z-index: 20;
  margin-top: 10px;
  width: min(900px, calc(100% - 112px));
  background: white;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.24);
}

.sugerencias button {
  width: 100%;
  padding: 14px 18px;
  border: none;
  background: white;
  text-align: left;
  cursor: pointer;
  color: #0f172a;
  font-weight: 600;
}

.sugerencias button:hover {
  background: #eff6ff;
}

.sugerencias small {
  display: block;
  color: #64748b;
  margin-top: 2px;
}

.error-msg {
  margin-top: 14px;
  color: #fecaca;
  font-weight: 700;
}

.features-section {
  max-width: 1180px;
  margin: 0 auto 24px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid #dbeafe;
  border-radius: 22px;
  padding: 20px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  transition: 0.25s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 38px rgba(37, 99, 235, 0.14);
}

.feature-card span {
  font-size: 2rem;
  display: block;
  margin-bottom: 10px;
}

.feature-card h3 {
  color: #0f172a;
  margin-bottom: 8px;
  font-size: 1rem;
}

.feature-card p {
  color: #64748b;
  font-size: 0.85rem;
  line-height: 1.4;
}

.favorites-section {
  max-width: 1180px;
  margin: 0 auto 24px;
}

.favorites-card {
  background: rgba(255, 255, 255, 0.88);
  border-radius: 24px;
  padding: 22px;
  border: 1px solid #dbeafe;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.favorites-card h2 {
  margin-bottom: 14px;
  color: #0f172a;
}

.favorites-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.favorite-city {
  border: none;
  padding: 10px 18px;
  border-radius: 999px;
  background: #eff6ff;
  color: #2563eb;
  font-weight: 700;
  cursor: pointer;
  transition: 0.25s;
}

.favorite-city:hover {
  background: #2563eb;
  color: white;
}

.quick-section {
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  gap: 22px;
}

.quick-card,
.section-card,
.map-card {
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 26px;
  padding: 24px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(16px);
}

.quick-card h2,
.section-card h3,
.map-card h3 {
  color: #0f172a;
  margin-bottom: 16px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.chips button {
  border: 1px solid #cbd5e1;
  border-radius: 999px;
  padding: 11px 20px;
  background: white;
  color: #1e293b;
  font-weight: 700;
  cursor: pointer;
  transition: 0.25s;
}

.chips button:hover {
  transform: translateY(-3px);
  background: #2563eb;
  border-color: #2563eb;
  color: white;
}

.loading-box {
  max-width: 1180px;
  margin: 40px auto;
  text-align: center;
  color: #1e293b;
  font-weight: 700;
}

.spinner {
  width: 58px;
  height: 58px;
  margin: 0 auto 16px;
  border-radius: 50%;
  border: 6px solid #bfdbfe;
  border-top-color: #2563eb;
  animation: spin 1s linear infinite;
}

.result-layout {
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 24px;
  align-items: start;
}

.result-left,
.result-right {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.map-card {
  display: grid;
  gap: 16px;
}

.map-card p {
  color: #475569;
}

.map-frame {
  overflow: hidden;
  border-radius: 22px;
  border: 1px solid #bfdbfe;
  background: #dbeafe;
}

.map-frame iframe {
  display: block;
}

.coords {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 0.9rem;
}

.forecast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(118px, 1fr));
  gap: 12px;
}

.alerts {
  display: grid;
  gap: 10px;
}

.alert {
  padding: 14px 16px;
  border-radius: 16px;
  font-weight: 700;
}

.success {
  background: #dcfce7;
  color: #166534;
}

.warning {
  background: #fef3c7;
  color: #92400e;
}

.back-btn {
  width: 100%;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .result-layout {
    grid-template-columns: 1fr;
  }

  .hero {
    padding: 36px 24px;
  }

  .sugerencias {
    width: calc(100% - 48px);
  }

  .features-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 620px) {
  .home-page {
    padding: 20px 14px 40px;
  }

  .search-box {
    flex-direction: column;
    align-items: stretch;
  }

  .search-icon {
    display: none;
  }

  .coords {
    flex-direction: column;
  }

  .features-section {
    grid-template-columns: 1fr;
  }
}
</style>