const usuarios = [
  {
    id: 1,
    nombre: 'Ana',
    email: 'ana@clima.com',
    password: '1234',
    favoritos: [],
    preferencias: {
      unidad: 'C',
      tema: 'dark'
    }
  },
  {
    id: 2,
    nombre: 'Carlos',
    email: 'carlos@clima.com',
    password: '1234',
    favoritos: [],
    preferencias: {
      unidad: 'F',
      tema: 'dark'
    }
  }
]

export default {
  namespaced: true,

  state: () => ({
    usuarioActual: null,
    isAuthenticated: false,
    usuarios: usuarios
  }),

  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    usuarioActual: (state) => state.usuarioActual,
    favoritos: (state) => state.usuarioActual?.favoritos || [],
    preferencias: (state) => state.usuarioActual?.preferencias || { unidad: 'C', tema: 'dark' }
  },

  mutations: {
    SET_USUARIO(state, usuario) {
      state.usuarioActual = usuario
      state.isAuthenticated = true
    },

    CERRAR_SESION(state) {
      state.usuarioActual = null
      state.isAuthenticated = false
    },

    AGREGAR_FAVORITO(state, ciudad) {
      if (!state.usuarioActual) return
      const existe = state.usuarioActual.favoritos.find(f => f.nombre === ciudad.nombre)
      if (!existe) {
        state.usuarioActual.favoritos.push(ciudad)
      }
    },

    ELIMINAR_FAVORITO(state, nombreCiudad) {
      if (!state.usuarioActual) return
      state.usuarioActual.favoritos = state.usuarioActual.favoritos.filter(
        f => f.nombre !== nombreCiudad
      )
    },

    ACTUALIZAR_PREFERENCIAS(state, preferencias) {
      if (!state.usuarioActual) return
      state.usuarioActual.preferencias = {
        ...state.usuarioActual.preferencias,
        ...preferencias
      }
    },

    REGISTRAR_USUARIO(state, nuevoUsuario) {
      state.usuarios.push(nuevoUsuario)
    }
  },

  actions: {
    login({ commit, state }, { email, password }) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const usuario = state.usuarios.find(
            u => u.email === email && u.password === password
          )
          if (usuario) {
            commit('SET_USUARIO', { ...usuario })
            resolve(usuario)
          } else {
            reject(new Error('Usuario o contraseña incorrectos'))
          }
        }, 800)
      })
    },

    logout({ commit }) {
      commit('CERRAR_SESION')
    },

    registro({ commit, state }, { nombre, email, password }) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const existe = state.usuarios.find(u => u.email === email)
          if (existe) {
            reject(new Error('Ya existe una cuenta con ese correo'))
            return
          }
          const nuevoUsuario = {
            id: state.usuarios.length + 1,
            nombre,
            email,
            password,
            favoritos: [],
            preferencias: { unidad: 'C', tema: 'dark' }
          }
          commit('REGISTRAR_USUARIO', nuevoUsuario)
          commit('SET_USUARIO', { ...nuevoUsuario })
          resolve(nuevoUsuario)
        }, 800)
      })
    },

    agregarFavorito({ commit }, ciudad) {
      commit('AGREGAR_FAVORITO', ciudad)
    },

    eliminarFavorito({ commit }, nombreCiudad) {
      commit('ELIMINAR_FAVORITO', nombreCiudad)
    },

    actualizarPreferencias({ commit }, preferencias) {
      commit('ACTUALIZAR_PREFERENCIAS', preferencias)
    }
  }
}