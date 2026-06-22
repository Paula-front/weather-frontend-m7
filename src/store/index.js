import { createStore } from 'vuex'
import auth from './modules/auth.js'
import weather from './modules/weather.js'

export default createStore({
  modules: {
    auth,
    weather
  }
})