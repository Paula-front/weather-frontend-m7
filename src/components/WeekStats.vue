<template>
  <section class="week-stats">
    <h3>📊 Estadísticas de la semana</h3>

    <div class="stats-grid">
      <div class="stat-card">
        <span class="icon">🌡️</span>
        <strong>{{ tempPromedio }}°</strong>
        <small>Temperatura promedio</small>
      </div>

      <div class="stat-card">
        <span class="icon">🧊</span>
        <strong>{{ tempMinima }}°</strong>
        <small>Mínima semanal</small>
      </div>

      <div class="stat-card">
        <span class="icon">📈</span>
        <strong>{{ tempMaxima }}°</strong>
        <small>Máxima semanal</small>
      </div>

      <div class="stat-card">
        <span class="icon">☔</span>
        <strong>{{ diasLluvia }} días</strong>
        <small>Con lluvia</small>
      </div>

      <div class="stat-card">
        <span class="icon">☀️</span>
        <strong>{{ diasSoleados }} días</strong>
        <small>Soleados</small>
      </div>
    </div>
  </section>
</template>

<script>
import weatherService from '../services/weatherService.js'

export default {
  name: 'WeekStats',

  props: {
    pronostico: {
      type: Array,
      default: () => []
    },
    unidad: {
      type: String,
      default: 'C'
    }
  },

  computed: {
    temperaturasMax() {
      return this.pronostico.map(dia => Number(dia.tempMax))
    },

    temperaturasMin() {
      return this.pronostico.map(dia => Number(dia.tempMin))
    },

    tempPromedio() {
      if (!this.pronostico.length) return '--'

      const todas = [
        ...this.temperaturasMax,
        ...this.temperaturasMin
      ]

      const promedio = Math.round(
        todas.reduce((acc, temp) => acc + temp, 0) / todas.length
      )

      return this.formatearTemp(promedio)
    },

    tempMinima() {
      if (!this.temperaturasMin.length) return '--'
      return this.formatearTemp(Math.min(...this.temperaturasMin))
    },

    tempMaxima() {
      if (!this.temperaturasMax.length) return '--'
      return this.formatearTemp(Math.max(...this.temperaturasMax))
    },

    diasLluvia() {
      return this.pronostico.filter(dia => Number(dia.precipitacion) > 0).length
    },

    diasSoleados() {
      return this.pronostico.filter(dia => {
        const codigo = Number(dia.codigo)
        return codigo === 0 || codigo === 1
      }).length
    }
  },

  methods: {
    formatearTemp(temp) {
      if (this.unidad === 'F') {
        return weatherService.celsiusAFahrenheit(temp)
      }

      return temp
    }
  }
}
</script>

<style scoped>
.week-stats {
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid #dbeafe;
  border-radius: 24px;
  padding: 22px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
}

.week-stats h3 {
  color: #0f172a;
  margin-bottom: 16px;
  font-size: 1.15rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(115px, 1fr));
  gap: 12px;
}

.stat-card {
  min-height: 115px;
  border-radius: 18px;
  padding: 14px 10px;
  background: linear-gradient(180deg, #ffffff, #eff6ff);
  border: 1px solid #bfdbfe;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  text-align: center;
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.07);
}

.icon {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: #dbeafe;
  font-size: 1.3rem;
}

.stat-card strong {
  color: #1d4ed8;
  font-size: 1.25rem;
  font-weight: 900;
}

.stat-card small {
  color: #475569;
  font-size: 0.75rem;
  line-height: 1.2;
}
</style>