import type { CropAnchor, CropResult } from '@/types'

export function useImageCrop() {
  function calculateCrop(
    sourceWidth: number,
    sourceHeight: number,
    targetWidth: number,
    targetHeight: number,
    anchor: CropAnchor = 'center-middle',
    scale: number = 1,
    offsetX: number = 0,
    offsetY: number = 0
  ): CropResult {
    const sourceAspect = sourceWidth / sourceHeight
    const targetAspect = targetWidth / targetHeight

    let cropWidth: number
    let cropHeight: number

    if (sourceAspect > targetAspect) {
      cropHeight = sourceHeight / scale
      cropWidth = cropHeight * targetAspect
    } else {
      cropWidth = sourceWidth / scale
      cropHeight = cropWidth / targetAspect
    }

    cropWidth = Math.min(cropWidth, sourceWidth)
    cropHeight = Math.min(cropHeight, sourceHeight)

    const maxX = Math.max(0, sourceWidth - cropWidth)
    const maxY = Math.max(0, sourceHeight - cropHeight)

    let cropX: number
    let cropY: number

    const [horizAnchor, vertAnchor] = anchor.split('-')

    switch (horizAnchor) {
      case 'left':
        cropX = 0
        break
      case 'right':
        cropX = maxX
        break
      default:
        cropX = maxX / 2
    }

    switch (vertAnchor) {
      case 'top':
        cropY = 0
        break
      case 'bottom':
        cropY = maxY
        break
      default:
        cropY = maxY / 2
    }

    cropX = Math.max(0, Math.min(maxX, cropX + offsetX))
    cropY = Math.max(0, Math.min(maxY, cropY + offsetY))

    return {
      cropX,
      cropY,
      cropWidth,
      cropHeight
    }
  }

  function getMaxOffset(
    sourceWidth: number,
    sourceHeight: number,
    targetWidth: number,
    targetHeight: number,
    scale: number = 1
  ) {
    const sourceAspect = sourceWidth / sourceHeight
    const targetAspect = targetWidth / targetHeight

    let cropWidth: number
    let cropHeight: number

    if (sourceAspect > targetAspect) {
      cropHeight = sourceHeight / scale
      cropWidth = cropHeight * targetAspect
    } else {
      cropWidth = sourceWidth / scale
      cropHeight = cropWidth / targetAspect
    }

    return {
      maxOffsetX: Math.max(0, (sourceWidth - cropWidth) / 2),
      maxOffsetY: Math.max(0, (sourceHeight - cropHeight) / 2)
    }
  }

  return {
    calculateCrop,
    getMaxOffset
  }
}
