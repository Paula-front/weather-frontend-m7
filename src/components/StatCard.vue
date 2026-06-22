<template>
  <div class="city-image-wrap">
    <img
      :src="imagenUrl"
      :alt="`${ciudad}, ${pais}`"
      class="city-image"
      :class="{ 'image-loaded': cargada }"
      @load="onLoad"
      @error="onError"
    />
    <div class="city-image-overlay">
      <div class="city-image-info">
        <h3 class="city-image-nombre">{{ ciudad }}</h3>
        <p class="city-image-pais">{{ pais }}</p>
      </div>
    </div>
    <div v-if="!cargada" class="skeleton city-image-skeleton"></div>
  </div>
</template>

<script>
import weatherService from '../services/weatherService.js'

export default {
  name: 'CityImage',
  props: {
    ciudad: { type: String, default: '' },
    pais: { type: String, default: '' }
  },
  data() {
    return {
      cargada: false,
      error: false
    }
  },
  computed: {
    imagenUrl() {
      if (this.error) {
        return 'https://source.unsplash.com/800x400/?city,skyline,buildings'
      }
      return weatherService.obtenerImagenCiudad(this.ciudad)
    }
  },
  watch: {
    ciudad() {
      this.cargada = false
      this.error = false
    }
  },
  methods: {
    onLoad() {
      this.cargada = true
    },
    onError() {
      this.error = true
      this.cargada = true
    }
  }
}
</script>

<style scoped>
.city-image-wrap {
  position: relative;
  width: 100%;
  height: 220px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.city-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.image-loaded {
  opacity: 1;
}

.city-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(10, 15, 30, 0.85) 0%,
    rgba(10, 15, 30, 0.2) 60%,
    transparent 100%
  );
  display: flex;
  align-items: flex-end;
  padding: 20px;
}

.city-image-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.city-image-nombre {
  font-size: 22px;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.city-image-pais {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}

.city-image-skeleton {
  position: absolute;
  inset: 0;
  border-radius: 0;
}
</style>