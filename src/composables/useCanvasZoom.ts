import { ref, type Ref } from 'vue'
import type Konva from 'konva'
import type { KonvaStageRef } from '@/types'

const MIN_SCALE = 0.1
const MAX_SCALE = 5
const SCALE_BY = 1.1

export function useCanvasZoom(stageRef: Ref<KonvaStageRef | null>) {
  const scale = ref(1)
  const position = ref({ x: 0, y: 0 })

  function handleWheel(e: Konva.KonvaEventObject<WheelEvent>) {
    e.evt.preventDefault()

    const stage = stageRef.value?.getStage()
    if (!stage) return

    const oldScale = scale.value
    const pointer = stage.getPointerPosition()
    if (!pointer) return

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    }

    const direction = e.evt.deltaY > 0 ? -1 : 1
    const newScale = direction > 0
      ? oldScale * SCALE_BY
      : oldScale / SCALE_BY

    scale.value = Math.min(MAX_SCALE, Math.max(MIN_SCALE, newScale))

    const newPos = {
      x: pointer.x - mousePointTo.x * scale.value,
      y: pointer.y - mousePointTo.y * scale.value,
    }

    position.value = newPos
  }

  function resetView() {
    scale.value = 1
    position.value = { x: 0, y: 0 }
  }

  function zoomIn() {
    scale.value = Math.min(MAX_SCALE, scale.value * SCALE_BY)
  }

  function zoomOut() {
    scale.value = Math.max(MIN_SCALE, scale.value / SCALE_BY)
  }

  function fitToContainer(containerWidth: number, containerHeight: number, assetWidth: number, assetHeight: number) {
    const scaleX = containerWidth / assetWidth
    const scaleY = containerHeight / assetHeight
    const newScale = Math.min(scaleX, scaleY) * 0.9

    scale.value = Math.min(MAX_SCALE, Math.max(MIN_SCALE, newScale))
    position.value = {
      x: (containerWidth - assetWidth * scale.value) / 2,
      y: (containerHeight - assetHeight * scale.value) / 2
    }
  }

  return {
    scale,
    position,
    handleWheel,
    resetView,
    zoomIn,
    zoomOut,
    fitToContainer
  }
}
