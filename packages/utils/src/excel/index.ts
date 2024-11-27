import * as XLSX from 'xlsx'

const RANGE_KEY = '!ref' // sheet范围key，没有内容的sheet没有!ref属性

type SheetTable<T = unknown> = { columns: string[], data: T[] }[]

export async function parseExcel<T = unknown>(file: File): Promise<SheetTable<T>> {
  try {
    const arrayBuffer = await readFile(file)
    if (checkExcelFile(file.name) === false) {
      return []
    }
    return formatExcelJsonToTableData<T>(arrayBuffer)
  }
  catch (error) {
    console.error('Error parsing Excel file:', error)
    throw error
  }
}

/**
 * 将 file 转为一个 ArrayBuffer 对象
 * @param {File} file
 * @returns Promise<ArrayBuffer>
 */
function readFile(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    if (file instanceof File) {
      const reader = new FileReader()

      reader.onloadend = () => {
        const arrayBuffer = reader.result as ArrayBuffer
        resolve(arrayBuffer)
      }
      reader.readAsArrayBuffer(file)
    }
    else {
      reject(new Error('入参不是 File 类型'))
    }
  })
}

/**
 * 将ArrayBuffer 数据对象处理为字符串
 * @param data ArrayBuffer 数据
 */
function fixData(data: ArrayBuffer): string {
  let str = ''
  const w = 10240
  for (let l = 0; l < data.byteLength / w; ++l) {
    str += String.fromCharCode.apply(
      null,
      [...new Uint8Array(data.slice(l * w, l * w + w))],
    )
  }
  str += String.fromCharCode.apply(null, [...new Uint8Array(data.slice(data.byteLength - data.byteLength % w))])
  return str
}

function formatExcelJsonToTableData<T = unknown>(data: ArrayBuffer): SheetTable<T> {
  const fixedData = fixData(data)
  const workbook = XLSX.read(btoa(fixedData), { type: 'base64' })

  const sheetNames = workbook.SheetNames
  const sheetTable: SheetTable<T> = []

  sheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName]
    if (RANGE_KEY in worksheet) {
      Object.keys(worksheet).forEach((key) => {
        // eslint-disable-next-line regexp/no-unused-capturing-group
        const regexp = /^[+-]?\d+(\.\d+)?e[+-]?\d+$/i // 匹配科学计数法

        if (worksheet[key].t === 'd' || worksheet[key].t === 'n' && String(worksheet[key].v).trim() !== worksheet[key].w.trim() && !regexp.test(worksheet[key].w.trim())) {
          const formattedV = Number(worksheet[key].v).toFixed(8)
          const formattedW = Number.parseFloat(worksheet[key].w).toFixed(8)
          // 修复小数位数不一致的问题
          if (formattedV !== formattedW) {
            worksheet[key].v = parseDate(worksheet[key].v)
          }
        }
      })

      // 解析合并单元格信息
      const merges = worksheet['!merges'] || []

      merges.forEach((merge) => {
        const { s, e } = merge // s: start, e: end
        const startCell = XLSX.utils.encode_cell(s)
        const cellValue = worksheet[startCell].v

        for (let row = s.r; row <= e.r; row++) {
          for (let col = s.c; col <= e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col })
            worksheet[cellAddress] = { v: cellValue }
          }
        }
      })

      const columns = getHeaderRow(worksheet) || []
      let data = XLSX.utils.sheet_to_json<T>(worksheet, { header: 1, defval: null, range: 1 }) || []

      // 过滤全是null的行
      data = data.filter(row => (row as unknown[]).some(cell => cell !== null))

      sheetTable.push({
        columns,
        data,
      })
    }
  })

  return sheetTable
}

// 解析excel的日期时间
function parseDate(dateCode: number): number {
  const { y, m, d, H, M, S } = XLSX.SSF.parse_date_code(dateCode)
  return new Date(`${y}/${m}/${d} ${H}:${M}:${S}`).getTime()
}

/**
 * 获取头部项
 * @param sheet worksheet数据
 * @return {Array}
 */
function getHeaderRow(sheet: XLSX.WorkSheet): string[] {
  const headers: string[] = []
  const range = XLSX.utils.decode_range(sheet[RANGE_KEY] as string)
  const R = range.s.r // 第一行

  // 获取合并单元格信息
  const merges = sheet['!merges'] || []
  const mergeCells = new Map<number, { value: string, span: number }>()

  // 预处理合并单元格
  merges.forEach((merge) => {
    if (merge.s.r === R) { // 只处理第一行的合并单元格
      const startCell = XLSX.utils.encode_cell(merge.s)
      const cell = sheet[startCell]
      if (cell && cell.v) {
        // 只在起始列记录合并信息
        mergeCells.set(merge.s.c, {
          value: cell.v,
          span: merge.e.c - merge.s.c + 1,
        })
      }
    }
  })

  // 获取表头
  for (let C = range.s.c; C <= range.e.c; ++C) {
    // 检查是否是合并单元格的起始列
    if (mergeCells.has(C)) {
      const { value, span } = mergeCells.get(C)!
      headers.push(value)
      // 跳过后续的合并列
      C += span - 1
      continue
    }

    // 处理非合并单元格
    const cellAddress = XLSX.utils.encode_cell({ c: C, r: R })
    const cell = sheet[cellAddress]
    if (cell && cell.t) {
      headers.push(XLSX.utils.format_cell(cell))
    }
    else {
      headers.push('') // 空单元格填充空字符串
    }
  }

  return headers
}

/**
 * 根据文件名判断是否为excel文件
 * @param filename 文件名
 * @return {boolean} true: 为excel文件 false: 不为excel文件
 */
function checkExcelFile(filename: string) {
  if (!filename)
    return false
  const suffix = filename.substr(filename.lastIndexOf('.'))
  return suffix === '.xls' || suffix === '.xlsx'
}
