<template>
  <div class="favoritos-page tema-oscuro">
    <div class="favoritos-container">

      <!-- Header -->
      <div class="section-header">
        <h2 class="section-title">
          <span class="section-icon">❤️</span>
          Mis ciudades favoritas
        </h2>
        <span class="badge badge-accent">{{ favoritos.length }} guardadas</span>
      </div>

      <!-- Sin favoritos -->
      <div v-if="favoritos.length === 0" class="empty-state card">
        <div class="empty-icon">🌍</div>
        <h3 class="empty-title">Aún no tienes favoritos</h3>
        <p class="empty-desc">Busca una ciudad en el inicio y agrégala a tus favoritos</p>
        <RouterLink to="/" class="btn btn-primary mt-16">
          🔍 Buscar ciudades
        </RouterLink>
      </div>

      <!-- Grid de favoritos -->
      <div v-else class="favoritos-grid">
        <div
          v-for="ciudad in favoritos"
          :key="ciudad.nombre"
          class="favorito-card card"
          :class="{ 'card-cargando': cargandoCiudad === ciudad.nombre }"
        >
          <!-- Imagen de fondo -->
          <div class="fav-imagen">
            <img
              :src="obtenerImagen(ciudad.nombre)"
              :alt="ciudad.nombre"
              class="fav-img"
              @error="onImageError"
            />
            <div class="fav-overlay"></div>
          </div>

          <!-- Contenido -->
          <div class="fav-content">
            <div class="fav-header">
              <div>
                <h3 class="fav-ciudad">{{ ciudad.nombre }}</h3>
                <p class="fav-pais">📍 {{ ciudad.pais }}</p>
              </div>
              <button
                class="btn-eliminar"
                @click="eliminarDeFavoritos(ciudad.nombre)"
                title="Eliminar de favoritos"
              >
                🗑️
              </button>
            </div>

            <!-- Clima si está cargado -->
            <div v-if="climasCiudades[ciudad.nombre]" class="fav-clima">
              <div class="fav-temp-row">
                <span class="fav-emoji">{{ obtenerEmoji(climasCiudades[ciudad.nombre].codigo) }}</span>
                <span class="fav-temp">{{ formatearTemp(climasCiudades[ciudad.nombre].temperatura) }}</span>
              </div>
              <p class="fav-desc">{{ obtenerDescripcion(climasCiudades[ciudad.nombre].codigo) }}</p>
              <div class="fav-stats">
                <span>💧 {{ climasCiudades[ciudad.nombre].humedad }}%</span>
                <span>🌬️ {{ climasCiudades[ciudad.nombre].viento }} km/h</span>
              </div>
            </div>

            <!-- Loading individual -->
            <div v-else-if="cargandoCiudad === ciudad.nombre" class="fav-loading">
              <div class="spinner"></div>
            </div>

            <!-- Skeleton si aún carga -->
            <div v-else class="fav-skeleton">
              <div class="skeleton" style="height: 40px; width: 80px; margin-bottom: 8px;"></div>
              <div class="skeleton" style="height: 16px; width: 120px;"></div>
            </div>

            <!-- Botón ver detalle -->
            <button
              class="btn btn-outline btn-sm btn-full mt-12"
              @click="verDetalle(ciudad)"
            >
              👁️ Ver detalle
            </button>
          </div>
        </div>

        <!-- Card agregar más -->
        <RouterLink to="/" class="favorito-card card card-agregar">
          <div class="agregar-content">
            <span class="agregar-icon">＋</span>
            <p class="agregar-text">Agregar ciudad</p>
          </div>
        </RouterLink>
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import weatherService from '../services/weatherService.js'

