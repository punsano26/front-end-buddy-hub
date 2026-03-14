export interface IValidate {
  required (val: any, _name?: string): boolean | string
  requiredImage (val: any): boolean | string
  email(val: any): boolean | string
  emailOptional(val: any): boolean | string
  lowercaseEnglish(val: any): boolean | string
  confirmPassword (val: string, password: string): boolean | string
  duplicatePassword (val: string, password: string): boolean | string
  length (val: any, length: number): boolean | string
  minLength (val: any, length: number): boolean | string
  maxLength (val: any, length: number): boolean | string
  between (val: any, min: number, max: number): boolean | string
  valueBetween (val: any, min: number, max: number): boolean | string
  atLeast (val: any, length: number): boolean | string
  numWithDecimal (val: any): boolean | string
  numOnly (val: any): boolean | string
  maxValue (val: any, max: number): boolean | string
  minValue (val: any, min: number): boolean | string
}

const emailRegex = /^[\w.-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*(?:\.[a-zA-Z]{2,})$/

export const validate: IValidate = {
  required: (val: any, _name?: string): boolean | string => {
    const hasValue = !!val || val?.length || val === 0
    if (hasValue) return true
    return 'กรุณากรอกข้อมูล'
  },
  requiredImage: (val: any): boolean | string => {
    if (val) return true
    return 'กรุณาอัปโหลดรูปภาพ'
  },
  email: (val: any): boolean | string => emailRegex.test(val) || 'รูปแบบอีเมลไม่ถูกต้อง',
  emailOptional: (val: any): boolean | string => !val || emailRegex.test(val) || 'รูปแบบอีเมลไม่ถูกต้อง',
  lowercaseEnglish: (val: any): boolean | string => {
    if (!val) return true
    return (/^[a-z0-9@._-]+$/).test(String(val)) || 'กรุณากรอกเป็นภาษาอังกฤษตัวพิมพ์เล็กเท่านั้น'
  },
  confirmPassword: (val: string, password: string): boolean | string => val === password || 'รหัสผ่านไม่ตรงกัน',
  duplicatePassword: (val: string, password: string): boolean | string => val !== password || 'รหัสผ่านไม่ถูกต้อง',
  length: (val: any, length: number): boolean | string => {
    const isValid = !!val && val.length === length
    return isValid || `กรุณากรอกข้อมูล ${length} ตัวอักษร`
  },
  minLength: (val: any, length: number): boolean | string => {
    const isValid = !!val && val.length >= length
    return isValid || `กรุณากรอกข้อมูลอย่างน้อย ${length} ตัวอักษร`
  },
  maxLength: (val: any, length: number): boolean | string => {
    const isValid = !!val && val.length <= length
    return isValid || `กรุณากรอกข้อมูลไม่เกิน ${length} ตัวอักษร`
  },
  between: (val: any, min: number, max: number): boolean | string => {
    const isValid = !!val && val.length >= min && val.length <= max
    return isValid || `กรุณากรอกข้อมูลระหว่าง ${min} ถึง ${max} ตัวอักษร`
  },
  valueBetween: (val: any, min: number, max: number): boolean | string => {
    const isValid = !!val && +val >= min && +val <= max
    return isValid || `กรุณากรอกค่าระหว่าง ${min} ถึง ${max}`
  },
  atLeast: (val: any, length: number = 1): boolean | string => {
    const isValid = !!val.length && val.length >= length
    return isValid || `กรุณาเลือกข้อมูลอย่างน้อย ${length} อย่าง`
  },
  numWithDecimal: (val: any): boolean | string => (/^\d+(\.\d+)*$/).test(val) || 'กรุณากรอกเฉพาะตัวเลขและทศนิยมเท่านั้น',
  numOnly: (val: any): boolean | string => (/^[0-9]*$/).test(val) || 'รูปแบบข้อมูลต้องเป็นตัวเลขเท่านั้น',
  maxValue: (val: any, max: number): boolean | string => {
    const isValid = val === 0 || val <= max
    return isValid || `กรุณากรอกค่าที่น้อยกว่าหรือเท่ากับ ${max}`
  },
  minValue: (val: any, min: number): boolean | string => {
    const isValid = val === 0 || val >= min
    return isValid || `กรุณากรอกค่าที่มากกว่าหรือเท่ากับ ${min}`
  }
}

export default defineNuxtPlugin((_nuxtApp: any): {
  provide: {
    validate: IValidate
  }
} => {
  return {
    provide: {
      validate
    }
  }
})
