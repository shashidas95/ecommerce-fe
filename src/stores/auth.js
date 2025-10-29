import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/lib/axios'
import router from '@/router'


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
        this.message = res.data?.messages?.[0] || 'OTP sent!' //res.data?.messages → Access the messages array in the API response safely (?. avoids errors if messages is missing).
        console.log('OTP sent successfully:', this.message)
      } catch (error) {
        this.message = error.response?.data?.messages?.[0] || 'Failed to send OTP'
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
          this.message = res.data?.messages?.[0] || 'OTP Verified!'
          this.user = res.data?.data?.user || null

          router.push('/')
        } else {
          this.message = res.data?.messages?.[0] || 'OTP verification failed'
        }
      } catch (error) {
        this.message = error.response?.data?.messages[0] || 'Failed to send OTP'
      } finally {
        this.verifying = false

      }
    },
    logout() {
      this.access_token = null
      this.user = null
      localStorage.removeItem('access_token')
      router.push('/login')
    }
  },
})

