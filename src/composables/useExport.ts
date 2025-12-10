import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import type Konva from 'konva'

export function useExport() {
  async function exportAsPng(
    stage: Konva.Stage,
    targetWidth: number,
    targetHeight: number
  ): Promise<string> {
    const oldScale = stage.scale()
    const oldPosition = stage.position()

    stage.scale({ x: 1, y: 1 })
    stage.position({ x: 0, y: 0 })
    stage.batchDraw()

    const dataUrl = stage.toDataURL({
      mimeType: 'image/png',
      quality: 1,
      pixelRatio: 1,
      x: 0,
      y: 0,
      width: targetWidth,
      height: targetHeight
    })

    stage.scale(oldScale)
    stage.position(oldPosition)
    stage.batchDraw()

    return dataUrl
  }

  function downloadPng(dataUrl: string, filename: string) {
    const link = document.createElement('a')
    link.download = `${filename}.png`
    link.href = dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  async function exportAllAsZip(
    exports: Array<{ dataUrl: string; filename: string }>
  ) {
    const zip = new JSZip()

    for (const { dataUrl, filename } of exports) {
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '')
      zip.file(`${filename}.png`, base64Data, { base64: true })
    }

    const blob = await zip.generateAsync({ type: 'blob' })
    saveAs(blob, 'steam-assets.zip')
  }

  function dataUrlToBlob(dataUrl: string): Blob {
    const arr = dataUrl.split(',')
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png'
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
  }

  return {
    exportAsPng,
    downloadPng,
    exportAllAsZip,
    dataUrlToBlob
  }
}
