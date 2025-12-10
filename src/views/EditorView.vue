<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type Konva from 'konva'
import { useAssetStore } from '@/composables/useAssetStore'
import AssetList from '@/components/sidebar/AssetList.vue'
import AssetEditor from '@/components/canvas/AssetEditor.vue'
import ImageControls from '@/components/controls/ImageControls.vue'
import ExportControls from '@/components/controls/ExportControls.vue'

const router = useRouter()
const store = useAssetStore()
const editorRef = ref<InstanceType<typeof AssetEditor> | null>(null)

const requiredComplete = computed(() => {
  return store.requiredAssets.filter(a => store.state.assetStates[a.id]?.isComplete).length
})

function getStage(): Konva.Stage | null {
  return editorRef.value?.stageRef?.getStage() || null
}

function goBack() {
  router.push('/')
}

onMounted(() => {
  if (!store.state.setupComplete) {
    router.push('/')
  }
})
</script>

<template>
  <div class="h-full w-full flex flex-col bg-steam-green-dark">
    <!-- Header -->
    <header class="flex-shrink-0 h-12 px-4 steam-border bg-steam-green flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button
          @click="goBack"
          class="btn h-7 min-w-0 px-2"
          title="Back to Setup"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-sm font-bold tracking-wider text-steam-gold">Steam Asset Creator</h1>
      </div>

      <div class="flex items-center gap-2 text-xs text-steam-text-muted">
        <div
          class="w-2 h-2"
          :class="store.requiredAssetsComplete ? 'bg-steam-gold' : 'bg-steam-highlight'"
        />
        <span>{{ requiredComplete }}/{{ store.requiredAssets.length }} required ready</span>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left Sidebar - Asset List -->
      <aside class="w-56 flex-shrink-0 steam-border bg-steam-green overflow-y-auto">
        <AssetList />
      </aside>

      <!-- Center - Canvas Editor -->
      <main class="flex-1 flex flex-col overflow-hidden">
        <AssetEditor ref="editorRef" />
      </main>

      <!-- Right Sidebar - Controls -->
      <aside class="w-64 flex-shrink-0 steam-border bg-steam-green overflow-y-auto">
        <div class="steam-border-inset">
          <ImageControls />
        </div>
        <ExportControls :get-stage="getStage" />
      </aside>
    </div>
  </div>
</template>
