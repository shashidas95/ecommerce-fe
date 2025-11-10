import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/lib/axios'
import router from '@/router'
import { toast } from 'vue3-toastify'


export const useAuth = defineStore('auth', {

  state: () => ({
    user: null,
    email: '',
    access_token: localStorage.getItem('access_token') || null,
    sending: false,
    message: '',
    verifying: false
  }),
  getters: {
    // ✅ 'state' is the right parameter name, not 'check'
    isAuthenticated: (state) => !!state.access_token // state.access_token? true :false
  },
  actions: {
    async sendOtp(email) {
      if (!email) {
        this.message = 'Please enter email'
        return
      }
      try {
        this.message = ''
        this.sending = true
        const res = await api.post('/api/V1/login/send/otp', { email })
        this.message = res.data?.message || 'OTP sent!'
      } catch (error) {
        this.message = error.response?.data?.message || 'Failed to send OTP'
        console.error('API error:', error.response)
      } finally {
        this.sending = false
      }
    },
    async verifyOtp(email, otp) {
      if (!email || !otp) {
        this.message = 'Email and OTP are required'
        return
      }

      try {
        this.message = ''
        this.verifying = true
        const res = await api.post('/api/V1/login/verify/otp', { email, otp })
        const token = res.data?.data?.access_token || null

        if (token) {
          this.access_token = token //Save token in Pinia state
          localStorage.setItem('access_token', token) //Save token in browser for persistence
          this.message = res.data?.message || 'OTP Verified!'
          this.user = res.data?.data?.user || null
          toast.success(this.message)
          setTimeout(() => {
            router.push('/dashboard/my-account')
          }, 2000)

        } else {
          this.message = res.data?.message || 'OTP verification failed'
        }
      } catch (error) {
        this.message = error.response?.data?.message || 'Failed to send OTP'
      } finally {
        this.verifying = false

      }
    },
    logout() {
      this.access_token = null
      this.user = null
      this.email = ''

      toast.success("Logout successfully")
      localStorage.removeItem('access_token')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
  },
})

