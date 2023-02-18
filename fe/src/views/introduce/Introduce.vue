<template>
  <div>
    <!-- ============= Short desc ============-->
    <div
      id="short-desc"
      class="mt-4"
    >
      <h3 class="title text-center">Investigating the collection and sharing of personal
        data in the Android platform</h3><!-- intro-->
      <div class="intro mt-3">
        <div class="intro-title text-underline font-weight-bold">Description:</div>
        <div class="intro-desc">
          Our research analyzes and evaluates user feedback about the information displayed on Google Play's Data safety section (June 2022 version). The information we collect includes: personal information reviewed by the Google Play's Data safety section document, whether personal data collection and sharing requirements meet users, as well as the collection of personal data. User reviews of some real apps (i.e., Social apps).
        </div>
      </div>
    </div>
    <UINextButton @next="next" />
  </div>
</template>

<script>
import UINextButton from '@/components/UINextButton.vue'
import { UPDATE_INSTRUCTION } from '@/store/modules/user/action.type.js'

export default {
  components: {
    UINextButton
  },
  computed: {
  },
  mounted() {
  },
  methods: {
    next() {
      this.$router.push('/survey')
      this.$store.dispatch(UPDATE_INSTRUCTION)
        .then(() => {
          this.$router.push('/survey')
        })
    },
  }
};
</script>