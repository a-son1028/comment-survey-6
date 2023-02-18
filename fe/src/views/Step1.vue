<template>
  <div>
    <UILoader v-if="isLoading" />
    <form
      method="POST"
      @submit="next"
    >
      <div>
        <!-- ============= Short desc ============-->
        <div
          id="short-desc"
          class="mt-4"
        >
          <div class="intro mt-3">
            <div class="intro-title text-underline font-weight-bold">Survey:</div>
            <div class="intro-desc">
              <ol>
                <li>
                  Which of the following information do you think is your personal information (i.e.,
                  access restrictions) when you using the apps on the Android platform?

                  <div>
                    <ol type="a">
                      <!--  -->
                      <li>
                        Location (i.e., 
                        <span
                          v-b-tooltip.hover
                          title="Yours or your device's physical location to an area greater than or equal to 3 square kilometers, such as the city you are in."
                        >
                          Approximate location,
                        </span> 
                        <span
                          v-b-tooltip.hover
                          title="Yours or your device's physical location within an area less than 3 square kilometers."
                        >
                          Precise location)
                        </span> 

                        <div>
                          <UIRadioGroup
                            v-model="questions.question1.question11.value"
                            :name="questions.question1.question11.name"
                            :options="questionOptions"
                          />
                        </div>
                   
                        <div>
                          Explain your selection
                          <UITextarea v-model="questions.question1.question11.explain" />
                        </div>
                      </li>

                      <!--  -->
                      <li>
                        Personal info (i.e., 
                        <span
                          v-b-tooltip.hover
                          title="How you refer to yourself, such as your first or last name, or nickname."
                        >
                          Name,
                        </span> 

                        <span
                          v-b-tooltip.hover
                          title="Your email address."
                        >
                          Email address,
                        </span> 

                        <span
                          v-b-tooltip.hover
                          title="Identifiers that relate to an identifiable person. For example, an account ID, account number, or account name."
                        >
                          User IDs,
                        </span> 

                        <span
                          v-b-tooltip.hover
                          title="Your address, such as a mailing or home address."
                        >
                          Address,
                        </span> 

                        <span
                          v-b-tooltip.hover
                          title="Your phone number."
                        >
                          Phone number,
                        </span> 

                        <span
                          v-b-tooltip.hover
                          title="Information about your race or ethnicity."
                        >
                          Race and ethnicity,
                        </span> 

                        <span
                          v-b-tooltip.hover
                          title="Information about your political or religious beliefs."
                        >
                          Political or religious beliefs,
                        </span> 

                        <span
                          v-b-tooltip.hover
                          title="Information about your sexual orientation."
                        >
                          Sexual orientation,
                        </span> 
                        <span
                          v-b-tooltip.hover
                          title="Any other personal information such as date of birth, gender identity, veteran status, etc."
                        >
                          Other info)
                        </span> 

                        <div>
                          <UIRadioGroup
                            v-model="questions.question1.question12.value"
                            :name="questions.question1.question12.name"
                            :options="questionOptions"
                          />
                        </div>
                   
                        <div>
                          Explain your selection
                          <UITextarea v-model="questions.question1.question12.explain" />
                        </div>
                      </li>

                      <!--  -->
                      <li>
                        Financial info (i.e., 
                        <span
                          v-b-tooltip.hover
                          title="Information about your financial accounts, such as credit card number."
                        >
                          User payment info,
                        </span> 
                        <span
                          v-b-tooltip.hover
                          title="Information about purchases or transactions you have made."
                        >
                          Purchase history,
                        </span> 

                        <span
                          v-b-tooltip.hover
                          title="Information about your credit. For example, your credit history or credit score."
                        >
                          Credit score,
                        </span> 

                        <span
                          v-b-tooltip.hover
                          title="Any other financial information, such as your salary or debts."
                        >
                          Other financial info)
                        </span> 

                        <div>
                          <UIRadioGroup
                            v-model="questions.question1.question13.value"
                            :name="questions.question1.question13.name"
                            :options="questionOptions"
                          />
                        </div>
                   
                        <div>
                          Explain your selection
                          <UITextarea v-model="questions.question1.question13.explain" />
                        </div>
                      </li>

                      <!--  -->
                      <li>
                        Health and fitness (i.e., 
                        <span
                          v-b-tooltip.hover
                          title="Information about your health, such as medical records or symptoms."
                        >
                          Health info,
                        </span> 
                        <span
                          v-b-tooltip.hover
                          title="Information about your fitness, such as exercise or other physical activity."
                        >
                          Fitness info)
                        </span> 

                        <div>
                          <UIRadioGroup
                            v-model="questions.question1.question14.value"
                            :name="questions.question1.question14.name"
                            :options="questionOptions"
                          />
                        </div>
                   
                        <div>
                          Explain your selection
                          <UITextarea v-model="questions.question1.question14.explain" />
                        </div>
                      </li>

                      <!--  -->
                      <li>
                        Messages (i.e., 
                        <span
                          v-b-tooltip.hover
                          title="Your emails, including the email subject line, sender, recipients, and the content of the email."
                        >
                          Emails,
                        </span> 
                        <span
                          v-b-tooltip.hover
                          title="Your text messages, including the sender, recipients, and the content of the message."
                        >
                          SMS or MMS,
                        </span> 
                        <span
                          v-b-tooltip.hover
                          title="Any other types of messages. For example, instant messages or chat content."
                        >
                          Other in-app messages)
                        </span> 

                        <div>
                          <UIRadioGroup
                            v-model="questions.question1.question15.value"
                            :name="questions.question1.question15.name"
                            :options="questionOptions"
                          />
                        </div>
                   
                        <div>
                          Explain your selection
                          <UITextarea v-model="questions.question1.question15.explain" />
                        </div>
                      </li>

                      <!--  -->
                      <li>
                        Photos and videos (i.e., 
                        <span
                          v-b-tooltip.hover
                          title="Your photos."
                        >
                          Photos,
                        </span> 
                        <span
                          v-b-tooltip.hover
                          title="Your videos."
                        >
                          Videos)
                        </span> 

                        <div>
                          <UIRadioGroup
                            v-model="questions.question1.question16.value"
                            :name="questions.question1.question16.name"
                            :options="questionOptions"
                          />
                        </div>
                   
                        <div>
                          Explain your selection
                          <UITextarea v-model="questions.question1.question16.explain" />
                        </div>
                      </li>

                      <!--  -->
                      <li>
                        Audio files (i.e., 
                        <span
                          v-b-tooltip.hover
                          title="Your voice, such as a voicemail or a sound recording."
                        >
                          Voice or sound recordings,
                        </span> 
                        <span
                          v-b-tooltip.hover
                          title="Your music files."
                        >
                          Music files,
                        </span> 

                        <span
                          v-b-tooltip.hover
                          title="Any other audio files you created or provided."
                        >
                          Other audio files)
                        </span>

                        <div>
                          <UIRadioGroup
                            v-model="questions.question1.question17.value"
                            :name="questions.question1.question17.name"
                            :options="questionOptions"
                          />
                        </div>
                   
                        <div>
                          Explain your selection
                          <UITextarea v-model="questions.question1.question17.explain" />
                        </div>
                      </li>

                      <!--  -->
                      <li>
                        Files and docs (i.e., 
                        <span
                          v-b-tooltip.hover
                          title="Your files or documents, or information about your files or documents, such as file names."
                        >
                          Files and docs)
                        </span> 

                        <div>
                          <UIRadioGroup
                            v-model="questions.question1.question18.value"
                            :name="questions.question1.question18.name"
                            :options="questionOptions"
                          />
                        </div>
                   
                        <div>
                          Explain your selection
                          <UITextarea v-model="questions.question1.question18.explain" />
                        </div>
                      </li>

                      <!--  -->
                      <li>
                        Calendar (i.e., 
                        <span
                          v-b-tooltip.hover
                          title="Information from your calendar, such as events, event notes, and attendees."
                        >
                          Calendar events)
                        </span> 

                        <div>
                          <UIRadioGroup
                            v-model="questions.question1.question19.value"
                            :name="questions.question1.question19.name"
                            :options="questionOptions"
                          />
                        </div>
                   
                        <div>
                          Explain your selection
                          <UITextarea v-model="questions.question1.question19.explain" />
                        </div>
                      </li>

                      <!--  -->
                      <li>
                        Contacts (i.e., 
                        <span
                          v-b-tooltip.hover
                          title="Information about your contacts, such as contact names, message history, and social graph information like usernames, contact recency, contact frequency, interaction duration, and call history."
                        >
                          Contacts)
                        </span> 

                        <div>
                          <UIRadioGroup
                            v-model="questions.question1.question110.value"
                            :name="questions.question1.question110.name"
                            :options="questionOptions"
                          />
                        </div>
                   
                        <div>
                          Explain your selection
                          <UITextarea v-model="questions.question1.question110.explain" />
                        </div>
                      </li>

                      <!--  -->
                      <li>
                        App activity (i.e., 
                        <span
                          v-b-tooltip.hover
                          title="Information about how you interact with the app. For example, the number of times you visit a page or sections you tap on."
                        >
                          App interactions,
                        </span> 

                        <span
                          v-b-tooltip.hover
                          title="Information about what you have searched for in the app."
                        >
                          In-app search history,
                        </span> 

                        <span
                          v-b-tooltip.hover
                          title="Information about the apps installed on your device."
                        >
                          Installed apps,
                        </span> 

                        <span
                          v-b-tooltip.hover
                          title="Any other content you generated that is not listed here, or in any other section. For example, bios, notes, or open-ended responses."
                        >
                          Other user-generated content,
                        </span> 

                        <span
                          v-b-tooltip.hover
                          title="Any other activity or actions in-app not listed here, such as gameplay, likes, and dialog options."
                        >
                          Other actions,
                        </span> 

                        <div>
                          <UIRadioGroup
                            v-model="questions.question1.question111.value"
                            :name="questions.question1.question111.name"
                            :options="questionOptions"
                          />
                        </div>
                   
                        <div>
                          Explain your selection
                          <UITextarea v-model="questions.question1.question111.explain" />
                        </div>
                      </li>

                      <!--  -->
                      <li>
                        Web browsing (i.e., 
                        <span
                          v-b-tooltip.hover
                          title="Information about the websites you have visited."
                        >
                          Web browsing history)
                        </span> 

                        <div>
                          <UIRadioGroup
                            v-model="questions.question1.question112.value"
                            :name="questions.question1.question112.name"
                            :options="questionOptions"
                          />
                        </div>
                   
                        <div>
                          Explain your selection
                          <UITextarea v-model="questions.question1.question112.explain" />
                        </div>
                      </li>

                      <!--  -->
                      <li>
                        App info and performance (i.e., 
                        <span
                          v-b-tooltip.hover
                          title="Crash data from the app. For example, the number of times the app has crashed on the device or other information directly related to a crash."
                        >
                          Crash logs,
                        </span>
                    
                        <span
                          v-b-tooltip.hover
                          title="Information about the performance of the app on the device. For example, battery life, loading time, latency, framerate, or any technical diagnostics."
                        >
                          Diagnostics,
                        </span>

                        <span
                          v-b-tooltip.hover
                          title="Any other app performance data not listed here."
                        >
                          Other app performance data)
                        </span>

                        <div>
                          <UIRadioGroup
                            v-model="questions.question1.question113.value"
                            :name="questions.question1.question113.name"
                            :options="questionOptions"
                          />
                        </div>
                   
                        <div>
                          Explain your selection
                          <UITextarea v-model="questions.question1.question113.explain" />
                        </div>
                      </li>


                      <!--  -->
                      <li>
                        Device or other IDs (i.e., 
                        <span
                          v-b-tooltip.hover
                          title="Identifiers that relate to an individual device, browser, or app. For example, an IMEI number, MAC address, Widevine Device ID, Firebase installation ID, or advertising identifier."
                        >
                          Device or other IDs)
                        </span>
                    
                        <div>
                          <UIRadioGroup
                            v-model="questions.question1.question114.value"
                            :name="questions.question1.question114.name"
                            :options="questionOptions"
                          />
                        </div>
                   
                        <div>
                          Explain your selection
                          <UITextarea v-model="questions.question1.question114.explain" />
                        </div>
                      </li>
                    </ol>
                  </div>
                </li>

                <li>
                  Which of the following purposes do you think is essential when collecting/sharing your personal data when you use apps on the Android platform?
                  <div>
                    <ol type="a">
                      <!--  -->
                      <li>
                        Account management (i.e., 
                        <span
                          v-b-tooltip.hover
                          title="For example, to let you:

Create accounts, or add information to an account the developer provides for use across its services.
Log in to the app, or verify your credentials."
                        >
                          Used for the setup or management of your account with the developer.)
                        </span> 

                        <div>
                          <UIRadioGroup
                            v-model="questions.question2.question21.value"
                            :name="questions.question2.question21.name"
                            :options="questionOptions"
                          />
                        </div>
                   
                        <div>
                          Explain your selection
                          <UITextarea v-model="questions.question2.question21.explain" />
                        </div>
                      </li>

                      <!--  -->
                      <li>
                        Advertising or marketing (i.e., 
                        <span
                          v-b-tooltip.hover
                          title="For example, displaying ads in your app, sending push notifications to promote other products or services, or sharing data with advertising partners."
                        >
                          Used to display or target ads or marketing communications, or measuring ad performance.)
                        </span> 

                        <div>
                          <UIRadioGroup
                            v-model="questions.question2.question22.value"
                            :name="questions.question2.question22.name"
                            :options="questionOptions"
                          />
                        </div>
                   
                        <div>
                          Explain your selection
                          <UITextarea v-model="questions.question2.question22.explain" />
                        </div>
                      </li>

                      <!--  -->
                      <li>
                        App functionality (i.e., 
                        <span
                          v-b-tooltip.hover
                          title="For example, to enable app features, or authenticate you."
                        >
                          Used for features that are available in the app.)
                        </span> 

                        <div>
                          <UIRadioGroup
                            v-model="questions.question2.question23.value"
                            :name="questions.question2.question23.name"
                            :options="questionOptions"
                          />
                        </div>
                   
                        <div>
                          Explain your selection
                          <UITextarea v-model="questions.question2.question23.explain" />
                        </div>
                      </li>

                      <!--  -->
                      <li>
                        Analytics (i.e., 
                        <span
                          v-b-tooltip.hover
                          title="For example, to see how many users are using a particular feature, to monitor app health, to diagnose and fix bugs or crashes, or to make future performance improvements."
                        >
                          Used to collect data about how you use the app or how it performs.)
                        </span> 

                        <div>
                          <UIRadioGroup
                            v-model="questions.question2.question24.value"
                            :name="questions.question2.question24.name"
                            :options="questionOptions"
                          />
                        </div>
                   
                        <div>
                          Explain your selection
                          <UITextarea v-model="questions.question2.question24.explain" />
                        </div>
                      </li>

                      <!--  -->
                      <li>
                        Developer communications (i.e., 
                        <span
                          v-b-tooltip.hover
                          title="For example, sending a push notification to inform you about new features of the app or an important security update."
                        >
                          Used to send news or notifications about the app or the developer.)
                        </span> 

                        <div>
                          <UIRadioGroup
                            v-model="questions.question2.question25.value"
                            :name="questions.question2.question25.name"
                            :options="questionOptions"
                          />
                        </div>
                   
                        <div>
                          Explain your selection
                          <UITextarea v-model="questions.question2.question25.explain" />
                        </div>
                      </li>

                      <!--  -->
                      <li>
                        Fraud prevention, security, and compliance (i.e., 
                        <span
                          v-b-tooltip.hover
                          title="For example, monitoring failed login attempts to identify possible fraudulent activity."
                        >
                          Used for fraud prevention, security, or compliance with laws.)
                        </span> 

                        <div>
                          <UIRadioGroup
                            v-model="questions.question2.question26.value"
                            :name="questions.question2.question26.name"
                            :options="questionOptions"
                          />
                        </div>
                   
                        <div>
                          Explain your selection
                          <UITextarea v-model="questions.question2.question26.explain" />
                        </div>
                      </li>

                      <li>
                        Personalization (i.e., 
                        <span
                          v-b-tooltip.hover
                          title="For example, suggesting playlists based on your listening habits or delivering local news based on your location."
                        >
                          Used to customize your app, such as showing recommended content or suggestions.)
                        </span> 

                        <div>
                          <UIRadioGroup
                            v-model="questions.question2.question27.value"
                            :name="questions.question2.question27.name"
                            :options="questionOptions"
                          />
                        </div>
                   
                        <div>
                          Explain your selection
                          <UITextarea v-model="questions.question2.question27.explain" />
                        </div>
                      </li>
                    </ol>
                  </div>
                </li>

                <li>
                  Do you think the following actions are not considered as collecting user data (i.e., apps’ data collection behavior)?
                  <div>
                    <ol type="a">
                      <!--  -->
                      <li>
                        <span
                          v-b-tooltip.hover
                          title="For example, if you provide an app permission to access your location, but it only uses that data to provide app functionality on your device and does not send it to its server, it does not need to disclose that data as collected."
                        >
                          An app accesses the data only on your device and it is not sent off your device.
                        </span> 

                        <div>
                          <UIRadioGroup
                            v-model="questions.question3.question31.value"
                            :name="questions.question3.question31.name"
                            :options="questionOptions2"
                          />
                        </div>
                   
                        <div>
                          Explain your selection
                          <UITextarea v-model="questions.question3.question31.explain" />
                        </div>
                      </li>

                      <!--  -->
                      <li>
                        <span
                          v-b-tooltip.hover
                          title="This means the developer accesses and uses your data only when it is stored in memory, and retains the data for no longer than necessary to service a specific request. For example, if a weather app sends your location off your device to get the current weather at your location, but the app only uses your location data in memory and does not store the data for longer than necessary to provide the weather."
                        >
                          Your data is sent off the device but only processed ephemerally.
                        </span> 

                        <div>
                          <UIRadioGroup
                            v-model="questions.question3.question32.value"
                            :name="questions.question3.question32.name"
                            :options="questionOptions2"
                          />
                        </div>
                   
                        <div>
                          Explain your selection
                          <UITextarea v-model="questions.question3.question32.explain" />
                        </div>
                      </li>

                      <!--  -->
                      <li>
                        <span
                          v-b-tooltip.hover
                          title="This means the data is unreadable by anyone other than the sender and recipient. For example, if you send a message to a friend using a messaging app with end-to-end encryption, only you and your friend can read the message."
                        >
                          Your data is sent using end-to-end encryption.
                        </span> 

                        <div>
                          <UIRadioGroup
                            v-model="questions.question3.question33.value"
                            :name="questions.question3.question33.name"
                            :options="questionOptions2"
                          />
                        </div>
                   
                        <div>
                          Explain your selection
                          <UITextarea v-model="questions.question3.question33.explain" />
                        </div>
                      </li>

                      <!--  -->
                      <li>
                        <span
                          v-b-tooltip.hover
                          v-b-tooltip.hover.html="true"
                          title="For example, an app may direct you to a payment service such as PayPal, Google Pay, or another similar service, to complete a purchase. In these cases, the app developer does not need to declare the data collected by the other service if:
<br>o The app does not access this information, and
<br>o You provide this information directly to the other service under that service’s
privacy policy and terms of service."
                        >
                          The apps may redirect you to a different service to complete a certain action.
                        </span> 

                        <div>
                          <UIRadioGroup
                            v-model="questions.question3.question34.value"
                            :name="questions.question3.question34.name"
                            :options="questionOptions2"
                          />
                        </div>
                   
                        <div>
                          Explain your selection
                          <UITextarea v-model="questions.question3.question34.explain" />
                        </div>
                      </li>
                    </ol>
                  </div>
                </li>

                <li>
                  Do you think the following actions are not considered as sharing user data (i.e., apps’ data sharing behavior)?
                  <div>
                    <ol type="a">
                      <!--  -->
                      <li>
                        <span
                          v-b-tooltip.hover
                          v-b-tooltip.hover.html="true"
                          title="For example, when you send an email to or share a document with another person."
                        >
                          The data is transferred to a third party based on a specific action that you initiate, where you reasonably expect the data to be shared
                        </span> 

                        <div>
                          <UIRadioGroup
                            v-model="questions.question4.question41.value"
                            :name="questions.question4.question41.name"
                            :options="questionOptions"
                          />
                        </div>
                   
                        <div>
                          Explain your selection
                          <UITextarea v-model="questions.question4.question41.explain" />
                        </div>
                      </li>

                      <!--  -->
                      <li>
                        <span
                          v-b-tooltip.hover
                          v-b-tooltip.hover.html="true"
                          title=""
                        >
                          The data transfer to a third party is prominently disclosed in the app, and the app requests your consent in a way that meets the requirements of <a
                            href="https://support.google.com/googleplay/android- developer/answer/10144311"
                            target="_blank"
                          > Google Play’s
                            User Data policy</a>
                        </span> 

                        <div>
                          <UIRadioGroup
                            v-model="questions.question4.question42.value"
                            :name="questions.question4.question42.name"
                            :options="questionOptions"
                          />
                        </div>
                   
                        <div>
                          Explain your selection
                          <UITextarea v-model="questions.question4.question42.explain" />
                        </div>
                      </li>

                      <!--  -->
                      <li>
                        <span
                          v-b-tooltip.hover
                          v-b-tooltip.hover.html="true"
                          title="For example, a developer may use a service provider to host data on their behalf and in compliance with the developer's instructions, contractual terms, privacy policies, and security standards."
                        >
                          The data is transferred to a service provider to process it on the developer’s behalf
                        </span> 

                        <div>
                          <UIRadioGroup
                            v-model="questions.question4.question43.value"
                            :name="questions.question4.question43.name"
                            :options="questionOptions"
                          />
                        </div>
                   
                        <div>
                          Explain your selection
                          <UITextarea v-model="questions.question4.question43.explain" />
                        </div>
                      </li>

                      <!--  -->
                      <li>
                        <span
                          v-b-tooltip.hover
                          v-b-tooltip.hover.html="true"
                          title="Such as in response to a government request."
                        >
                          The data is transferred for specific legal purposes
                        </span> 

                        <div>
                          <UIRadioGroup
                            v-model="questions.question4.question44.value"
                            :name="questions.question4.question44.name"
                            :options="questionOptions"
                          />
                        </div>
                   
                        <div>
                          Explain your selection
                          <UITextarea v-model="questions.question4.question44.explain" />
                        </div>
                      </li>

                      <!--  -->
                      <li>
                        <span
                          v-b-tooltip.hover
                          v-b-tooltip.hover.html="true"
                          title=""
                        >
                          The data transferred is fully anonymized so it can no longer be associated with any individual.
                        </span> 

                        <div>
                          <UIRadioGroup
                            v-model="questions.question4.question45.value"
                            :name="questions.question4.question45.name"
                            :options="questionOptions"
                          />
                        </div>
                   
                        <div>
                          Explain your selection
                          <UITextarea v-model="questions.question4.question45.explain" />
                        </div>
                      </li>
                    </ol>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
        <UINextButton />
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import UINextButton from '@/components/UINextButton.vue'
import { UPDATE_SURVEY } from '@/store/modules/user/action.type.js'
import UIRadioGroup from '@/components/UIRadioGroup.vue'
import UITextarea from '@/components/UITextarea.vue'
import { GET_ANSWER } from '@/store/modules/question/action.type.js'
import { GET_USER_INFO } from '@/store/modules/user/action.type.js'
import UILoader from '@/components/UILoader.vue'

const questionOptions = [{label: 'Yes', value: 1}, {label: 'No', value: 0}, {label: 'Maybe', value: 2} ]
const questionOptions2 = [{label: 'Agree', value: 1}, {label: 'Disagree', value: 0}, {label: 'Others (Lack of knowledge/background)', value: 2} ]

export default {
  components: {
    UINextButton,
    UIRadioGroup,
    UITextarea,
    UILoader
  },
  data: () => ({
    isLoading: true,
    isLoadingComment: true,
    questionOptions,
    questionOptions2,
    questions: {
      question1: {
        question11: {
          value: null,
          name: "question11",
          explain: ""
        },
        question12: {
          value: null,
          name: "question12",
          explain: ""
        },
        question13: {
          value: null,
          name: "question13",
          explain: ""
        },
        question14: {
          value: null,
          name: "question14",
          explain: ""
        },
        question15: {
          value: null,
          name: "question15",
          explain: ""
        },
        question16: {
          value: null,
          name: "question16",
          explain: ""
        },
        question17: {
          value: null,
          name: "question17",
          explain: ""
        },
        question18: {
          value: null,
          name: "question18",
          explain: ""
        },
        question19: {
          value: null,
          name: "question19",
          explain: ""
        },
        question110: {
          value: null,
          name: "question110",
          explain: ""
        },
        question111: {
          value: null,
          name: "question111",
          explain: ""
        },
        question112: {
          value: null,
          name: "question112",
          explain: ""
        },
        question113: {
          value: null,
          name: "question113",
          explain: ""
        },
        question114: {
          value: null,
          name: "question114",
          explain: ""
        }
      },
      question2: {
        question21: {
          value: null,
          name: "question21",
          explain: ""
        },
        question22: {
          value: null,
          name: "question22",
          explain: ""
        },
        question23: {
          value: null,
          name: "question23",
          explain: ""
        },
        question24: {
          value: null,
          name: "question24",
          explain: ""
        },
        question25: {
          value: null,
          name: "question25",
          explain: ""
        },
        question26: {
          value: null,
          name: "question26",
          explain: ""
        },
        question27: {
          value: null,
          name: "question27",
          explain: ""
        },
      },
      question3: {
        question31: {
          value: null,
          name: "question31",
          explain: ""
        },
        question32: {
          value: null,
          name: "question32",
          explain: ""
        },
        question33: {
          value: null,
          name: "question33",
          explain: ""
        },
        question34: {
          value: null,
          name: "question34",
          explain: ""
        },
      },
      question4: {
        question41: {
          value: null,
          name: "question41",
          explain: ""
        },
        question42: {
          value: null,
          name: "question42",
          explain: ""
        },
        question43: {
          value: null,
          name: "question43",
          explain: ""
        },
        question44: {
          value: null,
          name: "question44",
          explain: ""
        },
        question45: {
          value: null,
          name: "question45",
          explain: ""
        },
      },
    },
  }),
  computed: {
    ...mapGetters({
      survey: 'getSurvey',
    })
  },
  watch: {
    survey(survey) {
      if(!survey) return
      this.questions = survey
    },
    userInfo(userInfo) {
      if(!userInfo.isInstruction) this.$router.push('/')
    },
  },
  mounted() {
    Promise.all([
      this.$store.dispatch(GET_ANSWER),
      this.$store.dispatch(GET_USER_INFO),
    ]).then(() =>  this.isLoading = false)
  },
  methods: {
    next(e) {
      e.preventDefault();
      this.isLoading = true
      this.$store.dispatch(UPDATE_SURVEY, this.questions)
        .then(() => {
          this.isLoading = false
          this.$router.push('/questions')
        })
    },
  }
};
</script>