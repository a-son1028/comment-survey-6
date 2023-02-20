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
          class="validate-form signup100-form"
          method="POST"
          @submit="submit"
        ><span class="login100-form-title">Sign Up</span><!-- full name-->
          <div
            class="wrap-input100 validate-input"
            data-validate="Full name is required"
          ><input
            v-model="fullName"
            class="input100"
            type="text"
            placeholder="Full name*"
            required
          ><span class="focus-input100" /><span class="symbol-input100"><i
            class="fa fa-user"
            aria-hidden="true"
          /></span></div><!-- email-->
          <div
            class="wrap-input100 validate-input"
            data-validate="Valid email is required: ex@gmail.com"
          ><input
            v-model="email"
            class="input100"
            type="text"
            placeholder="Email*"
            required
          ><span class="focus-input100" /><span class="symbol-input100"><i
            class="fa fa-envelope"
            aria-hidden="true"
          /></span></div><!-- age-->
          <div
            class="wrap-input100 validate-input"
            data-validate="Age is required"
          ><input
            v-model="age"
            class="input100"
            type="text"
            placeholder="Age*"
            required
          ><span class="focus-input100" /><span class="symbol-input100"><img
            src="@/assets/images/icons/hornbill-brands.svg"
            width="15"
          ></span></div><!-- gender-->
          <div class="wrap-input100 validate-input mt-3"><b class="mr-2">Gender: </b>
            <div class="form-check form-check-inline ml-4"><input
              id="inlineRadio1"
              v-model="gender"
              class="form-check-input"
              type="radio"
              value="male"
              required
            ><label
              class="form-check-label pl-2"
              for="inlineRadio1"
            >Male</label></div>
            <div class="form-check form-check-inline ml-5"><input
              id="inlineRadio2"
              v-model="gender"
              class="form-check-input"
              type="radio"
              value="female"
            ><label
              class="form-check-label pl-2"
              for="inlineRadio2"
            >Female</label></div>
          </div><!-- The field of work: -->
          <div class="wrap-input100 validate-input mt-3">
            <b class="mr-2">The field of work*: </b>
            <div class="form-check form-check-inline ml-4"><input
              id="inlineRadio1"
              v-model="fieldOfWorkType"
              class="form-check-input"
              type="radio"
              value="computer-science"
              required
            ><label
              class="form-check-label pl-2"
              for="inlineRadio1"
            >Computer science</label></div>
            <div class="form-check form-check-inline ml-5">
              <input
                id="inlineRadio2"
                v-model="fieldOfWorkType"
                class="form-check-input"
                type="radio"
                value="other"
              ><label
                class="form-check-label pl-2"
                for="inlineRadio2"
              >Other</label>
            </div>
          </div>
          <div
            v-if="fieldOfWorkType === 'other'"
            class="wrap-input100 validate-input"
            data-validate="The field of work is required"
          ><input
            v-model="fieldOfWork"
            class="input100"
            type="text"
            placeholder="Please enter the field of work*"
            required
          ><span class="focus-input100" /><span class="symbol-input100"><i
            class="fa fa-graduation-cap"
            aria-hidden="true"
          /></span></div><!-- educational-->
          <div
            class="wrap-input100 validate-input"
            data-validate="Educational qualification is required"
          ><input
            v-model="education"
            class="input100"
            type="text"
            placeholder="Educational qualification*"
            required
          ><span class="focus-input100" /><span class="symbol-input100"><i
            class="fa fa-graduation-cap"
            aria-hidden="true"
          /></span></div><!-- address-->
          <!-- city and country// country-->
          <div
            class="wrap-input100 validate-input"
            data-validate="Country is required"
          ><input
            v-model="country"
            class="input100"
            type="text"
            placeholder="Country*"
            required
          ><span class="focus-input100" /><span class="symbol-input100"><i
            class="fa fa-globe"
            aria-hidden="true"
          /></span></div>
          <div class="container-login100-form-btn"><button
            class="login100-form-btn"
          >Create account</button></div>
          <div class="text-center p-t-25"><a
            class="txt2"
            href="/login"
          >Already have an account<i
            class="fa fa-long-arrow-right m-l-5"
            aria-hidden="true"
          /></a></div>
          
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import UILoader from '@/components/UILoader.vue'
import { SIGNUP } from '@/store/modules/user/action.type.js'
export default({
  components: {
    UILoader,
  },
  data() {
    return {
      fullName: '',
      email: '',
      age: '',
      gender: '',
      fieldOfWorkType: '',
      fieldOfWork: '',
      education: '',
      country: '',
      hasExperience: '',
      isLoading: false,
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    clearFormData() {
      this.fullName = ''
      this.email = ''
      this.age = ''
      this.gender = ''
      this.fieldOfWorkType = ''
      this.fieldOfWork = ''
      this.education = ''
      this.country = ''
      this.hasExperience = ''
    },
    submit(e) {
      e.preventDefault();
      this.isLoading = true

      const payload = {
        fullName: this.fullName,
        email: this.email,
        age: this.age,
        gender: this.gender,
        fieldOfWorkType: this.fieldOfWorkType,
        fieldOfWork: this.fieldOfWork,
        education: this.education,
        country: this.country,
        hasExperience: this.hasExperience
      }
      
      this.$store.dispatch(SIGNUP, payload)
      .then((response) => {
        this.isLoading = false
        this.$toast.success(response.data.message);

        this.clearFormData()
      })
      .catch(({ response }) => {
        this.isLoading = false
        this.$toast.error(response.data.message);
      })
    }
  }
})
</script>
