<template>
  <div class="limiter">
    <UILoader v-if="isLoading" />
    <div class="container-login100">
      <div class="wrap-login100">
        <div
          class="login100-pic js-tilt"
          data-tilt=""
        ><img
          src="@/assets/images/img-01.png"
          alt="IMG"
        ></div>
        <form
          class="login100-form validate-form"
          method="POST"
          @submit="submit"
        ><span class="login100-form-title">Login</span>
          <div
            class="wrap-input100 validate-input"
            data-validate="Valid email is required: ex@abc.xyz"
          ><input
            v-model="email"
            class="input100"
            type="email"
            placeholder="Email"
            required
          ><span class="focus-input100" /><span class="symbol-input100"><i
            class="fa fa-envelope"
            aria-hidden="true"
          /></span></div>
          <div class="container-login100-form-btn"><button class="login100-form-btn">Login</button></div>
          <div class="text-center p-t-136"><a
            class="txt2"
            href="/signup"
          >Create your Account<i
            class="fa fa-long-arrow-right m-l-5"
            aria-hidden="true"
          /></a></div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { LOGIN } from '@/store/modules/user/action.type.js'
import UILoader from '@/components/UILoader.vue'

export default({
  components: {
    UILoader,
  },
  data() {
    return {
      email: '',
      isLoading: false,
    }
  },
  methods: {
    submit(e) {
      e.preventDefault();
      this.isLoading = true

      this.$store.dispatch(LOGIN, this.email)
      .then(() => {
        this.isLoading = false
        this.$router.push('/')
      })
      .catch(({ response }) => {
        this.isLoading = false
        this.$toast.error(response.data.message);
      })
    }
  }
})
</script>

