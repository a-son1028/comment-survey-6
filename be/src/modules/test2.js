import path from "path";
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
import "../configs/mongoose.config";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import Models from "../models";
import { Promise } from "bluebird";
import _, { isEmpty, isInteger, isNumber } from "lodash";
import natural from "natural";
import fs from "fs";
import Services from "../services";
const fastCSV = require("fast-csv");
const csv = require("csvtojson");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const DATA_TYPES = {
  Location: {
    "Approximate location": {
      desc:
        "Yours or your device's physical location to an area greater than or equal to 3 square kilometers, such as the city you are in."
    },
    "Precise location": {
      desc: "Yours or your device's physical location within an area less than 3 square kilometers."
    }
  },
  "Personal info": {
    Name: {
      desc: "How you refer to yourself, such as your first or last name, or nickname."
    },
    "Email address": {
      desc: "Your email address."
    },
    "User IDs": {
      desc:
        "Identifiers that relate to an identifiable person. For example, an account ID, account number, or account name."
    },
    Address: {
      desc: "Your address, such as a mailing or home address."
    },
    "Phone number": {
      desc: "Your phone number."
    },
    "Race and ethnicity": {
      desc: "Information about your race or ethnicity."
    },
    "Political or religious beliefs": {
      desc: "Information about your political or religious beliefs."
    },
    "Sexual orientation": {
      desc: "Information about your sexual orientation."
    },
    "Other info": {
      desc:
        "Any other personal information such as date of birth, gender identity, veteran status, etc."
    }
  },
  "Financial info": {
    "User payment info": {
      desc: "Information about your financial accounts, such as credit card number."
    },
    "Purchase history": {
      desc: "Information about purchases or transactions you have made."
    },
    "Credit score": {
      desc: "Information about your credit. For example, your credit history or credit score."
    },
    "Other financial info": {
      desc: "Any other financial information, such as your salary or debts."
    }
  },
  "Health and fitness": {
    "Health info": {
      desc: "Information about your health, such as medical records or symptoms."
    },
    "Fitness info": {
      desc: "Information about your fitness, such as exercise or other physical activity."
    }
  },
  Messages: {
    Emails: {
      desc:
        "Your emails, including the email subject line, sender, recipients, and the content of the email."
    },
    "SMS or MMS": {
      desc: "Your text messages, including the sender, recipients, and the content of the message."
    },
    "Other in-app messages": {
      desc: "Any other types of messages. For example, instant messages or chat content."
    }
  },
  "Photos and videos": {
    Photos: {
      desc: "Your photos."
    },
    Videos: {
      desc: "Your videos."
    }
  },
  "Audio files": {
    "Voice or sound recordings": {
      desc: "Your voice, such as a voicemail or a sound recording."
    },
    "Music files": {
      desc: "Your music files."
    },
    "Other audio files": {
      desc: "Any other audio files you created or provided."
    }
  },
  "Files and docs": {
    "Files and docs": {
      desc:
        "Your files or documents, or information about your files or documents, such as file names."
    }
  },
  Calendar: {
    "Calendar events": {
      desc: "Information from your calendar, such as events, event notes, and attendees."
    }
  },
  Contacts: {
    Contacts: {
      desc:
        "Information about your contacts, such as contact names, message history, and social graph information like usernames, contact recency, contact frequency, interaction duration, and call history."
    }
  },
  "App activity": {
    "App interactions": {
      desc:
        "Information about how you interact with the app. For example, the number of times you visit a page or sections you tap on."
    },
    "In-app search history": {
      desc: "Information about what you have searched for in the app."
    },
    "Installed apps": {
      desc: "Information about the apps installed on your device."
    },
    "Other user-generated content": {
      desc:
        "Any other content you generated that is not listed here, or in any other section. For example, bios, notes, or open-ended responses."
    },
    "Other actions": {
      desc:
        "Any other activity or actions in-app not listed here, such as gameplay, likes, and dialog options."
    }
  },
  "Web browsing": {
    "Web browsing history": {
      desc: "Information about the websites you have visited."
    }
  },
  "App info and performance": {
    "Crash logs": {
      desc:
        "Crash data from the app. For example, the number of times the app has crashed on the device or other information directly related to a crash."
    },
    Diagnostics: {
      desc:
        "Information about the performance of the app on the device. For example, battery life, loading time, latency, framerate, or any technical diagnostics."
    },
    "Other app performance data": {
      desc: "Any other app performance data not listed here"
    }
  },
  "Device or other IDs": {
    "Device or other IDs": {
      desc:
        "Identifiers that relate to an individual device, browser, or app. For example, an IMEI number, MAC address, Widevine Device ID, Firebase installation ID, or advertising identifier."
    }
  }
};
const DATA_PURPOSES = {
  "Account management": {
    desc: "Used for the setup or management of your account with the developer.",
    example: `For example, to let you:

    Create accounts, or add information to an account the developer provides for use across its services.
    Log in to the app, or verify your credentials.`
  },
  "Advertising or marketing": {
    desc: "Used to display or target ads or marketing communications, or measuring ad performance.",
    example:
      "For example, displaying ads in your app, sending push notifications to promote other products or services, or sharing data with advertising partners."
  },
  "App functionality": {
    desc: "Used for features that are available in the app.",
    example: "For example, to enable app features, or authenticate you."
  },
  Analytics: {
    desc: "Used to collect data about how you use the app or how it performs.",
    example:
      "For example, to see how many users are using a particular feature, to monitor app health, to diagnose and fix bugs or crashes, or to make future performance improvements."
  },
  "Developer communications": {
    desc: "Used to send news or notifications about the app or the developer.",
    example:
      "For example, sending a push notification to inform you about new features of the app or an important security update."
  },
  "Fraud prevention, security, and compliance": {
    desc: "Used for fraud prevention, security, or compliance with laws.",
    example:
      "For example, monitoring failed login attempts to identify possible fraudulent activity."
  },
  Personalization: {
    desc: "Used to customize your app, such as showing recommended content or suggestions.",
    example:
      "For example, suggesting playlists based on your listening habits or delivering local news based on your location."
  }
};
const QUESTION3 = {
  "An app accesses the data only on your device and it is not sent off your device.": "",
  "Your data is sent off the device but only processed ephemerally.": "",
  "Your data is sent using end-to-end encryption.": "",
  "The apps may redirect you to a different service to complete a certain action.": ""
};
const QUESTION4 = {
  "The data is transferred to a third party based on a specific action that you initiate, where you reasonably expect the data to be shared":
    "",
  "The data transfer to a third party is prominently disclosed in the app, and the app requests your consent in a way that meets the requirements of Google Play’s User Data policy":
    "",
  "The data is transferred to a service provider to process it on the developer’s behalf": "",
  "The data is transferred for specific legal purposes": "",
  "The data transferred is fully anonymized so it can no longer be associated with any individual.":
    ""
};


main();
async function main() {
  // await getSurveyStatPercent()
  // await getAppSelectionPercent()
  // await getUserSelectionPercent()
  // await getFirstQuestionStat()
  // await getQuestionStatByGroup()
  await transferPreprocessData()
  // await getDataSet()
  // await getEMAccuracy()

  // await mergeFiles() 
  // await mergeFiles2() 
  // await testData()
}
async function mergeFiles2() {
  const header = [
      {
        id: "stt",
        title: "",
      },
      {
        id: "ticker",
        title: "Ticker",
      },
      {
        id: "companyName",
        title: "Company Common Name",
      },
      {
        id: "ISIN",
        title: "ISIN",
      },
    ];
  const [[, ...data], [,...ISINCompanies]] = await Promise.all([
    csv({
      noheader: true,
      output: "csv"
    }).fromFile("/Users/a1234/Downloads/List-_1_.csv"),
    csv({
      noheader: true,
      output: "csv"
    }).fromFile("/Users/a1234/Downloads/Allcomp-_1_.csv")
  ]);

  const rows = data.map((similities, i) => {
    let ISINRecord
    let companyName
    similities.forEach(simility => {
      if(!ISINRecord) {
        ISINRecord = ISINCompanies.find(item => item[1] === simility)
        companyName = simility
      }
    })

    if(!companyName) {
      companyName = similities[1]
    }
  
    return {
      stt: i + 1,
      ticker: ISINRecord ? ISINRecord[0] : "",
      companyName,
       ISIN: ISINRecord ? ISINRecord[2] : ""
    }
  })
  const csvWriter = createCsvWriter({
      path: `./merged-file.csv`,
      header,
    });
  csvWriter.writeRecords(rows);
  console.log("DONE")
}

