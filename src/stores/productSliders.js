import { defineStore } from 'pinia'
import api from '@/lib/axios'

export const useProductSlidersStore = defineStore('productSliders', {
 state: () => ({
  sliders: [],
 }),
 actions: {
  async fetchSliders() {
   const res = await api.get('/api/V1/products/sliders')
   this.sliders = res.data?.data || []
  },
 },
})
