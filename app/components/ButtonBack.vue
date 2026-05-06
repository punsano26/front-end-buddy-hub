<template>
  <NuxtLink
    v-if="target"
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
  <button
    v-else
    class="flex"
    type="button"
    @click="handleBack">
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
  </button>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

interface IProps {
  to?: RouteLocationRaw
  label?: string
  icon: string
  preserveQuery?: boolean
  useHistoryFallback?: boolean
}

const props = defineProps<IProps>()

const route = useRoute()
const router = useRouter()

const target = computed((): RouteLocationRaw | null => {
  if (!props.to) return null

  const baseTarget = (props.to as any)?.name?.includes('-id-')
    ? route.params.id
      ? {
        ...props.to as any,
        params: {
          id: route.params.id
        }
      } as RouteLocationRaw
      : 'index'
    : props.to

  if (!props.preserveQuery) return baseTarget

  if (typeof baseTarget === 'string') {
    return {
      path: baseTarget,
      query: { ...route.query }
    }
  }

  return {
    ...(baseTarget as Record<string, any>),
    query: {
      ...route.query,
      ...(baseTarget as Record<string, any>).query
    }
  } as RouteLocationRaw
})

function handleBack (): void {
  if (props.useHistoryFallback) {
    router.back()
  }
}
</script>

<style scoped>

</style>
