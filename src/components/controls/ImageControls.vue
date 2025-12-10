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
  <div class="p-4 space-y-6" v-if="currentAsset && currentState">
    <div v-if="canUseSplitMode" class="pb-4 border-b border-surface-700">
      <div class="flex items-center justify-between">
        <div>
          <label class="text-sm font-medium text-surface-300">Use Split Mode</label>
          <p class="text-xs text-surface-500">Background + Logo</p>
        </div>
        <button
          @click="toggleAssetSplitMode"
          class="relative w-11 h-6 rounded-full transition-colors"
          :class="currentState.useSplitMode ? 'bg-blue-600' : 'bg-surface-600'"
        >
          <span
            class="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform"
            :class="currentState.useSplitMode ? 'translate-x-5' : 'translate-x-0'"
          />
        </button>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-surface-300 mb-2">
        Scale: {{ Math.round(currentState.scale * 100) }}%
      </label>
      <input
        type="range"
        :value="currentState.scale"
        @input="updateScale(Number(($event.target as HTMLInputElement).value))"
        min="1"
        max="3"
        step="0.05"
        class="w-full h-2 bg-surface-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
      <div class="flex justify-between text-xs text-surface-500 mt-1">
        <span>100%</span>
        <span>300%</span>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-surface-300 mb-2">Anchor Point</label>
      <div class="grid grid-cols-3 gap-1 w-24">
        <button
          v-for="point in anchorPoints"
          :key="point.id"
          @click="updateAnchor(point.id)"
          class="w-7 h-7 text-xs rounded flex items-center justify-center transition-colors"
          :class="currentState.anchor === point.id
            ? 'bg-blue-600 text-white'
            : 'bg-surface-700 text-surface-400 hover:bg-surface-600'"
          :title="point.label"
        >
          <div
            class="w-2 h-2 rounded-full"
            :class="currentState.anchor === point.id ? 'bg-white' : 'bg-surface-500'"
          />
        </button>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-surface-300 mb-2">
        Horizontal Offset: {{ Math.round(currentState.offsetX) }}px
      </label>
      <input
        type="range"
        :value="currentState.offsetX"
        @input="updateOffsetX(Number(($event.target as HTMLInputElement).value))"
        :min="-maxOffsets.maxOffsetX"
        :max="maxOffsets.maxOffsetX"
        step="1"
        class="w-full h-2 bg-surface-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-surface-300 mb-2">
        Vertical Offset: {{ Math.round(currentState.offsetY) }}px
      </label>
      <input
        type="range"
        :value="currentState.offsetY"
        @input="updateOffsetY(Number(($event.target as HTMLInputElement).value))"
        :min="-maxOffsets.maxOffsetY"
        :max="maxOffsets.maxOffsetY"
        step="1"
        class="w-full h-2 bg-surface-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
    </div>

    <div class="pt-4 border-t border-surface-700 space-y-2">
      <button
        @click="resetToDefaults"
        class="w-full btn btn-secondary text-sm"
      >
        Reset to Defaults
      </button>
      <button
        @click="markComplete"
        class="w-full btn text-sm"
        :class="currentState.isComplete ? 'bg-green-600 hover:bg-green-700 text-white' : 'btn-primary'"
      >
        {{ currentState.isComplete ? 'Marked Complete' : 'Mark as Complete' }}
      </button>
    </div>
  </div>

  <div v-else class="p-4 text-center text-surface-500">
    Select an asset to adjust
  </div>
</template>