async function testData() {
  const data = await fs.readFileSync('/Users/a1234/Downloads/app-paragraph.json', { encoding: 'utf8' })
  const dataJson = JSON.parse(data)

  fs.writeFileSync("./app-paragraph(1).json", JSON.stringify(dataJson.splice(0, 2846)))
  fs.writeFileSync("./app-paragraph(2).json", JSON.stringify(dataJson.splice(0, 2846)))
  fs.writeFileSync("./app-paragraph(3).json", JSON.stringify(dataJson.splice(0, 2846)))
  fs.writeFileSync("./app-paragraph(4).json", JSON.stringify(dataJson))
}
async function mergeFiles() {
  const header = [
      {
        id: "securityName",
        title: "SecurityName",
      },
      {
        id: "type",
        title: "_TYPE_",
      },
      {
        id: "freq",
        title: "_FREQ_",
      },
      {
        id: "holdingWeight",
        title: "Holding_Weight",
      },
      {
        id: "holdingShares",
        title: "Holding_Shares",
      },
      {
        id: "holdingValue",
        title: "Holding_Value",
      },
      {
        id: "holdingShareChange",
        title: "Holding_Share_change",
      },
      {
        id: "length",
        title: "length",
      },
      {
        id: "year",
        title: "year",
      },
      {
        id: "ISIN",
        title: "ISIN",
      },
    ];
  const [[, ...data], [,...similities], [,...ISINCompanies]] = await Promise.all([
    csv({
      noheader: true,
      output: "csv"
    }).fromFile("/Users/a1234/Downloads/listfile.csv"),
    csv({
      noheader: true,
      output: "csv"
    }).fromFile("/Users/a1234/Downloads/List.csv"),
    csv({
      noheader: true,
      output: "csv"
    }).fromFile("/Users/a1234/Downloads/Allcomp.csv")
  ]);

  const rows = data.map(row => {
    const [securityName, type, freq, holdingWeight, holdingShares, holdingValue, holdingShareChange, length, year] = row

    const similitiesBysecurityName = similities.find(item => item.includes(securityName))

    let ISIN
    if(similitiesBysecurityName) {
      const ISINBySecurityName =  ISINCompanies.find(item => similitiesBysecurityName.includes(item[1]))

      if(ISINBySecurityName) {
        ISIN = ISINBySecurityName[2]
      }
    }
    return {
      securityName, type, freq, holdingWeight, holdingShares, holdingValue, holdingShareChange, length, year, ISIN: ISIN || ""
    }
  })

  const csvWriter = createCsvWriter({
      path: `./merged-file.csv`,
      header,
    });
  csvWriter.writeRecords(rows);
  console.log("DONE")
}

async function getDataSet() {
  const algorithms = [
    "EM", 
    // "SVM", 
    // "GradientBoostingClassifier", 
    // "AdaBoostClassifier",
    //  "GradientBoostingRegressor"
  ]

  const getDataSetByAlgorithms = async (algorithm) => {
    console.log(algorithm)

    const data = await csv({
      noheader: true,
      output: "csv"
    }).fromFile("./pre-process.csv");

    const [header, ...rows] = data
     const newHeader = [
      {
        id: 'id',
        title: algorithm
      }
    ]

    const trainingRows = rows.splice(0, 930)
    const testingRows = rows.map(row => {
      row[row.length - 1] = "-1"
      return row
    })

    let result;
    switch (algorithm) {
      case "EM":
        result = await Services.Prediction.getPredictEM({
          train: trainingRows,
          test: testingRows
        })
        break;
      case "SVM":
        result = await Services.Prediction.getPredictSVM({
          train: trainingRows,
          test: testingRows
        })
        break;
      case "GradientBoostingClassifier":
        result = await Services.Prediction.getPredictGradientBoostingClassifier({
          train: trainingRows,
          test: testingRows
        })
      case "AdaBoostClassifier":
        result = await Services.Prediction.getPredictAdaBoostClassifier({
          train: trainingRows,
          test: testingRows
        })
      case "GradientBoostingRegressor":
        result = await Services.Prediction.getPredictGradientBoostingRegressor({
          train: trainingRows,
          test: testingRows
        })
        break;
    }

    let newRows = []
    Array.from({ length: 930 }, () => {
      newRows.push({
        id: ""
      })
    })
    result.forEach(item => {
      newRows.push({
        id: item[0] == "0" ? "0" : "1"
      })
    })
    const csvWriter = createCsvWriter({
        path: `./pre-process-${algorithm}.csv`,
        header: newHeader,
      });
    csvWriter.writeRecords(newRows);
  }
 
  await Promise.map(algorithms, getDataSetByAlgorithms, { concurrency: 2 })



  console.log("DONE")
}

async function getEMAccuracy() {
  const algorithms = ["EM", 
  "SVM", 
  // "GradientBoostingClassifier", "AdaBoostClassifier", "GradientBoostingRegressor"
]

  for (let i = 0; i < algorithms.length; i++) {
    const algorithm = algorithms[i];
    
    const header = [
      {
        id: "stt",
        title: "#",
      },
      {
        id: "label",
        title: "Label",
      },
      {
        id: "predictLabel",
        title: "Predict label",
      },
    ];
    const testResult = await csv({
      noheader: true,
      output: "csv",
    }).fromFile(`./pre-process-${algorithm}.csv`);

    const testingFile = await csv({
      noheader: true,
      output: "csv",
    }).fromFile("./pre-process.csv");

    const rows = []
    testingFile.forEach((item, index) => {
      if(index !== 0 && testResult[index]) {
        const predictLabel = testResult[index][0] === "0" ? "0" : "1"

        console.log(predictLabel)
        rows.push({
          stt: index + 1,
          label: _.last(item),
          predictLabel,
        })
      }
    })

    const csvWriter = createCsvWriter({
      path: "./report-label-merged-predict-label.csv",
      header,
    });
    await csvWriter.writeRecords(rows);
    
    let X = 0,
      Y = 0,
      Z = 0,
      W = 0;
    testingFile.forEach((item, index) => {
      if(index !== 0 && testResult[index]) {
        const predictLabel = Number(testResult[index][0] === "0" ? "0" : "1")
        const label = Number(_.last(item))

        if (predictLabel === 0 && label === 0) X++;
        else if (predictLabel === 1 && label === 0) Y++;
        else if (predictLabel === 0 && label === 1) Z++;
        else if (predictLabel === 1 && label === 1) W++;
      }
    })

    const PrecisionBenign = X / (X + Z);
    const RecallBenign = X / (X + Y);
    const F1Benign =
      (2 * (PrecisionBenign * RecallBenign)) / (PrecisionBenign + RecallBenign);

    const Accuracy = (X + W) / (X + Y + Z + W);

    const headerAccuracy = [
      {
        id: "name",
        title: "",
      },
      {
        id: "begin",
        title: "",
      },
    ];

    const rowsAccuracy = [
      {
        name: "Percision",
        begin: PrecisionBenign,
      },
      {
        name: "Recall",
        begin: RecallBenign,
      },
      {
        name: "F1",
        begin: F1Benign,
      },
      {
        name: "Accuracy",
        begin: Accuracy,
      },
    ];

    const csvWriterAccuracy = createCsvWriter({
      path: `${algorithm}-Accuracy.csv`,
      header: headerAccuracy,
    });
    await csvWriterAccuracy.writeRecords(rowsAccuracy);

  }
	
	console.log("DONE") 

}

