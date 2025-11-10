<template lang="">
  <!-- START MAIN CONTENT -->
  <div class="main_content">
    <!-- START SECTION SHOP -->
    <div class="section">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="table-responsive wishlist_table">
              <table class="table">
                <thead>
                  <tr>
                    <th class="product-thumbnail">&nbsp;</th>
                    <th class="product-name">Product</th>
                    <th class="product-price">Price</th>
                    <th class="product-stock-status">Stock Status</th>
                    <th class="product-add-to-cart"></th>
                    <th class="product-remove">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in wishlist.items" :key="item.id">
                    <td class="product-thumbnail">
                      <a href="#"
                        ><img
                          :src="item.image"
                          alt="product"
                          width="70"
                          height="70"
                      /></a>
                    </td>
                    <td class="product-name" data-title="Product">
                      <a href="#">{{ item.title }}</a>
                    </td>
                    <td class="product-price" data-title="Price">
                      ${{ item.price }}
                    </td>
                    <td class="product-stock-status" data-title="Stock Status">
                      <span
                        class="badge rounded-pill text-bg-success"
                        :class="
                          item.stock > 0 ? 'text-bg-success' : 'text-bg-danger'
                        "
                        >{{ item.stock }}</span
                      >
                    </td>
                    <td class="product-add-to-cart">
                      <a
                        href="#"
                        class="btn btn-fill-out"
                        @click.prevent="moveToCart(item)"
                        :disabled="item.stock <= 0 || cart.loading"
                        ><i class="icon-basket-loaded"></i> Add to Cart</a
                      >
                    </td>
                    <td
                      class="product-remove"
                      @click.prevent="wishlist.removeFromWishlist(item)"
                      data-title="Remove"
                    >
                      <a href="#"><i class="ti-close"></i></a>
                    </td>
                  </tr>
                  <!-- Show message if empty -->
                  <tr v-if="wishlist.items.length === 0">
                    <td colspan="6" class="text-center py-4">
                      ❤️ No items in wishlist
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- END SECTION SHOP -->

    <!-- START SECTION SUBSCRIBE NEWSLETTER -->
    <div class="section bg_default small_pt small_pb">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6">
            <div class="heading_s1 mb-md-0 heading_light">
              <h3>Subscribe Our Newsletter</h3>
            </div>
          </div>
          <div class="col-md-6">
            <div class="newsletter_form">
              <form>
                <input
                  type="text"
                  required=""
                  class="form-control rounded-0"
                  placeholder="Enter Email Address"
                />
                <button
                  type="submit"
                  class="btn btn-dark rounded-0"
                  name="submit"
                  value="Submit"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- START SECTION SUBSCRIBE NEWSLETTER -->
  </div>
  <!-- END MAIN CONTENT -->
</template>
<script setup>
import { useWishlist } from '@/stores/wishlist'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { useCart } from '@/stores/cart'

const router = useRoute()
const wishlist = useWishlist()
const cart = useCart()

onMounted(async () => {
  await wishlist.fetchWishlist()
})
const moveToCart = async (product) => {
  await cart.moveWishlistToCart(product)
}
</script>
