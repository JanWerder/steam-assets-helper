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
  <div class="h-full w-full flex flex-col">
    <header class="flex-shrink-0 h-14 px-4 border-b border-surface-800 flex items-center justify-between bg-surface-900">
      <div class="flex items-center gap-4">
        <button
          @click="goBack"
          class="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-800 text-surface-400 hover:text-surface-200 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-lg font-semibold text-surface-100">Steam Asset Creator</h1>
      </div>

      <div class="flex items-center gap-2 text-sm text-surface-400">
        <div
          class="w-2 h-2 rounded-full"
          :class="store.requiredAssetsComplete ? 'bg-green-500' : 'bg-yellow-500'"
        />
        <span>{{ requiredComplete }}/{{ store.requiredAssets.length }} required ready</span>
      </div>
    </header>

    <div class="flex-1 flex overflow-hidden">
      <aside class="w-64 flex-shrink-0 border-r border-surface-800 bg-surface-900 overflow-y-auto">
        <AssetList />
      </aside>

      <main class="flex-1 flex flex-col overflow-hidden">
        <AssetEditor ref="editorRef" />
      </main>

      <aside class="w-72 flex-shrink-0 border-l border-surface-800 bg-surface-900 overflow-y-auto">
        <div class="border-b border-surface-800">
          <ImageControls />
        </div>
        <ExportControls :get-stage="getStage" />
      </aside>
    </div>
  </div>
</template>
