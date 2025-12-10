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
    <!-- Header -->
    <div class="px-3 py-2 steam-border-inset bg-steam-green-dark">
      <h2 class="font-semibold text-steam-gold text-sm">Assets</h2>
      <p class="text-xs text-steam-text-muted mt-0.5">
        {{ requiredComplete }}/{{ store.requiredAssets.length }} required complete
      </p>
    </div>

    <!-- Asset List -->
    <div class="flex-1 overflow-y-auto py-1">
      <div class="px-1">
        <!-- Store Assets Section -->
        <div class="mb-1">
          <h3 class="px-2 py-1 text-xs font-semibold text-steam-highlight uppercase tracking-wider">
            Store Assets
          </h3>
          <div class="space-y-0.5">
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
        <div class="mb-1">
          <h3 class="px-2 py-1 text-xs font-semibold text-steam-highlight uppercase tracking-wider">
            Library Assets
          </h3>
          <div class="space-y-0.5">
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
        <div class="pt-1 border-t border-steam-shadow">
          <h3 class="px-2 py-1 text-xs font-semibold text-steam-highlight uppercase tracking-wider">
            Optional
          </h3>
          <div class="space-y-0.5">
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