async function transferPreprocessData() {
  const data = await csv({
    noheader: true,
    output: "csv"
  }).fromFile("/Users/a1234/Downloads/Macro.csv");

  const [header,...rows] = data

  const temp = header.reduce((acc, headerName, index) => {

    const values = rows.reduce((acc, row) => {
      acc.push(row[index]);
      return acc
    }, [])

    const validValues = values.map(item => Number(item)).filter(item => item && isInteger(item))

    acc[headerName] =  { 
      data: {},
      count: (_.max(validValues) + 1) || 0
    }
    return acc
  }, {})

  let newRows = []
  rows.forEach((row, index) => {
    const newRow = {}
    row.forEach((item, index2) => {
      const headerName = header[index2]
      const headerNameSlug = _.kebabCase(headerName)
      const isIntegerItem = isInteger(Number(item))
      
      if(item && isIntegerItem) {
        newRow[headerNameSlug] = item
      } else {
        const tempHeader = temp[headerName]

        if(tempHeader.data[item] === undefined) {
          tempHeader.data[item] = temp[headerName].count++
        }

        newRow[headerNameSlug] = tempHeader.data[item]
      }
    })

    newRows.push(newRow)
  })

  newRows = newRows.map(item => {
    item['relationshipto-shooter'] = item['relationshipto-shooter'] === '0' ? '0' : '1'

    return item
  })

  const newHeader = header.reduce((acc, headerName) => {
    acc.push({
      id: _.kebabCase(headerName),
      title: headerName
    })

    return acc
  }, [])

  let text = ''
  Object.entries(temp).forEach(([headerName, { data}]) => {
    if(!isEmpty(data)) {
      text += `"${headerName}"\n`
      Object.entries(data).forEach(([name, value]) => {
        text += `"${name}", ${value} \n`
      })

      text += `============================`
      text += `\n`
    }
  })
  fs.writeFileSync('./process-note-Marco.txt', text, { encoding: 'utf-8' })

  const csvWriter = createCsvWriter({
      path: `./pre-process-Marco.csv`,
      header: newHeader,
      fieldDelimiter: ",",
      alwaysQuote: true,
    });
  csvWriter.writeRecords(newRows);

  console.log("DONE")
}


async function getQuestionStatByGroup() {
  const dataTypeNames = Object.keys(DATA_TYPES)
  const purposeNames = Object.keys(DATA_PURPOSES)
   const header = []
  
  // add header 
  dataTypeNames.forEach(dataTypeName => {
    header.push({
      id: `${dataTypeName}.collection`,
      title: `${dataTypeName}.Collection`
    })
  })
  dataTypeNames.forEach(dataTypeName => {
     header.push({
      id: `${dataTypeName}.sharing`,
      title: `${dataTypeName}.Sharing`
    })
  })

  dataTypeNames.forEach(dataTypeName => {
    purposeNames.forEach(purposeName => {
      header.push({
        id: `${dataTypeName}.collection.${purposeName}`,
        title: `${dataTypeName}.Collection.${purposeName}`
      })
    })
  })

  dataTypeNames.forEach(dataTypeName => {
    purposeNames.forEach(purposeName => {
      header.push({
        id: `${dataTypeName}.sharing.${purposeName}`,
        title: `${dataTypeName}.Sharing.${purposeName}`
      })
    })
  })

  const answers = await Models.Answer.find({
    _id: { $ne: "63f34befa59453001352999d" }
  })

  const types = ['yes', 'no']
  for (let k = 0; k < types.length; k++) {
    const result = {}
    const type = types[k];
    
    for (let i = 0; i < answers.length; i++) {
      const { questions, userId, survey } = answers[i];
      
      for (let j = 0; j < questions.length; j++) {
        const { appId, responses: { question1, question2, question3, question4, question5 } } = questions[j];
        
        if(question1 && question1.name && ((type === 'yes' && question1.value === 1) || (type === 'no' && question1.value === 0))) {
          // question2
          dataTypeNames.forEach(dataTypeName => {
            const itemsOfDataType = Object.entries(question2 || {}).filter(([nameSlug]) => {
              const [name] = nameSlug.split("+")

              return name === _.kebabCase(dataTypeName)
            }).map(item => item[1])

            const sectionType = 'collection'
            if(!result[sectionType]) result[sectionType] = {}
            if(!result[sectionType][dataTypeName]) {
              result[sectionType][dataTypeName] = {
                yes: 0,
                no: 0,
                maybe: 0,
              }
            }

            const yesApp = _.map(itemsOfDataType, 'value').filter(value => value > 3).length
            const noApp = _.map(itemsOfDataType, 'value').filter(value => value < 3).length
            const maybeApp = _.map(itemsOfDataType, 'value').filter(value => value === 3).length

          
            const  { yes, no, maybe} = result[sectionType][dataTypeName]
            result[sectionType][dataTypeName] = {
              yes: yes + yesApp,
              no: no + noApp,
              maybe: maybe + maybeApp,
            }
          })

          // question3
          dataTypeNames.forEach(dataTypeName => {
            const itemsOfDataType = Object.entries(question3 || {}).filter(([nameSlug]) => {
              const [name] = nameSlug.split("+")

              return name === _.kebabCase(dataTypeName)
            }).map(item => item[1])

            const sectionType = 'collectionPurpose'
            if(!result[sectionType]) result[sectionType] = {}

            if(!result[sectionType][dataTypeName]) result[sectionType][dataTypeName] = {}

            purposeNames.forEach(purposeName => {
              const itemsOfPurpose = itemsOfDataType.filter(({name: nameSlug}) => {
                const name = nameSlug.split("+").pop()

                return name === _.kebabCase(purposeName)
              })
              
              if(!result[sectionType][dataTypeName][purposeName]) {
                result[sectionType][dataTypeName][purposeName] = {
                  yes: 0,
                  no: 0,
                  maybe: 0,
                }
              }

              const yesApp = _.map(itemsOfPurpose, 'value').filter(value => value > 3).length
              const noApp = _.map(itemsOfPurpose, 'value').filter(value => value < 3).length
              const maybeApp = _.map(itemsOfPurpose, 'value').filter(value => value === 3).length

            
              const  { yes, no, maybe} = result[sectionType][dataTypeName][purposeName]
              result[sectionType][dataTypeName][purposeName] = {
                yes: yes + yesApp,
                no: no + noApp,
                maybe: maybe + maybeApp,
              }
            })
          })

          // question4
          dataTypeNames.forEach(dataTypeName => {
            const itemsOfDataType = Object.entries(question4 || {}).filter(([nameSlug]) => {
              const [name] = nameSlug.split("+")

              return name === _.kebabCase(dataTypeName)
            }).map(item => item[1])

            const sectionType = 'sharing'
            if(!result[sectionType]) result[sectionType] = {}
            if(!result[sectionType][dataTypeName]) {
              result[sectionType][dataTypeName] = {
                yes: 0,
                no: 0,
                maybe: 0,
              }
            }

            const yesApp = _.map(itemsOfDataType, 'value').filter(value => value > 3).length
            const noApp = _.map(itemsOfDataType, 'value').filter(value => value < 3).length
            const maybeApp = _.map(itemsOfDataType, 'value').filter(value => value === 3).length

            const  { yes, no, maybe} = result[sectionType][dataTypeName]
            result[sectionType][dataTypeName] = {
              yes: yes + yesApp,
              no: no + noApp,
              maybe: maybe + maybeApp,
            }
          })

          // question5
          dataTypeNames.forEach(dataTypeName => {
            const itemsOfDataType = Object.entries(question5 || {}).filter(([nameSlug]) => {
              const [name] = nameSlug.split("+")

              return name === _.kebabCase(dataTypeName)
            }).map(item => item[1])

            const sectionType = 'sharingPurpose'
            if(!result[sectionType]) result[sectionType] = {}

            if(!result[sectionType][dataTypeName]) result[sectionType][dataTypeName] = {}

            purposeNames.forEach(purposeName => {
              const itemsOfPurpose = itemsOfDataType.filter(({name: nameSlug}) => {
                const name = nameSlug.split("+").pop()

                return name === _.kebabCase(purposeName)
              })
              
              if(!result[sectionType][dataTypeName][purposeName]) {
                result[sectionType][dataTypeName][purposeName] = {
                  yes: 0,
                  no: 0,
                  maybe: 0,
                }
              }

              const yesApp = _.map(itemsOfPurpose, 'value').filter(value => value > 3).length
              const noApp = _.map(itemsOfPurpose, 'value').filter(value => value < 3).length
              const maybeApp = _.map(itemsOfPurpose, 'value').filter(value => value === 3).length

            
              const  { yes, no, maybe} = result[sectionType][dataTypeName][purposeName]
              result[sectionType][dataTypeName][purposeName] = {
                yes: yes + yesApp,
                no: no + noApp,
                maybe: maybe + maybeApp,
              }
            })
          })
        }
      
      }
    }

    const rows = []
    const row = {}
    const { collection, collectionPurpose, sharing, sharingPurpose } = result
    // collection 
    Object.entries(collection || {}).forEach(([dataType, { yes, no, maybe }]) => {
      
      if(yes + no + maybe !== 0) {
        row[`${dataType}.collection`] = `Yes(${yes} apps - ${(yes / (yes + no + maybe) * 100).toFixed(2)}%) - Maybe(${maybe} apps - ${(maybe / (yes + no + maybe) * 100).toFixed(2)}%) - No(${no} apps - ${(no / (yes + no + maybe) * 100).toFixed(2)}%)`
      }
    })

    // sharing 
    Object.entries(sharing || {}).forEach(([dataType, { yes, no, maybe }]) => {
      
      if(yes + no + maybe !== 0) {
        row[`${dataType}.sharing`] = `Yes(${yes} apps - ${(yes / (yes + no + maybe) * 100).toFixed(2)}%) - Maybe(${maybe} apps - ${(maybe / (yes + no + maybe) * 100).toFixed(2)}%) - No(${no} apps - ${(no / (yes + no + maybe) * 100).toFixed(2)}%)`
      }
    })

    // collectionPurpose
    Object.entries(collectionPurpose || {}).forEach(([dataType, purposes]) => {
      Object.entries(purposes).forEach(([purposeName, { yes, no, maybe }]) => {
        if(yes + no + maybe !== 0) {
          row[`${dataType}.collection.${purposeName}`] = `Yes(${yes} apps - ${(yes / (yes + no + maybe) * 100).toFixed(2)}%) - Maybe(${maybe} apps - ${(maybe / (yes + no + maybe) * 100).toFixed(2)}%) - No(${no} apps - ${(no / (yes + no + maybe) * 100).toFixed(2)}%)`
        }
      })
    })

    // sharingPurpose
    Object.entries(sharingPurpose || {}).forEach(([dataType, purposes]) => {
      Object.entries(purposes).forEach(([purposeName, { yes, no, maybe }]) => {
        if(yes + no + maybe !== 0) {
          row[`${dataType}.sharing.${purposeName}`] = `Yes(${yes} apps - ${(yes / (yes + no + maybe) * 100).toFixed(2)}%) - Maybe(${maybe} apps - ${(maybe / (yes + no + maybe) * 100).toFixed(2)}%) - No(${no} apps - ${(no / (yes + no + maybe) * 100).toFixed(2)}%)`
        }
      })
    })
    rows.push(row)


    const csvWriter = createCsvWriter({
      path: `./question-stat-by-group(${type}).csv`,
      header,
    });
    csvWriter.writeRecords(rows);
  }
  console.log("DONE");
}

