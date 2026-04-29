<template>
  <Card pt:root:class="rounded-3xl">
    <template #content>
      <div class="flex gap-2 items-center">
        <i class="pi pi-asterisk text-green-500" />
        <p>ตอนนี้คุณใช้แพ็คเกจ <span class="font-bold">ฟรี</span> · Find Match ได้ 5 ครั้ง/วัน · อัปเกรดเพื่อรับสิทธิพิเศษทันที</p>
      </div>
    </template>
  </Card>

  <Card pt:root:class="rounded-3xl bg-gradient-primary shadow-[0_10px_30px_rgba(120,120,255,0.3)]">
    <template #content>
      <div class="flex justify-between items-center">
        <div class="flex gap-2 items-center">
          <i class="pi pi-crown text-green-500" />
          <div class="flex flex-col">
            <p class="text-sm">
              คุณเป็นสมาชิก VIP
            </p>
            <p class="font-bold">
              เหลือเวลา 23 ชม. 59 นาที
            </p>
          </div>
        </div>
        <div>
          <Button
            label="ยกเลิก VIP"
            severity="secondary"
            size="small" />
        </div>
      </div>
    </template>
  </Card>
</template>

<script lang="ts" setup>

</script>

<style>

</style>
