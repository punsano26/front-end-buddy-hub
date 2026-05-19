import { defineStore } from 'pinia'
import type { IPagination } from '~/models/Global.model'
import type { INotificationList } from '~/models/response/NotificationRes.model'
import NotificationProvider from '~/resource/provider/Notification.provider'

interface INotificationState {
  items: INotificationList[]
  pagination: IPagination
  unreadCount: number
}

export const useNotificationStore = defineStore('Notification', {
  state: (): INotificationState => ({
    items: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      lastPage: 1
    },
    unreadCount: 0
  }),

  actions: {
    async fetchNotifications (page?: number, limit?: number): Promise<void> {
      const notificationService = new NotificationProvider()
      const response = await notificationService.findAllNotificationPaginate({
        page: page ?? this.pagination.page,
        limit: limit ?? this.pagination.limit
      })

      this.items = response.data || []
      if (response.pagination) {
        this.pagination = {
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.pagination.total,
          lastPage: response.pagination.lastPage
        }
      }

      await this.fetchUnreadCount()
    },

    async fetchUnreadCount (): Promise<void> {
      const { $handleLoading } = useNuxtApp()
      const notificationService = new NotificationProvider()
      const response = await $handleLoading(
        (): Promise<
          Awaited<
            ReturnType<NotificationProvider['findUnreadNotificationCount']>
          >
        > => notificationService.findUnreadNotificationCount()
      )
      this.unreadCount = response?.data?.count || 0
    },

    async markAllAsRead (): Promise<void> {
      const notificationService = new NotificationProvider()
      const response = await notificationService.markAllNotificationsAsRead()

      if (response?.data?.length) {
        this.items = response.data
      } else {
        this.items = this.items.map(
          (item: INotificationList): INotificationList => ({
            ...item,
            isRead: true
          })
        )
      }
      this.unreadCount = 0
    },

    async markAsRead (id: number): Promise<void> {
      const notificationService = new NotificationProvider()
      const response = await notificationService.markNotificationAsRead(id)

      if (response?.data) {
        const index = this.items.findIndex(
          (item: INotificationList): boolean => item.id === response.data.id
        )
        if (index !== -1) {
          this.items[index] = { ...this.items[index], ...response.data }
        }
      } else {
        const item = this.items.find(
          (i: INotificationList): boolean => i.id === id
        )
        if (item) item.isRead = true
      }
      await this.fetchUnreadCount()
    },

    async deleteNotification (id: number): Promise<void> {
      const { $handleLoading } = useNuxtApp()
      const notificationService = new NotificationProvider()
      await $handleLoading(
        (): Promise<
          Awaited<ReturnType<NotificationProvider['deleteNotification']>>
        > => notificationService.deleteNotification(id)
      )
      this.items = this.items.filter(
        (item: INotificationList): boolean => item.id !== id
      )
      await this.fetchUnreadCount()
    }
  }
})
