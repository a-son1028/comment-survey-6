<template>
  <div>
    {{ label }}
    <div class="anwsers">
      <textarea
        cols="30"
        rows="2"
        style="width: 100%; padding: 5px;"
        v-bind="{
          ...(required && {required: true})
        }"
        :value="value"
        @change="$emit('input', $event.target.value)"
      />
    </div>
  </div>
</template>

<script>
export default ({
  props: {
    label: {
      type: String,
      default: ""
    },
    value: {
      type: String,
      default: ''
    },
    required: {
      type: String,
      default: "true"
    },
  },
  emits: ['input'],
  watch: {
    picked(data) {
      console.log(data)
    }
  }
})
</script>
