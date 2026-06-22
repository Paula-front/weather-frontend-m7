// Servicio de clima
// Maneja las llamadas a Open-Meteo y Unsplash

export const weatherService = {

  // Ciudades sugeridas de Chile
  ciudadesChile: [
    { nombre: 'Santiago', pais: 'Chile', lat: -33.4489, lon: -70.6693 },
    { nombre: 'Valparaíso', pais: 'Chile', lat: -33.0472, lon: -71.6127 },
    { nombre: 'Concepción', pais: 'Chile', lat: -36.8201, lon: -73.0444 },
    { nombre: 'Antofagasta', pais: 'Chile', lat: -23.6509, lon: -70.3975 },
    { nombre: 'Puerto Montt', pais: 'Chile', lat: -41.4693, lon: -72.9424 }
  ],

  // Capitales del mundo
  ciudadesMundo: [
    { nombre: 'Nueva York', pais: 'Estados Unidos', lat: 40.7128, lon: -74.0060 },
    { nombre: 'Londres', pais: 'Reino Unido', lat: 51.5074, lon: -0.1278 },
    { nombre: 'Tokio', pais: 'Japón', lat: 35.6762, lon: 139.6503 },
    { nombre: 'París', pais: 'Francia', lat: 48.8566, lon: 2.3522 },
    { nombre: 'Sydney', pais: 'Australia', lat: -33.8688, lon: 151.2093 },
    { nombre: 'Ciudad de México', pais: 'México', lat: 19.4326, lon: -99.1332 },
    { nombre: 'Buenos Aires', pais: 'Argentina', lat: -34.6037, lon: -58.3816 },
    { nombre: 'Dubái', pais: 'Emiratos Árabes', lat: 25.2048, lon: 55.2708 },
    { nombre: 'Roma', pais: 'Italia', lat: 41.9028, lon: 12.4964 },
    { nombre: 'Berlín', pais: 'Alemania', lat: 52.5200, lon: 13.4050 }
  ],

  // Buscar ciudad por nombre usando Open-Meteo Geocoding
  async buscarCiudad(nombre) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(nombre)}&count=5&language=es&format=json`
    const response = await fetch(url)
    if (!response.ok) throw new Error('Error al buscar la ciudad')
    const data = await response.json()

    if (!data.results || data.results.length === 0) {
      throw new Error('No se encontraron resultados para esa ciudad')
    }

    return data.results.map(r => ({
      nombre: r.name,
      pais: r.country,
      lat: r.latitude,
      lon: r.longitude,
      region: r.admin1 || ''
    }))
  },

  // Obtener imagen de ciudad desde Unsplash
  obtenerImagenCiudad(nombreCiudad) {
    const query = encodeURIComponent(`${nombreCiudad} city`)
    return `https://source.unsplash.com/800x400/?${query}`
  },

  // Obtener emoji según código de clima WMO
  obtenerEmoji(codigo) {
    if (codigo === 0) return '☀️'
    if (codigo <= 2) return '⛅'
    if (codigo === 3) return '☁️'
    if (codigo <= 49) return '🌫️'
    if (codigo <= 59) return '🌦️'
    if (codigo <= 69) return '🌧️'
    if (codigo <= 79) return '🌨️'
    if (codigo <= 84) return '🌧️'
    if (codigo <= 94) return '⛈️'
    return '🌩️'
  },

  // Obtener descripción según código de clima WMO
  obtenerDescripcion(codigo) {
    if (codigo === 0) return 'Despejado'
    if (codigo === 1) return 'Mayormente despejado'
    if (codigo === 2) return 'Parcialmente nublado'
    if (codigo === 3) return 'Nublado'
    if (codigo <= 49) return 'Niebla'
    if (codigo <= 59) return 'Llovizna'
    if (codigo <= 69) return 'Lluvia'
    if (codigo <= 79) return 'Nieve'
    if (codigo <= 84) return 'Lluvia intensa'
    if (codigo <= 94) return 'Tormenta eléctrica'
    return 'Tormenta severa'
  },

  // Convertir temperatura de C a F
  celsiusAFahrenheit(temp) {
    return Math.round((temp * 9 / 5) + 32)
  },

  // Formatear fecha legible
  formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr + 'T00:00:00')
    return fecha.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short' })
  },

  // Obtener día de la semana corto
  obtenerDia(fechaStr) {
    const fecha = new Date(fechaStr + 'T00:00:00')
    return fecha.toLocaleDateString('es-CL', { weekday: 'short' })
  },

  // Calcular estadísticas de la semana
  calcularEstadisticas(pronostico) {
    if (!pronostico || pronostico.length === 0) return null

    const tempMaxima = Math.max(...pronostico.map(d => d.tempMax))
    const tempMinima = Math.min(...pronostico.map(d => d.tempMin))
    const promedio = Math.round(
      pronostico.reduce((acc, d) => acc + ((d.tempMax + d.tempMin) / 2), 0) / pronostico.length
    )
    const diasLluvia = pronostico.filter(d => d.precipitacion > 0).length
    const diasSoleados = pronostico.filter(d => d.codigo === 0 || d.codigo === 1).length

    return { tempMaxima, tempMinima, promedio, diasLluvia, diasSoleados }
  },

  // Generar alertas según condiciones
  generarAlertas(climaActual, pronostico) {
    const alertas = []

    if (climaActual) {
      if (climaActual.temperatura >= 35) {
        alertas.push({ tipo: 'calor', mensaje: '🌡️ Temperatura muy alta. Mantente hidratado.' })
      }
      if (climaActual.temperatura <= 0) {
        alertas.push({ tipo: 'frio', mensaje: '🥶 Temperatura bajo cero. Abrígate bien.' })
      }
      if (climaActual.viento >= 50) {
        alertas.push({ tipo: 'viento', mensaje: '💨 Vientos fuertes. Ten precaución al salir.' })
      }
      if (climaActual.humedad >= 90) {
        alertas.push({ tipo: 'humedad', mensaje: '💧 Humedad muy alta. Puede sentirse sofocante.' })
      }
      if ([95, 96, 99].includes(climaActual.codigo)) {
        alertas.push({ tipo: 'tormenta', mensaje: '⛈️ Tormenta eléctrica. Evita espacios abiertos.' })
      }
    }

    return alertas
  }
}

export default weatherService