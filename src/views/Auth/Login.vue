<template>
  <section class="vh-100 gradient-custom">
    <div class="container py-5 h-100">
      <div class="row justify-content-center align-items-center h-100">
        <div class="col-12 col-md-6">
          <div class="card shadow-2-strong" style="border-radius: 15px">
            <div class="card-body p-4 p-md-5">
              <h3 class="mb-4 text-center">
                {{ otpSent ? 'Verify OTP' : 'Login / Registration' }}
              </h3>
              <form @submit.prevent="otpSent ? verifyOtp() : sendOtp()">
                <!-- Email Input -->
                <div class="mb-3">
                  <label class="form-label" for="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    v-model="email"
                    placeholder="Enter email"
                    class="form-control form-control-lg"
                    :disabled="otpSent"
                    required
                  />
                </div>

                <!-- OTP Input (only after sending) -->
                <div class="mb-3" v-if="otpSent">
                  <label class="form-label" for="otp">OTP</label>
                  <input
                    type="text"
                    id="otp"
                    v-model="otp"
                    placeholder="Enter OTP"
                    class="form-control form-control-lg"
                    required
                  />
                </div>

                <!-- Submit button -->
                <button
                  type="submit"
                  class="btn btn-primary w-100 mb-2"
                  :disabled="sending || verifying"
                >
                  {{
                    sending
                      ? 'Sending...'
                      : verifying
                      ? 'Verifying...'
                      : otpSent
                      ? 'Verify OTP'
                      : 'Send OTP'
                  }}
                </button>

                <!-- Resend OTP button -->
                <button
                  type="button"
                  class="btn btn-secondary w-100"
                  @click="resendOtp"
                  v-if="otpSent"
                  :disabled="resendTimer > 0"
                >
                  Resend OTP {{ resendTimer > 0 ? `(${resendTimer}s)` : '' }}
                </button>

                <!-- Message display -->
                <p v-if="message" class="mt-3 text-center text-danger">
                  {{ message }}
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '@/stores/auth'


// ✅ define refs (reactive variables)
const email = ref('')
const otp = ref('')
const otpSent = ref(false)
const resendTimer = ref(0)
// ✅ connect to Pinia store

const auth = useAuth()
const sending = computed(() => auth.sending)
const verifying = computed(() => auth.verifying)
const message = computed(() => auth.message)

// function sendOtp() {
//   auth.sendOtp(email.value).then(() => {
//     auth.otpSent = true
//   })
// }

// Send OTP function
async function sendOtp() {
  if (!email.value) {
    auth.message = 'Please enter your email'
    return
  }
  await auth.sendOtp(email.value)

    // If backend says "OTP sent successfully"
  if (auth.message.includes('sent')) {
    otpSent.value = true
    startResendTimer()
  }
}

// Verify OTP function
async function verifyOtp() {
  if (!otp.value) {
    auth.message = 'Please enter OTP'
    return
  }
  await auth.verifyOtp(email.value, otp.value)
}
// Resend OTP function
async function resendOtp() {
  if (resendTimer.value === 0) {
    await sendOtp()
  }
}

// Start  ✅ 60s countdown timer

function startResendTimer() {
  resendTimer.value = 60
  const interval = setInterval(() => {
    resendTimer.value -= 1
    if (resendTimer.value <= 0) clearInterval(interval)
  }, 1000)
}
</script>
<style scoped>
.gradient-custom {
  background: linear-gradient(to right, #6a11cb, #2575fc);
}
</style>
