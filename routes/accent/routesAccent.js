var routesCommon = require('./../common/routesCommon.js');
var TagAction = require("./../../controller/TagAction.js");
var MediaAction = require("./../../controller/MediaAction.js");

exports.login = function(request, response){
	routesCommon.login(1, request, response);
}

exports.question = function(request, response) {
	routesCommon.questionRoute(1, request, response);
}

exports.questions = function(request, response) {
	routesCommon.questionsRoute(1, request, response);
}

exports.questionsByUser = function(request, response) {
	routesCommon.questionsByUserRoute(1, request, response);
}

exports.followQuestion = function(request, response) {
	routesCommon.followQuestionRoute(1, request, response);
}

exports.questionStatus = function(request, response) {
	routesCommon.questionStatusRoute(1, request, response);
}



exports.comment = function(request, response) {
	routesCommon.commentRoute(1, request, response);
}

exports.comments = function(request, response) {
	routesCommon.commentsRoute(1, request, response);
}

exports.commentsByUser = function(request, response) {
	routesCommon.commentsByUserRoute(1, request, response);
}

exports.commentVote = function(request, response) {
	routesCommon.commentVoteRoute(1, request, response);
}

exports.commentAnswered = function(request, response) {
	routesCommon.commentAnsweredRoute(1, request, response);
}

exports.commentsByQuestion = function(request, response) {
	routesCommon.commentsByQuestionRoute(1, request, response);
}

exports.search = function(request, response) {
	routesCommon.searchRoute(1, request, response);
}

exports.followQuestion = function(request, response) {
	routesCommon.followQuestionRoute(1, request, response);
}

exports.unfollowQuestion = function(request, response) {
	routesCommon.unfollowQuestionRoute(1, request, response);
}

exports.resourcesInSection = function(request, response){
	routesCommon.resourcesInSection(1, request, response);
}


// Tag
exports.tag = function(request,response){

	if(request.method === 'POST'){

		if(request.session && request.session.user){
			request.body.user =  request.session.user.uuid;

			TagAction.addTag(request.body, function(error, result){
				if(result){
					response.writeHead(200, { 'Content-Type': 'application/json' });
					response.end(JSON.stringify({ errorcode: 0, tag: result }));
				}
				else{
					response.writeHead(200, { 'Content-Type': 'application/json' });
					response.end(JSON.stringify({ errorcode: 1, message: error }));
				}
			});
		}
		else{
			response.writeHead(200, { 'Content-Type': 'application/json' });
			response.end(JSON.stringify({ errorcode: 2, message: 'You aren\'t logged in' }));
		}
	}
	else if (request.method === 'GET'){
		var uuid = request.params.id;
		TagAction.getTagById({'uuid':uuid}, function(error, result){
			if(result){
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, tag: result }));
			}
			else{
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: error }));
			}
		});		
	}
	else if (request.method === 'PUT'){		
		var uuid = request.params.id;
		TagAction.updateTag({'uuid':uuid}, request.body, function(error, result){
			if(result){
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, tag: result }));
			}
			else{
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: error }));
			}
		});	
	}
	else if (request.method === 'DELETE'){
		var uuid = request.params.id;
		TagAction.deleteTag({'uuid':uuid},function(error,result){
			if(result){
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, tag: result }));
			}
			else{
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: error }));
			}
		})
	}


}


