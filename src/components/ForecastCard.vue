<template>
  <div class="forecast-card">
    <p class="fc-dia">{{ diaSemana }}</p>
    <span class="fc-emoji">{{ emoji }}</span>
    <p class="fc-desc">{{ descripcion }}</p>

    <div class="fc-temps">
      <span class="fc-max">{{ tempMaxFormateada }}°</span>
      <span class="fc-min">{{ tempMinFormateada }}°</span>
    </div>

    <p v-if="dia.precipitacion > 0" class="fc-precip">
      💧 {{ dia.precipitacion }} mm
    </p>
  </div>
</template>

<script>
import weatherService from '../services/weatherService.js'

export default {
  name: 'ForecastCard',

  props: {
    dia: {
      type: Object,
      required: true
    },
    unidad: {
      type: String,
      default: 'C'
    }
  },

  computed: {
    diaSemana() {
      return weatherService.obtenerDia(this.dia.fecha)
    },

    emoji() {
      return weatherService.obtenerEmoji(this.dia.codigo)
    },

    descripcion() {
      return weatherService.obtenerDescripcion(this.dia.codigo)
    },

    tempMaxFormateada() {
      return this.unidad === 'F'
        ? weatherService.celsiusAFahrenheit(this.dia.tempMax)
        : this.dia.tempMax
    },

    tempMinFormateada() {
      return this.unidad === 'F'
        ? weatherService.celsiusAFahrenheit(this.dia.tempMin)
        : this.dia.tempMin
    }
  }
}
</script>

<style scoped>
.forecast-card {
  min-height: 125px;
  padding: 14px;
  border-radius: 18px;
  background: white;
  border: 1px solid #dbeafe;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
  text-align: center;
}

.fc-dia {
  color: #2563eb;
  font-weight: 800;
  text-transform: capitalize;
  margin-bottom: 8px;
}

.fc-emoji {
  font-size: 28px;
  display: block;
  margin-bottom: 6px;
}

.fc-desc {
  font-size: 0.75rem;
  color: #64748b;
  min-height: 28px;
}

.fc-temps {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
}

.fc-max {
  color: #ef4444;
  font-weight: 800;
}

.fc-min {
  color: #2563eb;
  font-weight: 800;
}

.fc-precip {
  margin-top: 6px;
  font-size: 0.75rem;
  color: #0284c7;
}
</style>