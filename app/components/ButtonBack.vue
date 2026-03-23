<template>
  <NuxtLink
    :to="target"
    class="flex">
    <ContrastButton
      :label="props.label"
      class="w-fit px-0! py-0!"
      pt:label:class="text-sm font-bold"
      variant="text">
      <template #icon>
        <Icon
          :name="props.icon"
          size="24px" />
      </template>
    </ContrastButton>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

interface IProps {
  to: RouteLocationRaw
  label?: string
  icon: string
}

const props = defineProps<IProps>()

const route = useRoute()

const target = computed((): RouteLocationRaw => {
  if ((props.to as any)?.name?.includes('-id-')) {
    return route.params.id
      ? {
        ...props.to as any,
        params: {
          id: route.params.id
        }
      } as RouteLocationRaw
      : 'index'
  }
  return props.to
})
</script>

<style scoped>

</style>
