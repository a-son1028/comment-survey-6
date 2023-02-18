<template>
  
  <div class="mt-5">
    <UILoader v-if="isLoading" />
    <form
      method="POST"
      @submit="confirm"
    >
      <div>
        <div>Do you have the other comments for this survey?</div>
        <UIRadioGroup
          v-model="isHasComment"
          :options="questionOptions2"
        />

        <div v-if="isHasComment">
          Please provide this in the textbox below: 
          <UITextarea v-model="comment" />
        </div>
      </div>

      <div style="position: relative">
        <UINextButton />
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import UILoader from '@/components/UILoader.vue'
import UIRadioGroup from '@/components/UIRadioGroup.vue'
import UITextarea from '@/components/UITextarea.vue'
import UINextButton from '@/components/UINextButton.vue'

import { GET_ANSWER } from '@/store/modules/question/action.type.js'
import { GET_USER_INFO } from '@/store/modules/user/action.type.js'
import { QUESTION_NUM } from '@/constants'
import { CONFIRM } from '@/store/modules/question/action.type.js'

const questionOptions2 = [{label: 'Yes', value: 1},{label: 'No', value: 0} ]
export default({
  components: {
    UIRadioGroup,
    UITextarea,
    UINextButton,
    UILoader
  },
  data: () => ({
    QUESTION_NUM,
    isLoading: true,
    questionOptions2,
    isHasComment: null,
    comment: ""
  }),
  computed: {
    ...mapGetters({
      answer: 'getAnswer',
      questionId: 'getQuestionId',
      userInfo: 'getUserInfo',
    })
  },
  watch: {
    answer(answer) {
      if(!answer) return
      
      this.isHasComment = answer.isHasComment
      this.comment = answer.comment
    },
    userInfo(userInfo) {
      if(userInfo.currentQuestion < this.QUESTION_NUM) this.$router.push('/questions')
    }
  },
  mounted() {
    Promise.all([
      this.$store.dispatch(GET_ANSWER),
      this.$store.dispatch(GET_USER_INFO),
    ]).then(() => this.isLoading = false)
  },
  methods: {
    confirm(e) {
      e.preventDefault();
      this.isLoading = true

      this.$store.dispatch(CONFIRM, { isHasComment: this.isHasComment, comment: this.comment})
      .then(() => this.$router.push('/success'))
    }
  }
})
</script>
