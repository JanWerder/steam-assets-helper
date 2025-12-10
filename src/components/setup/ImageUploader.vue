<script setup lang="ts">
import { ref } from 'vue'
import type { SourceImage } from '@/types'

const props = defineProps<{
  label: string
  description: string
  orientation: 'horizontal' | 'vertical'
  image?: SourceImage | null
}>()

const emit = defineEmits<{
  upload: [image: SourceImage]
}>()

const isDragging = ref(false)
const isLoading = ref(false)
const error = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

function handleDragOver(e: DragEvent) {
  e.preventDefault()
  isDragging.value = true
}

function handleDragLeave() {
  isDragging.value = false
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false

  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    processFile(files[0])
  }
}

function handleClick() {
  fileInput.value?.click()
}

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    processFile(files[0])
  }
}

async function processFile(file: File) {
  error.value = null

  if (!file.type.startsWith('image/')) {
    error.value = 'Please upload an image file (PNG, JPG, or WEBP)'
    return
  }

  isLoading.value = true

  try {
    const image = await loadImage(file)
    emit('upload', image)
  } catch (err) {
    error.value = 'Failed to load image. Please try another file.'
  } finally {
    isLoading.value = false
  }
}

function loadImage(file: File): Promise<SourceImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      const img = new Image()

      img.onload = () => {
        resolve({
          element: img,
          width: img.naturalWidth,
          height: img.naturalHeight,
          dataUrl,
          filename: file.name
        })
      }

      img.onerror = reject
      img.src = dataUrl
    }

    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-surface-100">{{ label }}</h3>
        <p class="text-sm text-surface-400">{{ description }}</p>
      </div>
      <div
        class="w-10 h-10 rounded-lg flex items-center justify-center"
        :class="orientation === 'horizontal' ? 'bg-blue-500/20' : 'bg-purple-500/20'"
      >
        <svg
          v-if="orientation === 'horizontal'"
          class="w-5 h-5 text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <rect x="2" y="6" width="20" height="12" rx="2" stroke-width="2" />
        </svg>
        <svg
          v-else
          class="w-5 h-5 text-purple-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <rect x="6" y="2" width="12" height="20" rx="2" stroke-width="2" />
        </svg>
      </div>
    </div>

    <div
      v-if="!image"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      @click="handleClick"
      class="relative border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all duration-200"
      :class="[
        isDragging
          ? 'border-blue-500 bg-blue-500/10'
          : 'border-surface-600 hover:border-surface-500 hover:bg-surface-800/50',
        isLoading && 'pointer-events-none opacity-60'
      ]"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        class="hidden"
        @change="handleFileChange"
      />

      <div class="flex flex-col items-center gap-3 text-center">
        <div class="w-12 h-12 rounded-full bg-surface-700 flex items-center justify-center">
          <svg v-if="!isLoading" class="w-6 h-6 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <svg v-else class="w-6 h-6 text-surface-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>

        <div>
          <p class="text-surface-200 font-medium">
            {{ isLoading ? 'Loading...' : 'Drop image here or click to browse' }}
          </p>
          <p class="text-sm text-surface-500 mt-1">PNG, JPG, or WEBP</p>
        </div>
      </div>
    </div>

    <div
      v-else
      class="relative rounded-xl overflow-hidden border border-surface-700 bg-surface-800"
    >
      <img
        :src="image.dataUrl"
        :alt="label"
        class="w-full h-48 object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

      <div class="absolute bottom-0 left-0 right-0 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-white truncate max-w-[200px]">{{ image.filename }}</p>
            <p class="text-xs text-surface-300">{{ image.width }} × {{ image.height }}</p>
          </div>
          <button
            @click.stop="handleClick"
            class="px-3 py-1.5 text-sm bg-surface-900/80 hover:bg-surface-900 text-surface-200 rounded-lg transition-colors"
          >
            Change
          </button>
        </div>
      </div>

      <input
        ref="fileInput"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        class="hidden"
        @change="handleFileChange"
      />
    </div>

    <p v-if="error" class="text-sm text-red-400">{{ error }}</p>
  </div>
</template>
