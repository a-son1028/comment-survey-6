<template>
  <div>You are <b>{{ question.params[0] }}</b>. Do you allow <span
    v-b-tooltip.hover
    v-b-tooltip.hover.html="true"
    :title="question.params[1].description"
  ><b>{{ question.params[1].appName }}</b></span> app to access your <b>{{ question.params[2] }}(i.e., {{ question.params[3].join(', ') }})</b>?</div>
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

