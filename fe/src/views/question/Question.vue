<template>
  <div>
    <UILoader v-if="isLoading" />
    <form
      method="POST"
      @submit="next"
    >
      <div
        v-if="userQuestions.length"
      >
        <h5
          class="text-center"
          style="text-transform: capitalize;"
        > <span class="pagingInfo"> <span style="color: #FF9800; font-size: 30px">{{ STAGES.indexOf(currentStage) + 1 }}</span> / 10</span></h5>
        
        <div class="mt-2 mb-2">
          <div>
            <b>{{ TITLES_BY_STAGE[currentStage] }}</b>
          </div>
          <div><small>(Move your mouse over the app name to see its description)</small></div>

        </div>

        <!-- training1 -->
        <ol
          v-if="currentStage === 'training1'"
        >
          <li
            v-for="(question, index) in userQuestions"
            :key="index"
            class="mb-2"
          >
            <div>You are <b>{{ question.params[0] }}</b>. Do you allow <span
              v-b-tooltip.hover
              v-b-tooltip.hover.html="true"
              :title="question.params[1].description"
            ><b>{{ question.params[1].appName }}</b></span> app to access your <b>{{ question.params[2] }}</b>?</div>
            <div>
              <div>
                <UIRadioGroup
                  v-model="questions[question._id].allow"
                  :name="`questions-${index}`"
                  :options="questionOptions"
                />
              </div>
            </div>
          </li>
        </ol>

        <!-- training2 -->
        <ol
          v-if="currentStage === 'training2'"
        >
          <li
            v-for="(question, index) in userQuestions"
            :key="index"
            class="mb-2"
          >
            <div>You are <b>{{ question.params[0] }}</b>. Do you allow <span
              v-b-tooltip.hover
              v-b-tooltip.hover.html="true"
              :title="question.params[1].description"
            ><b>{{ question.params[1].appName }}</b> app to share your <b>{{ question.params[3] }}</b> to <b>{{ question.params[4] }}</b>?</span></div>
            <div>
              <div>
                <UIRadioGroup
                  v-model="questions[question._id].allow"
                  :name="`questions-${index}`"
                  :options="questionOptions"
                />
              </div>
            </div>
          </li>
        </ol>

        <!-- training3 -->
        <ol
          v-if="currentStage === 'training3'"
        >
          <li
            v-for="(question, index) in userQuestions"
            :key="index"
            class="mb-2"
          >
            <div>You are <b>{{ question.params[0] }}</b>. Do you want to share your <b>{{ question.params[1] }}</b> with <b>{{ question.params[2] }}</b>?</div>
            <div>
              <div>
                <UIRadioGroup
                  v-model="questions[question._id].allow"
                  :name="`questions-${index}`"
                  :options="questionOptions"
                />
              </div>
            </div>
          </li>
        </ol>

        <!-- training4 -->
        <ol
          v-if="currentStage === 'training4'"
        >
          <li
            v-for="(question, index) in userQuestions"
            :key="index"
            class="mb-2"
          >
            <div>Do you want your <b>{{ question.params[0] }}</b> to be collected by <span
              v-b-tooltip.hover
              v-b-tooltip.hover.html="true"
              :title="question.params[1].description"
            ><b>{{ question.params[1].appName }}</b></span> app for<b>{{ question.params[2] }}</b> purposes?</div>
            <div>
              <div>
                <UIRadioGroup
                  v-model="questions[question._id].allow"
                  :name="`questions-${index}`"
                  :options="questionOptions"
                />
              </div>
            </div>
          </li>
        </ol>

        <!-- training5 -->
        <ol
          v-if="currentStage === 'training5'"
        >
          <li
            v-for="(question, index) in userQuestions"
            :key="index"
            class="mb-2"
          >
            <div>Do you want your <b>{{ question.params[0] }}</b> to be shared to <b>{{ question.params[1] }}</b> for <b>{{ question.params[2] }}</b> purposes?</div>
            <div>
              <div>
                <UIRadioGroup
                  v-model="questions[question._id].allow"
                  :name="`questions-${index}`"
                  :options="questionOptions"
                />
              </div>
            </div>
          </li>
        </ol>
        <ol
          v-else-if="currentStage.includes('testing')"
        >
          <li
            v-for="(question, index) in userQuestions"
            :key="index"
            class="mb-2"
          >
            <div>Based on our prediction approach 1, your answer for this question is: {{ question.ourPrediction }}
              <div>Are you satisfied with our prediction approach 1?</div>
            </div>
            <div>
              <div>
                <UIRadioGroup
                  v-model="questions[question._id].agree"
                  :name="`questions-testing-${index}`"
                  :options="questionOptions1"
                />
              </div>
              <div v-if="questions[question._id].agree === 0">
                Please provide the correct answer?
                <UIRadioGroup
                  v-model="questions[question._id].allow"
                  :name="`questions-testing-alow-${index}`"
                  :options="questionOptions.filter(item => item.value != question.ourPrediction)"
                />
              </div>
            </div>
          </li>
        </ol>
      </div>

      <div style="position: relative">
        <UINextButton />

        <div
          v-show="currentStage !== 'training1'"
          class="wrap-btn-pre"
        >
          <button
            class="login100-form-btn button-pre slick-prev"
            @click.prevent="back"
          >Back</button>
        </div>
      </div>
    </form>
  </div>
