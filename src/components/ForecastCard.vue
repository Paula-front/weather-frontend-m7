<template>
  <div class="forecast-card card">
    <p class="fc-dia">{{ dia }}</p>
    <p class="fc-fecha">{{ fecha }}</p>
    <span class="fc-emoji">{{ emoji }}</span>
    <p class="fc-desc">{{ descripcion }}</p>
    <div class="fc-temps">
      <span class="fc-max">{{ tempMaxFormateada }}°</span>
      <span class="fc-separator">/</span>
      <span class="fc-min">{{ tempMinFormateada }}°</span>
    </div>
    <div v-if="diaProp.precipitacion > 0" class="fc-precip">
      💧 {{ diaProp.precipitacion }} mm
    </div>
  </div>
</template>

<script>
import weatherService from '../services/weatherService.js'

export default {
  name: 'ForecastCard',
  props: {
    dia: { type: Object, required: true },
    unidad: { type: String, default: 'C' }
  },
  computed: {
    diaProp() {
      return this.dia
    },
    dia() {
      return weatherService.obtenerDia(this.diaProp.fecha)
    },
    fecha() {
      return weatherService.formatearFecha(this.diaProp.fecha)
    },
    emoji() {
      return weatherService.obtenerEmoji(this.diaProp.codigo)
    },
    descripcion() {
      return weatherService.obtenerDescripcion(this.diaProp.codigo)
    },
    tempMaxFormateada() {
      if (this.unidad === 'F') {
        return weatherService.celsiusAFahrenheit(this.diaProp.tempMax)
      }
      return this.diaProp.tempMax
    },
    tempMinFormateada() {
      if (this.unidad === 'F') {
        return weatherService.celsiusAFahrenheit(this.diaProp.tempMin)
      }
      return this.diaProp.tempMin
    }
  }
}
</script>

<style scoped>
.forecast-card {
  padding: 14px 10px !important;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.04) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
  transition: all 0.2s ease;
}

.forecast-card:hover {
  background: rgba(96, 165, 250, 0.08) !important;
  border-color: rgba(96, 165, 250, 0.2) !important;
  transform: translateY(-3px);
}

.fc-dia {
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
  text-transform: capitalize;
}

.fc-fecha {
  font-size: 10px;
  color: var(--text-muted);
}

.fc-emoji {
  font-size: 28px;
  filter: drop-shadow(0 0 8px rgba(96, 165, 250, 0.3));
}

.fc-desc {
  font-size: 10px;
  color: var(--text-muted);
  text-align: center;
  line-height: 1.3;
}

.fc-temps {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}

.fc-max {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.fc-separator {
  font-size: 12px;
  color: var(--text-muted);
}

.fc-min {
  font-size: 13px;
  color: var(--text-muted);
}

.fc-precip {
  font-size: 10px;
  color: #60A5FA;
  background: rgba(96, 165, 250, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
}
</style>