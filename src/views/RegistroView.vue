<template>
  <div class="registro-page tema-oscuro">
    <div class="registro-container">

      <!-- Header -->
      <div class="registro-header">
        <RouterLink to="/login" class="back-link">← Volver al login</RouterLink>
        <div class="registro-logo">
          <span class="logo-icon">🌤️</span>
          <h1 class="logo-text">ClimaApp</h1>
        </div>
        <p class="registro-subtitle">Crea tu cuenta y personaliza tu experiencia</p>
      </div>

      <!-- Card de registro -->
      <div class="registro-card card">

        <h2 class="card-title">Crear cuenta</h2>

        <!-- Alerta de error -->
        <div v-if="errorGeneral" class="alerta alerta-error">
          ⚠️ {{ errorGeneral }}
        </div>

        <!-- Alerta de éxito -->
        <div v-if="exitoso" class="alerta alerta-success">
          ✅ ¡Cuenta creada! Bienvenido/a {{ nombreUsuario }}
        </div>

        <!-- Formulario -->
        <form @submit.prevent="handleRegistro">

          <div class="input-group">
            <label class="input-label">Nombre</label>
            <input
              v-model="form.nombre"
              type="text"
              class="input-field"
              :class="{ 'input-error': errores.nombre }"
              placeholder="Tu nombre"
              autocomplete="name"
            />
            <span v-if="errores.nombre" class="error-msg">{{ errores.nombre }}</span>
          </div>

          <div class="input-group">
            <label class="input-label">Correo electrónico</label>
            <input
              v-model="form.email"
              type="email"
              class="input-field"
              :class="{ 'input-error': errores.email }"
              placeholder="tu@correo.com"
              autocomplete="email"
            />
            <span v-if="errores.email" class="error-msg">{{ errores.email }}</span>
          </div>

          <div class="input-group">
            <label class="input-label">Contraseña</label>
            <div class="password-wrap">
              <input
                v-model="form.password"
                :type="mostrarPassword ? 'text' : 'password'"
                class="input-field"
                :class="{ 'input-error': errores.password }"
                placeholder="Mínimo 4 caracteres"
                autocomplete="new-password"
              />
              <button
                type="button"
                class="toggle-password"
                @click="mostrarPassword = !mostrarPassword"
              >
                {{ mostrarPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <span v-if="errores.password" class="error-msg">{{ errores.password }}</span>
          </div>

          <div class="input-group">
            <label class="input-label">Confirmar contraseña</label>
            <div class="password-wrap">
              <input
                v-model="form.confirmarPassword"
                :type="mostrarConfirmar ? 'text' : 'password'"
                class="input-field"
                :class="{ 'input-error': errores.confirmarPassword }"
                placeholder="Repite tu contraseña"
                autocomplete="new-password"
              />
              <button
                type="button"
                class="toggle-password"
                @click="mostrarConfirmar = !mostrarConfirmar"
              >
                {{ mostrarConfirmar ? '🙈' : '👁️' }}
              </button>
            </div>
            <span v-if="errores.confirmarPassword" class="error-msg">{{ errores.confirmarPassword }}</span>
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-full btn-lg mt-8"
            :disabled="cargando"
          >
            <span v-if="cargando">⏳ Creando cuenta...</span>
            <span v-else>🚀 Crear cuenta</span>
          </button>

        </form>

        <div class="registro-footer">
          <p class="text-muted">¿Ya tienes cuenta?
            <RouterLink to="/login" class="text-accent">Inicia sesión</RouterLink>
          </p>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import authService from '../services/authService.js'

export default {
  name: 'RegistroView',
  data() {
    return {
      form: {
        nombre: '',
        email: '',
        password: '',
        confirmarPassword: ''
      },
      errores: {},
      errorGeneral: '',
      exitoso: false,
      cargando: false,
      mostrarPassword: false,
      mostrarConfirmar: false,
      nombreUsuario: ''
    }
  },
  methods: {
    ...mapActions('auth', ['registro']),
    async handleRegistro() {
      this.errorGeneral = ''
      this.errores = {}

      const { valido, errores } = authService.validarFormularioRegistro(this.form)
      if (!valido) {
        this.errores = errores
        return
      }

      this.cargando = true
      try {
        const usuario = await this.registro({
          nombre: this.form.nombre,
          email: this.form.email,
          password: this.form.password
        })
        this.exitoso = true
        this.nombreUsuario = usuario.nombre
        setTimeout(() => {
          this.$router.push('/')
        }, 1500)
      } catch (error) {
        this.errorGeneral = error.message
      } finally {
        this.cargando = false
      }
    }
  }
}
</script>

<style scoped>
.registro-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(160deg, #0A0F1E 0%, #0D1B3E 60%, #1a0d2e 100%);
}

.registro-container {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.registro-header {
  text-align: center;
}

.back-link {
  display: inline-block;
  color: var(--text-muted);
  text-decoration: none;
  font-size: 13px;
  margin-bottom: 20px;
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--accent);
}

.registro-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 8px;
}

.logo-icon {
  font-size: 36px;
  filter: drop-shadow(0 0 20px rgba(96, 165, 250, 0.5));
}

.logo-text {
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #60A5FA, #818CF8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.registro-subtitle {
  color: var(--text-muted);
  font-size: 14px;
}

.registro-card {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(96, 165, 250, 0.2) !important;
  padding: 28px !important;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.password-wrap {
  position: relative;
}

.password-wrap .input-field {
  padding-right: 44px;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
}

.registro-footer {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
}
</style>