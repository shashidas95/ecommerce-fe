import { defineStore } from "pinia";
import api from "@/lib/axios";
import { ref, computed } from "vue";
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { useWishlist } from "./wishlist";


export const useCart = defineStore('cart', () => {
 // Declare the reactive state for the cart
 const items = ref([]);
 const selectedVariations = ref({})
 const loading = ref(false)
 // Fetch the cart from the backend
 const fetchCart = async () => {
  try {
   const res = await api.get('/api/V1/cart')
   items.value = res.data?.data || [] // Store the data in the cart
  } catch (error) {
   console.error('Fetching cart error', error)
  }
 }

 const moveWishlistToCart = async (product) => {
  try {
   loading.value = true
   const wishlist = useWishlist()
   const variationId = selectedVariations.value[product.id] || null
   const res = await api.post('/api/V1/move/wishlist/cart', {
    product_id: product.id,
    variation_id: variationId
   })

   // ✅ refresh both cart and wishlist
   await fetchCart();
   await wishlist.fetchWishlist();
   wishlist.items = wishlist.items.filter(i => i.id !== product.id);
   toast.success(res.data.message || 'Wishlist item moved to cart!');
   console.log('Wishlist item moved to cart:', res.data);
  } catch (error) {
   console.error('Error moving wishlist item to cart:', error);
   toast.error(error.response?.data?.message || 'Failed to move to cart');

  } finally {
   loading.value = false
  }
 }
 const increment = async (item) => {
  if (!item) return;
  item.quantity++
  await updateQuantity(item) // update backend and refresh cart
 }

 const decrement = async (item) => {
  if (!item || item.quantity <= 1) {
   toast.info("Minimum quantity is 1");
   return;
  }
  item.quantity--
  await updateQuantity(item) // update backend and refresh cart
 }


 const removeFromCart = async (item) => {
  try {
   // Use the variation from the cart item directly

   const res = await api.post('/api/V1/remove/product/cart', {
    product_id: item.product_id,
    variation_id: item.variation_id ?? null,
   })
   // Remove the item locally (by its cart item id)
   items.value = items.value.filter(i => i.id !== item.id)
   toast.success(res.data.message || 'removed from cart!')
   await fetchCart() // refresh

  } catch (error) {
   console.error('Error removing products from cart', error)
   toast.error(error.response?.data?.message || 'Failed to remove to cart')
  }
 }

 const updateQuantity = async (item) => {
  if (!item || !item.product_id) return;
  try {
   // Optional: set loading to true (if you want to show a loader)
   loading.value = true;

   const res = await api.post("/api/V1/cart/update", {
    product_id: item.product_id,
    variation_id: item.variation_id ?? null,
    quantity: item.quantity,
   });
   console.log("Updating quantity payload:", {
    product_id: item.product_id,
    variation_id: item.variation_id ?? null,
    quantity: item.quantity,
   });
   // Optimistic update — update local item before refetch
   const existing = items.value.find(i => i.id === item.id);
   if (existing) existing.quantity = item.quantity;

   // Refresh from backend to stay consistent
   await fetchCart();

   toast.success(res.data.message || "Cart updated successfully");
  } catch (error) {
   console.error("Update quantity error:", error);
   toast.error(error.response?.data?.message || "Failed to update cart");
  } finally {
   loading.value = false;
  }
 };

 const cartCount = computed(() =>
  items.value.reduce((sum, i) => sum + i.quantity, 0)
 )
 const cartTotal = computed(() =>
  items.value.reduce((sum, i) => sum + i.quantity * parseFloat(i.price), 0)
 )

 const discount = ref(0) // store discount percentage

 const applyDiscount = (code) => {
   const enteredCode = code?.trim().toUpperCase()
  if (!enteredCode) {
   toast.error('Please enter a coupon code')
   return
  }

  const codes = {
   SAVE10: 0.1,
   SAVE20: 0.2,
   FREESHIP: 0 // handle later if needed
  }

  if (codes.hasOwnProperty(enteredCode)) {
   discount.value = codes[enteredCode]
   toast.success(`${enteredCode} applied!`)
  } else {
   discount.value = 0
   toast.error('Invalid coupon code')
  }
 }

 const cartTotalAfterDiscount = computed(() => {
  return cartTotal.value * (1 - discount.value)
 })


 // Return the cart state and fetchCart function so that other components can use them
 return { items, fetchCart, moveWishlistToCart, selectedVariations, loading, increment, decrement, cartCount, cartTotal, removeFromCart, updateQuantity, applyDiscount, discount, cartTotalAfterDiscount }
})
