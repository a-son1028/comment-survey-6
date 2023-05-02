<template>
  <div>You are <b>{{ question.params[0] }}</b>. Do you allow <span
    v-b-tooltip.hover
    v-b-tooltip.hover.html="true"
    :title="question.params[1].description"
  ><b>{{ question.params[1].appName }}</b> app to share your <b>{{ question.params[3] }}</b> to <b>{{ question.params[4] }}</b>?</span></div>
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

