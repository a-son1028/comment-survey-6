<template>
  <div>
    <UILoader v-if="isLoading || !question" />
    <form
      method="POST"
      @submit="next"
    >
      <div
        v-if="question"
      >
        <h5
          class="text-center"
          style="text-transform: capitalize;"
        > <span class="pagingInfo"> <span style="color: #FF9800; font-size: 30px">{{ questionId }}</span> / {{ QUESTION_NUM }}</span></h5>
        <h3
          class="text-center"
          style="text-transform: capitalize;"
        >{{ question.appName }}</h3>
        <div class="text-center mt-1">Category: {{ question.categoryName }}</div>
        <div class="text-center mt-1">Developer: {{ question.developer }}</div>
        <div
          v-if="question.privacyLink"
          class="text-center mt-1"
        >Privacy policy: <a
          :href="question.privacyLink"
          target="_blank"
        >{{ question.privacyLink }}</a></div>

        <!-- DESC -->
        <div
          class="mt-4 comment-content"
          style="font-size: 21px"
        >
          <ol type="I">
            <li>
              <b>Description: </b> 
              <div>
                <!-- eslint-disable vue/no-v-html -->
                <span v-html="question.description" />
                <!--eslint-enable-->

                <div
                  class="mt-3 question-style"
                >
                  <ol>
                    <li>
                      <div>Is the app's description mentioning its personal data collection and sharing behaviors?</div>
                      <div>
                        <div>
                          <UIRadioGroup
                            v-model="questions.question1.value"
                            :name="questions.question1.name"
                            :options="questionOptions"
                          />
                        </div>

                        <div v-if="questions.question1.value === 1">
                          Can you show the related content?
                          <UITextarea
                            v-model="questions.question1.explain"
                            name="questions.question1.explain"
                          />
                        </div>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
            </li>

            <li>
              <b>Data safety</b>
              <div class="mt-3">
                <div>
                  <p v-html="question.appInfo.dataSafety.desc" />
                </div>

                <div
                  v-for="(section, index) in question.appInfo.dataSafety.sections"
                  :key="index"
                  class="mt-3"
                >
                  <div>
                    <div
                      v-if="section.icon"
                      class="mb-2"
                    ><img
                      :src="section.icon"
                      :alt="section.title"
                    ></div>
                    <b> {{ section.title }}</b>
                    <p>{{ section.content }}</p>
                  </div>
                  <!-- child -->
                  <div
                    style="padding-left: 10px;font-size: 16px;"
                  >
                    <div
                      v-for="(child, index1) in section.children"
                      :key="index1"
                      class="mt-2"
                    >
                      <div
                        v-b-toggle="`collapse-${index}-${index1}`"
                        variant="primary"
                        class="d-flex justify-content-between"
                      >
                        <div class="d-flex">
                          <div>
                            <span
                              v-if="child.icon"
                              style="margin-right: 10px;"
                            ><img
                       
                              :src="child.icon"
                              :alt="child.title"
                            ></span>
                          </div>
                          <div>
                            <b>{{ child.title }}</b> 
                            <p>{{ child.content }}</p>
                          </div>
                        </div>
                        <div
                          v-if="child.purposes.length"
                        >
                          <i
                            class="fa fa-angle-down"
                            aria-hidden="true"
                          /></div>
                      </div>
                      <b-collapse
                        v-if="child.purposes.length"
                        :id="`collapse-${index}-${index1}`"
                        class="mt-2"
                      >
                        <b-card>
                          <div class="card-text">
                            <div class="mb-3">Data collected and for what purpose</div>
                            <div
                              v-for="(purpose, index2) in child.purposes"
                              :key="index2"
                              class="mt-2"
                            >
                              <b>{{ purpose.title }} </b><span>{{ purpose.isOptional ? " · Optional" : "" }}</span>
                              <div><small> {{ purpose.content }}</small></div>
                            </div>
                          </div>
                        </b-card>
                      </b-collapse>
                    </div>
                  </div>
                  
                  <div
                    v-if="section.title === 'Data collected'"
                    class="question-style mt-3"
                  >
                    <ol>
                      <!-- 2 -->
                      <li v-if="dataCollections.length">How would you rate the necessary level of the app's personal data collection?
                        <div>
                          <ol type="a">
                            <!--  -->
                            <li
                              v-for="(dataCollection, index2) in dataCollections"
                              :key="index2"
                            > 
                              {{ dataCollection.title }}
                              <div v-if="dataCollection.purposes.length">
                                <ol type="i">
                                  <li
                                    v-for="(dataType, index3) in dataCollection.purposes"
                                    :key="index3"
                                  >
                                    <div>
                                      <span
                                        v-b-tooltip.hover
                                        v-b-tooltip.hover.html="true"
                                        :title="DATA_TYPES?.[dataCollection.title]?.[dataType.title]?.desc"
                                      >
                                        {{ dataType.title }}
                                      </span> 
                                    </div>
                                    
                                    <div>
                                      <UIRadioGroup
                                        v-model="questions.question2[dataType.key].value"
                                        :name="`question2${questions.question2[dataType.key].name}`"
                                        :options="question2Options"
                                      />
                                    </div>
                                  </li>
                                </ol>
                              </div>
                            </li>
                          </ol>
                        </div>
                      </li>
             
                      <!-- 3 -->
                      <li v-if="dataCollections.length">How would you agree the data collection purpose of the app's personal data collection?
                        <div>
                          <ol type="a">
                            <!--  -->
                            <li
                              v-for="(dataCollection, index2) in dataCollections"
                              :key="index2"
                            > 
                              {{ dataCollection.title }}
                              <div v-if="dataCollection.purposes.length">
                                <ol type="i">
                                  <li 
                                    v-for="(dataType, index3) in dataCollection.purposes"
                                    :key="index3"
                                  >
                                    <div>
                                      <span
                                        v-b-tooltip.hover
                                        v-b-tooltip.hover.html="true"
                                        :title="DATA_TYPES?.[dataCollection.title]?.[dataType.title]?.desc"
                                      >
                                        {{ dataType.title }}
                                      </span> 
                                    </div>

                                    <div
                                      v-if="dataType.purposes.length"
                                      div
                                    >
                                      <ol>
                                        <li 
                                          v-for="(purpose, index4) in dataType.purposes"
                                          :key="index4"
                                        >
                                          <span
                                            v-b-tooltip.hover
                                            v-b-tooltip.hover.html="true"
                                            :title="DATA_PURPOSES?.[purpose.title]?.example"
                                          >
                                            {{ purpose.title }} {{ DATA_PURPOSES?.[purpose.title]?.desc ? `(${DATA_PURPOSES?.[purpose.title]?.desc})` : "" }}
                                          </span> 
                                          <UIRadioGroup
                                            v-model="questions.question3[purpose.key].value"
                                            :name="`question3${questions.question3[purpose.key].name}`"
                                            :options="question3Options"
                                          />
                                        </li> 
                                      </ol>
                                    </div>
                                  </li>
                                </ol>
                              </div>
                            </li>
                          </ol>
                        </div>
                      </li>
                    </ol>
                  </div>


                  <div
                    v-if="section.title === 'Data shared'"
                    class="question-style mt-3"
                  >
                    <ol>
                      <!-- 4 -->
                      <li v-if="dataShared.length">How would you rate the necessary level of the app's personal data sharing?
                        <div>
                          <ol type="a">
                            <!--  -->
                            <li
                              v-for="(dataSharing, index2) in dataShared"
                              :key="index2"
                            > 
                              {{ dataSharing.title }}
                              <div v-if="dataSharing.purposes.length">
                                <ol type="i">
                                  <li
                                    v-for="(dataType, index3) in dataSharing.purposes"
                                    :key="index3"
                                  >
                                    <span
                                      v-b-tooltip.hover
                                      v-b-tooltip.hover.html="true"
                                      :title="DATA_TYPES?.[dataSharing.title]?.[dataType.title]?.desc"
                                    >
                                      {{ dataType.title }}
                                    </span> 
                                    <div>
                                      <UIRadioGroup
                                        v-model="questions.question4[dataType.key].value"
                                        :name="`question4${questions.question4[dataType.key].name}`"
                                        :options="question2Options"
                                      />
                                    </div>
                                  </li>
                                </ol>
                              </div>
                            </li>
                          </ol>
                        </div>
                      </li>
              
                      <!-- 5 -->
                      <li v-if="dataShared.length">How would you agree the data sharing purpose of the app's personal data sharing?
                        <div>
                          <ol type="a">
                            <!--  -->
                            <li
                              v-for="(dataSharing, index2) in dataShared"
                              :key="index2"
                            > 
                              {{ dataSharing.title }}
                              <div v-if="dataSharing.purposes.length">
                                <ol type="i">
                                  <li 
                                    v-for="(dataType, index3) in dataSharing.purposes"
                                    :key="index3"
                                  >
                                    <span
                                      v-b-tooltip.hover
                                      v-b-tooltip.hover.html="true"
                                      :title="DATA_TYPES?.[dataSharing.title]?.[dataType.title]?.desc"
                                    >
                                      {{ dataType.title }}
                                    </span> 
                                    <div
                                      v-if="dataType.purposes.length"
                                    >
                                      <ol>
                                        <li 
                                          v-for="(purpose, index4) in dataType.purposes"
                                          :key="index4"
                                        >
                                          <span
                                            v-b-tooltip.hover
                                            v-b-tooltip.hover.html="true"
                                            :title="DATA_PURPOSES?.[purpose.title]?.example"
                                          >
                                            {{ purpose.title }} {{ DATA_PURPOSES?.[purpose.title]?.desc ? `(${DATA_PURPOSES?.[purpose.title]?.desc})` : "" }}
                                          </span> 
                                          <UIRadioGroup
                                            v-model="questions.question5[purpose.key].value"
                                            :name="`question5${questions.question5[purpose.key].name}`"
                                            :options="question3Options"
                                          />
                                        </li> 
                                      </ol>
                                    </div>
                                  </li>
                                </ol>
                              </div>
                            </li>

                          </ol>
                        </div>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </li>
          </ol>
        </div>
      </div>

      <div style="position: relative">
        <UINextButton />

        <div
          v-show="questionId !== 1"
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
import UITextarea from '@/components/UITextarea.vue'
import { GET_QUESTIONS } from '@/store/modules/question/action.type.js'
import { GET_ANSWER, STORE_ANSWER } from '@/store/modules/question/action.type.js'
import { GET_USER_INFO } from '@/store/modules/user/action.type.js'
import { QUESTION_NUM, DATA_TYPES, DATA_PURPOSES } from '@/constants'

