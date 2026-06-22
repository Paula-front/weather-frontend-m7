<template>
  <div class="weekstats-section" v-if="estadisticas">
    <div class="section-header">
      <h3 class="section-title">
        <span class="section-icon">📊</span>
        Estadísticas de la semana
      </h3>
    </div>
    <div class="stats-grid">
      <StatCard
        icono="🌡️"
        :valor="`${tempMaxFormateada}°`"
        label="Temperatura máxima"
        sublabel="Promedio semanal"
      />
      <StatCard
        icono="🧊"
        :valor="`${tempMinFormateada}°`"
        label="Temperatura mínima"
        sublabel="Promedio semanal"
      />
      <StatCard
        icono="📈"
        :valor="`${promedioFormateado}°`"
        label="Promedio semanal"
        sublabel="Temperatura promedio"
      />
      <StatCard
        icono="🌧️"
        :valor="`${estadisticas.diasLluvia} día${estadisticas.diasLluvia !== 1 ? 's' : ''}`"
        label="Días con lluvia"
        sublabel="En la semana"
      />
      <StatCard
        icono="☀️"
        :valor="`${estadisticas.diasSoleados} día${estadisticas.diasSoleados !== 1 ? 's' : ''}`"
        label="Días soleados"
        sublabel="En la semana"
      />
    </div>
  </div>
</template>

<script>
import weatherService from '../services/weatherService.js'
import StatCard from './StatCard.vue'

export default {
  name: 'WeekStats',
  components: { StatCard },
  props: {
    pronostico: { type: Array, default: () => [] },
    unidad: { type: String, default: 'C' }
  },
  computed: {
    estadisticas() {
      return weatherService.calcularEstadisticas(this.pronostico)
    },
    tempMaxFormateada() {
      if (!this.estadisticas) return '--'
      if (this.unidad === 'F') {
        return weatherService.celsiusAFahrenheit(this.estadisticas.tempMaxima)
      }
      return this.estadisticas.tempMaxima
    },
    tempMinFormateada() {
      if (!this.estadisticas) return '--'
      if (this.unidad === 'F') {
        return weatherService.celsiusAFahrenheit(this.estadisticas.tempMinima)
      }
      return this.estadisticas.tempMinima
    },
    promedioFormateado() {
      if (!this.estadisticas) return '--'
      if (this.unidad === 'F') {
        return weatherService.celsiusAFahrenheit(this.estadisticas.promedio)
      }
      return this.estadisticas.promedio
    }
  }
}
</script>

<style scoped>
.weekstats-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>