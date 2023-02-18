var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var groupSchema = new Schema(
  {
    commentId: String,
    userName: String,
    comment: String,
    appName: String,
    appId: Schema.Types.ObjectId,
    rating: String,
    thumbsUp: String,
    isLabeled: Boolean,
    isAnalyzed: {
      type: Boolean,
      default: false
    },
    isGetStructure: {
      type: Boolean,
      default: false
    },
    securityKeyWords: Array,
    securitySimiWords: Schema.Types.Mixed,
    securityStructure: Array,
    securityStructureWithKeywords: Array,

    privacyKeyWords: Array,
    privacySimiWords: Schema.Types.Mixed,
    privacyStructure: Array,
    privacyStructureWithKeyWords: Array,

    permissionKeyWords: Array,
    permissionSimiWords: Schema.Types.Mixed,
    permissionStructure: Array,
    permissionStructureWithKeyWords: Array,

    collectionKeyWords: Array,
    collectionSimiWords: Schema.Types.Mixed,
    collectionStructure: Array,
    collectionDataTypes: Schema.Types.Mixed,

    sharingKeyWords: Array,
    sharingSimiWords: Schema.Types.Mixed,
    sharingStructure: Array,
    sharingDataTypes: Schema.Types.Mixed,

    securitySentences: Array,
    privacySentences: Array,
    permissionSentences: Array,
    collectionSentences: Array,
    sharingSentences: Array,

    dataItems: Array, // has in comment text
    purposes: Array, // has in comment text
    thirdParties: Array, // has in comment text

    perissionType: String, // all, specific, none
    dataItemType: String, // all, specific, none
    purposeType: String, // all, specific, none
    thirdPartyType: String, // all, specific, none

    permissions: [String],
    dataItems: [String],
    purposes: [String],
    thirdParties: [String],

    permissionResult: Schema.Types.Number,
    dataTypeResult: Schema.Types.Number,
    purposeResult: Schema.Types.Number,
    thirdPartyResult: Schema.Types.Number,

    sentiment: Schema.Types.Number,

    // rais3
    isShowSecurityRail3: {
      type: Boolean,
      default: false
    },
    isShowPrivacyRail3: {
      type: Boolean,
      default: false
    },
    isShowPermissionRail3: {
      type: Boolean,
      default: false
    },
    isShowDataCollectionRail3: {
      type: Boolean,
      default: false
    },
    isShowDataSharingRail3: {
      type: Boolean,
      default: false
    },

    // show pieces sections on UI
    isShowSecurityRais3: Boolean,
    isShowPrivacyRais3: Boolean,
    isShowPermissionRais3: Boolean,
    isShowDataItemRais3: Boolean,
    isShowPurposeRais3: Boolean,
    isShowThirdPartyRais3: Boolean,
    isShowOnRais3: Boolean,

    isRelatedRail3: {
      type: Boolean
    },
    label: String,
    scores: Schema.Types.Mixed,
    isCheckRelated: Boolean,
    isNotLabel: Boolean
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

export default mongoose.model("commentsrais3_v2", groupSchema);
