<template>
  <div class="landing-root w-screen h-screen overflow-hidden">
    <div class="ambient ambient-cyan" />
    <div class="ambient ambient-indigo" />
    <div class="ambient ambient-grid" />

    <main class="relative z-10 h-full w-full px-4 py-6 md:px-10 md:py-10">
      <div class="mx-auto grid h-full max-w-6xl items-center gap-8 lg:grid-cols-2">
        <section class="space-y-6">
          <p class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs tracking-[0.2em] text-white/80 uppercase backdrop-blur-sm">
            บัดดี้ ฮับ
            <span class="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_2px_rgba(16,185,129,0.8)]" />
          </p>

          <div class="space-y-3">
            <h1 class="text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              ค้นหาเพื่อนคุยใหม่
              <span class="bg-gradient-primary bg-clip-text text-transparent">ในวันที่เหงาใจ</span>
            </h1>
            <p class="max-w-xl text-sm text-surface-200 sm:text-base">
              มาที่นี่แล้วคุณจะได้พบคนใหม่ที่คุยสนุก เข้าใจ และพร้อมเปิดใจในทุกโมเมนต์
              ทุกห้องแชทคือโอกาสใหม่ ทุกการทักคือจุดเริ่มต้นที่น่าจดจำ
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3 text-xs text-surface-200">
            <span class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1">
              <i class="pi pi-comments" />
              แชททันใจแบบเรียลไทม์
            </span>
            <span class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1">
              <i class="pi pi-users" />
              จับคู่เพื่อนคุยถูกใจ
            </span>
            <span class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1">
              <i class="pi pi-bolt" />
              ลื่นไหล ใช้งานง่าย
            </span>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
            <NuxtLink
              class="w-full sm:w-auto"
              to="/public/home">
              <Button
                class="w-full sm:w-auto"
                icon="pi pi-compass"
                label="เริ่มหาเพื่อนตอนนี้"
                pt:root:class="bg-gradient-primary border-none text-surface-900 font-semibold px-6 py-3 rounded-xl shadow-[0_20px_40px_-20px_rgba(111,143,232,0.9)] hover:brightness-105" />
            </NuxtLink>

            <NuxtLink
              class="w-full sm:w-auto"
              to="/auth/verify">
              <SecondaryButton
                class="w-full sm:w-auto"
                icon="pi pi-sign-in"
                icon-pos="right"
                label="เข้าสู่ระบบ"
                pt:root:class="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20" />
            </NuxtLink>
          </div>
        </section>

        <section class="scene-wrap">
          <div class="scene perspective">
            <Card pt:root:class="layer layer-base">
              <template #content>
                <div class="space-y-3">
                  <p class="text-xs uppercase tracking-[0.18em] text-surface-300">
                    โซนยอดนิยม
                  </p>
                  <div class="space-y-2 text-sm">
                    <div class="module-row">
                      <i class="pi pi-home" />
                      <span>โฮมฟีดแนะนำเพื่อนใหม่</span>
                    </div>
                    <div class="module-row">
                      <i class="pi pi-comments" />
                      <span>ห้องแชทนัดคุยทันที</span>
                    </div>
                    <div class="module-row">
                      <i class="pi pi-users" />
                      <span>เชื่อมต่อเพื่อนคุยถูกใจ</span>
                    </div>
                    <div class="module-row">
                      <i class="pi pi-user" />
                      <span>โปรไฟล์โดดเด่น น่าค้นหา</span>
                    </div>
                  </div>
                </div>
              </template>
            </Card>

            <Card pt:root:class="layer layer-float layer-float-a">
              <template #content>
                <div class="space-y-2">
                  <p class="text-xs uppercase tracking-[0.18em] text-surface-300">
                    ออนไลน์ตอนนี้
                  </p>
                  <p class="text-3xl font-black text-white">
                    1,234
                  </p>
                  <p class="text-xs text-surface-300">
                    คนกำลังคุยสนุกในชั่วโมงนี้
                  </p>
                </div>
              </template>
            </Card>

            <Card pt:root:class="layer layer-float layer-float-b">
              <template #content>
                <div class="space-y-2">
                  <p class="text-xs uppercase tracking-[0.18em] text-surface-300">
                    เข้าได้ทันที
                  </p>
                  <p class="text-lg font-bold text-white">
                    พร้อมเริ่มคุยกับคนใหม่เลยตอนนี้
                  </p>
                  <div class="inline-flex items-center gap-2 rounded-full bg-emerald-400/20 px-3 py-1 text-xs text-emerald-200">
                    <span class="h-2 w-2 rounded-full bg-emerald-300" />
                    ระบบพร้อมใช้งาน
                  </div>
                </div>
              </template>
            </Card>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import Button from '~/volt/Button.vue'
