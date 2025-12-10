<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAssetStore } from '@/composables/useAssetStore'
import ImageUploader from './ImageUploader.vue'

const router = useRouter()
const store = useAssetStore()

const showSplitMode = ref(false)

const canProceed = computed(() => {
  return store.state.horizontalSource !== null && store.state.verticalSource !== null
})

watch(showSplitMode, (enabled) => {
  store.toggleSplitMode(enabled)
})

function handleHorizontalUpload(image: any) {
  if (image) {
    store.setSourceImage('horizontal', image)
  }
}

function handleVerticalUpload(image: any) {
  if (image) {
    store.setSourceImage('vertical', image)
  }
}

function handleLogoUpload(image: any) {
  store.setLogoImage(image || null)
}

function handleHorizontalBackgroundUpload(image: any) {
  store.setBackgroundImage('horizontal', image || null)
}

function handleVerticalBackgroundUpload(image: any) {
  store.setBackgroundImage('vertical', image || null)
}

function proceedToEditor() {
  if (canProceed.value) {
    store.completeSetup()
    router.push('/editor')
  }
}
</script>

<template>
  <div class="h-full w-full flex flex-col">
    <header class="flex-shrink-0 px-8 py-6 border-b border-surface-800">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-2xl font-bold text-surface-100">Steam Asset Creator</h1>
        <p class="text-surface-400 mt-1">Generate all required Steam store graphics from your cover art</p>
      </div>
    </header>

    <main class="flex-1 overflow-y-auto">
      <div class="max-w-4xl mx-auto px-8 py-8">
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-surface-100 mb-2">Upload Your Cover Art</h2>
          <p class="text-surface-400">
            Upload two versions of your game's cover art: one horizontal (for capsules, headers)
            and one vertical (for library display). You'll be able to adjust cropping for each asset.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-6 mb-8">
          <div class="card p-6">
            <ImageUploader
              label="Horizontal Cover"
              description="For headers, capsules, and banners"
              orientation="horizontal"
              :image="store.state.horizontalSource"
              @upload="handleHorizontalUpload"
            />
          </div>

          <div class="card p-6">
            <ImageUploader
              label="Vertical Cover"
              description="For library and portrait displays"
              orientation="vertical"
              :image="store.state.verticalSource"
              @upload="handleVerticalUpload"
            />
          </div>
        </div>

        <div class="card p-6 mb-8">
          <div class="flex items-start gap-4">
            <button
              @click="showSplitMode = !showSplitMode"
              class="flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors"
              :class="showSplitMode
                ? 'bg-blue-600 border-blue-600'
                : 'border-surface-500 hover:border-surface-400'"
            >
              <svg v-if="showSplitMode" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <div class="flex-1">
              <h3 class="font-semibold text-surface-100">Split Mode: Logo + Background (Optional)</h3>
              <p class="text-sm text-surface-400 mt-1">
                Upload your logo separately and background images without the logo.
                This lets you position the logo manually on each asset for perfect placement.
              </p>
            </div>
          </div>

          <div v-if="showSplitMode" class="mt-6 pl-10 space-y-6">
            <div>
              <h4 class="text-sm font-medium text-surface-300 mb-3">Game Logo</h4>
              <ImageUploader
                label="Logo"
                description="Transparent PNG recommended"
                orientation="horizontal"
                :image="store.state.logoImage"
                @upload="handleLogoUpload"
              />
            </div>

            <div class="pt-4 border-t border-surface-700">
              <h4 class="text-sm font-medium text-surface-300 mb-3">Backgrounds (without logo)</h4>
              <p class="text-xs text-surface-500 mb-4">
                Upload backgrounds without the logo. You can toggle between using these or the main cover art per asset in the editor.
              </p>
              <div class="grid md:grid-cols-2 gap-4">
                <ImageUploader
                  label="Horizontal Background"
                  description="For horizontal assets"
                  orientation="horizontal"
                  :image="store.state.horizontalBackground"
                  @upload="handleHorizontalBackgroundUpload"
                />
                <ImageUploader
                  label="Vertical Background"
                  description="For vertical assets"
                  orientation="vertical"
                  :image="store.state.verticalBackground"
                  @upload="handleVerticalBackgroundUpload"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="card p-6 bg-surface-800/50">
          <h3 class="font-semibold text-surface-100 mb-3">What You'll Create</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p class="text-surface-300 font-medium">Store Assets (4)</p>
              <ul class="text-surface-500 mt-1 space-y-0.5">
                <li>Header Capsule</li>
                <li>Small Capsule</li>
                <li>Main Capsule</li>
                <li>Vertical Capsule</li>
              </ul>
            </div>
            <div>
              <p class="text-surface-300 font-medium">Library Assets (4)</p>
              <ul class="text-surface-500 mt-1 space-y-0.5">
                <li>Library Capsule</li>
                <li>Library Header</li>
                <li>Library Hero</li>
                <li>Library Logo</li>
              </ul>
            </div>
            <div>
              <p class="text-surface-300 font-medium">Optional (6)</p>
              <ul class="text-surface-500 mt-1 space-y-0.5">
                <li>Community Icon</li>
                <li>Client Icon</li>
                <li>Page Background</li>
                <li>Event Cover/Header</li>
                <li>Broadcast Panel</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="flex-shrink-0 px-8 py-4 border-t border-surface-800 bg-surface-900/50">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <p class="text-sm text-surface-500">
          {{ canProceed ? 'Ready to create your assets' : 'Upload both images to continue' }}
        </p>
        <button
          @click="proceedToEditor"
          :disabled="!canProceed"
          class="btn btn-primary flex items-center gap-2"
        >
          Continue to Editor
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </footer>
  </div>
</template>
