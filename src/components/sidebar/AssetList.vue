<script setup lang="ts">
import { computed } from 'vue'
import { useAssetStore } from '@/composables/useAssetStore'
import AssetListItem from './AssetListItem.vue'

const store = useAssetStore()

const requiredComplete = computed(() => {
  return store.requiredAssets.filter(a => store.state.assetStates[a.id]?.isComplete).length
})

function handleSelect(assetId: string) {
  store.selectAsset(assetId)
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="px-4 py-3 border-b border-surface-800">
      <h2 class="font-semibold text-surface-200">Assets</h2>
      <p class="text-xs text-surface-500 mt-0.5">
        {{ requiredComplete }}/{{ store.requiredAssets.length }} required complete
      </p>
    </div>

    <div class="flex-1 overflow-y-auto py-2">
      <div class="px-2">
        <!-- Store Assets Section -->
        <div class="mb-2">
          <h3 class="px-2 py-1.5 text-xs font-semibold text-surface-500 uppercase tracking-wider">
            Store Assets
          </h3>
          <div class="space-y-1">
            <AssetListItem
              v-for="asset in store.storeAssets"
              :key="asset.id"
              :asset="asset"
              :state="store.state.assetStates[asset.id]"
              :source-image="store.getSourceForAsset(asset)"
              :is-selected="store.state.currentAssetId === asset.id"
              @select="handleSelect(asset.id)"
            />
          </div>
        </div>

        <!-- Library Assets Section -->
        <div class="mb-2">
          <h3 class="px-2 py-1.5 text-xs font-semibold text-surface-500 uppercase tracking-wider">
            Library Assets
          </h3>
          <div class="space-y-1">
            <AssetListItem
              v-for="asset in store.libraryAssets"
              :key="asset.id"
              :asset="asset"
              :state="store.state.assetStates[asset.id]"
              :source-image="store.getSourceForAsset(asset)"
              :is-selected="store.state.currentAssetId === asset.id"
              @select="handleSelect(asset.id)"
            />
          </div>
        </div>

        <!-- Optional Assets Section -->
        <div class="pt-2 border-t border-surface-700">
          <h3 class="px-2 py-1.5 text-xs font-semibold text-surface-500 uppercase tracking-wider">
            Optional
          </h3>
          <div class="space-y-1">
            <AssetListItem
              v-for="asset in store.optionalAssets"
              :key="asset.id"
              :asset="asset"
              :state="store.state.assetStates[asset.id]"
              :source-image="store.getSourceForAsset(asset)"
              :is-selected="store.state.currentAssetId === asset.id"
              @select="handleSelect(asset.id)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
