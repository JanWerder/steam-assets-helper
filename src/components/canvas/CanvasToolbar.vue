<script setup lang="ts">
defineProps<{
  scale: number
}>()

const emit = defineEmits<{
  zoomIn: []
  zoomOut: []
  resetView: []
  fitToScreen: []
}>()

const scalePercent = (scale: number) => Math.round(scale * 100)
</script>

<template>
  <div class="flex items-center gap-2 px-3 py-2 bg-surface-800 rounded-lg">
    <button
      @click="emit('zoomOut')"
      class="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-700 text-surface-400 hover:text-surface-200 transition-colors"
      title="Zoom Out"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
      </svg>
    </button>

    <span class="text-sm text-surface-400 w-12 text-center">{{ scalePercent(scale) }}%</span>

    <button
      @click="emit('zoomIn')"
      class="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-700 text-surface-400 hover:text-surface-200 transition-colors"
      title="Zoom In"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>

    <div class="w-px h-4 bg-surface-600 mx-1" />

    <button
      @click="emit('fitToScreen')"
      class="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-700 text-surface-400 hover:text-surface-200 transition-colors"
      title="Fit to Screen"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
      </svg>
    </button>

    <button
      @click="emit('resetView')"
      class="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-700 text-surface-400 hover:text-surface-200 transition-colors"
      title="Reset View"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    </button>
  </div>
</template>
