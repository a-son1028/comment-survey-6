<template>
  <div>
    <UILoader v-if="isLoading" />
    <form
      method="POST"
      @submit="next"
    >
      <div
        v-if="userQuestions.length && !lodash.isEmpty(questions)"
      >
        <h5
          class="text-center"
          style="text-transform: capitalize;"
        > 
          <span class="pagingInfo"> <span style="color: #FF9800; font-size: 30px">{{ STAGES.indexOf(currentStage) + 1 }}</span> / 10</span>
         
        </h5>
        <div class="text-center">{{ PHRASES[currentStage] }}</div>
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
            <QuestionType1 :question="question" />
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
            <QuestionType2 :question="question" />
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
            <QuestionType3 :question="question" />
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
            <QuestionType4 :question="question" />
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
        <div v-if="currentStage === 'training5'">
          <ol>
            <li
              v-for="(question, index) in userQuestions"
              :key="index"
              class="mb-2"
            >
              <QuestionType5 :question="question" />
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
        </div>


        <div
          v-else-if="currentStage.includes('testing')"
        > 
          <div
            v-for="(approachNumber) in [1, 2 ,3]"
            :key="approachNumber"
          >
            <div><b>Arroach {{ approachNumber }}</b></div>
            <ol>
              <li
                v-for="(question, index) in userQuestions.slice((approachNumber - 1) * 3, approachNumber * 3)"
                :key="index"
                class="mb-2"
              >
                <QuestionType1
                  v-if="currentStage === 'testing1'"
                  :question="question"
                />
                <QuestionType2
                  v-else-if="currentStage === 'testing2'"
                  :question="question"
                />
                <QuestionType3
                  v-else-if="currentStage === 'testing3'"
                  :question="question"
                />
                <QuestionType4
                  v-else-if="currentStage === 'testing4'"
                  :question="question"
                />
                <QuestionType5
                  v-else-if="currentStage === 'testing5'"
                  :question="question"
                />


                <div>Based on our prediction, your answer for this question is:
                  <UIRadioGroup
                    v-model="question.ourPrediction"
                    :disabled="true"
                    :name="`questions-prediction-${approachNumber}-${index}`"
                    :options="questionOptions"
                  />
                  <div>Do you agree for this prediction?</div>
                </div>
                <div>
                  <div>
                    <UIRadioGroup
                      v-model="questions[question._id].agree"
                      :name="`questions-testing-${approachNumber}-${index}`"
                      :options="questionOptions1"
                    />
                  </div>
                  <div v-if="questions[question._id].agree === 0">
                    Please provide the correct answer?
                    <UIRadioGroup
                      v-model="questions[question._id].allow"
                      :name="`questions-testing-allow-${approachNumber}-${index}`"
                      :options="questionOptions.filter(item => item.value != question.ourPrediction)"
                    />
                  </div>
                </div>
              </li>
            </ol>
            <div>Are you satisfied with our prediction approach?</div>
            <div> <UIRadioGroup
              v-model="questions[`satisfied-approach-${approachNumber}`]"
              :name="`questions-satisfied-approach-${approachNumber}`"
              :options="questionOptions2"
            /></div>
          </div>
      
        </div>
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
import QuestionType1 from './components/QuestionType1.vue'
import QuestionType2 from './components/QuestionType2.vue'
import QuestionType3 from './components/QuestionType3.vue'
import QuestionType4 from './components/QuestionType4.vue'
import QuestionType5 from './components/QuestionType5.vue'
import { GET_QUESTIONS } from '@/store/modules/question/action.type.js'
import { 
  GET_ANSWER, 
  STORE_ANSWER
} from '@/store/modules/question/action.type.js'
import { GET_USER_INFO } from '@/store/modules/user/action.type.js'
import { QUESTION_NUM, DATA_TYPES, DATA_PURPOSES, TITLES_BY_STAGE, PHRASES } from '@/constants'

const questionOptions = [{label: 'Yes (Full)', value: 1},  {label: 'No (Not allow)', value: 0}, {label: 'Partial or under user’s control', value: 2} ]
const questionOptions1 = [{label: 'Yes', value: 1},  {label: 'No', value: 0}]
const questionOptions2 = [{label: 'Yes', value: 1},  {label: 'No', value: 0}, {label: 'Maybe', value: 2}]

const STAGES = ["training1", "testing1", "training2", "testing2","training3", "testing3","training4", "testing4","training5", "testing5"]

export default {
  components: {
    UINextButton,
    UILoader,
    UIRadioGroup,
    // UITextarea,
    QuestionType1,
    QuestionType2,
    QuestionType3,
    QuestionType4,
    QuestionType5,
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
    PHRASES,
    isLoading: true,
    questionOptions,
    questionOptions1,
    questionOptions2,
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
            agree: null,
            ourPrediction: question.ourPrediction
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