export default {
  name: 'FavoritosView',
  data() {
    return {
      climasCiudades: {},
      cargandoCiudad: null
    }
  },
  computed: {
    ...mapGetters('auth', ['favoritos', 'preferencias']),
    unidad() {
      return this.preferencias?.unidad || 'C'
    }
  },
  mounted() {
    this.cargarClimasFavoritos()
  },
  watch: {
    favoritos() {
      this.cargarClimasFavoritos()
    }
  },
  methods: {
    ...mapActions('auth', ['eliminarFavorito']),
    ...mapActions('weather', ['buscarClima']),

    async cargarClimasFavoritos() {
      for (const ciudad of this.favoritos) {
        if (!this.climasCiudades[ciudad.nombre]) {
          try {
            this.cargandoCiudad = ciudad.nombre
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${ciudad.lat}&longitude=${ciudad.lon}&current=temperature_2m,relative_humidity_2m,weathercode,windspeed_10m&timezone=auto`
            const response = await fetch(url)
            const data = await response.json()
            this.climasCiudades[ciudad.nombre] = {
              temperatura: Math.round(data.current.temperature_2m),
              humedad: data.current.relative_humidity_2m,
              viento: Math.round(data.current.windspeed_10m),
              codigo: data.current.weathercode
            }
          } catch {
            console.error(`Error cargando clima de ${ciudad.nombre}`)
          } finally {
            this.cargandoCiudad = null
          }
        }
      }
    },

    async verDetalle(ciudad) {
      await this.buscarClima(ciudad)
      this.$router.push('/')
    },

    eliminarDeFavoritos(nombreCiudad) {
      this.eliminarFavorito(nombreCiudad)
      delete this.climasCiudades[nombreCiudad]
    },

    obtenerImagen(nombre) {
      return weatherService.obtenerImagenCiudad(nombre)
    },

    obtenerEmoji(codigo) {
      return weatherService.obtenerEmoji(codigo)
    },

    obtenerDescripcion(codigo) {
      return weatherService.obtenerDescripcion(codigo)
    },

    formatearTemp(temp) {
      if (this.unidad === 'F') {
        return `${weatherService.celsiusAFahrenheit(temp)}°F`
      }
      return `${temp}°C`
    },

    onImageError(e) {
      e.target.src = 'https://source.unsplash.com/800x400/?city,skyline'
    }
  }
}
</script>

<style scoped>
.favoritos-page {
  min-height: 100vh;
  padding: 32px 24px;
}

.favoritos-container {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.empty-state {
  text-align: center;
  padding: 60px 40px !important;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  filter: drop-shadow(0 0 20px rgba(96, 165, 250, 0.3));
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.empty-desc {
  color: var(--text-muted);
  font-size: 14px;
}

.favoritos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.favorito-card {
  padding: 0 !important;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

.fav-imagen {
  position: relative;
  height: 140px;
  overflow: hidden;
}

.fav-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.favorito-card:hover .fav-img {
  transform: scale(1.05);
}

.fav-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 30%, rgba(10, 15, 30, 0.8) 100%);
}

.fav-content {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.fav-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.fav-ciudad {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.fav-pais {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
}

.btn-eliminar {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.btn-eliminar:hover {
  opacity: 1;
}

.fav-clima {
  flex: 1;
}

.fav-temp-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.fav-emoji {
  font-size: 28px;
}

.fav-temp {
  font-size: 32px;
  font-weight: 300;
  color: var(--text-primary);
}

.fav-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.fav-stats {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--text-muted);
}

.fav-loading {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.card-agregar {
  border: 2px dashed rgba(96, 165, 250, 0.2) !important;
  background: rgba(96, 165, 250, 0.03) !important;
  min-height: 200px;
  display: flex !important;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.2s ease;
}

.card-agregar:hover {
  border-color: rgba(96, 165, 250, 0.4) !important;
  background: rgba(96, 165, 250, 0.08) !important;
}

.agregar-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.agregar-icon {
  font-size: 36px;
  color: rgba(96, 165, 250, 0.4);
}

.agregar-text {
  font-size: 14px;
  color: var(--text-muted);
}

@media (max-width: 600px) {
  .favoritos-grid {
    grid-template-columns: 1fr;
  }
}
</style>