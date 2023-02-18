<template>
  
  <div
    style="text-align: center; min-height: 400px"
  >
    <img
      src="@/assets/images/success.png"
      alt="Success"
    >
    <h3>Thank You!</h3>
    <div class="mt-2">Your submission have been received</div>
  </div>
</template>

<script>
import { SUCCESS } from '@/store/modules/question/action.type.js'

export default({
  mounted() {
    this.$store.dispatch(SUCCESS)
  }
})
</script>
