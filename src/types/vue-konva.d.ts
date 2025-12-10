import type { Stage } from 'konva/lib/Stage'
import type { Layer } from 'konva/lib/Layer'
import type { Image as KonvaImage } from 'konva/lib/shapes/Image'
import type { Transformer } from 'konva/lib/shapes/Transformer'

declare module 'vue-konva'

export interface KonvaStageRef {
  getStage(): Stage
}

export interface KonvaLayerRef {
  getNode(): Layer
}

export interface KonvaImageRef {
  getNode(): KonvaImage
}

export interface KonvaTransformerRef {
  getNode(): Transformer
}
