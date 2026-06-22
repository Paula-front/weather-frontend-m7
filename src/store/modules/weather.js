export default {
  namespaced: true,

  state: () => ({
    ciudadActual: null,
    climaActual: null,
    pronostico: [],
    loading: false,
    error: null
  }),

  getters: {
    ciudadActual: (state) => state.ciudadActual,
    climaActual: (state) => state.climaActual,
    pronostico: (state) => state.pronostico,
    loading: (state) => state.loading,
    error: (state) => state.error
  },

  mutations: {
    SET_LOADING(state, valor) {
      state.loading = valor
    },

    SET_ERROR(state, error) {
      state.error = error
    },

    SET_CIUDAD(state, ciudad) {
      state.ciudadActual = ciudad
    },

    SET_CLIMA(state, clima) {
      state.climaActual = clima
    },

    SET_PRONOSTICO(state, pronostico) {
      state.pronostico = pronostico
    },

    LIMPIAR_CLIMA(state) {
      state.ciudadActual = null
      state.climaActual = null
      state.pronostico = []
      state.error = null
    }
  },

  actions: {
    async buscarClima({ commit }, { lat, lon, nombre, pais }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weathercode,windspeed_10m,visibility&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=7`

        const response = await fetch(url)
        if (!response.ok) throw new Error('Error al obtener el clima')
        const data = await response.json()

        commit('SET_CIUDAD', { nombre, pais, lat, lon })

        commit('SET_CLIMA', {
          temperatura: Math.round(data.current.temperature_2m),
          sensacionTermica: Math.round(data.current.apparent_temperature),
          humedad: data.current.relative_humidity_2m,
          viento: Math.round(data.current.windspeed_10m),
          visibilidad: data.current.visibility ? Math.round(data.current.visibility / 1000) : 10,
          codigo: data.current.weathercode
        })

        const pronostico = data.daily.time.map((fecha, i) => ({
          fecha,
          codigo: data.daily.weathercode[i],
          tempMax: Math.round(data.daily.temperature_2m_max[i]),
          tempMin: Math.round(data.daily.temperature_2m_min[i]),
          precipitacion: data.daily.precipitation_sum[i]
        }))

        commit('SET_PRONOSTICO', pronostico)

      } catch (error) {
        commit('SET_ERROR', 'No se pudo obtener el clima. Intenta de nuevo.')
      } finally {
        commit('SET_LOADING', false)
      }
    }
  }
}