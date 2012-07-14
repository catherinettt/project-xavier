var coreApi = {}
coreApi._construct = function () {

	function Common(){

		this.getUserById = function(id,callback ){
			console.log("API - getUserById");
			$.ajax({
				url:'/api/user/' + id,
				type:'GET',
				success:function (data) {
					callback(data);
				}
			});

		}



		this.getCourseById = function(id,callback ){
			console.log("API - getCourseById");
			$.ajax({
				url:'/api/course/' + id,
				type:'GET',
				success:function (data) {
					callback(data);
				}
			});

		}

		this.getUserProfileById = function(id,callback){
			console.log("API - getUserProfileById");
			$.ajax({
				url:'/api/user/' + id+'/profile',
				type:'GET',
				success:function (data) {
					callback(data);
				}
			})
		}

		this.updateUserProfileById = function(id, user_profile,callback){
			console.log("API - updateUserProfileById");
			$.ajax({
				url:'/api/user/' + id+'/profile',
				type:'PUT',
				dataType:'json',
				contentType:"application/json",
				data:JSON.stringify(user_profile),
				success:function (data) {
					callback(data);
				}
			})
		}



	}

	function Accent() {
		this.createTag = function(tag,callback){
			console.log('API - createTag');
			$.ajax({
				url:'/api/tag',
				type:'POST',
				dataType:'json',
				contentType:"application/json",
				data:JSON.stringify(tag),
				success:function (data) {
					callback(data);
				}
			})

		}

		this.getTagById = function(id, callback){
			console.log('API - getTagById');

		}

		this.updateTagById = function(id, callback){
			console.log('API - updateTagById');

		}

		this.deleteTagById = function(id,callback){
			console.log('API - deleteTagById');

		}

	}

	function Engage() {

		this.createResource = function (course_id,title,description,resource_type,file_type,url,callback){
			console.log('API - createResource');
			var body = {};
			var resource = {};
			resource.course = course_id;
			resource.title = title;
			resource.description = description;
			resource.resourceType = resource_type;
			resource.fileType = file_type;
			resource.url = url;

			$.ajax({

				url:'/api/resource',
				type:'POST',
				dataType:'json',
				contentType:"application/json",
				data:JSON.stringify(body),
				success:function (data) {
					callback(data);

				}

			})

		}

	}

	function Presenter() {

		this.createQuestion = function (questionTitle, questionBody, callback) {
			console.log("API - createQuestion");

			var body = {};
			var question = {};

			question.body = questionBody;
			question.category = 'testcategory'; //TODO need replaced
//			question.status = 'unanswered';
			question.title = questionTitle;
//			question.timestamp = '2008-10-21';
//			question.followup = [];
			body.question = question;


			$.ajax({
				//url : '/api/user/'+user_id+'/questions',
				url:'/api/question',
				type:'POST',
				dataType:'json',
				contentType:"application/json",
				data:JSON.stringify(body),
				success:function (data) {
					callback(data);

				}

			})

		}

		this.getAllQuestions = function (callback) {
			console.log("API - getAllQuestions");
			$.ajax({
				url:'/api/questions',
				type:'GET',
				success:function (data) {
					callback(data);
				}
			});
		}

		this.getQuestionById = function (id, callback) {
			console.log("API - getQuestionById");
			$.ajax({
				url:'/api/question/' + id,
				type:'GET',
				success:function (data) {
					callback(data);
				}
			});
		}

		this.updateQuestionById = function (id, questionTitle, questionBody, callback) {
			console.log("API - updateQuestionById");
			var body = {};
			body.title= questionTitle;
			body.body = questionBody;
			$.ajax({
				url:'/api/question/' + id,
				type:'PUT',
				dataType:'json',
				contentType:"application/json",
				data:JSON.stringify(body),
				success:function (data) {
					callback(data);
				}
			});
		}


		this.deleteQuestionById = function (id, callback) {
			console.log("API - deleteQuestionById");
			$.ajax({
				url:'/api/question/' + id,
				type:'DELETE',
				success:function (data) {
					callback(data);
				}
			});
		}


		this.getQuestionsByUserId = function (user_id, callback) {
			console.log("API - getQuestionsByUserId");
			$.ajax({
				url:'/api/user/' + user_id + '/questions',
				type:'GET',
				success:function (data) {
					callback(data);
				}
			});
		}

		this.searchQuestion = function (query, callback) {
			console.log("API - searchQuestion");
			var body = {};
			body.query = query;
			$.ajax({
				url:'/api/search/',
				type:'POST',
				dataType:'json',
				contentType:"application/json",
				data:JSON.stringify(body),
				success:function (data) {
					callback(data);
				}


			})


		}



		this.getCommentsByTargetId = function (target_id, callback){
			console.log("API - getCommentsByTargetId");
			$.ajax({
				url:'/api/question/'+target_id+'/comments',
				type:'GET',
				success:function (data) {
					callback(data);
				}
			});
		}

		this.followQuestionById = function (id, callback){
			console.log("API - followQuestionById");
			$.ajax({
				url:'/api/question/'+id+'/follow',
				type:'PUT',
				success:function (data) {
					callback(data);
				}
			});
		}

		this.unfollowQuestionById = function (id, callback){
			console.log("API - unfollowQuestionById");
			$.ajax({
				url:'/api/question/'+id+'/unfollow',
				type:'PUT',
				success:function (data) {
					callback(data);
				}
			});
		}

		//Comments



		this.getAllComments = function (callback) {
			console.log("API - getAllComments");
			$.ajax({
				url:'/api/comments',
				type:'GET',
				success:function (data) {
					callback(data);
				}
			});
		}


		this.createComment = function (target_id, comment_title, comment_body, callback) {
			console.log("API - createComment");

			var body = {};
			var comment = {};

			comment.body = comment_body;
//			comment.status = 'unanswered';
			comment.title = comment_title;

			//TODO:need to fix this to dynamic input
			comment.objectType = 'question';

			comment.target_uuid = target_id;
//			comment.timestamp = '2008-10-21';
//			comment.followup = [];
			body.comment = comment;


			$.ajax({
				//url : '/api/user/'+user_id+'/comments',
				url:'/api/comment',
				type:'POST',
				dataType:'json',
				contentType:"application/json",
				data:JSON.stringify(body),
				success:function (data) {
					callback(data);

				}

			})

		}

		this.getCommentById = function (id, callback) {
			console.log("API - getCommentById");
			$.ajax({
				url:'/api/comment/' + id,
				type:'GET',
				success:function (data) {
					callback(data);
				}
			});
		}

		this.updateCommentById = function (id, commentTitle, commentBody, callback) {
			console.log("API - updateCommentById");
			var body = {};
			body.title = commentTitle;
			body.body = commentBody;
			$.ajax({
				url:'/api/comment/' + id,
				type:'PUT',
				dataType:'json',
				contentType:"application/json",
				data:JSON.stringify(body),
				success:function (data) {
					callback(data);
				}
			});
		}


		this.deleteCommentById = function (id, callback) {
			console.log("API - deleteCommentById");
			$.ajax({
				url:'/api/comment/' + id,
				type:'DELETE',
				success:function (data) {
					callback(data);
				}
			});
		}


		this.getCommentsByUserId = function (user_id, callback) {
			console.log("API - getCommentsByUserId");
			$.ajax({
				url:'/api/user/' + user_id + '/comments',
				type:'GET',
				success:function (data) {
					callback(data);

				}
			});
		}

		this.getCommentsByUserId = function (user_id, callback) {
			console.log("API - getCommentsByUserId");
			$.ajax({
				url:'/api/user/' + user_id + '/comments',
				type:'GET',
				success:function (data) {
					callback(data);

				}
			});
		}


		this.upVoteCommentById = function(id, callback){
			console.log('API - upVoteCommentById');
			var dir = 0;
			voteCommentById( id,dir, callback);
		}

		this.downVoteCommentById = function(id, callback){
			console.log('API - downVoteCommentById');
			var dir = 1;
			voteCommentById(id,dir, callback);

		}


		//private method

		var voteCommentById = function(id,dir,callback){

			$.ajax({
				url :'/api/comment/'+id+'/vote/'+dir,
				type: 'POST',
				dataType:'json',
				contentType:"application/json",
					success: function(data){
					callback(data);
				}

			})

		}






	}

	this.Common = Common;
	this.Accent = Accent;
	this.Engage = Engage;
	this.Presenter = Presenter;
}

coreApi._construct();

//
//var xx = new coreApi.Presenter();
//xx.downVoteCommentById('qJfzggggguOicWWAjx7F05',function(data){
//	console.log(data);
//});

//
//xx.updateQuestionById('pJfzndwdadddQuOicWWAjx7F00', "i have no clue!!!" ,function(data){
//
//	console.log(data);
//
//});
