<template>
  <div class="login-page tema-oscuro">
    <div class="login-container">

      <!-- Header -->
      <div class="login-header">
        <RouterLink to="/" class="back-link">← Volver al inicio</RouterLink>
        <div class="login-logo">
          <span class="logo-icon">🌤️</span>
          <h1 class="logo-text">ClimaApp</h1>
        </div>
        <p class="login-subtitle">El clima de cualquier ciudad, personalizado para ti</p>
      </div>

      <!-- Card de login -->
      <div class="login-card card">

        <h2 class="card-title">Iniciar sesión</h2>

        <!-- Alerta de error -->
        <div v-if="errorGeneral" class="alerta alerta-error">
          ⚠️ {{ errorGeneral }}
        </div>

        <!-- Alerta de éxito -->
        <div v-if="exitoso" class="alerta alerta-success">
          ✅ ¡Bienvenido/a! Redirigiendo...
        </div>

        <!-- Formulario -->
        <form @submit.prevent="handleLogin">

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
                placeholder="••••••••"
                autocomplete="current-password"
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

          <button
            type="submit"
            class="btn btn-primary btn-full btn-lg mt-8"
            :disabled="cargando"
          >
            <span v-if="cargando">⏳ Ingresando...</span>
            <span v-else>✨ Iniciar sesión</span>
          </button>

        </form>

        <div class="login-footer">
          <p class="text-muted">¿No tienes cuenta?
            <RouterLink to="/registro" class="text-accent">Regístrate gratis</RouterLink>
          </p>
        </div>

      </div>

      <!-- Usuarios de prueba -->
      <div class="demo-card card">
        <p class="demo-title">👥 Usuarios de prueba</p>
        <div class="demo-users">
          <button
            v-for="usuario in usuariosPrueba"
            :key="usuario.email"
            class="demo-user-btn"
            @click="cargarUsuarioPrueba(usuario)"
          >
            <div class="demo-avatar">{{ usuario.nombre.substring(0,2).toUpperCase() }}</div>
            <div class="demo-info">
              <span class="demo-nombre">{{ usuario.nombre }}</span>
              <span class="demo-email">{{ usuario.email }}</span>
            </div>
            <span class="demo-arrow">→</span>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import authService from '../services/authService.js'

export default {
  name: 'LoginView',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      errores: {},
      errorGeneral: '',
      exitoso: false,
      cargando: false,
      mostrarPassword: false,
      usuariosPrueba: [
        { nombre: 'Ana', email: 'ana@clima.com', password: '1234' },
        { nombre: 'Carlos', email: 'carlos@clima.com', password: '1234' }
      ]
    }
  },
  methods: {
    ...mapActions('auth', ['login']),
    async handleLogin() {
      this.errorGeneral = ''
      this.errores = {}

      const { valido, errores } = authService.validarFormularioLogin(this.form)
      if (!valido) {
        this.errores = errores
        return
      }

      this.cargando = true
      try {
        await this.login({ email: this.form.email, password: this.form.password })
        this.exitoso = true
        setTimeout(() => {
          this.$router.push('/')
        }, 1000)
      } catch (error) {
        this.errorGeneral = error.message
      } finally {
        this.cargando = false
      }
    },
    cargarUsuarioPrueba(usuario) {
      this.form.email = usuario.email
      this.form.password = usuario.password
      this.errores = {}
      this.errorGeneral = ''
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(160deg, #0A0F1E 0%, #0D1B3E 60%, #1a0d2e 100%);
}

.login-container {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.login-header {
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

.login-logo {
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

.login-subtitle {
  color: var(--text-muted);
  font-size: 14px;
}

.login-card {
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

.login-footer {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
}

.demo-card {
  background: rgba(96, 165, 250, 0.06) !important;
  border: 1px solid rgba(96, 165, 250, 0.15) !important;
  padding: 16px !important;
}

.demo-title {
  font-size: 12px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 12px;
}

.demo-users {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.demo-user-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  font-family: inherit;
}

.demo-user-btn:hover {
  background: rgba(96, 165, 250, 0.1);
  border-color: rgba(96, 165, 250, 0.3);
}

.demo-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3B82F6, #8B5CF6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: white;
  font-weight: 600;
  flex-shrink: 0;
}

.demo-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
}

.demo-nombre {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}

.demo-email {
  font-size: 11px;
  color: var(--text-muted);
}

.demo-arrow {
  color: var(--accent);
  font-size: 14px;
}
</style>