import { defineStore } from "pinia";
import api from "@/lib/axios";
import router from "@/router";


export const useBrandsStore = defineStore('brands', {
 state: () => ({
  list: [],

 }),
 actions: {
  async fetchBrands() {
   const res = await api.get('api/V1/brands')
   this.list = res.data?.data || []
  },
 },
})