async function getFirstQuestionStat() {
 const answers = await Models.Answer.find({
    _id: { $ne: "63f34befa59453001352999d" }
  })

  const result = {
    yes: 0,
    no: 0
  }
  for (let i = 0; i < answers.length; i++) {
    const { questions, userId, survey } = answers[i];

    for (let j = 0; j < questions.length; j++) {
      const { appId, responses: { question1 } } = questions[j];

      if(question1 && question1.name) {
        if(question1.value === 1) {
          result.yes++
        } else {
          result.no++
        }
      }
    }
  }

  const { yes, no } = result
  const content = `Yes: ${(yes / (no + yes) * 100).toFixed(2)}% - No: ${(no / (no + yes) * 100).toFixed(2)}%`
  fs.writeFileSync('./first-question-stat.txt', content, { encoding: 'utf-8' })
  console.log("DONE")
}

async function getUserSelectionPercent() {
  const dataTypeNames = Object.keys(DATA_TYPES)
  const purposeNames = Object.keys(DATA_PURPOSES)
  
  const result = {}
  const answers = await Models.Answer.find({
    _id: { $ne: "63f34befa59453001352999d" }
  })

  for (let i = 0; i < answers.length; i++) {
    const { questions, userId, survey } = answers[i];
    result[userId] = {}
    
    for (let j = 0; j < questions.length; j++) {
      const { appId, responses: { question2, question3, question4, question5 } } = questions[j];

      // question2
      dataTypeNames.forEach(dataTypeName => {
        const itemsOfDataType = Object.entries(question2 || {}).filter(([nameSlug]) => {
          const [name] = nameSlug.split("+")

          return name === _.kebabCase(dataTypeName)
        }).map(item => item[1])

        const sectionType = 'collection'
        if(!result[userId][sectionType]) result[userId][sectionType] = {}
        if(!result[userId][sectionType][dataTypeName]) {
          result[userId][sectionType][dataTypeName] = {
            nec: 0,
            unnect: 0,
            totalNec: 0,
            totalUnnect: 0
          }
        }

        const necApp = _.map(itemsOfDataType, 'value').filter(value => value >= 3).length
        const unnecApp = _.map(itemsOfDataType, 'value').filter(value => value < 3).length

       
        const  { nec, unnect, totalNec, totalUnnect} = result[userId][sectionType][dataTypeName]
        result[userId][sectionType][dataTypeName] = {
          nec: nec + necApp,
          unnect: unnect + unnecApp,
          totalNec: necApp > 0 ? totalNec + 1 : totalNec,
          totalUnnect: unnecApp > 0 ? totalUnnect + 1 : totalUnnect,
        }
      })

      // question3
      dataTypeNames.forEach(dataTypeName => {
        const itemsOfDataType = Object.entries(question3 || {}).filter(([nameSlug]) => {
          const [name] = nameSlug.split("+")

          return name === _.kebabCase(dataTypeName)
        }).map(item => item[1])

        const sectionType = 'collectionPurpose'
        if(!result[userId][sectionType]) result[userId][sectionType] = {}

        if(!result[userId][sectionType][dataTypeName]) result[userId][sectionType][dataTypeName] = {}

        purposeNames.forEach(purposeName => {
          const itemsOfPurpose = itemsOfDataType.filter(({name: nameSlug}) => {
            const name = nameSlug.split("+").pop()

            return name === _.kebabCase(purposeName)
          })
          
          if(!result[userId][sectionType][dataTypeName][purposeName]) {
            result[userId][sectionType][dataTypeName][purposeName] = {
              nec: 0,
              unnect: 0,
              totalNec: 0,
              totalUnnect: 0
            }
          }

          const necApp = _.map(itemsOfPurpose, 'value').filter(value => value >= 3).length
          const unnecApp = _.map(itemsOfPurpose, 'value').filter(value => value < 3).length

        
          const  { nec, unnect, totalNec, totalUnnect} = result[userId][sectionType][dataTypeName][purposeName]
          result[userId][sectionType][dataTypeName][purposeName] = {
            nec: nec + necApp,
            unnect: unnect + unnecApp,
            totalNec: necApp > 0 ? totalNec + 1 : totalNec,
            totalUnnect: unnecApp > 0 ? totalUnnect + 1 : totalUnnect,
          }
        })
      })


      // question4
      dataTypeNames.forEach(dataTypeName => {
        const itemsOfDataType = Object.entries(question4 || {}).filter(([nameSlug]) => {
          const [name] = nameSlug.split("+")

          return name === _.kebabCase(dataTypeName)
        }).map(item => item[1])

        const sectionType = 'sharing'
        if(!result[userId][sectionType]) result[userId][sectionType] = {}
        if(!result[userId][sectionType][dataTypeName]) {
          result[userId][sectionType][dataTypeName] = {
            nec: 0,
            unnect: 0,
            totalNec: 0,
            totalUnnect: 0
          }
        }

        const necApp = _.map(itemsOfDataType, 'value').filter(value => value >= 3).length
        const unnecApp = _.map(itemsOfDataType, 'value').filter(value => value < 3).length

       
        const  { nec, unnect, totalNec, totalUnnect} = result[userId][sectionType][dataTypeName]
        result[userId][sectionType][dataTypeName] = {
          nec: nec + necApp,
          unnect: unnect + unnecApp,
          totalNec: necApp > 0 ? totalNec + 1 : totalNec,
          totalUnnect: unnecApp > 0 ? totalUnnect + 1 : totalUnnect,
        }
      })

      // question5
      dataTypeNames.forEach(dataTypeName => {
        const itemsOfDataType = Object.entries(question5 || {}).filter(([nameSlug]) => {
          const [name] = nameSlug.split("+")

          return name === _.kebabCase(dataTypeName)
        }).map(item => item[1])

        const sectionType = 'sharingPurpose'
        if(!result[userId][sectionType]) result[userId][sectionType] = {}

        if(!result[userId][sectionType][dataTypeName]) result[userId][sectionType][dataTypeName] = {}

        purposeNames.forEach(purposeName => {
          const itemsOfPurpose = itemsOfDataType.filter(({name: nameSlug}) => {
            const name = nameSlug.split("+").pop()

            return name === _.kebabCase(purposeName)
          })
          
          if(!result[userId][sectionType][dataTypeName][purposeName]) {
            result[userId][sectionType][dataTypeName][purposeName] = {
              nec: 0,
              unnect: 0,
              totalNec: 0,
              totalUnnect: 0
            }
          }

          const necApp = _.map(itemsOfPurpose, 'value').filter(value => value >= 3).length
          const unnecApp = _.map(itemsOfPurpose, 'value').filter(value => value < 3).length

        
          const  { nec, unnect, totalNec, totalUnnect} = result[userId][sectionType][dataTypeName][purposeName]
          result[userId][sectionType][dataTypeName][purposeName] = {
            nec: nec + necApp,
            unnect: unnect + unnecApp,
            totalNec: necApp > 0 ? totalNec + 1 : totalNec,
            totalUnnect: unnecApp > 0 ? totalUnnect + 1 : totalUnnect,
          }
        })
      })
    }

    const { question1, question2, question3, question4 } = survey

    // question1
    result[userId]['question1'] = {}
    dataTypeNames.forEach((dataTypeName, i) => {
      const value = question1[`question1${i + 1}`]?.value

      if(value) result[userId]['question1'][dataTypeName] = value
    })

    // question2
    result[userId]['question2'] = {}
    purposeNames.forEach((purposeName, i) => {
      const value = question2[`question2${i + 1}`]?.value

      if(value) result[userId]['question2'][purposeName] = value
    })
  }

  const getLabelFor3Value = value => {
    return `${value === 1 ? "Y" : value === 0 ? "N" : "M"}`;
  }
  const header = [
    {
      id: "stt",
      title: "#"
    },
    {
      id: "email",
      title: "Email"
    },
  ]
  
  // add header 
  dataTypeNames.forEach(dataTypeName => {
    header.push({
      id: `${dataTypeName}.collection`,
      title: `${dataTypeName}.Collection`
    })
  })
  dataTypeNames.forEach(dataTypeName => {
     header.push({
      id: `${dataTypeName}.sharing`,
      title: `${dataTypeName}.Sharing`
    })
  })

  dataTypeNames.forEach(dataTypeName => {
    purposeNames.forEach(purposeName => {
      header.push({
        id: `${dataTypeName}.collection.${purposeName}`,
        title: `${dataTypeName}.Collection.${purposeName}`
      })
    })
  })

  dataTypeNames.forEach(dataTypeName => {
    purposeNames.forEach(purposeName => {
      header.push({
        id: `${dataTypeName}.sharing.${purposeName}`,
        title: `${dataTypeName}.Sharing.${purposeName}`
      })
    })
  })
  
  const rows = []
  const users = Object.entries(result)
  for (let i = 0; i < users.length; i++) {
    const [userId, { collection, collectionPurpose, sharing, sharingPurpose, question1, question2 }] = users[i];

    const user = await Models.User.findById(userId).select('email')
    const row = {
      stt: i + 1,
      email: user.email
    }
    
    // collection 
    Object.entries(collection || {}).forEach(([dataType, { nec, unnect, totalNec, totalUnnect }]) => {
      
      if(totalNec + totalUnnect !== 0) {
        row[`${dataType}.collection`] = `${getLabelFor3Value(question1[dataType])} - Un(${totalUnnect} apps - ${(unnect / (nec + unnect) * 100).toFixed(2)}%) - Nec(${totalNec} apps - ${(nec / (nec + unnect) * 100).toFixed(2)}%)`
      }
    })

    // sharing 
    Object.entries(sharing || {}).forEach(([dataType, { nec, unnect, totalNec, totalUnnect }]) => {
      
      if(totalNec + totalUnnect !== 0) {
        row[`${dataType}.sharing`] = `${getLabelFor3Value(question1[dataType])} - Un(${totalUnnect} apps - ${(unnect / (nec + unnect) * 100).toFixed(2)}%) - Nec(${totalNec} apps - ${(nec / (nec + unnect) * 100).toFixed(2)}%)`
      }
    })

    // collectionPurpose
    Object.entries(collectionPurpose || {}).forEach(([dataType, purposes]) => {
      Object.entries(purposes).forEach(([purposeName, { nec, unnect, totalNec, totalUnnect }]) => {
        if(totalNec + totalUnnect !== 0) {
          row[`${dataType}.collection.${purposeName}`] = `${getLabelFor3Value(question2[purposeName])} - Un(${totalUnnect} apps - ${(unnect / (nec + unnect) * 100).toFixed(2)}%) - Nec(${totalNec} apps - ${(nec / (nec + unnect) * 100).toFixed(2)}%)`
        }
      })
    })

    // sharingPurpose
    Object.entries(sharingPurpose || {}).forEach(([dataType, purposes]) => {
      Object.entries(purposes).forEach(([purposeName, { nec, unnect, totalNec, totalUnnect }]) => {
        if(totalNec + totalUnnect !== 0) {
          row[`${dataType}.sharing.${purposeName}`] = `${getLabelFor3Value(question2[purposeName])} - Un(${totalUnnect} apps - ${(unnect / (nec + unnect) * 100).toFixed(2)}%) - Nec(${totalNec} apps - ${(nec / (nec + unnect) * 100).toFixed(2)}%)`
        }
      })
    })

    rows.push(row)
  }


  const csvWriter = createCsvWriter({
    path: "./user-selection.csv",
    header,
  });
  csvWriter.writeRecords(rows);

  console.log("DONE");
}
async function getAppSelectionPercent() {
  const header = [
    {
      id: "stt",
      title: "#"
    },
    {
      id: "appName",
      title: "App Name"
    },
    {
      id: "agree",
      title: "Agree"
    },
    {
      id: "disagree",
      title: "Disagree"
    }
  ];
  let rows = []
  const answers = await Models.Answer.find({
    _id: { $ne: "63f34befa59453001352999d" }
  })

  let stt = 1
  for (let i = 0; i < answers.length; i++) {
    const {questions} = answers[i];
    
    for (let j = 0; j < questions.length; j++) {
      const { appId, responses: { question2, question3, question4, question5 } } = questions[j];
      const app = await Models.App.findById(appId).select('appName')

      let agree = 0, disagree = 0

      const valueArr = [...Object.values(question2 || {}), ...Object.values(question3 || {}), ...Object.values(question4 || {}), ...Object.values(question5 || {})]
      valueArr.forEach(item => {
        if(item.value >= 3) agree++
        else disagree++
      })

      if(agree + disagree !== 0) {
         rows.push({
          stt: stt++,
          appName: app.appName,
          agree: Number((agree / (agree + disagree) * 100).toFixed(2)),
          disagree: Number((disagree / (agree + disagree) * 100).toFixed(2)),
        })
      }
    }
  }
  
  rows = _.orderBy(rows, ['agree', 'disagree'], ['desc', 'desc'])
  console.log(rows)

  rows = rows.map((row, i) => {
    return {
      ...row,
      stt: i+ 1
    }
  })
  const csvWriter = createCsvWriter({
    path: "./app-selection(percent).csv",
    header,
  });
  csvWriter.writeRecords(rows);
  console.log("DONE")
}
async function getSurveyStatPercent() {
const answers = await Models.Answer.find({
  _id: { $ne: "63f34befa59453001352999d" }
})

  let content = ''
  let result = {
    question1: {},
    question2: {},
    question3: {},
    question4: {},
  };
  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];
    const {
      survey: { question1, question2, question3, question4 }
    } = answer;

    // console.log(question2)
    // question1
    Array.from({ length: 14 }, (v, i) => {
      if(!result.question1[ i+ 1]) {
        result.question1[ i+ 1] = {
      0: 0,
      1: 0,
      2: 0,
    }
      }
      const userValue = question1?.[`question1${i+1}`]?.value
      
      if(userValue) {
        result.question1[i+ 1][userValue]++
      }
    });

    // question2
    Array.from({ length: 7 }, (v, i) => {
      if(!result.question2[ i+ 1]) {
        result.question2[ i+ 1] = {
      0: 0,
      1: 0,
      2: 0,
    }
      }
      const userValue = question2?.[`question2${i+1}`]?.value
      
      if(userValue) {
        result.question2[i+ 1][userValue]++
      }
    });

    // question3
    Array.from({ length: 4 }, (v, i) => {
      if(!result.question3[ i+ 1]) {
        result.question3[ i+ 1] = {
      0: 0,
      1: 0,
      2: 0,
    }
      }
      const userValue = question3?.[`question3${i+1}`]?.value
      
      if(userValue) {
        result.question3[i+ 1][userValue]++
      }
    });

    // question4
    Array.from({ length: 5 }, (v, i) => {
      if(!result.question4[ i+ 1]) {
        result.question4[ i+ 1] = {
      0: 0,
      1: 0,
      2: 0,
    }
      }
      const userValue = question4?.[`question4${i+1}`]?.value
      
      if(userValue) {
        result.question4[i+ 1][userValue]++
      }
    });
  }

  console.log(result)

  const indexToAlpha = (num = 1) => {
   // ASCII value of first character
   const A = 'A'.charCodeAt(0);
   let numberToCharacter = number => {
      return String.fromCharCode(A + number);
   };
   return numberToCharacter(num).toLowerCase();
};
  // question1
  content += `I - Which of the following information do you think is your personal information (i.e., access restrictions) when you using the apps on the Android platform? \n`
  Object.entries(DATA_TYPES).forEach(([name], i) => {
    const questionResult = result.question1[i + 1]
    const total = _.sum(Object.values(questionResult))

    content += `1.${indexToAlpha(i)}) ${name} #Yes (${((questionResult[1] / total) * 100).toFixed(2)}%) #No (${((questionResult[0] / total) * 100).toFixed(2)}%) #Maybe (${((questionResult[2] / total) * 100).toFixed(2)}%)\n`
  })

  // question2
  content += `\nII - Which of the following purposes do you think is essential when collecting/sharing your personal data when you use apps on the Android platform? \n`
  Object.entries(DATA_PURPOSES).forEach(([name], i) => {
    const questionResult = result.question2[i + 1]
    const total = _.sum(Object.values(questionResult))

    content += `2.${indexToAlpha(i)}) ${name} #Yes (${((questionResult[1] / total) * 100).toFixed(2)}%) #No (${((questionResult[0] / total) * 100).toFixed(2)}%) #Maybe (${((questionResult[2] / total) * 100).toFixed(2)}%)\n`
  })

  // question3
  content += `\nIII - Do you think the following actions are not considered as collecting user data (i.e., apps’ data collection behavior)? \n`
  Object.entries(QUESTION3).forEach(([name], i) => {
    const questionResult = result.question3[i + 1]
    const total = _.sum(Object.values(questionResult))

    content += `3.${indexToAlpha(i)}) ${name} 
    #Yes (${((questionResult[1] / total) * 100).toFixed(2)}%) #No (${((questionResult[0] / total) * 100).toFixed(2)}%) #Maybe (${((questionResult[2] / total) * 100).toFixed(2)}%)\n`
  })

  // question4
  content += `\nIV - Do you think the following actions are not considered as sharing user data (i.e., apps’ data sharing behavior)? \n`
  Object.entries(QUESTION4).forEach(([name], i) => {
    const questionResult = result.question4[i + 1]
    const total = _.sum(Object.values(questionResult))

    content += `4.${indexToAlpha(i)}) ${name} 
    #Yes (${((questionResult[1] / total) * 100).toFixed(2)}%) #No (${((questionResult[0] / total) * 100).toFixed(2)}%) #Maybe (${((questionResult[2] / total) * 100).toFixed(2)}%)\n`
  })
  

  fs.writeFileSync('./survey-stat(percent).txt', content, { encoding: 'utf8' })
}
// updateHtmlPrivacyPolicy();
async function updateHtmlPrivacyPolicy() {
  let apps = [];

  do {
    apps = await Models.App.find({
      // privacyLink: { $exists: true },
      // isUpdatedHtmlPrivacyPolicy: { $exists: false }

      isUpdatedHtmlPrivacyPolicy: true,
      htmlPrivacyPolicy: ""
    }).limit(500);

    await Promise.map(
      apps,
      async (app, i) => {
        console.log(`${i + 1}/${apps.length}`);
        const { privacyLink } = app;
        try {
          const html = await getContentFromUrl(privacyLink);

          await Models.App.updateOne(
            {
              _id: app.id
            },
            {
              isUpdatedHtmlPrivacyPolicy: true,
              htmlPrivacyPolicy: html
            }
          );
        } catch (error) {
          console.log(error.message);
        }
        return;
      },
      {
        concurrency: 4
      }
    );
  } while (apps.length);

  console.log("DONE");
}

