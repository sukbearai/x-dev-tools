/* eslint-disable ts/no-use-before-define */
import type { Ref } from 'vue'
import jsPDF from 'jspdf'
import { ref } from 'vue'

interface PDFOptions {
  filename?: string
  download?: boolean
  callback?: (doc: jsPDF) => void
}

interface HTMLToPDFConfig {
  margin?: [number, number, number, number]
  image?: {
    quality: number
    type: string
  }
  width?: number
  windowWidth?: number
}

export function useHTMLToPDF(defaultConfig?: HTMLToPDFConfig) {
  const doc: Ref<jsPDF | null> = ref(null)
  const cacheDoc: Ref<jsPDF | null> = ref(null)

  // 初始化 PDF 实例
  // eslint-disable-next-line new-cap
  doc.value = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
    floatPrecision: 4,
    compress: true,
  })

  // PDF 基础配置
  const baseConfig = {
    margin: [10, 10, 10, 10],
    image: { quality: 0.9, type: 'jpeg' },
    autoPaging: 'text',
    x: 0,
    y: 0,
    width: 190,
    windowWidth: 1000,
    fontFaces: [
      {
        family: 'AlimamaDongFangDaKai-Regular',
        weight: 'normal',
        src: [{
          url: 'https://dcyweb.oss-cn-qingdao.aliyuncs.com/tinymce/AlimamaDongFangDaKai-Regular.ttf',
          format: 'truetype',
        }],
      },
    ],
    html2canvas: {
      onclone: (document: Document) => {
        document.documentElement.classList.add('exportToPDF')
      },
    },
  }

  // 生成 PDF
  const generatePDF = async (html: HTMLElement, options?: PDFOptions) => {
    if (cacheDoc.value) {
      handlePDFOutput(cacheDoc.value, options)
      return cacheDoc.value
    }

    const config = { ...baseConfig, ...defaultConfig }
    return doc.value!.html(html, {
      ...config,
      callback: (resultDoc: jsPDF) => {
        cacheDoc.value = resultDoc
        handlePDFOutput(resultDoc, options)
      },
    } as any)
  }

  // 处理 PDF 输出
  const handlePDFOutput = (pdfDoc: jsPDF, options?: PDFOptions) => {
    const { filename = 'document', download, callback } = options || {}

    if (download)
      pdfDoc.save(`${filename}.pdf`)

    if (callback)
      callback(pdfDoc)
  }

  // 导出 PDF
  const exportToPdf = (html: HTMLElement, options?: PDFOptions) => {
    return generatePDF(html, { ...options, download: true })
  }

  // 预览 PDF
  const previewInWindow = async (html: HTMLElement, options?: PDFOptions) => {
    const pdfDoc = await generatePDF(html, options)
    const blob = pdfDoc.output('blob')
    window.open(URL.createObjectURL(blob), '_blank')
    return pdfDoc
  }

  // 清除缓存
  const clearCache = () => {
    cacheDoc.value = null
  }

  return {
    exportToPdf,
    previewInWindow,
    clearCache,
  }
}
