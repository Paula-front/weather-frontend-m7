// Servicio de autenticación
// Maneja la lógica de usuarios mock y validaciones

export const authService = {
  // Valida formato de email
  validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  },

  // Valida contraseña mínima
  validarPassword(password) {
    return password && password.length >= 4
  },

  // Valida nombre de usuario
  validarNombre(nombre) {
    return nombre && nombre.trim().length >= 2
  },

  // Valida formulario de login completo
  validarFormularioLogin({ email, password }) {
    const errores = {}

    if (!email) {
      errores.email = 'El correo es obligatorio'
    } else if (!this.validarEmail(email)) {
      errores.email = 'El correo no tiene un formato válido'
    }

    if (!password) {
      errores.password = 'La contraseña es obligatoria'
    } else if (!this.validarPassword(password)) {
      errores.password = 'La contraseña debe tener al menos 4 caracteres'
    }

    return {
      valido: Object.keys(errores).length === 0,
      errores
    }
  },

  // Valida formulario de registro completo
  validarFormularioRegistro({ nombre, email, password, confirmarPassword }) {
    const errores = {}

    if (!nombre) {
      errores.nombre = 'El nombre es obligatorio'
    } else if (!this.validarNombre(nombre)) {
      errores.nombre = 'El nombre debe tener al menos 2 caracteres'
    }

    if (!email) {
      errores.email = 'El correo es obligatorio'
    } else if (!this.validarEmail(email)) {
      errores.email = 'El correo no tiene un formato válido'
    }

    if (!password) {
      errores.password = 'La contraseña es obligatoria'
    } else if (!this.validarPassword(password)) {
      errores.password = 'La contraseña debe tener al menos 4 caracteres'
    }

    if (!confirmarPassword) {
      errores.confirmarPassword = 'Debes confirmar tu contraseña'
    } else if (password !== confirmarPassword) {
      errores.confirmarPassword = 'Las contraseñas no coinciden'
    }

    return {
      valido: Object.keys(errores).length === 0,
      errores
    }
  }
}

export default authService