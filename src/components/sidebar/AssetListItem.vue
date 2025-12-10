<script setup lang="ts">
import { computed } from 'vue'
import type { AssetDefinition, AssetState, SourceImage } from '@/types'
import { useImageCrop } from '@/composables/useImageCrop'

const props = defineProps<{
  asset: AssetDefinition
  state: AssetState | null
  sourceImage: SourceImage | null
  isSelected: boolean
}>()

const emit = defineEmits<{
  select: []
}>()

const { calculateCrop } = useImageCrop()

const thumbnailStyle = computed(() => {
  if (!props.sourceImage || !props.state) {
    return {}
  }

  const crop = calculateCrop(
    props.sourceImage.width,
    props.sourceImage.height,
    props.asset.width,
    props.asset.height,
    props.state.anchor,
    props.state.scale,
    props.state.offsetX,
    props.state.offsetY
  )

  const scaleX = 48 / props.asset.width
  const scaleY = 32 / props.asset.height
  const scale = Math.min(scaleX, scaleY)

  return {
    width: `${props.asset.width * scale}px`,
    height: `${props.asset.height * scale}px`,
    backgroundImage: `url(${props.sourceImage.dataUrl})`,
    backgroundSize: `${props.sourceImage.width * (crop.cropWidth ? props.asset.width / crop.cropWidth : 1) * scale}px auto`,
    backgroundPosition: `${-crop.cropX * (props.asset.width / crop.cropWidth) * scale}px ${-crop.cropY * (props.asset.height / crop.cropHeight) * scale}px`
  }
})

const dimensionsLabel = computed(() => {
  return `${props.asset.width}×${props.asset.height}`
})
</script>

<template>
  <button
    @click="emit('select')"
    class="w-full flex items-center gap-2 px-2 py-1.5 text-left transition-colors"
    :class="isSelected
      ? 'bg-steam-green-light steam-border'
      : 'hover:bg-steam-green-dark'"
  >
    <!-- Thumbnail -->
    <div
      class="flex-shrink-0 w-10 h-7 flex items-center justify-center overflow-hidden steam-border-inset bg-steam-green-darker"
    >
      <div
        v-if="sourceImage"
        :style="thumbnailStyle"
        class="bg-cover bg-no-repeat"
      />
      <svg
        v-else
        class="w-3 h-3 text-steam-highlight"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>

    <!-- Info -->
    <div class="flex-1 min-w-0">
      <p class="text-xs font-medium text-steam-text truncate">{{ asset.name }}</p>
      <p class="text-xs text-steam-text-muted">{{ dimensionsLabel }}</p>
    </div>

    <!-- Status -->
    <div
      v-if="state?.isComplete"
      class="flex-shrink-0 w-4 h-4 flex items-center justify-center"
    >
      <svg class="w-3 h-3 text-steam-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  </button>
</template>
