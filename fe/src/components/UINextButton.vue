<template>
  <div class="wrap-btn-next mt-2">
    <button 
      class="login100-form-btn button-intro" 
      @click="next"
    >
      Next
    </button>
  </div>
</template>

<script>
export default {
  emits: ['next'],
  methods: {
    next() {
      this.$emit("next");
    }
  }
}

</script>