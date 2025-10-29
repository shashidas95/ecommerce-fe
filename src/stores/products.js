import { defineStore } from 'pinia'
import api from '@/lib/axios'

export const useProductsStore = defineStore('products', {
 state: () => ({
  list: [],
  details: {},
 }),
 actions: {
  async fetchProducts() {
   const res = await api.get('/api/V1/products')
   this.list = res.data?.data || []
  },
  async fetchProductDetails(productId) {
   const res = await api.get(`/api/V1/products/${productId}`)
   this.details[productId] = res.data?.data || {}
  },
 },
})
