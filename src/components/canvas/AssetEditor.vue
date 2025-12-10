<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import type { KonvaStageRef } from '@/types'
import { useAssetStore } from '@/composables/useAssetStore'
import { useImageCrop } from '@/composables/useImageCrop'
import { useCanvasZoom } from '@/composables/useCanvasZoom'
import CanvasToolbar from './CanvasToolbar.vue'

const containerRef = ref<HTMLDivElement | null>(null)
const stageRef = ref<KonvaStageRef | null>(null)
const logoRef = ref<any>(null)
const transformerRef = ref<any>(null)
const containerSize = ref({ width: 800, height: 600 })

const store = useAssetStore()
const { calculateCrop, getMaxOffset } = useImageCrop()
const { scale, position, handleWheel, resetView, zoomIn, zoomOut, fitToContainer } = useCanvasZoom(stageRef as any)

const isDragging = ref(false)
const isDraggingLogo = ref(false)
const dragStart = ref({ x: 0, y: 0 })

const stageConfig = computed(() => ({
  width: containerSize.value.width,
  height: containerSize.value.height,
  draggable: false
}))

const currentAsset = computed(() => store.currentAsset.value)
const currentState = computed(() => store.currentAssetState.value)
const sourceImage = computed(() => store.currentSourceImage.value)

const imageConfig = computed(() => {
  const asset = currentAsset.value
  const state = currentState.value
  const source = sourceImage.value
  if (!asset || !source || !state) {
    return null
  }

  const crop = calculateCrop(
    source.width,
    source.height,
    asset.width,
    asset.height,
    state.anchor,
    state.scale,
    state.offsetX,
    state.offsetY
  )

  return {
    image: source.element,
    x: 0,
    y: 0,
    width: asset.width,
    height: asset.height,
    crop: {
      x: crop.cropX,
      y: crop.cropY,
      width: crop.cropWidth,
      height: crop.cropHeight
    }
  }
})

const safeZoneConfig = computed(() => {
  const asset = currentAsset.value
  if (!asset?.safeZone) return null

  const safeWidth = asset.safeZone.width
  const safeHeight = asset.safeZone.height
  const safeX = (asset.width - safeWidth) / 2
  const safeY = (asset.height - safeHeight) / 2

  return {
    x: safeX,
    y: safeY,
    width: safeWidth,
    height: safeHeight,
    stroke: '#c4b550',
    strokeWidth: 2,
    dash: [10, 5],
    listening: false
  }
})

const borderConfig = computed(() => {
  const asset = currentAsset.value
  if (!asset) return null
  return {
    x: 0,
    y: 0,
    width: asset.width,
    height: asset.height,
    stroke: '#899281',
    strokeWidth: 1,
    listening: false
  }
})

const showLogo = computed(() => {
  const state = currentState.value
  return state?.useSplitMode && store.state.logoImage !== null
})

const logoConfig = computed(() => {
  const logo = store.state.logoImage
  const state = currentState.value
  const asset = currentAsset.value
  if (!logo || !state || !asset) return null

  const logoScale = state.logoScale
  const width = logo.width * logoScale
  const height = logo.height * logoScale

  return {
    image: logo.element,
    x: state.logoPosition.x,
    y: state.logoPosition.y,
    width,
    height,
    draggable: true,
    name: 'logo'
  }
})

function handleLogoDragStart() {
  isDraggingLogo.value = true
}

function handleLogoDragEnd(e: any) {
  isDraggingLogo.value = false
  const asset = currentAsset.value
  if (!asset) return
  store.updateAssetState(asset.id, {
    logoPosition: {
      x: e.target.x(),
      y: e.target.y()
    }
  })
}

function handleLogoTransformEnd(e: any) {
  const asset = currentAsset.value
  const logo = store.state.logoImage
  if (!asset || !logo) return

  const node = e.target
  const scaleX = node.scaleX()
  const newLogoScale = (node.width() * scaleX) / logo.width

  node.scaleX(1)
  node.scaleY(1)

  store.updateAssetState(asset.id, {
    logoPosition: {
      x: node.x(),
      y: node.y()
    },
    logoScale: newLogoScale,
    logoRotation: node.rotation()
  })
}

function attachTransformer() {
  if (transformerRef.value && logoRef.value) {
    const transformer = transformerRef.value.getNode()
    const logo = logoRef.value.getNode()
    if (transformer && logo) {
      transformer.nodes([logo])
      transformer.getLayer()?.batchDraw()
    }
  }
}

watch(showLogo, (show) => {
  if (show) {
    nextTick(() => {
      setTimeout(attachTransformer, 50)
    })
  }
})

function handleStageMouseDown(e: any) {
  const clickedOnEmpty = e.target === e.target.getStage()
  const clickedOnBackground = e.target.name() !== 'logo' && !e.target.getParent()?.className?.includes('Transformer')

  if (clickedOnEmpty || (clickedOnBackground && !e.target.name())) {
    isDragging.value = true
    dragStart.value = {
      x: e.evt.clientX,
      y: e.evt.clientY
    }
  }
}

