<template>
  <Dialog
    v-model:visible="visible"
    class="sm:w-100 w-9/10"
    header="แก้ไขรายละเอียดโปรไฟล์"
    pt:root:class=" bg-surface-900! border-none rounded-xl shadow-lg"
    dismissable-mask
    modal>
    <form @submit.prevent="update">
      <div class="grid gap-4">
        <InputLabelField
          v-model="form.nickname"
          label="ชื่อเล่น" />
        <InputLabelField
          v-model="form.description"
          label="รายละเอียด" />
        <InputLabelField
          label="เพศ">
          <Select
            v-model="form.gender"
            :options="gender"
            class="w-full rounded-xl"
            option-label="label"
            option-value="value"
            placeholder="เลือกเพศของคุณ" />
        </InputLabelField>
        <InputBirthDatePicker
          v-model="form.dateOfBirth"
          label="วันเกิด" />
        <Button
          label="บันทึก"
          pt:label:class="font-bold"
          pt:root:class="bg-gradient-primary border-none rounded-xl py-3"
          type="submit" />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { toGenderEnum } from '~/models/enums/User.enum'
import type { IBaseOptions } from '~/models/Global.model'
import type { IUpdateUserPayload } from '~/models/request/UserReq.model'
import type { IFindOneCurrentUserData } from '~/models/response/UserRes.model'
import type { IUserProvider } from '~/resource/provider/User.provider'
import UserProvider from '~/resource/provider/User.provider'
import Dialog from '~/volt/Dialog.vue'

const toast = useToast()
const userService: IUserProvider = new UserProvider()
const { $handleLoading } = useNuxtApp()

const gender = ref<IBaseOptions[]>([
  {
    label: 'ผู้ชาย',
    value: 'male'
  },
  {
    label: 'ผู้หญิง',
    value: 'female'
  },
  {
    label: 'อื่นๆ',
    value: 'other'
  }
])

const props = defineProps<{
  value?: IFindOneCurrentUserData
  visible: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'updated': []
}>()

const visible = computed({
  get: (): boolean => props.visible,
  set: (val: boolean): void => emit('update:visible', val)
})

const form = ref<IUpdateUserPayload>({
  nickname: '',
  description: '',
  gender: undefined,
  dateOfBirth: ''
})


watch((): boolean => props.visible, (isOpen: boolean): void => {
  if (!isOpen) return
  form.value = {
    nickname: props.value?.nickname ?? '',
    description: props.value?.description ?? '',
    gender: toGenderEnum(props.value?.gender) ?? undefined,
    dateOfBirth: props.value?.dateOfBirth ?? ''
  }
})

async function useUpdate (): Promise<void> {
  await userService.updateUser(form.value)
  emit('updated')
  visible.value = false
}

function update (): void {
  $handleLoading(useUpdate, {
    toast: {
      instance: toast
    }
  })
}
</script>

<style scoped>

</style>
