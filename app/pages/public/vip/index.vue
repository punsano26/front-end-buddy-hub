<template>
  <div class="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
    <div class="w-full max-w-xl space-y-6">

      <!-- HEADER -->
      <div class="flex flex-col items-center text-center gap-4">
        <div
          class="p-5 rounded-3xl bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 shadow-[0_15px_40px_rgba(255,100,200,0.35)] animate-pulse">
          <i class="pi pi-crown text-4xl text-white" />
        </div>

        <h1 class="text-3xl font-extrabold bg-gradient-to-r from-yellow-300 to-pink-400 bg-clip-text text-transparent">
          BuddyHub VIP
        </h1>

        <p class="text-gray-400 max-w-md">
          ปลดล็อกประสบการณ์เต็มรูปแบบ — Find Match ได้มากขึ้น
          <span class="text-pink-400 font-semibold">10 เท่า</span>
          และโดดเด่นกว่าใคร
        </p>
      </div>

      <!-- STATUS -->
      <div class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 shadow-lg">
        <StatusPackage />
      </div>

      <!-- PACKAGE -->
      <div class="space-y-3">
        <p class="text-lg font-semibold text-white">เลือกแพ็คเกจ VIP</p>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">

          <OverlayBadge value="ลองก่อน">
            <div class="hover:scale-105 transition duration-300">
              <Package :package="vipPackage1" />
            </div>
          </OverlayBadge>

          <OverlayBadge value="คุ้มสุด">
            <div class="hover:scale-105 transition duration-300 ring-2 ring-pink-500 rounded-2xl">
              <Package :package="vipPackage2" />
            </div>
          </OverlayBadge>

          <OverlayBadge value="ประหยัดสุด">
            <div class="hover:scale-105 transition duration-300">
              <Package :package="vipPackage3" />
            </div>
          </OverlayBadge>

        </div>
      </div>

      <!-- BENEFITS -->
      <div class="space-y-3">
        <p class="text-lg font-semibold text-white">สิทธิพิเศษสำหรับสมาชิก VIP</p>

        <div class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 shadow-lg">
          <SpacialDescription :spacial-descriptions="spacialDescriptions" />
        </div>
      </div>

      <!-- INFO -->
      <Message class="!bg-blue-500/10 !border !border-blue-500/30 !rounded-2xl">
        <div class="flex gap-3 items-start text-sm text-blue-200">
          <i class="pi pi-wave-pulse text-blue-400 text-lg mt-1" />
          <p>
            VIP ต่ออายุไม่อัตโนมัติ — ระบบจะเตือนก่อนหมดอายุ ·
            สามารถยกเลิกได้ทุกเมื่อ ·
            ยอดที่ชำระไม่สามารถขอคืนได้หลังเริ่มใช้งานแล้ว
          </p>
        </div>
      </Message>

    </div>
  </div>
</template>

<script lang="ts" setup>
import Package from '~/components/subscription/Package.vue'
import SpacialDescription from '~/components/subscription/SpacialDescription.vue'
import StatusPackage from '~/components/subscription/StatusPackage.vue'

const vipPackage1 = ref({
  name: 'VIP รายวัน',
  price: 15,
  smallDescription: 'ใช้งาน 1 วัน · ≈ ฿15.00/วัน',
  features: [
    'Find Match 50 ครั้ง/วัน',
    'VIP Badge สีทอง',
    'โปรไฟล์ติดอันดับต้น',
    'ไม่มีโฆษณา'
  ]
})

const vipPackage2 = ref({
  name: 'VIP รายสัปดาห์',
  price: 39,
  smallDescription: 'ใช้งาน 7 วัน · ≈ ฿5.57/วัน',
  features: [
    'Find Match 50 ครั้ง/วัน',
    'VIP Badge สีทอง',
    'โปรไฟล์ติดอันดับต้น',
    'ไม่มีโฆษณา'
  ]
})

const vipPackage3 = ref({
  name: 'VIP รายเดือน',
  price: 99,
  smallDescription: 'ใช้งาน 30 วัน · ≈ ฿3.30/วัน',
  features: [
    'Find Match 50 ครั้ง/วัน',
    'VIP Badge สีทอง',
    'โปรไฟล์ติดอันดับต้น',
    'ไม่มีโฆษณา'
  ]
})

const spacialDescriptions = ref([
  {
    icon: 'pi-bolt',
    title: 'ใช้ Find Match ได้ 50 ครั้ง/วัน',
    description: 'ฟรีจำกัดแค่ 5 ครั้ง/วัน'
  },
  {
    icon: 'pi-crown',
    title: 'VIP Badge สีทอง',
    description: 'เด่นในทุกโปรไฟล์และห้องแชท'
  },
  {
    icon: 'pi-heart',
    title: 'Match ติดอันดับต้น',
    description: 'โปรไฟล์ของคุณถูกเสนอให้คนอื่นเห็นมากขึ้น'
  },
  {
    icon: 'pi-images',
    title: 'ตั้ง Avatar & Banner เป็น GIF',
    description: 'เฉพาะสมาชิก VIP เท่านั้น (ฟรีใช้ได้แค่ภาพนิ่ง)'
  },
  {
    icon: 'pi-objects-column',
    title: 'ไม่มีโฆษณา',
    description: 'ใช้งานลื่นไหลแบบไม่มีรบกวน'
  }
])
</script>

<style scoped>

</style>