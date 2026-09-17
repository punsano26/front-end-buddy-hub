---
name: nuxt-debugging
description: Surgical debugging guide for Nuxt 4, Volt, PrimeVue, and Pinia. Use when fixing runtime errors, store reactivity issues, or lint failures in Buddy Hub.
---

# Nuxt 4 + TypeScript + Volt + PrimeVue + Pinia Debugging Skill

แนวทางการแก้ปัญหาและเทคนิคเฉพาะจุดสำหรับ Buddy Hub Frontend

## 1. Guiding Principles
1. **Surgical Changes**: เน้นแก้ปัญหาให้ตรงจุด ไม่ทำการ refactor วงกว้างโดยไม่จำเป็น เพื่อป้องกันผลข้างเคียง
2. **Component Modularity**: อนุญาตให้แยก Sub-component ออกมาไว้ที่ `app/components/<feature>/` ได้เมื่อช่วยให้โค้ดเป็นระเบียบและอ่านง่าย
3. **Error-driven**: อ่าน error messages และ stack trace ก่อนลงมือแก้เสมอ

---

## 2. การแก้ไข Volt Component (PrimeVue)
- **หลักการ**: ห้ามแก้ไขไฟล์ต้นทางใน `~/volt/*.vue` เด็ดขาด
- ให้ใช้ `pt:section:class="..."` หรือ `:pt` prop ใน **parent component** ที่เรียกใช้งาน
```html
<Dialog
  v-model:visible="visible"
  pt:header:class="hidden"
  pt:content:class="!p-6"
  pt:root:class="max-w-md w-full rounded-3xl"
  modal>
```

---

## 3. เทคนิคการ Debug รายจุด (Current Know-how)

### A. Provider & API
- ตรวจสอบว่ามีการเรียก `this.setUserAuthHeader()` ใน Provider ก่อนส่ง request
- ตรวจสอบ Request/Response Model ใน `app/models/` ให้ตรงกับ Backend

### B. State (Pinia)
- ใช้ `storeToRefs` เมื่อต้องการดึง state มาใช้งานแบบ reactive ใน template
- ใช้ `watch()` ใน component เพื่อตรวจสอบการเปลี่ยนแปลงของ state เมื่อจำเป็น

### C. UI & Loading ($handleLoading)
- จัดวาง `const { $handleLoading } = useNuxtApp()` ไว้บรรทัดแรกๆ ของ `<script setup lang="ts">` เสมอ
- ฟังก์ชัน async ให้ครอบด้วย `$handleLoading` พร้อมตั้งค่า toast แจ้งผลลัพธ์

### D. TypeScript / ESLint ใน Catch Block
- ใน Callback function ของ `.catch()` หรือ catch block ต้องระบุ type annotation เสมอ เช่น `(err: any)` หรือ `(err: TErrorResponse)`:
```typescript
audio.play().catch((err: any): void => { ... })
```

---

## 4. Autonomous Verification
- ใช้ `bun run lint` เพื่อตรวจสอบ ESLint rules
- ใช้ `bun run build` เพื่อตรวจสอบ TypeScript compilation & Nuxt build
- แก้ไขข้อผิดพลาดจาก lint/build อัตโนมัติและตรวจสอบซ้ำจนกว่าจะผ่าน 100% ก่อนจบงาน