function handleContainerMouseDown(e: MouseEvent) {
  if (isDraggingLogo.value) return
  const target = e.target as HTMLElement
  if (target.tagName !== 'CANVAS') {
    isDragging.value = false
  }
}

function handleContainerMouseMove(e: MouseEvent) {
  const asset = currentAsset.value
  const state = currentState.value
  const source = sourceImage.value
  if (!isDragging.value || !asset || !state || !source) return

  const dx = (e.clientX - dragStart.value.x) / scale.value
  const dy = (e.clientY - dragStart.value.y) / scale.value

  const { maxOffsetX, maxOffsetY } = getMaxOffset(
    source.width,
    source.height,
    asset.width,
    asset.height,
    state.scale
  )

  const newOffsetX = Math.max(-maxOffsetX, Math.min(maxOffsetX, state.offsetX - dx))
  const newOffsetY = Math.max(-maxOffsetY, Math.min(maxOffsetY, state.offsetY - dy))

  store.updateAssetState(asset.id, {
    offsetX: newOffsetX,
    offsetY: newOffsetY
  })

  dragStart.value = {
    x: e.clientX,
    y: e.clientY
  }
}

function handleContainerMouseUp() {
  isDragging.value = false
}

function handleFitToScreen() {
  const asset = currentAsset.value
  if (!asset) return
  fitToContainer(
    containerSize.value.width,
    containerSize.value.height,
    asset.width,
    asset.height
  )
}

function updateContainerSize() {
  if (containerRef.value) {
    containerSize.value = {
      width: containerRef.value.clientWidth,
      height: containerRef.value.clientHeight
    }
  }
}

watch(currentAsset, () => {
  resetView()
  setTimeout(handleFitToScreen, 50)
})

onMounted(() => {
  updateContainerSize()
  window.addEventListener('resize', updateContainerSize)
  setTimeout(handleFitToScreen, 100)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateContainerSize)
})

defineExpose({
  stageRef
})
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Header Bar -->
    <div class="flex-shrink-0 px-3 py-2 steam-border-inset bg-steam-green-dark flex items-center justify-between">
      <div v-if="currentAsset">
        <h2 class="font-semibold text-steam-gold text-sm">{{ currentAsset.name }}</h2>
        <p class="text-xs text-steam-text-muted">
          {{ currentAsset.width }} × {{ currentAsset.height }} &middot; {{ currentAsset.description }}
        </p>
      </div>
      <div v-else class="text-steam-text-muted text-sm">Select an asset to edit</div>

      <CanvasToolbar
        :scale="scale"
        @zoom-in="zoomIn"
        @zoom-out="zoomOut"
        @reset-view="resetView"
        @fit-to-screen="handleFitToScreen"
      />
    </div>

    <!-- Canvas Area -->
    <div
      ref="containerRef"
      class="flex-1 overflow-hidden bg-steam-green-darker relative select-none"
      :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
      @mousedown="handleContainerMouseDown"
      @mousemove="handleContainerMouseMove"
      @mouseup="handleContainerMouseUp"
      @mouseleave="handleContainerMouseUp"
    >
      <!-- Checker Pattern Background -->
      <div
        class="absolute inset-0 pointer-events-none"
        style="background-image: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22><rect width=%2220%22 height=%2220%22 fill=%22%23292d23%22/><rect width=%2210%22 height=%2210%22 fill=%22%233e4637%22/><rect x=%2210%22 y=%2210%22 width=%2210%22 height=%2210%22 fill=%22%233e4637%22/></svg>');"
      />

      <!-- Konva Stage -->
      <v-stage
        v-if="currentAsset && sourceImage"
        ref="stageRef"
        :config="stageConfig"
        @wheel="handleWheel"
        @mousedown="handleStageMouseDown"
      >
        <v-layer>
          <v-group :config="{ x: position.x, y: position.y, scaleX: scale, scaleY: scale }">
            <v-image v-if="imageConfig" :config="imageConfig" />
            <v-image
              v-if="showLogo && logoConfig"
              ref="logoRef"
              :config="logoConfig"
              @dragstart="handleLogoDragStart"
              @dragend="handleLogoDragEnd"
              @transformend="handleLogoTransformEnd"
            />
            <v-transformer
              v-if="showLogo"
              ref="transformerRef"
              :config="{
                enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
                rotateEnabled: true,
                keepRatio: true,
                boundBoxFunc: (_oldBox: any, newBox: any) => newBox
              }"
            />
            <v-rect v-if="safeZoneConfig" :config="safeZoneConfig" />
            <v-rect v-if="borderConfig" :config="borderConfig" />
          </v-group>
        </v-layer>
      </v-stage>

      <!-- Empty State -->
      <div
        v-else
        class="absolute inset-0 flex items-center justify-center"
      >
        <p class="text-steam-text-muted">Select an asset from the sidebar</p>
      </div>
    </div>
  </div>
</template>
