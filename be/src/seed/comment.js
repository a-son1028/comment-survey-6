const csv = require("csvtojson");
require("dotenv")
require("../configs/mongoose.config")
import Models from "../models";
import _ from "lodash";

main()
async function main() {
    // await initCommentCollection()

    await initCommentSurveyCollection()
    resetCommentSurveyCollection()
}
async function resetCommentSurveyCollection() {
     await Models.CommentSurvey.updateMany({}, { isDone: false, isSelected: false })
}
async function initCommentSurveyCollection() {
     await Models.CommentSurvey.deleteMany()
    const comments = await Models.Comment.find({
			isLabeled: true
		})

    const commentChunks = _.chunk(comments, 50);

		// for(let i = 0; i < commentChunks.length; i++) {
		// 	const comments = commentChunks[i];

		// 	comments = comments.map((comment, stt) => {
		// 		comment = comment.toJSON()
		// 		comment.stt = stt + 1;
		// 		return {
		// 			_id: comment._id,
		// 			commentId: comment.commentId,
		// 			stt: comment.stt,
		// 		}
		// 	})
		// 	if(comments.length < 50) return
		// 	return Models.CommentSurvey.create({comments})
		// }
    await Promise.all(
        commentChunks.map(comments => {
            comments = comments.map((comment, stt) => {
                comment = comment.toJSON()
                comment.stt = stt + 1;
                return {
									_id: comment._id,
									commentId: comment.commentId,
									stt: comment.stt,
								}
            })
            if(comments.length < 50) return
            return Models.CommentSurvey.create({comments})
        })
    )
		console.log("DONE")
}
async function initCommentCollection() {
    const data = await csv({
        noheader: true,
        output: "csv",
    }).fromFile("/Users/a1234/Downloads/comments-apps-by-keywords.csv");
    data.shift()

    await Models.Comment.deleteMany()
    await Promise.all(data.map(([commentId, userName, comment, appName, rating, thumbsUp]) => Models.Comment.create({ commentId, userName, comment, appName, rating, thumbsUp })))
}