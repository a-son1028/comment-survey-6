<template>
  <div>You are <b>{{ question.params[0] }}</b>. Do you want to share your <b>{{ question.params[1] }}(i.e., {{ question.params[3].join(', ') }})</b> with <b>{{ question.params[2] }}</b>?</div>
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

