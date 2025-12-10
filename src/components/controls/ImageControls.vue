<script setup lang="ts">
import { computed } from 'vue'
import type { CropAnchor } from '@/types'
import { useAssetStore } from '@/composables/useAssetStore'
import { useImageCrop } from '@/composables/useImageCrop'

const store = useAssetStore()
const { getMaxOffset } = useImageCrop()

const currentAsset = computed(() => store.currentAsset.value)
const currentState = computed(() => store.currentAssetState.value)
const sourceImage = computed(() => store.currentSourceImage.value)

const maxOffsets = computed(() => {
  const asset = currentAsset.value
  const state = currentState.value
  const source = sourceImage.value
  if (!asset || !source || !state) {
    return { maxOffsetX: 100, maxOffsetY: 100 }
  }
  return getMaxOffset(
    source.width,
    source.height,
    asset.width,
    asset.height,
    state.scale
  )
})

const anchorPoints: { id: CropAnchor; label: string }[] = [
  { id: 'left-top', label: 'TL' },
  { id: 'center-top', label: 'T' },
  { id: 'right-top', label: 'TR' },
  { id: 'left-middle', label: 'L' },
  { id: 'center-middle', label: 'C' },
  { id: 'right-middle', label: 'R' },
  { id: 'left-bottom', label: 'BL' },
  { id: 'center-bottom', label: 'B' },
  { id: 'right-bottom', label: 'BR' }
]

const canUseSplitMode = computed(() => {
  const asset = currentAsset.value
  if (!asset) return false
  const hasBackground = asset.orientation === 'vertical'
    ? store.state.verticalBackground !== null
    : store.state.horizontalBackground !== null
  return store.state.useSplitMode && hasBackground
})

function updateScale(value: number) {
  const asset = currentAsset.value
  const state = currentState.value
  const source = sourceImage.value
  if (!asset || !state || !source) return

  const newMaxOffsets = getMaxOffset(
    source.width,
    source.height,
    asset.width,
    asset.height,
    value
  )

  store.updateAssetState(asset.id, {
    scale: value,
    offsetX: Math.max(-newMaxOffsets.maxOffsetX, Math.min(newMaxOffsets.maxOffsetX, state.offsetX)),
    offsetY: Math.max(-newMaxOffsets.maxOffsetY, Math.min(newMaxOffsets.maxOffsetY, state.offsetY))
  })
}

function updateOffsetX(value: number) {
  const asset = currentAsset.value
  if (!asset) return
  store.updateAssetState(asset.id, { offsetX: value })
}

function updateOffsetY(value: number) {
  const asset = currentAsset.value
  if (!asset) return
  store.updateAssetState(asset.id, { offsetY: value })
}

function updateAnchor(anchor: CropAnchor) {
  const asset = currentAsset.value
  if (!asset) return
  store.updateAssetState(asset.id, { anchor, offsetX: 0, offsetY: 0 })
}

function resetToDefaults() {
  const asset = currentAsset.value
  if (!asset) return
  store.resetAssetState(asset.id)
}

function markComplete() {
  const asset = currentAsset.value
  if (!asset) return
  store.markAssetComplete(asset.id, true)
}

function toggleAssetSplitMode() {
  const asset = currentAsset.value
  const state = currentState.value
  if (!asset || !state) return
  store.updateAssetState(asset.id, { useSplitMode: !state.useSplitMode })
}
</script>

<template>
  <div class="p-3 space-y-4" v-if="currentAsset && currentState">
    <!-- Split Mode Toggle -->
    <div v-if="canUseSplitMode" class="pb-3 border-b border-steam-shadow">
      <div class="flex items-center justify-between">
        <div>
          <label class="text-xs font-medium text-steam-text">Use Split Mode</label>
          <p class="text-xs text-steam-text-muted">Background + Logo</p>
        </div>
        <button
          @click="toggleAssetSplitMode"
          class="relative w-10 h-5 transition-colors steam-border-inset"
          :class="currentState.useSplitMode ? 'bg-steam-green-light' : 'bg-steam-green-darker'"
        >
          <span
            class="absolute top-0.5 left-0.5 w-4 h-4 bg-steam-green steam-border transition-transform"
            :class="currentState.useSplitMode ? 'translate-x-5' : 'translate-x-0'"
          />
        </button>
      </div>
    </div>

    <!-- Scale Slider -->
    <div>
      <label class="block text-xs font-medium text-steam-text mb-1">
        Scale: {{ Math.round(currentState.scale * 100) }}%
      </label>
      <input
        type="range"
        :value="currentState.scale"
        @input="updateScale(Number(($event.target as HTMLInputElement).value))"
        min="1"
        max="3"
        step="0.05"
        class="w-full"
      />
      <div class="flex justify-between text-xs text-steam-text-muted mt-0.5">
        <span>100%</span>
        <span>300%</span>
      </div>
    </div>

    <!-- Anchor Point Grid -->
    <div>
      <label class="block text-xs font-medium text-steam-text mb-1">Anchor Point</label>
      <div class="grid grid-cols-3 gap-0.5 w-20">
        <button
          v-for="point in anchorPoints"
          :key="point.id"
          @click="updateAnchor(point.id)"
          class="w-6 h-6 text-xs flex items-center justify-center transition-colors"
          :class="currentState.anchor === point.id
            ? 'bg-steam-green-light steam-border'
            : 'bg-steam-green-dark steam-border-inset hover:bg-steam-green'"
          :title="point.label"
        >
          <div
            class="w-1.5 h-1.5"
            :class="currentState.anchor === point.id ? 'bg-steam-gold' : 'bg-steam-highlight'"
          />
        </button>
      </div>
    </div>

    <!-- Horizontal Offset -->
    <div>
      <label class="block text-xs font-medium text-steam-text mb-1">
        Horizontal Offset: {{ Math.round(currentState.offsetX) }}px
      </label>
      <input
        type="range"
        :value="currentState.offsetX"
        @input="updateOffsetX(Number(($event.target as HTMLInputElement).value))"
        :min="-maxOffsets.maxOffsetX"
        :max="maxOffsets.maxOffsetX"
        step="1"
        class="w-full"
      />
    </div>

    <!-- Vertical Offset -->
    <div>
      <label class="block text-xs font-medium text-steam-text mb-1">
        Vertical Offset: {{ Math.round(currentState.offsetY) }}px
      </label>
      <input
        type="range"
        :value="currentState.offsetY"
        @input="updateOffsetY(Number(($event.target as HTMLInputElement).value))"
        :min="-maxOffsets.maxOffsetY"
        :max="maxOffsets.maxOffsetY"
        step="1"
        class="w-full"
      />
    </div>

    <!-- Action Buttons -->
    <div class="pt-3 border-t border-steam-shadow space-y-2">
      <button
        @click="resetToDefaults"
        class="w-full btn btn-secondary text-xs"
      >
        Reset to Defaults
      </button>
      <button
        @click="markComplete"
        class="w-full btn text-xs"
        :class="currentState.isComplete ? 'bg-steam-green-light text-steam-gold' : 'btn-primary'"
      >
        {{ currentState.isComplete ? 'Marked Complete' : 'Mark as Complete' }}
      </button>
    </div>
  </div>

  <!-- No Asset Selected -->
  <div v-else class="p-3 text-center text-steam-text-muted text-sm">
    Select an asset to adjust
  </div>
</template>
