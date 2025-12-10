export type AssetOrientation = 'horizontal' | 'vertical' | 'square'
export type AssetCategory = 'capsule' | 'library' | 'icon' | 'event' | 'other'
export type CropAnchor =
  | 'left-top' | 'center-top' | 'right-top'
  | 'left-middle' | 'center-middle' | 'right-middle'
  | 'left-bottom' | 'center-bottom' | 'right-bottom'

export interface SafeZone {
  width: number
  height: number
}

export interface AssetDefinition {
  id: string
  name: string
  width: number
  height: number
  orientation: AssetOrientation
  required: boolean
  category: AssetCategory
  safeZone?: SafeZone
  description: string
}

export interface SourceImage {
  element: HTMLImageElement
  width: number
  height: number
  dataUrl: string
  filename: string
}

export interface LogoPosition {
  x: number
  y: number
}

export interface AssetState {
  scale: number
  offsetX: number
  offsetY: number
  anchor: CropAnchor
  logoPosition: LogoPosition
  logoScale: number
  logoRotation: number
  useSplitMode: boolean
  isComplete: boolean
}

export interface CropResult {
  cropX: number
  cropY: number
  cropWidth: number
  cropHeight: number
}
