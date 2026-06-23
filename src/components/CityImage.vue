<template>
  <div class="city-image-container">

    <img
      :src="imageUrl"
      :alt="ciudad"
      class="city-image"
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

  computed: {
    imageUrl() {

      const imagenes = {

        Santiago:
          'https://upload.wikimedia.org/wikipedia/commons/7/78/Santiago_de_Chile.jpg',

        Valparaíso:
          'https://upload.wikimedia.org/wikipedia/commons/5/5f/Valparaiso.jpg',

        Concepción:
          'https://upload.wikimedia.org/wikipedia/commons/6/67/Concepcion_Chile.jpg',

        Antofagasta:
          'https://upload.wikimedia.org/wikipedia/commons/3/38/Antofagasta.jpg',

        Tokio:
          'https://upload.wikimedia.org/wikipedia/commons/1/12/Tokyo_Skyline.jpg',

        París:
          'https://upload.wikimedia.org/wikipedia/commons/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg',

        Londres:
          'https://upload.wikimedia.org/wikipedia/commons/c/cd/London_Montage_L.jpg',

        Berlín:
          'https://upload.wikimedia.org/wikipedia/commons/d/d9/Berlin_Brandenburg_Gate.jpg',

        'Nueva York':
          'https://upload.wikimedia.org/wikipedia/commons/4/47/New_york_times_square-terabass.jpg',

        Sydney:
          'https://upload.wikimedia.org/wikipedia/commons/b/b1/Sydney_Opera_House_Sails.jpg',

        Roma:
          'https://upload.wikimedia.org/wikipedia/commons/d/de/Roma_Piazza_Venezia.jpg',

        Dubái:
          'https://upload.wikimedia.org/wikipedia/commons/9/93/Dubai_skyline.jpg'
      }

      return (
        imagenes[this.ciudad] ||
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb'
      )
    }
  }
}
</script>

<style scoped>

.city-image-container {

  position: relative;

  width: 100%;

  height: 420px;

  overflow: hidden;

  border-radius: 28px;

  box-shadow:
    0 20px 60px rgba(0,0,0,.35);

  border:
    1px solid rgba(255,255,255,.08);
}

.city-image {

  width: 100%;
  height: 100%;

  object-fit: cover;

  transition: transform .5s ease;
}

.city-image-container:hover .city-image {
  transform: scale(1.05);
}

.city-overlay {

  position: absolute;

  inset: 0;

  display: flex;

  align-items: flex-end;

  padding: 2rem;

  background:
    linear-gradient(
      to top,
      rgba(0,0,0,.85),
      rgba(0,0,0,.2),
      transparent
    );
}

.city-info {

  backdrop-filter: blur(10px);

  background:
    rgba(0,0,0,.25);

  padding: 16px 24px;

  border-radius: 18px;

  border:
    1px solid rgba(255,255,255,.1);
}

.city-info h2 {

  color: white;

  font-size: 2.3rem;

  margin: 0;
}

.city-info p {

  color: rgba(255,255,255,.8);

  margin-top: 6px;
}

@media (max-width:768px){

  .city-image-container{
    height:300px;
  }

  .city-info h2{
    font-size:1.8rem;
  }

}

</style>