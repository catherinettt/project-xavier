var rqra = new coreApi.Presenter();

function formatQuestion(question) {
	return "<div class='question'>"
			+ "<div class='questionText'>" + question._source.body + "</div>"
			+ "<div class='questionData'>"
				+ "<div class='profResponsesRecent'>5 <img src='../images/rqra/prof.png' alt='Instructor Responses'/></div>"
				+ "<div class='replies'>" + question._source.commentCount + " <img src='../images/rqra/reply.png' alt='Replies'/></div>"
				+ "<div class='views'>" + question._source.viewCount + " <img src='../images/rqra/view.png' alt='Views'/></div>"
				+ "<div>Asked "
					+ "<span class='inserted'>" + jQuery.timeago(new Date(question._source.timestamp)) + "</span> "
					+ "by <span class='inserted'>" + question._source.user + "</span></div>"
			+ "</div>";
}

function formatComment(comment) {
	return "<div class='comment'>"
			+ "<div class='questionText'>" + comment._source.body + "</div>"
			+ "<div class='questionData'>"
				+ "<div>Asked "
					+ "<span class='inserted'>" + jQuery.timeago(new Date(comment._source.timestamp)) + "</span> "
					+ "by <span class='inserted'>" + comment._source.user + "</span></div>"
				+ "<div class='votes'><img src='../images/rqra/up.png' alt='UpVotes'/>" + comment._source.upvote + " <img src='../images/rqra/reply.png' alt='Replies'/></div>"
				+ "<div class='votes'><img src='../images/rqra/down.png' alt='DownVotes'/>" + comment._source.downvote + " <img src='../images/rqra/view.png' alt='Views'/></div>"
			+ "</div>";
}

function loadPage() {
	var questionId = window.location.pathname.replace("/question/", "");
	var question = document.getElementById("detailedQuestion");
	var commentList = document.getElementById("comments");
	
	// get question
	rqra.getQuestionById(questionId, function(data) {
		if (data && data.errorcode === 0) {
			question.innerHTML = formatQuestion(data.question);
			//displayPageNumbers(data.questions.total);
		}
	});
	
	// get comments
	rqra.getCommentsByTargetId(questionId, 0, function(data) {
		commentList.innerHTML = "";
		if (data && data.errorcode === 0 && data.comments.hits.length > 0) {
			//displayPageNumbers(data.questions.total);
			
			$.each(data.comments.hits, function (index, item) {
				commentList.innerHTML += formatComment(item);
			});
		}
	});
}

loadPage();