import { defineStore } from 'pinia'
import api from '@/lib/axios'

export const useCategoriesStore = defineStore('categories', {
 state: () => ({
  list: [],
 }),
 actions: {
  async fetchCategories() {
   const res = await api.get('/api/V1/categories')
   this.list = res.data?.data || []
  },
 },
})

