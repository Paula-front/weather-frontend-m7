<template>
  <div class="registro-page">
    <div class="registro-container">
      <div class="registro-header">
        <RouterLink to="/login" class="back-link">← Volver al login</RouterLink>

        <div class="registro-logo">
          <span class="logo-icon">🌤️</span>
          <h1 class="logo-text">ClimaApp</h1>
        </div>

        <p class="registro-subtitle">
          Crea tu cuenta y personaliza tu experiencia
        </p>
      </div>

      <div class="registro-card">
        <h2 class="card-title">Crear cuenta</h2>

        <div v-if="errorGeneral" class="alerta alerta-error">
          ⚠️ {{ errorGeneral }}
        </div>

        <div v-if="exitoso" class="alerta alerta-success">
          ✅ ¡Cuenta creada! Bienvenido/a {{ nombreUsuario }}
        </div>

        <form class="registro-form" @submit.prevent="handleRegistro">
          <div class="input-group">
            <label>Nombre</label>
            <input
              v-model="form.nombre"
              type="text"
              :class="{ 'input-error': errores.nombre }"
              placeholder="Tu nombre"
              autocomplete="name"
            />
            <span v-if="errores.nombre" class="error-msg">{{ errores.nombre }}</span>
          </div>

          <div class="input-group">
            <label>Correo electrónico</label>
            <input
              v-model="form.email"
              type="email"
              :class="{ 'input-error': errores.email }"
              placeholder="tu@correo.com"
              autocomplete="email"
            />
            <span v-if="errores.email" class="error-msg">{{ errores.email }}</span>
          </div>

          <div class="input-group">
            <label>Contraseña</label>

            <div class="password-wrap">
              <input
                v-model="form.password"
                :type="mostrarPassword ? 'text' : 'password'"
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
            <label>Confirmar contraseña</label>

            <div class="password-wrap">
              <input
                v-model="form.confirmarPassword"
                :type="mostrarConfirmar ? 'text' : 'password'"
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

            <span v-if="errores.confirmarPassword" class="error-msg">
              {{ errores.confirmarPassword }}
            </span>
          </div>

          <button type="submit" class="submit-btn" :disabled="cargando">
            <span v-if="cargando">⏳ Creando cuenta...</span>
            <span v-else>🚀 Crear cuenta</span>
          </button>
        </form>

        <div class="registro-footer">
          <p>
            ¿Ya tienes cuenta?
            <RouterLink to="/login">Inicia sesión</RouterLink>
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
  padding: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at top left, rgba(96, 165, 250, 0.18), transparent 35%),
    linear-gradient(160deg, #0a0f1e 0%, #0d1b3e 60%, #1a0d2e 100%);
}

.registro-container {
  width: 100%;
  max-width: 460px;
}

.registro-header {
  text-align: center;
  margin-bottom: 20px;
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

.registro-logo {
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

.registro-subtitle {
  color: #94a3b8;
  font-size: 1rem;
}

.registro-card {
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

.registro-form {
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

.registro-footer {
  margin-top: 22px;
  text-align: center;
  color: #e2e8f0;
  font-weight: 700;
}

.registro-footer a {
  color: #60a5fa;
  font-weight: 900;
}

@media (max-width: 520px) {
  .registro-page {
    padding: 18px;
    align-items: flex-start;
  }

  .registro-card {
    padding: 22px;
  }

  .logo-text {
    font-size: 28px;
  }
}
</style>