<template>
  <div class="mx-auto max-w-5xl px-4 py-8 space-y-10 sm:px-6">
    <CoinPackages />
    <TransactionCoinHistory />
  </div>
</template>

<script lang="ts" setup>
import CoinPackages from '~/components/subscription/CoinPackages.vue'
import TransactionCoinHistory from '~/components/subscription/TransactionCoinHistory.vue'

definePageMeta({
  layout: 'navbar'
})

useSeoMeta({
  title: 'กระเป๋าเหรียญ',
  description: 'จัดการเหรียญสำหรับเช่าคุย ส่งของขวัญ และปลดล็อกฟีเจอร์พิเศษ'
})
</script>