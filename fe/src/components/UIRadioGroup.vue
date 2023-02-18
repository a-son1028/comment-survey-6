<template>
  <div
    class="anwsers mt-2 d-flex flex-wrap"
  >
    <label
      v-for="(option, index) in options"
      :key="index"
      class="container-radio"
      style="margin-right: 25px"
    >{{ option.label }}
      <input
        :id="name + index"
        :name="name"
        class="type-question"
        type="radio"
        :required="required === 'true'"
        :checked="value == option.value"
        @change="$emit('input', option.value)"
      ><span class="checkmark" />
    </label>
  </div>
</template>


<script>

export default ({
  props: {
    options: {
      type: Array,
      default: function () {
        return []
      },
    },
    name: {
      type: String,
      default: ""
    },
    value: {
      type: [Number, String],
      default: null
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
