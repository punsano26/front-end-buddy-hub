<template>
  <div class="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-8 sm:px-6">
    <div class="w-full">
      <Card>
        <template #title>ชำระเงินสำเร็จ</template>
        <template #subtitle>คุณจะได้รับ coin หลังจากที่ชำระเงินเสร็จสิ้น</template>
        <template #content>
          <div class="p-2 flex flex-col">
            <div class="flex justify-between items-center">
              <p class="font-bold text-md">จำนวนเหรียญ</p>
              <p class="text-gradient-primary font-bold">฿{{ data.coinAmount }}</p>
            </div>
            <Divider/>
            <div class="flex justify-between items-center">
              <p class="font-bold text-xs">วิธีชำระเงิน</p>
              <p class="font-bold text-xs">{{ data.paymentMethod }}</p>
            </div>
            <div class="flex justify-between items-center">
              <p class="font-bold text-xs">VAT (7%)</p>
              <p class="font-bold text-xs">฿{{ data.vatAmount }}</p>
            </div>
            <div class="flex justify-between items-center">
              <p class="font-bold text-xs">รหัสรายการ</p>
              <p class="font-bold text-xs">{{ data.orderId }}</p>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex gap-4 mt-1">
            <Button label="เริ่มใช้เหรียญเช่าคุย" severity="secondary" variant="outlined" class="w-full" />
            <Button label="กลับที่หน้าซื้อเหรียญ" class="w-full" />
          </div>
          <p class="text-sm text-muted-foreground mt-2">
            ขอบคุณที่ใช้บริการของเรา
          </p>
        </template>
      </Card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

// Correct TypeScript syntax
const data = ref<any>([{
  coinAmount: 35,
  paymentMethod: 'TrueMoney Wallet •••• 4787',
  vatAmount: 2.45,
  orderId: 'cs_test_1O7EOQWoQTJsbkR9IZvjwWyX'
}])

</script>

<style>

</style>