// updateParagraphs();
async function updateParagraphs() {
  // const header = [
  //   {
  //     id: "stt",
  //     title: "#"
  //   },
  //   {
  //     id: "paragraph",
  //     title: "Paragraph"
  //   },
  //   {
  //     id: "appName",
  //     title: "App Name"
  //   },
  //   {
  //     id: "link",
  //     title: "Link"
  //   }
  // ];
  const apps = await Models.App.find({
    htmlPrivacyPolicy: { $ne: "" },
    isUpdatedHtmlPrivacyPolicy: true,
    paragraph: {
      $exists: false
    }
  }).select("htmlPrivacyPolicy privacyLink appName");
  // .limit(1);

  for (let i = 0; i < apps.length; i++) {
    const app = apps[i];
    const { htmlPrivacyPolicy, privacyLink, appName } = app;
    const $ = await cheerio.load(htmlPrivacyPolicy);
    let content = "";

    $("p").each((index, element) => {
      const $element = $(element);
      const pTagContent = $element.text();
      const isSecurity = checkSententIncludeSecurity(pTagContent);

      if (isSecurity) {
        content += `${pTagContent}`;

        const $nextElement = $element.next();
        const $nextParentElement = $element.parent().next();
        if (pTagContent.includes(":") && $nextElement.is("ul")) {
          content += `${$nextElement.text()} \n`;
        } else if (pTagContent.includes(":") && $nextParentElement.is("ul")) {
          content += `${$nextParentElement.text()} \n`;
        }
      }
    });

    await Models.App.updateOne(
      {
        _id: app.id
      },
      {
        paragraph: content
      }
    );
  }

  // const csvWriter = createCsvWriter({
  //   path: "./app-paragraph.csv",
  //   header,
  //   fieldDelimiter: ",",
  //   alwaysQuote: true,
  //   encoding: "utf8"
  // });
  // csvWriter.writeRecords(rows);

  console.log("DONE");
}

