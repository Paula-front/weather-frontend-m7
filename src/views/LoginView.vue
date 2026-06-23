<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <RouterLink to="/" class="back-link">← Volver al inicio</RouterLink>

        <div class="login-logo">
          <span class="logo-icon">🌤️</span>
          <h1 class="logo-text">ClimaApp</h1>
        </div>

        <p class="login-subtitle">
          El clima de cualquier ciudad, personalizado para ti
        </p>
      </div>

      <div class="login-card">
        <h2 class="card-title">Iniciar sesión</h2>

        <div v-if="errorGeneral" class="alerta alerta-error">
          ⚠️ {{ errorGeneral }}
        </div>

        <div v-if="exitoso" class="alerta alerta-success">
          ✅ ¡Bienvenido/a! Redirigiendo...
        </div>

        <form class="login-form" @submit.prevent="handleLogin">
          <div class="input-group">
            <label>Correo electrónico</label>

            <input
              v-model="form.email"
              type="email"
              :class="{ 'input-error': errores.email }"
              placeholder="tu@correo.com"
              autocomplete="email"
            />

            <span v-if="errores.email" class="error-msg">
              {{ errores.email }}
            </span>
          </div>

          <div class="input-group">
            <label>Contraseña</label>

            <div class="password-wrap">
              <input
                v-model="form.password"
                :type="mostrarPassword ? 'text' : 'password'"
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

            <span v-if="errores.password" class="error-msg">
              {{ errores.password }}
            </span>
          </div>

          <button type="submit" class="submit-btn" :disabled="cargando">
            <span v-if="cargando">⏳ Ingresando...</span>
            <span v-else>✨ Iniciar sesión</span>
          </button>
        </form>

        <div class="login-footer">
          <p>
            ¿No tienes cuenta?
            <RouterLink to="/registro">Regístrate gratis</RouterLink>
          </p>
        </div>
      </div>

      <div class="demo-card">
        <p class="demo-title">👥 Usuarios de prueba</p>

        <div class="demo-users">
          <button
            v-for="usuario in usuariosPrueba"
            :key="usuario.email"
            class="demo-user-btn"
            @click="cargarUsuarioPrueba(usuario)"
          >
            <div class="demo-avatar">
              {{ usuario.nombre.substring(0, 2).toUpperCase() }}
            </div>

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
        await this.login({
          email: this.form.email,
          password: this.form.password
        })

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
  padding: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at top left, rgba(96, 165, 250, 0.18), transparent 35%),
    linear-gradient(160deg, #0a0f1e 0%, #0d1b3e 60%, #1a0d2e 100%);
}

.login-container {
  width: 100%;
  max-width: 460px;
  display: grid;
  gap: 20px;
}

.login-header {
  text-align: center;
}

.back-link {
  display: inline-block;
  margin-bottom: 20px;
  color: #94a3b8;
  text-decoration: none;
  font-weight: 600;
}

.back-link:hover {
  color: #60a5fa;
}

.login-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-bottom: 8px;
}

.logo-icon {
  font-size: 44px;
  filter: drop-shadow(0 0 18px rgba(96, 165, 250, 0.45));
}

.logo-text {
  font-size: 34px;
  font-weight: 900;
  background: linear-gradient(135deg, #60a5fa, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.login-subtitle {
  color: #94a3b8;
  font-size: 1rem;
}

.login-card,
.demo-card {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(96, 165, 250, 0.28);
  border-radius: 24px;
  padding: 30px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(16px);
}

.card-title {
  font-size: 1.6rem;
  color: #f8fafc;
  margin-bottom: 22px;
}

.login-form {
  display: grid;
  gap: 16px;
}

.input-group {
  display: grid;
  gap: 7px;
}

.input-group label {
  color: #e2e8f0;
  font-size: 0.95rem;
  font-weight: 800;
}

.input-group input {
  width: 100%;
  min-height: 48px;
  padding: 0 14px;
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(15, 23, 42, 0.9);
  color: #f8fafc;
  font-size: 1rem;
  outline: none;
  box-sizing: border-box;
}

.input-group input::placeholder {
  color: #94a3b8;
}

.input-group input:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.16);
}

.input-error {
  border-color: #f87171 !important;
}

.password-wrap {
  position: relative;
}

.password-wrap input {
  padding-right: 48px;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.1rem;
}

.error-msg {
  color: #fca5a5;
  font-size: 0.8rem;
  font-weight: 700;
}

.alerta {
  padding: 13px 15px;
  border-radius: 14px;
  margin-bottom: 16px;
  font-weight: 700;
}

.alerta-error {
  background: rgba(239, 68, 68, 0.14);
  border: 1px solid rgba(248, 113, 113, 0.35);
  color: #fecaca;
}

.alerta-success {
  background: rgba(34, 197, 94, 0.14);
  border: 1px solid rgba(74, 222, 128, 0.35);
  color: #bbf7d0;
}

.submit-btn {
  width: 100%;
  min-height: 52px;
  border: none;
  border-radius: 16px;
  margin-top: 8px;
  background: linear-gradient(135deg, #3b82f6, #7c3aed);
  color: white;
  font-size: 1.05rem;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 14px 30px rgba(59, 130, 246, 0.28);
  transition: 0.25s;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.submit-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.login-footer {
  margin-top: 22px;
  text-align: center;
  color: #e2e8f0;
  font-weight: 700;
}

.login-footer a {
  color: #60a5fa;
  font-weight: 900;
}

.demo-card {
  padding: 20px;
}

.demo-title {
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.82rem;
  font-weight: 900;
  margin-bottom: 14px;
}

.demo-users {
  display: grid;
  gap: 10px;
}

.demo-user-btn {
  width: 100%;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 16px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(255, 255, 255, 0.06);
  cursor: pointer;
  transition: 0.25s;
  font-family: inherit;
}

.demo-user-btn:hover {
  background: rgba(96, 165, 250, 0.14);
  border-color: rgba(96, 165, 250, 0.35);
  transform: translateY(-2px);
}

.demo-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  font-weight: 900;
}

.demo-info {
  flex: 1;
  display: grid;
  text-align: left;
}

.demo-nombre {
  color: #f8fafc;
  font-weight: 800;
}

.demo-email {
  color: #94a3b8;
  font-size: 0.85rem;
}

.demo-arrow {
  color: #60a5fa;
  font-weight: 900;
}

@media (max-width: 520px) {
  .login-page {
    padding: 18px;
    align-items: flex-start;
  }

  .login-card,
  .demo-card {
    padding: 22px;
  }

  .logo-text {
    font-size: 28px;
  }
}
</style>