</template>


<script>
import { mapGetters } from 'vuex';
import _ from 'lodash';
import UINextButton from '@/components/UINextButton.vue'
import UILoader from '@/components/UILoader.vue'
import UIRadioGroup from '@/components/UIRadioGroup.vue'
// import UITextarea from '@/components/UITextarea.vue'
import { GET_QUESTIONS } from '@/store/modules/question/action.type.js'
import { 
  GET_ANSWER, 
  STORE_ANSWER
} from '@/store/modules/question/action.type.js'
import { GET_USER_INFO } from '@/store/modules/user/action.type.js'
import { QUESTION_NUM, DATA_TYPES, DATA_PURPOSES, TITLES_BY_STAGE } from '@/constants'

const questionOptions = [{label: 'Yes (Full)', value: 1},  {label: 'No (Not allow)', value: 0}, {label: 'Partial or under user’s control', value: 2} ]
const questionOptions1 = [{label: 'Yes', value: 1},  {label: 'No', value: 0}, {label: 'Maybe', value: 2}]

const STAGES = ["training1", "testing1", "training2", "testing2","training3", "testing3","training4", "testing4","training5", "testing5"]

export default {
  components: {
    UINextButton,
    UILoader,
    UIRadioGroup,
    // UITextarea,
  },
  data: () => ({
    lodash: _,
    currentStage: "",
    timer: 0,
    QUESTION_NUM,
    DATA_TYPES,
    DATA_PURPOSES,
    STAGES,
    TITLES_BY_STAGE,
    isLoading: true,
    questionOptions,
    questionOptions1,
    commentQuestions: [],
    questions: {},
    dataCollections: [],
    dataShared: []
  }),
  computed: {
    ...mapGetters({
      userQuestions: 'getQuestions',
      // questionAnswered: 'getQuestionAnswered',
      userInfo: 'getUserInfo',
      // questionAnswering: 'getQuestionAnswering',
      answer: 'getAnswer'
    })
  },
  watch: {
    answer(answer) {
      if(answer && answer[this.currentStage]) {
        this.questions = answer[this.currentStage]
      }
    },
    userInfo(userInfo) {
      this.currentStage = this.$route.query.currentStage ||  userInfo.currentStage
     
    },
    userQuestions(userQuestions) {
      if(!this.answer || !this.answer[this.currentStage]) {
        this.questions = userQuestions.reduce((acc, question) => {
          acc[question._id] = {
            allow: null,
            agree: null
          }

          return acc
        }, {})
      }
    }
  },
  mounted() {
    Promise.all([
      this.$store.dispatch(GET_QUESTIONS, { currentStage: this.$route.query.currentStage }),
      this.$store.dispatch(GET_USER_INFO),
      this.$store.dispatch(GET_ANSWER),
    ]).then(() =>  this.isLoading = false)

    setInterval(() => {
      this.timer++
    }, 1000)
  },
  methods: {
    clearFormData() {
      this.questions = {}
      window.scrollTo(0,0);
      this.timer = 0
    },
    next(e) {
      e.preventDefault();
      this.isLoading = true

      const data = {
        time: this.timer,
        responses: this.questions,
        currentStage: this.currentStage
      }

      this.$store.dispatch(STORE_ANSWER, data)
      .then(() => {
        if(this.currentStage === 'testing5') {
            return this.$router.push('/confirm')
        }
        else if(this.$route.query.currentStage) {
          window.location.href = `?currentStage=${this.STAGES[this.STAGES.indexOf(this.currentStage) + 1]}`
        } else {
            window.location.href = "/"
        }
      
        this.isLoading = false
        this.clearFormData()
      })
    },

    back() {
      window.location.href = `?currentStage=${this.STAGES[this.STAGES.indexOf(this.currentStage) - 1]}`
    }
  }
};
</script>

<style scoped>
  .scrollable {
    overflow-y: scroll; max-height: 250px;
  }
  .ml-10 {
    margin-left: 10px;
  }
</style>