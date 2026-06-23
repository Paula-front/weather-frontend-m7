<template>
  <div class="city-image-container">
    <img
      :src="imageUrl"
      :alt="ciudad"
      class="city-image"
      @error="onError"
    />

    <div class="city-overlay">
      <div class="city-info">
        <span class="city-badge">Vista de ciudad</span>
        <h2>{{ ciudad }}</h2>
        <p>{{ pais }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import arica from '../assets/images/cities/arica.jpg'
import antofagasta from '../assets/images/cities/antofagasta.jpg'
import laSerena from '../assets/images/cities/la-serena.jpg'
import valparaiso from '../assets/images/cities/valparaiso.jpg'
import santiago from '../assets/images/cities/santiago.jpg'
import talca from '../assets/images/cities/talca.jpg'
import concepcion from '../assets/images/cities/concepcion.jpg'
import valdivia from '../assets/images/cities/valdivia.jpg'
import puertoMontt from '../assets/images/cities/puerto-montt.jpg'
import puntaArenas from '../assets/images/cities/punta-arenas.jpg'
import juanFernandez from '../assets/images/cities/juan-fernandez.jpg'
import rapaNui from '../assets/images/cities/rapa-nui.jpg'

export default {
  name: 'CityImage',

  props: {
    ciudad: {
      type: String,
      required: true
    },
    pais: {
      type: String,
      default: ''
    }
  },

  computed: {
    imageUrl() {
      const imagenes = {
        arica,
        antofagasta,
        'la serena': laSerena,
        valparaiso,
        santiago,
        talca,
        concepcion,
        valdivia,
        'puerto montt': puertoMontt,
        'punta arenas': puntaArenas,
        'juan fernandez': juanFernandez,
        'rapa nui': rapaNui,

        tokio:
          'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',

        paris:
          'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',

        londres:
          'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=1200&q=80',

        berlin:
          'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1200&q=80',

        'nueva york':
          'https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&w=1200&q=80',

        sydney:
          'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80',

        roma:
          'https://images.unsplash.com/photo-1529154036614-a60975f5c760?auto=format&fit=crop&w=1200&q=80',

        dubai:
          'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',

        'ciudad de mexico':
          'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=1200&q=80',

        'buenos aires':
          'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=1200&q=80'
      }

      const key = this.normalize(this.ciudad)
      return imagenes[key] || this.fallbackImage
    },

    fallbackImage() {
      return 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?auto=format&fit=crop&w=1200&q=80'
    }
  },

  methods: {
    normalize(text) {
      return (text || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase()
    },

    onError(e) {
      e.target.src = this.fallbackImage
    }
  }
}
</script>

<style scoped>
.city-image-container {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: 28px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.22);
  background: #dbeafe;
}

.city-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform: scale(1.02);
}

.city-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  padding: 24px;
  background:
    linear-gradient(
      to top,
      rgba(15, 23, 42, 0.88),
      rgba(15, 23, 42, 0.25),
      transparent
    );
}

.city-info {
  color: white;
}

.city-badge {
  display: inline-block;
  margin-bottom: 8px;
  padding: 6px 11px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  color: #dbeafe;
  font-size: 0.75rem;
  font-weight: 800;
  backdrop-filter: blur(10px);
}

.city-info h2 {
  margin: 0;
  font-size: 2rem;
  line-height: 1;
}

.city-info p {
  margin: 6px 0 0;
  opacity: 0.86;
  font-weight: 600;
}
</style>