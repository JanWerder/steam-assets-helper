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
  <div class="flex items-center gap-1 px-2 py-1 steam-border bg-steam-green">
    <!-- Zoom Out -->
    <button
      @click="emit('zoomOut')"
      class="btn h-6 w-6 min-w-0 p-0"
      title="Zoom Out"
    >
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
      </svg>
    </button>

    <!-- Scale Display -->
    <span class="text-xs text-steam-text-muted w-10 text-center">{{ scalePercent(scale) }}%</span>

    <!-- Zoom In -->
    <button
      @click="emit('zoomIn')"
      class="btn h-6 w-6 min-w-0 p-0"
      title="Zoom In"
    >
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>

    <!-- Divider -->
    <div class="w-px h-4 bg-steam-shadow mx-1" />

    <!-- Fit to Screen -->
    <button
      @click="emit('fitToScreen')"
      class="btn h-6 w-6 min-w-0 p-0"
      title="Fit to Screen"
    >
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
      </svg>
    </button>

    <!-- Reset View -->
    <button
      @click="emit('resetView')"
      class="btn h-6 w-6 min-w-0 p-0"
      title="Reset View"
    >
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    </button>
  </div>
</template>