// getParagraphs();
async function getParagraphs() {
  const apps = await Models.App.find({
    paragraph: {
      $ne: "",
      $exists: true
    }
  }).select("paragraph privacyLink appName");
  // .limit(1);
  const rows = [];
  for (let i = 0; i < apps.length; i++) {
    const app = apps[i];

    let { paragraph, privacyLink, appName } = app;

    paragraph = boldWordsIncludeSecurity(paragraph);

    rows.push({
      stt: i + 1,
      paragraph: paragraph.replace(/\n/g, "<br />"),
      appName,
      link: privacyLink
    });
  }

  fs.writeFileSync("app-paragraph.json", JSON.stringify(rows), { encoding: "utf8" });

  console.log("DONE");
}

function boldWordsIncludeSecurity(sentent) {
  const keywords = [
    "security",
    "privacy",
    "keyword",
    "privaci",
    "person",
    "secur",
    "collect",
    "protect",
    "parti",
    "third",
    "access",
    "cooki",
    "share",
    "purpos",
    "identifi",
    "address",
    "store",
    "email",
    "advertis",
    "locat",
    "permiss",
    "confidenti",
    "safeti",
    "sell",
    "purchas",
    "password",
    "identif",
    "encrypt",
    "policyprivaci",
    "policyi",
    "securityi",
    "privat",
    "defend",
    "securityw",
    "policythi"
  ];

  const stemmer = natural.PorterStemmer;

  const words = sentent.split(" ");

  const formatedWords = words.map(word => {
    if (keywords.includes(stemmer.stem(word))) return `<strong>${word}</strong>`;

    return word;
  });

  return formatedWords.join(" ");
}
// checkSententIncludeSecurity("le thanh tuan security privacy");
function checkSententIncludeSecurity(sentent) {
  const keywords = [
    "security",
    "privacy",
    "keyword",
    "privaci",
    "person",
    "secur",
    "collect",
    "protect",
    "parti",
    "third",
    "access",
    "cooki",
    "share",
    "purpos",
    "identifi",
    "address",
    "store",
    "email",
    "advertis",
    "locat",
    "permiss",
    "confidenti",
    "safeti",
    "sell",
    "purchas",
    "password",
    "identif",
    "encrypt",
    "policyprivaci",
    "policyi",
    "securityi",
    "privat",
    "defend",
    "securityw",
    "policythi"
  ];
  const stemmer = natural.PorterStemmer;
  const sententStem = stemmer.stem(sentent);

  return keywords.some(keyword => sententStem.includes(keyword));
}