//
//exports.taggedQuestion = function(request,response){
//	if (request.method === 'GET'){
//		var questionID = request.params.qid;
//		TagAction.viewQuestionTagged({'question':questionID}, function(error, result){
//			if(result){
//				response.writeHead(200, { 'Content-Type': 'application/json' });
//				response.end(JSON.stringify({ errorcode: 0, question: result }));
//			}
//			else{
//				response.writeHead(200, { 'Content-Type': 'application/json' });
//				response.end(JSON.stringify({ errorcode: 1, message: error }));
//			}
//		});
//	}
//}
//
//exports.taggedComment = function(request,response){
//	if (request.method === 'GET'){
//		var commentID = request.params.cid;
//		TagAction.viewCommentTagged({'commentID':commentID}, function(error, result){
//			if(result){
//				response.writeHead(200, { 'Content-Type': 'application/json' });
//				response.end(JSON.stringify({ errorcode: 0, comment: result }));
//			}
//			else{
//				response.writeHead(200, { 'Content-Type': 'application/json' });
//				response.end(JSON.stringify({ errorcode: 1, message: error }));
//			}
//		});
//	}
//}
//
//exports.taggedUser = function(request,response){
//	if (request.method === 'GET'){
//		var userId = request.params.uid;
//		TagAction.getTaggedUser({'user':userId}, function(error, result){
//			if(result){
//				response.writeHead(200, { 'Content-Type': 'application/json' });
//				response.end(JSON.stringify({ errorcode: 0, resource: result }));
//			}
//			else{
//				response.writeHead(200, { 'Content-Type': 'application/json' });
//				response.end(JSON.stringify({ errorcode: 1, message: error }));
//			}
//		});
//	}
//}

// MediaFile
exports.mediafile = function(request,response){

	if(request.method === 'POST'){
		if(request.session && request.session.user){
			request.body.user =  request.session.user.uuid;
			MediaAction.addMediaFile(request.body, function(error, result){
				if(result){
					response.writeHead(200, { 'Content-Type': 'application/json' });
					response.end(JSON.stringify({ errorcode: 0, mediafile: result }));
				}
				else{
					response.writeHead(200, { 'Content-Type': 'application/json' });
					response.end(JSON.stringify({ errorcode: 1, message: error }));
				}
			});
		}
		else{
			response.writeHead(200, { 'Content-Type': 'application/json' });
			response.end(JSON.stringify({ errorcode: 2, message: 'You aren\'t logged in' }));
		}
	}
	else if (request.method === 'GET'){	
		var uuid = request.params.id;
		MediaAction.getMediaFileById({'uuid':uuid}, function(error, result){
			if(result){
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, mediafile: result }));
			}
			else{
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: error }));
			}
		});		
	}
	else if (request.method === 'PUT'){		
		var uuid = request.params.id;
		MediaAction.updateMediaFile({'uuid':uuid}, request.body, function(error, result){
			if(result){
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, mediafile: result }));
			}
			else{
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: error }));
			}
		});	
	}
	else if (request.method === 'DELETE'){
		var uuid = request.params.id;
		MediaAction.deleteMediaFile({'uuid':uuid}, function(error, result){
			if(result){
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, mediafile: result }));
			}
			else{
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: error }));
			}
		});

	}


}

exports.mediafileTag = function(request,response){	
	if (request.method === 'GET'){
		var targetID = request.params.tid;								
		MediaAction.getMediaFileTags({'uuid':targetID}, function(error, result){
			if(result){
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, tags: result }));
			}
			else{
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: error }));
			}
		});		
	}
}

//exports.mediafileUser = function(request,response){
//	if (request.method === 'GET'){
//		var userId = request.params.uid;
//		MediaAction.getMediaFileUser({'user':userId}, function(error, result){
//			if(result){
//				response.writeHead(200, { 'Content-Type': 'application/json' });
//				response.end(JSON.stringify({ errorcode: 0, resource: result }));
//			}
//			else{
//				response.writeHead(200, { 'Content-Type': 'application/json' });
//				response.end(JSON.stringify({ errorcode: 1, message: error }));
//			}
//		});
//	}
//}

//deprecated

//exports.follower = function(request, response) {
//	var question_id = request.params.uid;
//	var follower_id = request.params.follower;
//
//	if (request.method === "PUT") {
//		response.writeHead(500, { 'Content-Type': 'application/json' });
//		response.end(JSON.stringify({ errorcode: 1, message: "Not Implemented" }));
//	} else if (request.method === "DELETE") {
//		response.writeHead(500, { 'Content-Type': 'application/json' });
//		response.end(JSON.stringify({ errorcode: 1, message: "Not Implemented" }));
//	}
//}