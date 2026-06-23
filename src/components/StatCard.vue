<template>
  <div class="stat-card card">
    <div class="stat-icon-wrap">
      <span class="stat-icon">{{ icono }}</span>
    </div>
    <div class="stat-info">
      <p class="stat-valor">{{ valor }}</p>
      <p class="stat-label">{{ label }}</p>
      <p v-if="sublabel" class="stat-sublabel">{{ sublabel }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatCard',
  props: {
    icono: { type: String, default: '📊' },
    valor: { type: String, required: true },
    label: { type: String, required: true },
    sublabel: { type: String, default: '' }
  }
}
</script>

<style scoped>
.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px 16px !important;
  gap: 12px;
  background: rgba(255, 255, 255, 0.04) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
  transition: all 0.2s ease;
}

.stat-card:hover {
  background: rgba(96, 165, 250, 0.06) !important;
  border-color: rgba(96, 165, 250, 0.15) !important;
  transform: translateY(-2px);
}

.stat-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(96, 165, 250, 0.1);
  border: 1px solid rgba(96, 165, 250, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon {
  font-size: 24px;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-valor {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.stat-sublabel {
  font-size: 11px;
  color: var(--text-muted);
}
</style>