<script setup lang="ts">
import { ref, computed } from 'vue'
import type Konva from 'konva'
import { useAssetStore } from '@/composables/useAssetStore'
import { useImageCrop } from '@/composables/useImageCrop'
import { useExport } from '@/composables/useExport'

const props = defineProps<{
  getStage: () => Konva.Stage | null
}>()

const store = useAssetStore()
const { calculateCrop } = useImageCrop()
const { downloadPng, exportAllAsZip } = useExport()

const isExporting = ref(false)
const isExportingAll = ref(false)

const currentAsset = computed(() => store.currentAsset.value)
const completedAssets = computed(() =>
  store.allAssets.filter(a => store.state.assetStates[a.id]?.isComplete)
)

async function generateAssetDataUrl(assetId: string): Promise<string | null> {
  const asset = store.allAssets.find(a => a.id === assetId)
  if (!asset) return null

  const sourceImage = store.getSourceForAsset(asset)
  const state = store.state.assetStates[assetId]
  if (!sourceImage || !state) return null

  const crop = calculateCrop(
    sourceImage.width,
    sourceImage.height,
    asset.width,
    asset.height,
    state.anchor,
    state.scale,
    state.offsetX,
    state.offsetY
  )

  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    canvas.width = asset.width
    canvas.height = asset.height
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      resolve(null)
      return
    }

    ctx.drawImage(
      sourceImage.element,
      crop.cropX,
      crop.cropY,
      crop.cropWidth,
      crop.cropHeight,
      0,
      0,
      asset.width,
      asset.height
    )

    resolve(canvas.toDataURL('image/png'))
  })
}

async function exportCurrent() {
  const asset = currentAsset.value
  if (!asset) return

  isExporting.value = true
  try {
    const dataUrl = await generateAssetDataUrl(asset.id)
    if (dataUrl) {
      downloadPng(dataUrl, asset.id)
    }
  } finally {
    isExporting.value = false
  }
}

async function exportAll() {
  if (completedAssets.value.length === 0) return

  isExportingAll.value = true
  try {
    const exports: Array<{ dataUrl: string; filename: string }> = []

    for (const asset of completedAssets.value) {
      const dataUrl = await generateAssetDataUrl(asset.id)
      if (dataUrl) {
        exports.push({ dataUrl, filename: asset.id })
      }
    }

    if (exports.length > 0) {
      await exportAllAsZip(exports)
    }
  } finally {
    isExportingAll.value = false
  }
}
</script>

<template>
  <div class="p-4 space-y-3">
    <h3 class="text-sm font-semibold text-surface-300">Export</h3>

    <button
      @click="exportCurrent"
      :disabled="!currentAsset || isExporting"
      class="w-full btn btn-primary text-sm flex items-center justify-center gap-2"
    >
      <svg v-if="isExporting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      {{ isExporting ? 'Exporting...' : 'Download Current' }}
    </button>

    <button
      @click="exportAll"
      :disabled="completedAssets.length === 0 || isExportingAll"
      class="w-full btn btn-secondary text-sm flex items-center justify-center gap-2"
    >
      <svg v-if="isExportingAll" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
      {{ isExportingAll ? 'Exporting...' : `Download All (${completedAssets.length})` }}
    </button>

    <p class="text-xs text-surface-500 text-center">
      Mark assets as complete to include them in the ZIP export
    </p>
  </div>
</template>
