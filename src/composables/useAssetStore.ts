import { reactive, computed } from 'vue'
import type { AssetDefinition, SourceImage, AssetState } from '@/types'
import { ASSET_DEFINITIONS, REQUIRED_ASSETS, OPTIONAL_ASSETS, STORE_ASSETS, LIBRARY_ASSETS } from '@/constants/assetDefinitions'

interface AssetStoreState {
  horizontalSource: SourceImage | null
  verticalSource: SourceImage | null
  logoImage: SourceImage | null
  horizontalBackground: SourceImage | null
  verticalBackground: SourceImage | null
  useSplitMode: boolean
  currentAssetId: string | null
  assetStates: Record<string, AssetState>
  setupComplete: boolean
}

function createDefaultAssetState(asset?: AssetDefinition): AssetState {
  return {
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    anchor: 'center-middle',
    logoPosition: { x: asset ? asset.width / 4 : 0, y: asset ? asset.height / 4 : 0 },
    logoScale: 0.5,
    logoRotation: 0,
    useSplitMode: false,
    isComplete: false
  }
}

const state = reactive<AssetStoreState>({
  horizontalSource: null,
  verticalSource: null,
  logoImage: null,
  horizontalBackground: null,
  verticalBackground: null,
  useSplitMode: false,
  currentAssetId: null,
  assetStates: {},
  setupComplete: false
})

export function useAssetStore() {
  const currentAsset = computed((): AssetDefinition | null => {
    if (!state.currentAssetId) return null
    return ASSET_DEFINITIONS.find(a => a.id === state.currentAssetId) || null
  })

  const currentAssetState = computed((): AssetState | null => {
    if (!state.currentAssetId) return null
    return state.assetStates[state.currentAssetId] || null
  })

  const currentSourceImage = computed((): SourceImage | null => {
    const asset = currentAsset.value
    if (!asset) return null
    const assetState = state.assetStates[asset.id]

    if (assetState?.useSplitMode && state.useSplitMode) {
      return asset.orientation === 'vertical'
        ? state.verticalBackground
        : state.horizontalBackground
    }
    return asset.orientation === 'vertical' ? state.verticalSource : state.horizontalSource
  })

  const completedCount = computed(() => {
    return Object.values(state.assetStates).filter(s => s.isComplete).length
  })

  const requiredAssetsComplete = computed(() => {
    return REQUIRED_ASSETS.every(asset => state.assetStates[asset.id]?.isComplete)
  })

  const canProceedToEditor = computed(() => {
    return state.horizontalSource !== null && state.verticalSource !== null
  })

  function setSourceImage(type: 'horizontal' | 'vertical', image: SourceImage) {
    if (type === 'horizontal') {
      state.horizontalSource = image
    } else {
      state.verticalSource = image
    }
  }

  function setLogoImage(image: SourceImage | null) {
    state.logoImage = image
  }

  function setBackgroundImage(type: 'horizontal' | 'vertical', image: SourceImage | null) {
    if (type === 'horizontal') {
      state.horizontalBackground = image
    } else {
      state.verticalBackground = image
    }
  }

  function toggleSplitMode(enabled: boolean) {
    state.useSplitMode = enabled
  }

  function initializeAssetStates() {
    ASSET_DEFINITIONS.forEach(asset => {
      if (!state.assetStates[asset.id]) {
        state.assetStates[asset.id] = createDefaultAssetState(asset)
      }
    })
  }

  function selectAsset(assetId: string) {
    state.currentAssetId = assetId
    const asset = ASSET_DEFINITIONS.find(a => a.id === assetId)
    if (!state.assetStates[assetId]) {
      state.assetStates[assetId] = createDefaultAssetState(asset)
    }
  }

  function updateAssetState(assetId: string, updates: Partial<AssetState>) {
    const asset = ASSET_DEFINITIONS.find(a => a.id === assetId)
    if (!state.assetStates[assetId]) {
      state.assetStates[assetId] = createDefaultAssetState(asset)
    }
    Object.assign(state.assetStates[assetId], updates)
  }

  function resetAssetState(assetId: string) {
    const asset = ASSET_DEFINITIONS.find(a => a.id === assetId)
    state.assetStates[assetId] = createDefaultAssetState(asset)
  }

  function markAssetComplete(assetId: string, complete: boolean = true) {
    updateAssetState(assetId, { isComplete: complete })
  }

  function completeSetup() {
    initializeAssetStates()
    state.setupComplete = true
    if (REQUIRED_ASSETS.length > 0) {
      selectAsset(REQUIRED_ASSETS[0].id)
    }
  }

  function getSourceForAsset(asset: AssetDefinition, assetState?: AssetState | null): SourceImage | null {
    if (assetState?.useSplitMode && state.useSplitMode) {
      return asset.orientation === 'vertical'
        ? state.verticalBackground
        : state.horizontalBackground
    }
    return asset.orientation === 'vertical' ? state.verticalSource : state.horizontalSource
  }

  return {
    state,
    currentAsset,
    currentAssetState,
    currentSourceImage,
    completedCount,
    requiredAssetsComplete,
    canProceedToEditor,
    requiredAssets: REQUIRED_ASSETS,
    optionalAssets: OPTIONAL_ASSETS,
    storeAssets: STORE_ASSETS,
    libraryAssets: LIBRARY_ASSETS,
    allAssets: ASSET_DEFINITIONS,
    setSourceImage,
    setLogoImage,
    setBackgroundImage,
    toggleSplitMode,
    initializeAssetStates,
    selectAsset,
    updateAssetState,
    resetAssetState,
    markAssetComplete,
    completeSetup,
    getSourceForAsset
  }
}
