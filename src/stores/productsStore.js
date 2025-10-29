import { defineStore } from "pinia";
import api from "@/lib/axios";
import router from "@/router";
import { ref, computed } from "vue";


export const useProductStore = defineStore('product', {
 state: () => ({
  sliders: [],
  categories: [],
  brands: [],
  products: [],
  loading: false,
  message: '',
 }),
 getters: {

 },
 actions: {
  async fetchProducts() {
   loading: true
   try {
    const res = await api.get('/api/V1/products')
    this.products = res.data.data
   } catch (error) {
    this.message = error.response?.data?.messages?.[0] || 'Product Loading error'
   } finally {
    loading: false
   }
  },
  async fetchSliders() {
   loading: true
   try {
    const res = await api.get('/api/V1/products/sliders')
    this.sliders = res.data.data
   } catch (error) {
    this.message = error.response?.data?.messages?.[0] || 'Sliders Loading error'
   } finally {
    loading: false
   }
  },
  async fetchCategories() {
   loading: true
   try {
    const res = await api.get('/api/V1/categories')
    this.categories = res.data.data
   } catch (error) {
    this.message = error.response?.data?.messages?.[0] || 'categories Loading error'
   } finally {
    loading: false
   }
  },
  async fetchBrands() {
   loading: true
   try {
    const res = await api.get('/api/V1/brands')
    this.brands = res.data.data
   } catch (error) {
    this.message = error.response?.data?.messages?.[0] || 'cBrand Loading error'
   } finally {
    loading: false
   }
  }
 }
})