import Card from '~/volt/Card.vue'
import SecondaryButton from '~/volt/SecondaryButton.vue'
</script>

<style scoped>
.landing-root {
  background: radial-gradient(circle at 12% 20%, #0f2a46 0%, transparent 42%),
    radial-gradient(circle at 88% 80%, #28184a 0%, transparent 40%),
    linear-gradient(145deg, #040b18 0%, #091827 45%, #060915 100%);
}

.ambient {
  pointer-events: none;
  position: absolute;
  inset: 0;
}

.ambient-cyan {
  background: radial-gradient(circle at 20% 30%, rgba(57, 198, 214, 0.24) 0%, transparent 38%);
  animation: driftA 12s ease-in-out infinite alternate;
}

.ambient-indigo {
  background: radial-gradient(circle at 78% 70%, rgba(111, 143, 232, 0.28) 0%, transparent 40%);
  animation: driftB 15s ease-in-out infinite alternate;
}

.ambient-grid {
  background-image: linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: radial-gradient(circle at center, black 10%, transparent 88%);
  opacity: 0.25;
}

.scene-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
}

.scene {
  position: relative;
  width: min(520px, 92vw);
  height: 420px;
  transform-style: preserve-3d;
}

.perspective {
  perspective: 1100px;
}

.layer {
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: linear-gradient(160deg, rgba(39, 39, 42, 0.82), rgba(9, 9, 11, 0.7));
  backdrop-filter: blur(10px);
  color: white;
}

.layer-base {
  inset: 24px 30px 20px 12px;
  transform: rotateY(-16deg) rotateX(7deg) translateZ(0);
  box-shadow: 0 24px 60px -28px rgba(0, 0, 0, 0.7);
}

.layer-float {
  width: 220px;
  transform-style: preserve-3d;
}

.layer-float-a {
  top: 20px;
  right: -8px;
  transform: rotateY(-18deg) rotateX(8deg) translateZ(86px);
  animation: levitateA 5.4s ease-in-out infinite;
}

.layer-float-b {
  bottom: 0;
  left: 10px;
  transform: rotateY(-10deg) rotateX(6deg) translateZ(64px);
  animation: levitateB 6.2s ease-in-out infinite;
}

.module-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 0.6rem 0.75rem;
  color: rgb(228 228 231);
  background: rgba(39, 39, 42, 0.45);
}

@keyframes driftA {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(0, 20px, 0);
  }
}

@keyframes driftB {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(0, -22px, 0);
  }
}

@keyframes levitateA {
  0%,
  100% {
    transform: rotateY(-18deg) rotateX(8deg) translateZ(86px) translateY(0);
  }
  50% {
    transform: rotateY(-18deg) rotateX(8deg) translateZ(96px) translateY(-8px);
  }
}

@keyframes levitateB {
  0%,
  100% {
    transform: rotateY(-10deg) rotateX(6deg) translateZ(64px) translateY(0);
  }
  50% {
    transform: rotateY(-10deg) rotateX(6deg) translateZ(74px) translateY(-10px);
  }
}

@media (max-width: 1024px) {
  .scene {
    height: 360px;
  }

  .layer-base {
    inset: 20px 20px 20px 10px;
  }
}

@media (max-width: 640px) {
  .scene {
    width: 100%;
    height: 320px;
  }

  .layer-float {
    width: 180px;
  }

  .layer-float-a {
    right: -2px;
  }
}
</style>