// main();
async function main1() {
  console.log(1);

  const apps = await Models.App.find({
    // categoryName: {
    //   $in: ["Social", "Dating", "Communication"]
    // },
    // appIdCHPlay: { $exists: true },
    // appInfo: { $exists: false }
    appInfo: { $exists: true },
    isUpdatedInfo: { $exists: false }
  });
  // .limit(1000);
  // console.log(apps.length)
  await Promise.map(
    apps,
    async (app, i) => {
      console.log(`${i}/${apps.length}`);
      const dataSafety = await getDataSafety(
        `https://play.google.com/store/apps/datasafety?id=${app.appIdCHPlay}`
      );

      const appInfo = await getAppInfo(
        `https://play.google.com/store/apps/details?id=${app.appIdCHPlay}`
      );

      await Models.App.updateOne(
        {
          _id: app.id
        },
        {
          isUpdatedInfo: true,
          appInfo: {
            ...appInfo,
            dataSafety
          }
        }
      );

      return;
    },
    {
      concurrency: 6
    }
  );
  for (let i = 0; i < apps.length; i++) {}

  console.log("DONE");
}
// getStat1();
async function getStat1() {
  const header = [
    {
      id: "stt",
      title: "#"
    },
    {
      id: "id",
      title: "ID of microworker"
    },
    {
      id: "email",
      title: "Email"
    },
    {
      id: "isCompleted",
      title: "Completed"
    },
    {
      id: "comment",
      title: "Comment"
    },
    {
      id: "time",
      title: "Time"
    },
    {
      id: "question1",
      title:
        "1. Is the app's description mentioning its personal data collection and sharing behaviors?"
    },
    ...Object.entries(DATA_TYPES).reduce((acc, [title, items]) => {
      const dataCollectionName = _.kebabCase(title);

      Object.keys(items).forEach(item => {
        const dataTypeName = _.kebabCase(item);
        const key = `${dataCollectionName}+${dataTypeName}`;
        acc.push({
          id: key,
          title: `2. ${title} -> ${item}`
        });
      });

      return acc;
    }, []),
    ...Object.entries(DATA_TYPES).reduce((acc, [title, items]) => {
      const dataCollectionName = _.kebabCase(title);

      Object.keys(items).forEach(item => {
        const dataTypeName = _.kebabCase(item);

        Object.keys(DATA_PURPOSES).forEach(purposeName => {
          const key = `${dataCollectionName}+${dataTypeName}+${_.kebabCase(purposeName)}`;

          acc.push({
            id: key,
            title: `3. ${title} -> ${item} -> ${purposeName}`
          });
        });
      });

      return acc;
    }, []),
    ...Object.entries(DATA_TYPES).reduce((acc, [title, items]) => {
      const dataCollectionName = _.kebabCase(title);

      Object.keys(items).forEach(item => {
        const dataTypeName = _.kebabCase(item);
        const key = `question4${dataCollectionName}+${dataTypeName}`;
        acc.push({
          id: key,
          title: `4. ${title} -> ${item}`
        });
      });

      return acc;
    }, []),
    ...Object.entries(DATA_TYPES).reduce((acc, [title, items]) => {
      const dataCollectionName = _.kebabCase(title);

      Object.keys(items).forEach(item => {
        const dataTypeName = _.kebabCase(item);

        Object.keys(DATA_PURPOSES).forEach(purposeName => {
          const key = `question5${dataCollectionName}+${dataTypeName}+${_.kebabCase(purposeName)}`;

          acc.push({
            id: key,
            title: `5. ${title} -> ${item} -> ${purposeName}`
          });
        });
      });

      return acc;
    }, [])
  ];
  // console.log(header)
  const rows = [];
  const answers = await Models.Answer.find({
    // questions: { $size: 5 }
  });
  const dataFromMicro = await csv({
    noheader: true,
    output: "csv"
  }).fromFile("/Users/a1234/Downloads/CSVReport_17bc748481c2_B_Page#1_With_PageSize#5000.csv");

  const getNecessaryByValue = value => {
    switch (value) {
      case 1:
        return "Very unnecessary";
      case 2:
        return "Unnecessary";
      case 3:
        return "Neutral";
      case 4:
        return "Necessary";
      case 5:
        return "Very necessary";
    }
  };
  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];
    let row = {};
    const user = await Models.User.findById(answer.userId);
    const resultInMicro = dataFromMicro.find(
      item => item[2].toLowerCase().trim() === user.email.toLowerCase().trim()
    );

    (answer.questions || []).forEach(({ responses }) => {
      const { question1, question2, question3, question4, question5 } = responses;

      if (question1) {
        row["question1"] = `${question1.value === 1 ? "Yes" : "No"} ${
          question1.value === 1 ? `- ${question1.explain}` : ""
        }`;
      }

      // 2
      if (question2) {
        Object.entries(question2).forEach(([key, { value, explain }]) => {
          row[key] = getNecessaryByValue(value);
        });
      }

      // 3
      if (question3) {
        Object.entries(question3).forEach(([key, { value, explain }]) => {
          row[key] = getNecessaryByValue(value);
        });
      }

      // 4
      if (question4) {
        Object.entries(question4).forEach(([key, { value, explain }]) => {
          row[`question4${key}`] = getNecessaryByValue(value);
        });
      }

      // 5
      if (question5) {
        Object.entries(question5).forEach(([key, { value, explain }]) => {
          row[`question5${key}`] = getNecessaryByValue(value);
        });
      }
    });

    rows.push({
      stt: i + 1,
      id: resultInMicro ? resultInMicro[0] : "",
      email: user.email,
      isCompleted: (answer.questions || []).length === 5 ? "x" : "",
      comment: answer.comment,
      time: resultInMicro ? resultInMicro[1] : "",
      ...row
    });
  }

  const csvWriter = createCsvWriter({
    path: "./question-stats.csv",
    header
  });
  csvWriter.writeRecords(rows);
  console.log("DONE");
}
// getStat();
async function getStat() {
  const header = [
    {
      id: "stt",
      title: "#"
    },
    {
      id: "id",
      title: "ID of microworker"
    },
    {
      id: "email",
      title: "Email"
    },
    ...Object.keys(DATA_TYPES).map((title, i) => ({
      id: `question1${i + 1}`,
      title: `1. ${title}`
    })),
    ...Object.keys(DATA_PURPOSES).map((title, i) => ({
      id: `question2${i + 1}`,
      title: `2. ${title}`
    })),
    ...Object.keys(QUESTION3).map((title, i) => ({
      id: `question3${i + 1}`,
      title: `3. ${title}`
    })),
    ...Object.keys(QUESTION4).map((title, i) => ({
      id: `question4${i + 1}`,
      title: `4. ${title}`
    }))
  ];

  let rows = [];
  const dataFromMicro = await csv({
    noheader: true,
    output: "csv"
  }).fromFile("/Users/a1234/Downloads/CSVReport_17bc748481c2_B_Page#1_With_PageSize#5000.csv");
  const answers = await Models.Answer.find({
    // questions: { $size: 5 }
  });

  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];
    const user = await Models.User.findById(answer.userId);
    const resultInMicro = dataFromMicro.find(
      item => item[2].toLowerCase().trim() === user.email.toLowerCase().trim()
    );

    let row = {};
    // 1
    Object.entries(answer.survey.question1).map(([key, { value, explain }], i) => {
      row[key] = `${value === 1 ? "Yes" : value === 0 ? "No" : "Maybe"} - ${explain}`;
    });

    // 2
    Object.entries(answer.survey.question2).map(([key, { value, explain }], i) => {
      row[key] = `${value === 1 ? "Yes" : value === 0 ? "No" : "Maybe"} - ${explain}`;
    });

    // 3
    Object.entries(answer.survey.question3).map(([key, { value, explain }], i) => {
      row[key] = `${value === 1 ? "Yes" : value === 0 ? "No" : "Maybe"} - ${explain}`;
    });

    // 4
    Object.entries(answer.survey.question4).map(([key, { value, explain }], i) => {
      row[key] = `${value === 1 ? "Yes" : value === 0 ? "No" : "Maybe"} - ${explain}`;
    });

    rows.push({
      stt: i + 1,
      id: resultInMicro ? resultInMicro[0] : "",
      email: user.email,
      ...row
    });
  }

  const csvWriter = createCsvWriter({
    path: "./survey-stats.csv",
    header
  });

  csvWriter.writeRecords(rows);
  console.log("DONE");
}
// getAppSurvey();
async function getAppSurvey() {
  const apps = await Models.App.find({
    appInfo: { $exists: true },
    "appInfo.dataSafety.sections": { $exists: true, $ne: [] }
  });

  const appSurveys = _.chunk(apps, 5);

  await Models.AppSurvey.deleteMany();

  await Promise.map(appSurveys, async apps => {
    if (apps.length < 5) return;
    return Models.AppSurvey.create({
      apps: apps.map((app, stt) => ({ stt: stt + 1, appId: app.id }))
    });
  });

  console.log("DONE");
}
async function getAppInfo(url) {
  const html = await getContentFromUrl(url);
  const $cheerio = await cheerio.load(html);

  const desc = $cheerio(".bARER[data-g-id='description']").html();
  const contacts = [];
  $cheerio("#developer-contacts .VfPpkd-WsjYwc").each(function(i, elem) {
    const title = $cheerio(this)
      .find(".pZ8Djf .xFVDSb")
      .text();

    const content = $cheerio(this)
      .find(".pZ8Djf .pSEeg")
      .text();

    contacts.push({
      title,
      content
    });
  });

  return {
    desc,
    contacts
  };
}
async function getDataSafety(url) {
  const html = await getContentFromUrl(url);
  const $cheerio = await cheerio.load(html);

  const desc = $cheerio(".RGUlu").html();

  let result = {
    desc,
    sections: []
  };
  $cheerio(".Mf2Txd").each(function(i, elem) {
    const $section = $cheerio(this);
    const title = $section.find(".q1rIdc").text();
    const content = $section.find(".ivTO9c").text();
    const icon = $section.find("img").attr("src");

    const section = {
      title,
      content,
      icon,
      children: []
    };

    const $children = $section.find(".XgPdwe div[jscontroller='ojPjfd']");

    if ($children.length) {
      $children.each(function(i, elem) {
        const $item = $cheerio(this);

        const title = $item.find(".aFEzEb").text();
        const content = $item.find(".fozKzd").text();
        const icon = $item.find("img").attr("src");

        // console.log(" +", title);
        const $purposeTitles = $item.find(".pcmFvf");
        const $purposeContents = $item.find(".FnWDne");

        const purposes = [];
        $purposeTitles.each(function(i, elem) {
          const $purposeTitle = $cheerio(this);

          purposes.push({
            title: $purposeTitle.find(".qcuwR").text(),
            isOptional: $purposeTitle.text().includes("Optional"),
            content: $purposeContents.eq(i).text()
          });
        });

        section.children.push({
          title,
          content,
          icon,
          purposes
        });
      });
    } else {
      $section.find(".XgPdwe .Vwijed").each(function(i, elem) {
        const $item = $cheerio(this);

        const title = $item.find(".aFEzEb").text();
        const content = $item.find(".fozKzd").text();

        section.children.push({
          title,
          content,
          purposes: []
        });
      });
    }

    result.sections.push(section);
  });

  return result;
}
async function getContentFromUrl(url) {
  try {
    const browser = await puppeteer.launch({
      // executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
      // executablePath: "/usr/bin/chromium-browser"
      args: ["--disable-setuid-sandbox", "--no-sandbox"]
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(1000 * 5);

    await page.goto(url, { waitUntil: "networkidle0" });

    const data = await page.evaluate(() => document.querySelector("html").outerHTML);

    await browser.close();

    return data;
  } catch (err) {
    // throw err;
    console.error(err);
    return "";
  }
}
