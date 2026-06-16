import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ICreateRentPostPayload, IFindAllRentPostsPaginateQuery, IUpdateRentPostPayload } from '~/models/request/RentReq.model'
import type { TBaseParamsId } from '~/models/request/Request.model'
import type {
  IFindAllRentCategoriesData,
  IFindAllRentPostList,
  IFindAllRentTagsData
} from '~/models/response/RentRes.model'
import type { IPagination } from '~/models/Global.model'
import RentProvider, { type IRentProvider } from '~/resource/provider/Rent.provider'

interface IRentStore {
  tags: Ref<IFindAllRentTagsData[]>
  tagNames: ComputedRef<string[]>
  categories: Ref<IFindAllRentCategoriesData[]>
  posts: Ref<IFindAllRentPostList[]>
  myPost: Ref<IFindAllRentPostList | undefined>
  selectedPost: Ref<IFindAllRentPostList | null>
  fetchTags: () => Promise<void>
  fetchCategories: () => Promise<void>
  fetchPosts: (query: IFindAllRentPostsPaginateQuery) => Promise<IPagination>
  fetchPostById: (id: TBaseParamsId) => Promise<void>
  fetchMyPost: () => Promise<void>
  createPost: (payload: ICreateRentPostPayload) => Promise<void>
  updatePost: (id: TBaseParamsId, payload: IUpdateRentPostPayload) => Promise<void>
  deletePost: (id: TBaseParamsId) => Promise<void>
  resetMyPost: () => void
}

export const useRentStore = defineStore('Rent', (): IRentStore => {
  const rentService: IRentProvider = new RentProvider()

  // --- Shared State ---
  const tags = ref<IFindAllRentTagsData[]>([])
  const categories = ref<IFindAllRentCategoriesData[]>([])
  const posts = ref<IFindAllRentPostList[]>([])
  const myPost = ref<IFindAllRentPostList>()
  const selectedPost = ref<IFindAllRentPostList | null>(null)

  const tagNames = computed((): string[] => tags.value.map((tag: IFindAllRentTagsData): string => tag.name))

  // --- Actions ---
  async function fetchTags (): Promise<void> {
    const response = await rentService.findAllRentTags()
    if (response?.data) {
      tags.value = response.data
    }
  }

  async function fetchCategories (): Promise<void> {
    const response = await rentService.findAllRentCategories()
    if (response?.data) {
      categories.value = response.data
    }
  }

  async function fetchPosts (query: IFindAllRentPostsPaginateQuery): Promise<IPagination> {
    const response = await rentService.findAllRentPostsPaginate(query)
    posts.value = response?.data || []
    return response?.pagination || { page: 1, limit: 10, total: 0, lastPage: 1 }
  }

  async function fetchPostById (id: TBaseParamsId): Promise<void> {
    const response = await rentService.findOneRentPostById(id)
    selectedPost.value = response?.data || null
  }

  async function fetchMyPost (): Promise<void> {
    const response = await rentService.findOneMyRentPost()
    myPost.value = response?.data
  }

  async function createPost (payload: ICreateRentPostPayload): Promise<void> {
    await rentService.createRentPost(payload)
  }

  async function updatePost (id: TBaseParamsId, payload: IUpdateRentPostPayload): Promise<void> {
    await rentService.updateRentPost(id, payload)
  }

  async function deletePost (id: TBaseParamsId): Promise<void> {
    await rentService.deleteRentPost(id)
  }

  function resetMyPost (): void {
    myPost.value = undefined
  }

  return {
    tags,
    tagNames,
    categories,
    posts,
    myPost,
    selectedPost,
    fetchTags,
    fetchCategories,
    fetchPosts,
    fetchPostById,
    fetchMyPost,
    createPost,
    updatePost,
    deletePost,
    resetMyPost
  }
})
