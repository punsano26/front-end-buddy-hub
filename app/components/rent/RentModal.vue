<template>
  <Dialog
    v-model:visible="visible"
    class="md:w-200 w-9/10 flex"
    header="
เริ่มเซสชันเช่าคุย"
    pt:content:class="flex flex-col gap-4"
    modal>
    <p>เลือกระยะเวลาที่ต้องการคุยกับ <span>Maya Patel</span></p>
    <Card>
      <template #content>
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-4">
            <img
              alt="Profile Image"
              class="w-12 h-12 rounded-full bg-gray-300"
              src="/png/upload-profile.png">
            <div>
              <p class="font-semibold">
                Maya Patel
              </p>
              <p class="text-sm text-gray-500">
                18 เหรียญ/นาที
              </p>
            </div>
          </div>
        </div>
      </template>
    </Card>
    <div class="flex flex-col gap-4">
      <p>ระยะเวลาที่ต้องการคุย</p>
      <SelectButton
        v-model="value"
        :options="options"
        option-label="name" />
    </div>
    <Card>
      <template #content>
        <div class="flex flex-col gap-4">
          <div class="flex justify-between items-center ">
            <p>ค่าบริการ</p>
            <span>18 x {{ value?.value || 0 }} นาที</span>
          </div>
          <div class="flex justify-between items-center ">
            <p class="font-bold">
              รวมทั้งหมด
            </p>
            <span class="font-bold">{{ showValue }} เหรียญ</span>
          </div>
          <div class="flex justify-between items-center ">
            <p>ยอดคงเหลือหลังหักค่าบริการ</p>
            <span>534</span>
          </div>
        </div>
      </template>
    </Card>
    <div class="flex gap-2 justify-end">
      <Button
        label="ยกเลิก"
        pt:label:class="font-semibold"
        pt:root:class="bg-gray-300 border-none px-4 py-2 shadow-sm hover:shadow-md hover:scale-105 transition"
        size="small"
        rounded
        @click="visible = false" />
      <Button
        :label="`ยืนยัน ${showValue} เหรียญ`"
        pt:label:class="font-semibold"
        pt:root:class="bg-gradient-primary border-none px-4 py-2 shadow-sm hover:shadow-md hover:scale-105 transition"
        size="small"
        rounded
        @click="visible = false" />
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const visible = defineModel<boolean>('visible', { default: false })
const value = ref<{ name: string, value: number } | null>(null)
const options = ref([
  { name: '15 นาที', value: 15 },
  { name: '30 นาที', value: 30 },
  { name: '50 นาที', value: 50 }
])

const showValue = computed((): number => {
  return 18 * (value.value?.value || 0)
})
</script>

<style scoped>

</style>