const questionOptions = [{label: 'Yes', value: 1},  {label: 'No', value: 0} ]
const question2Options = [{label: 'Very unnecessary', value: 1}, {label: 'Unnecessary', value: 2}, {label: 'Neutral', value: 3},{label: 'Necessary', value: 4},{label: 'Very necessary', value: 5} ]
const question3Options = [{label: 'Agree', value: 1}, {label: 'Not agree ', value: 0}]
const question4Options = [{label: 'Very unnecessary', value: 1}, {label: 'Unnecessary', value: 2}, {label: 'Neutral', value: 3}, {label: 'Necessary', value: 4}, {label: 'Very necessary', value: 5}]

export default {
  components: {
    UINextButton,
    UILoader,
    UIRadioGroup,
    UITextarea,
  },
  data: () => ({
    lodash: _,
    timer: 0,
    QUESTION_NUM,
    DATA_TYPES,
    DATA_PURPOSES,
    isLoading: true,
    questionOptions,
    question2Options,
    question3Options,
    question4Options,
    commentQuestions: [],
   
    questions: {
      question1: {
        value: null,
        name: "question11",
        explain: ""
      },
      question2: {},
      question3: {},
      question4: {},
      question5: {},
    },
    dataCollections: [],
    dataShared: []
  }),
  computed: {
    ...mapGetters({
      surveyQuestions: 'getQuestions',
      question: 'getQuestion',
      questionAnswered: 'getQuestionAnswered',
      questionId: 'getQuestionId',
      userInfo: 'getUserInfo',
      questionAnswering: 'getQuestionAnswering',
      answer: 'getAnswer'
    })
  },
  watch: {
    question(question) {
      if(question.appInfo) {
        const dataCollected = question.appInfo.dataSafety.sections[1]
        const dataShared = question.appInfo.dataSafety.sections[0]
        const dataCollections = dataCollected.children
      

        // dataCollections
        dataCollections.forEach(dataCollection => {
          const dataCollectionName = _.kebabCase(dataCollection.title)

          dataCollection.purposes.forEach(dataType => {
            const dataTypeName = _.kebabCase(dataType.title)
            const key = `${dataCollectionName}+${dataTypeName}`

            dataType.key = key
            // question 3
            let purposes = []
            let str = dataType.content
            if(str.includes("Fraud prevention, security, and compliance")) {
              purposes = ["Fraud prevention, security, and compliance"] 
              str = str.replace("Fraud prevention, security, and compliance", "");
            }
            purposes = [...purposes, ...str.split(", ")]
            purposes = purposes.filter(item => !!item).map(item => item.trim())
            
            dataType.purposes = purposes.map(purposeName=> {
              const purposeKey =`${key}+${_.kebabCase(purposeName)}`

              this.questions.question3[purposeKey] = {
                value: null,
                name: purposeKey,
                explain: ""
              }

              return {
                title: purposeName,
                key: purposeKey
              }
            })
            
            // question 2
            this.questions.question2[key] = {
              value: null,
              name: key,
              explain: ""
            }
          })
        });
        
        // dataShared
        dataShared.children.forEach(dataSharing => {
          const dataSharingName = _.kebabCase(dataSharing.title)

          dataSharing.purposes.forEach(dataType => {
            const dataTypeName = _.kebabCase(dataType.title)
            const key = `${dataSharingName}+${dataTypeName}`

            dataType.key = key
            // question 5
            dataType.purposes = dataType.content.split(',').map(item => item.trim()).map(purposeName=> {
              const purposeKey =`${key}+${_.kebabCase(purposeName)}`

              this.questions.question5[purposeKey] = {
                value: null,
                name: purposeKey,
                explain: ""
              }

              return {
                title: purposeName,
                key: purposeKey
              }
            })
            
            // question 4
            this.questions.question4[key] = {
              value: null,
              name: key,
              explain: ""
            }
          })
        });

        this.dataCollections = dataCollections
        this.dataShared = dataShared.children

        this.$store.dispatch(GET_ANSWER)
      }
    },
    userInfo(userInfo) {
      if(!userInfo.isInstruction) this.$router.push('/')

      this.$store.commit('setQuestionId', userInfo.currentQuestion)
    },
    questionAnswered(questionAnswered) {
      if(!questionAnswered) return
      this.questions = questionAnswered.responses

      this.timer = questionAnswered.time
    },
  },
  mounted() {
    Promise.all([
      this.$store.dispatch(GET_QUESTIONS),
      this.$store.dispatch(GET_USER_INFO),
    ]).then(() =>  this.isLoading = false)

    setInterval(() => {
      this.timer++
    }, 1000)
  },
  methods: {
    clearFormData() {
      this.questions = {
        question1: {
          value: null,
          name: "question11",
          explain: ""
        },
        question2: {},
        question3: {},
        question4: {},
        question5: {},
      }
      window.scrollTo(0,0);
      this.timer = 0
    },
    next(e) {
      e.preventDefault();
      this.isLoading = true
      const data = {
        appId: this.question.id,
        stt: this.questionId,
        time: this.timer,
        responses: this.questions
      }
      
      this.$store.dispatch(STORE_ANSWER, data)
      .then(() => {

        this.isLoading = false
        this.clearFormData()

        if(this.questionId === this.QUESTION_NUM) {
          return this.$router.push('/confirm')
        } else {
          this.$store.commit('setQuestionId', this.questionId + 1)
        }
      })
    },

    back() {
      this.clearFormData()
      this.$store.commit('setQuestionId', this.questionId - 1)
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