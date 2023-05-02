<template>
  <div>Do you want your <b>{{ question.params[0] }}(i.e., {{ question.params[3].join(', ') }})</b> to be shared to <b>{{ question.params[1] }}</b> for <b>{{ question.params[2] }}</b> purposes?</div>
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

