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
  <div class="h-full w-full flex flex-col bg-steam-green-dark">
    <!-- Header -->
    <header class="flex-shrink-0 px-6 py-4 steam-border bg-steam-green">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-lg font-bold tracking-wider">Steam Asset Creator</h1>
        <p class="text-steam-text-muted text-sm mt-1">Generate all required Steam store graphics from your cover art</p>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto">
      <div class="max-w-4xl mx-auto px-6 py-6">
        <!-- Instructions -->
        <div class="mb-6">
          <h2 class="text-base font-semibold mb-2">Upload Your Cover Art</h2>
          <p class="text-steam-text-muted text-sm">
            Upload two versions of your game's cover art: one horizontal (for capsules, headers)
            and one vertical (for library display). You'll be able to adjust cropping for each asset.
          </p>
        </div>

        <!-- Upload Cards -->
        <div class="grid md:grid-cols-2 gap-4 mb-6">
          <div class="card p-4">
            <ImageUploader
              label="Horizontal Cover"
              description="For headers, capsules, and banners"
              orientation="horizontal"
              :image="store.state.horizontalSource"
              @upload="handleHorizontalUpload"
            />
          </div>

          <div class="card p-4">
            <ImageUploader
              label="Vertical Cover"
              description="For library and portrait displays"
              orientation="vertical"
              :image="store.state.verticalSource"
              @upload="handleVerticalUpload"
            />
          </div>
        </div>

        <!-- Split Mode Card -->
        <div class="card p-4 mb-6">
          <div class="flex items-start gap-3">
            <button
              @click="showSplitMode = !showSplitMode"
              class="flex-shrink-0 steam-checkbox mt-0.5"
              :class="{ 'checked': showSplitMode }"
            >
              <svg v-if="showSplitMode" class="w-4 h-4 text-steam-gold absolute top-0 left-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <div class="flex-1">
              <h3 class="font-semibold text-steam-text">Split Mode: Logo + Background (Optional)</h3>
              <p class="text-sm text-steam-text-muted mt-1">
                Upload your logo separately and background images without the logo.
                This lets you position the logo manually on each asset for perfect placement.
              </p>
            </div>
          </div>

          <div v-if="showSplitMode" class="mt-4 pl-7 space-y-4">
            <div>
              <h4 class="text-sm font-medium text-steam-text mb-2">Game Logo</h4>
              <ImageUploader
                label="Logo"
                description="Transparent PNG recommended"
                orientation="horizontal"
                :image="store.state.logoImage"
                @upload="handleLogoUpload"
              />
            </div>

            <div class="pt-3 border-t border-steam-shadow">
              <h4 class="text-sm font-medium text-steam-text mb-2">Backgrounds (without logo)</h4>
              <p class="text-xs text-steam-text-muted mb-3">
                Upload backgrounds without the logo. You can toggle between using these or the main cover art per asset in the editor.
              </p>
              <div class="grid md:grid-cols-2 gap-3">
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

        <!-- What You'll Create Card -->
        <div class="card-inset p-4">
          <h3 class="font-semibold text-steam-gold mb-3">What You'll Create</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p class="text-steam-text font-medium">Store Assets (4)</p>
              <ul class="text-steam-text-muted mt-1 space-y-0.5">
                <li>Header Capsule</li>
                <li>Small Capsule</li>
                <li>Main Capsule</li>
                <li>Vertical Capsule</li>
              </ul>
            </div>
            <div>
              <p class="text-steam-text font-medium">Library Assets (4)</p>
              <ul class="text-steam-text-muted mt-1 space-y-0.5">
                <li>Library Capsule</li>
                <li>Library Header</li>
                <li>Library Hero</li>
                <li>Library Logo</li>
              </ul>
            </div>
            <div>
              <p class="text-steam-text font-medium">Optional (6)</p>
              <ul class="text-steam-text-muted mt-1 space-y-0.5">
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

    <!-- Footer -->
    <footer class="flex-shrink-0 px-6 py-3 steam-border bg-steam-green">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <p class="text-sm text-steam-text-muted"></p>
        <button
          @click="proceedToEditor"
          :disabled="!canProceed"
          class="btn btn-primary"
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
