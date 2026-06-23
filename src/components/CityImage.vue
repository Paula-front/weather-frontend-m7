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
        <h2>{{ ciudad }}</h2>
        <p>{{ pais }}</p>
      </div>
    </div>

  </div>
</template>

<script>
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

  methods: {
    normalize(text) {
      return (text || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase()
    },

    onError(e) {
      e.target.src =
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb'
    }
  },

  computed: {
    imageUrl() {
      const imagenes = {

        santiago:
          'https://upload.wikimedia.org/wikipedia/commons/7/78/Santiago_de_Chile.jpg',

        valparaiso:
          'https://upload.wikimedia.org/wikipedia/commons/5/5f/Valparaiso.jpg',

        concepcion:
          'https://upload.wikimedia.org/wikipedia/commons/6/67/Concepcion_Chile.jpg',

        antofagasta:
          'https://upload.wikimedia.org/wikipedia/commons/3/38/Antofagasta.jpg',

        tokio:
          'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',

        paris:
          'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',

        londres:
          'https://images.unsplash.com/photo-1529655683826-aba9b3e77383',

        berlin:
          'https://images.unsplash.com/photo-1560969184-10fe8719e047',

        'nueva york':
          'https://images.unsplash.com/photo-1522083165195-3424ed129620',

        sydney:
          'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9',

        roma:
          'https://images.unsplash.com/photo-1529154036614-a60975f5c760',

        dubai:
          'https://images.unsplash.com/photo-1512453979798-5ea266f8880c'
      }

      const key = this.normalize(this.ciudad)

      return imagenes[key] ||
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb'
    }
  }
}
</script>
<style scoped>
.city-image-container {
  position: relative;
  width: 100%;
  height: 320px; /* 👈 controla tamaño */
  overflow: hidden;
  border-radius: 28px;

  box-shadow: 0 20px 60px rgba(0,0,0,.35);
}

.city-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block; /* 👈 evita comportamiento raro */
}

.city-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  padding: 2rem;
  background: linear-gradient(
    to top,
    rgba(0,0,0,.85),
    rgba(0,0,0,.2),
    transparent
  );
}

.city-info {
  background: rgba(0,0,0,.25);
  padding: 12px 18px;
  border-radius: 14px;
  backdrop-filter: blur(8px);
  color: white;
}

.city-info h2 {
  margin: 0;
  font-size: 1.8rem;
}

.city-info p {
  margin: 4px 0 0;
  opacity: .8;
}
</style>