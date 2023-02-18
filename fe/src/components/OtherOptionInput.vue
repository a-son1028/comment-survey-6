<template>
  <div
    style="display: flex;align-items: center;"
  >
    <label for="">Others: </label>
    <div 
      style="width: 100%; margin: 0 15px;" 
      class="wrap-input100 validate-input"
    > 
      <input
        class="input100"
        type="text"
        style="padding: 0 15px; font-family: Poppins-Regular, sans-serif"
        :value="value"
        @change="$emit('input', $event.target.value)"
      >
      <div style="color:#999999; font-size: 12px;padding-left: 10px">Other options is seperated by comma</div>
    </div>
  </div>
</template>

<script>
export default ({
  props: {
    value: {
      type: String,
      default: ''
    },
  },
  emits: ['input'],
})
</script>
