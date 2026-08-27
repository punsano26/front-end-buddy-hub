<template>
  <div class="flex justify-center items-center py-10 px-8">
    <DataLoadingState :is-loading="isLoading">
      <template #skeleton>
        <MyProfilePageSkeleton />
      </template>

      <Card pt:root:class="md:w-[600px] w-full">
        <template #header>
          <UploadImageProfile :value="items" @update="fetch" />
        </template>
        <template #content>
          <!-- Unverified Email Alert Banner -->
          <div
            v-if="items && !items.isVerified"
            class="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-600 dark:text-amber-400"
          >
            <div class="flex items-center gap-2">
              <i class="pi pi-exclamation-circle text-lg shrink-0" />
              <div class="text-sm">
                <p class="font-semibold">อีเมลยังไม่ได้รับการยืนยัน</p>
                <p class="text-xs text-surface-500 dark:text-surface-400">
                  กรุณายืนยันอีเมลของคุณเพื่อความปลอดภัย
                </p>
              </div>
            </div>
            <Button
              :loading="isSendingVerification"
              size="small"
              class="shrink-0 bg-amber-500 hover:bg-amber-600 border-none text-white text-xs font-semibold px-3 py-1.5"
              @click="handleSendEmailVerification"
            >
              <i class="pi pi-send text-xs mr-1" />
              ส่งอีเมลยืนยัน
            </Button>
          </div>

          <div class="flex flex-col md:flex-row md:items-start gap-4 md:gap-2">
            <div class="flex flex-col gap-2 flex-1 min-w-0">
              <div class="flex gap-2 items-center">
                <p class="text-xl font-bold">
                  {{ items?.username }} - {{ items?.nickname }}
                </p>
              </div>
              <p class="text-sm text-surface-500">
                {{ items?.description }}
              </p>
              <div
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2"
              >
                <div class="flex gap-1 items-center min-w-0">
                  <i class="pi pi-clock text-surface-500 shrink-0" />
                  <span class="text-xs text-surface-400 shrink-0">join</span>
                  <p class="text-sm text-surface-500 truncate">
                    {{ dayjs(items?.createdAt).format("DD/MM/YYYY") }}
                  </p>
                </div>

                <div class="flex gap-1 items-center min-w-0">
                  <i class="pi pi-envelope text-surface-500 shrink-0" />
                  <p class="text-sm text-surface-500 truncate">
                    {{ items?.email }}
                  </p>
                  <Tag
                    v-if="items?.isVerified"
                    severity="success"
                    value="ยืนยันแล้ว"
                    class="text-[10px] py-0.5 px-1.5 shrink-0"
                  />
                  <Tag
                    v-else
                    severity="warn"
                    value="ยังไม่ยืนยัน"
                    class="text-[10px] py-0.5 px-1.5 shrink-0"
                  />
                </div>

                <div class="flex gap-1 items-center min-w-0">
                  <i
                    :class="changeIconGender"
                    :style="{
                      color:
                        items?.gender === genderEnum.MALE
                          ? '#3b82f6'
                          : items?.gender === genderEnum.FEMALE
                            ? '#ec4899'
                            : '#6b7280',
                    }"
                    class="shrink-0"
                  />
                  <p class="text-sm text-surface-500 truncate capitalize">
                    {{ items?.gender }}
                  </p>
                </div>

                <div class="flex gap-1 items-center min-w-0">
                  <i class="pi pi-calendar text-surface-500 shrink-0" />
                  <p class="text-sm text-surface-500 truncate">
                    {{ dayjs(items?.dateOfBirth).format("DD/MM/YYYY") }}
                  </p>
                </div>

                <div class="flex gap-1 items-center min-w-0">
                  <i class="pi pi-heart text-surface-500 shrink-0" />
                  <p class="text-sm text-surface-500 truncate">
                    {{ items?.age }}
                  </p>
                </div>
              </div>
            </div>
            <div class="w-full md:w-28 md:shrink-0 md:pt-1">
              <div class="grid grid-cols-1 gap-2">
                <Button
                  size="small"
                  class="w-full bg-linear-to-r from-sky-500 to-indigo-600 border-none text-white enabled:hover:from-sky-600 enabled:hover:to-indigo-700 active:from-sky-400 active:to-indigo-500"
                  @click="visible = true"
                >
                  แก้ไขโปรไฟล์
                </Button>
                <Button
                  size="small"
                  class="w-full bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 border-none text-surface-900 dark:text-surface-50"
                  @click="router.push({ name: 'public-profile-sessions' })"
                >
                  จัดการเซสชัน
                </Button>
              </div>
            </div>
          </div>
        </template>
        <template #footer>
          <Divider />
          <div class="flex justify-center gap-24">
            <div class="flex flex-col">
              <p class="font-bold text-center">{{ items?.friendCount }}</p>
              <p class="text-sm text-surface-500">เพื่อน</p>
            </div>
            <div class="flex flex-col">
              <p class="font-bold text-center">{{ items?.chatCount }}</p>
              <p class="text-sm text-surface-500">แชท</p>
            </div>
          </div>
        </template>
      </Card>
    </DataLoadingState>

    <UserEditDetailDialog
      :value="items"
      v-model:visible="visible"
      @updated="fetch"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Button from '~/volt/Button.vue'
import Card from '~/volt/Card.vue'
import Divider from '~/volt/Divider.vue'
import Tag from '~/volt/Tag.vue'
import UploadImageProfile from '~/components/input/UploadImageProfile.vue'
import DataLoadingState from '~/components/skeleton/DataLoadingState.vue'
import MyProfilePageSkeleton from '~/components/skeleton/profile/MyProfilePageSkeleton.vue'
import UserEditDetailDialog from '~/components/user/UserEditDetailDialog.vue'
import { genderEnum } from '~/models/enums/User.enum'
import type { IFindOneCurrentUserData } from '~/models/response/UserRes.model'
import AuthProvider, { type IAuthProvider } from '~/resource/provider/Auth.provider'
import UserProvider, { type IUserProvider } from '~/resource/provider/User.provider'

definePageMeta({ layout: 'navbar' })

const toast = useToast()
const visible = ref<boolean>(false)
const userService: IUserProvider = new UserProvider()
const authService: IAuthProvider = new AuthProvider()
const { $handleLoading } = useNuxtApp()
const router = useRouter()
const dayjs = useDayjs()
const items = ref<IFindOneCurrentUserData>()
const isLoading = ref<boolean>(true)
const isSendingVerification = ref<boolean>(false)

const changeIconGender = computed((): string => {
  if (items.value?.gender === genderEnum.MALE) {
    return 'pi pi-mars'
  }

  if (items.value?.gender === genderEnum.FEMALE) {
    return 'pi pi-venus'
  }

  return 'pi pi-genderless'
})

async function getMyProfileData (): Promise<void> {
  const response = await userService.findOneCurrentUser()
  const data = response?.data
  if (!data) return

  items.value = data
}

function fetch (): void {
  $handleLoading(getMyProfileData, { loadingUnit: isLoading })
}

async function onSendEmailVerification (): Promise<void> {
  await authService.sendEmailVerification()
}

function handleSendEmailVerification (): void {
  $handleLoading(onSendEmailVerification, {
    loadingUnit: isSendingVerification,
    toast: {
      instance: toast,
      success: {
        summary: 'ส่งอีเมลยืนยันสำเร็จ',
        detail: 'ส่งอีเมลยืนยันแล้ว กรุณาตรวจสอบกล่องข้อความในอีเมลของคุณ',
        life: 4000
      }
    }
  })
}

onMounted(() => {
  fetch()
})
</script>

<style scoped></style>