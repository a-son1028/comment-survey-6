<template>
  <div>Do you want your <b>{{ question.params[0] }}</b> to be collected by <span
    v-b-tooltip.hover
    v-b-tooltip.hover.html="true"
    :title="question.params[1].description"
  ><b>{{ question.params[1].appName }}</b></span> app for<b>{{ question.params[2] }}</b> purposes?</div>
</template>

<script>
export default ({
  props: {
    question: {
      type: Object,
       default: function () {
        return {}
      },
    },
  },
})
</script>

