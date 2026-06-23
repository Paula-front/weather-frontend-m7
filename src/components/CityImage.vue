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
        santiago:
          'https://images.unsplash.com/photo-1549839351-11d979815b0e?auto=format&fit=crop&w=1200&q=80',

        valparaiso:
          'https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?auto=format&fit=crop&w=1200&q=80',

        concepcion:
          'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80',

        antofagasta:
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',

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
          'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80'
      }

      const key = this.normalize(this.ciudad)

      return imagenes[key] || this.fallbackImage
    },

    fallbackImage() {
      return 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80'
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