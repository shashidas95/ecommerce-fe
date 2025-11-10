import { defineStore } from "pinia";
import api from "@/lib/axios";
import { ref } from "vue";
import { useAuth } from "./auth";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";




export const useWishlist = defineStore('wishlist', () => {
 const auth = useAuth()
 const items = ref([])
 const router = useRouter()
 const selectedVariations = ref({})
 const showDropdown = ref(false)

 //load from the backend
 const fetchWishlist = async () => {
  try {
   const res = await api.get('/api/V1/wishlist')
   items.value = res.data?.data || []
  } catch (error) {
   console.error('Error fetching wishlists', error)
  }
 }

 //add product to wishlist
 const addToWishlist = async (product) => {
  const auth = useAuth()
  if (!auth.isAuthenticated) {
   toast.warn('You have to login first')
   router.push('/login')
   return
  }

  const variationId = selectedVariations.value[product.id] || null

  if (product.variations && product.variations.length > 0 && !variationId) {
   toast.warn('Please select a variation first')
   return
  }
  try {
   const res = await api.post('api/V1/add/wishlist', {
    product_id: product.id,
    variation_id: variationId,
   })
   await fetchWishlist() // refresh

   toast.success(res.data.message || 'Added to wishlist!')
   console.log('✅ Added to wishlist:', res.data)
   router.push('/wishlist')
  } catch (error) {
   console.error('❌ Failed to add product:', error.response?.data || error)
   toast.error(error.response?.data?.message || 'Failed to add to wishlist')
  }
 }
 //remove products

 const removeFromWishlist = async (product) => {
  try {
   const variationId = selectedVariations.value[product.id] || null
   const res = await api.post('/api/V1/remove/wishlist', { product_id: product.id, variation_id: variationId, },)
   items.value = items.value.filter(item => item.id !== product.id)
   toast.success(res.data.message || 'removed from wishlist!')
   await fetchWishlist() // refresh
   
  } catch (error) {
   console.error('Error removing products from wishlist', error)
   toast.error(error.response?.data?.message || 'Failed to remove to wishlist')
  }
 }

 // 🔹 Toggle wishlist state (add or remove automatically)
 async function toggleWishlist(product) {
  // Check if already in wishlist
  const existing = items.value.find(item => item.product_id === product.id)
  if (existing) {
   await removeFromWishlist(product)
  } else {
   await addToWishlist(product)
  }
 }
 const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
 }
 return {
  items,
  selectedVariations,
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  toggleDropdown,
  showDropdown
 }
})