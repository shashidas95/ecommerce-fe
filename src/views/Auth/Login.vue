<template>
  <!-- START LOGIN SECTION -->
  <div class="login_register_wrap section">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-xl-6 col-md-10">
          <div class="login_wrap">
            <div class="padding_eight_all bg-white">
              <div class="heading_s1">
                <h3>Registration/ Login</h3>
              </div>
          
              <form method="post">
                <div class="form-group mb-3">
                  <input
                    type="text"
                    required=""
                    class="form-control"
                    v-model="email"
                    placeholder="Your Email"
                  />
                </div>
                <div class="form-group mb-3">
                  <button
                    :disabled="auth.sending || !email"
                    type="submit"
                    class="btn btn-fill-out btn-block"
                    @click="sendOtp"
                  >
                    Send Otp
                  </button>
                     <p>{{ auth.message }}</p>
                </div>
                <div class="form-group mb-3">
                  <input
                    class="form-control"
                    required=""
                    type="text"
                    v-model="otp"
                    placeholder="otp"
                  />
                </div>
            
                <div class="form-group mb-3">
                  <button
                    :disabled="auth.sending || !otp"
                    type="button"
                    class="btn btn-fill-out btn-block"
                    @click="verifyOtp"
                  >
                    Verify Otp
                  </button>
                    
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- END LOGIN SECTION -->
</template>
<script setup>
import { ref } from 'vue'
import { useAuth } from '@/stores/auth'

const auth = useAuth()
const email = ref(auth.email)
const otp = ref(auth.otp)
const sendOtp = async () => {
  if (!email.value) return alert('Enter your email')
  await auth.sendOtp(email.value)
}
const verifyOtp = async () => {
  if (!email.value) return alert('Enter your email')
  if (!otp.value) return alert('Enter your otp')
  await auth.verifyOtp(email.value, otp.value)
}
</script>
