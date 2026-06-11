# Nuxt 4 + TypeScript + Volt + PrimeVue + Pinia + Tailwind Debugging Skill

คุณคือนักแก้บั๊กที่โฟกัสเฉพาะจุด ไม่รีแฟคเตอร์ที่ไม่จำเป็น

## Core Rules (ห้ามละเมิดเด็ดขาด)

1. **ห้ามรีแฟคเตอร์**: อย่าเปลี่ยนโครงสร้าง อย่า rename อย่า "ทำให้สวย" ถ้าไม่ได้แก้บั๊ก
2. **แก้เฉพาะบรรทัดที่มีปัญหา**: ไม่แตะบรรทัดอื่น เว้นแต่จะเกิด error ต่อเนื่อง
3. **Error-driven เท่านั้น**: ถ้าไม่มี error หรือ behavior ผิด ไม่ต้องทำอะไร
4. **อ่าน stack trace ก่อนเสมอ**: ห้ามเดา ห้ามแก้ทั้งไฟล์

## การแก้ไข Volt Component (PrimeVue)

**หลักการ**: ใช้ `pt` (passthrough) ใน **parent** ที่เรียกใช้ component ห้ามแก้ component โดยตรง

```vue
<!-- ✅ ถูก: แก้ที่ parent -->
<Divider :pt="{ root: { class: 'p-2 mt-6' } }" />

<!-- หรือใช้数组 syntax ถ้า class เดิมมี -->
<Divider :pt="{ root: { class: ['p-2', 'mt-6'] } }" />

<!-- ❌ ผิด: ห้ามไปแก้ Volt component ต้นทาง -->
<!-- ห้ามแก้ ~/volt/components/Divider.vue -->

<!-- ❌ ผิด: ห้ามใช้ global CSS แก้ volt -->
<style global> .p-divider { margin-top: 1.5rem; } </style>
```

## เทคนิคการ Debug รายจุด (Current Know-how)

### 1. การ Debug Provider & API
- **ปัญหา**: Data ไม่มา หรือ Error 401/403
- **จุดตรวจสอบ**: 
    - เช็คว่ามีการเรียก `this.setUserAuthHeader()` ใน Provider ก่อนส่ง request หรือยัง
    - ตรวจสอบ Request/Response Model ใน `app/models/` ว่าตรงกับ Swagger/Backend หรือไม่
    - ใช้ `console.log` ดูผลลัพธ์ที่ `HttpRequest.ts` หรือ `Interceptors.ts` เพื่อดูว่าติดที่ middleware หรือเปล่า

### 2. การ Debug State (Pinia)
- **ปัญหา**: ข้อมูลใน UI ไม่ update ตาม Store
- **จุดตรวจสอบ**:
    - ตรวจสอบการใช้ `storeToRefs` เมื่อต้องการดึง state มาใช้แบบ reactive ใน template
    - ใช้ `watch()` ใน component เพื่อดูว่า state ใน store เปลี่ยนจริงหรือไม่

### 3. การ Debug UI & Loading
- **ปัญหา**: $handleLoading ไม่แสดงผล หรือค้าง
- **จุดตรวจสอบ**: 
    - ตรวจสอบว่าฟังก์ชัน async ถูกครอบด้วย `await $handleLoading(async () => { ... })` หรือไม่
    - ถ้าเป็นปัญหาเรื่อง CSS/Layout ให้เช็คที่ `pt` ของ PrimeVue เป็นหลัก (ห้ามแก้ที่ตัว volt)

### 4. การใช้ Console Log ให้มีประสิทธิภาพ
- ใส่ชื่อ Component หรือไฟล์เสมอ: `console.log('[UserCard] data:', data)`
- ใช้ `JSON.parse(JSON.stringify(obj))` เมื่อต้องการดูค่าปัจจุบันของ Proxy object (Vue Ref)
- ลบ log ออกทุกครั้งเมื่อแก้เสร็จ (Surgical Cleanup)

### if your test run using bun 
- bun run lint or bun run test and bun lint when you want to check for linting errors