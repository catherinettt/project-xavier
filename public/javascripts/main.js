//Just a test file to demo how to use core.api.js


$(document).ready(function () {

	$("#tabs").tabs();

	var rqra = new coreApi.Presenter();

	loadAllQuestions(rqra);
	loadAllComments(rqra);

	$("#getALLQuestions").click(function (event) {

		loadAllQuestions(rqra);

	});

	$("#getQuestionById").click(function (event) {
		var question_id = $('#question_id').val();
		if (question_id) {
			rqra.getQuestionById(question_id, function (data) {
				if (data) {
					if (data.errorcode === 0) {
						$('#question_title').val(data.question.title);
						$('#question_body').val(data.question.body);
					}
					else {
						alert(data.message);
					}
				}
				else {
					alert('CANNOT CONNECT TO DATABASE');
				}
			})
		}
		else {
			alert('CANNOT BE EMPTY ID');
		}
	})

	$("#followQuestionById").click(function (event) {
		var question_id = $('#question_id').val();
		if (question_id) {
			rqra.followQuestionById(question_id, function (data) {
				if (data) {
					if (data.errorcode === 0) {
						alert('OK OK, REFRESH');

					}
					else {
						alert(data.message);
					}
				}
				else {
					alert('CANNOT CONNECT TO DATABASE');
				}
			})
		}
		else {
			alert('CANNOT BE EMPTY ID');
		}
	})


	$("#unfollowQuestionById").click(function (event) {
		var question_id = $('#question_id').val();
		if (question_id) {
			rqra.unfollowQuestionById(question_id, function (data) {
				if (data) {
					if (data.errorcode === 0) {
						alert('OK OK, REFRESH');

					}
					else {
						alert(data.message);
					}
				}
				else {
					alert('CANNOT CONNECT TO DATABASE');
				}
			})
		}
		else {
			alert('CANNOT BE EMPTY ID');
		}
	})

	$("#updateQuestionById").click(function (event) {
		var question_id = $('#question_id').val();
		var new_title = $('#question_title').val();
		var new_body = $('#question_body').val();
		if (question_id && new_title && new_body) {
			//rqra.updateQuestionById('pJfzndwdadddQuOicWWAjx7F00', "i have no clue!!!" ,function(data){
			rqra.updateQuestionById(question_id, new_title, new_body, function (data) {

				if (data) {

					if (data.errorcode === 0) {

						alert("COOL,REFRESH THE LIST");
					}
					else {
						alert(data.message);
					}

				}
				else {
					alert('CANNOT CONNECT TO DATABASE');
				}
			})
		}
		else {
			alert('CANNOT HAVE EMPTY FILED');
		}
	})

	$('#deleteQuestionById').click(function () {
		var question_id = $('#question_id').val();
		if (question_id) {

			rqra.deleteQuestionById(question_id, function (data) {

				if (data) {

					if (data.errorcode === 0) {

						alert("COOL, REFRESH THE LIST");
					}
					else {
						alert(data.message);
					}

				}
				else {
					alert('CANNOT CONNECT TO DATABASE');
				}


			})


		}

		else {
			alert('CANNOT HAVE EMPTY FILED');
		}
	})



	$('#upVoteCommentById').click(function () {
		var question_id = $('#comment_id').val();
		if (question_id) {

			rqra.upVoteCommentById(question_id, function (data) {
				if (data) {
					if (data.errorcode === 0) {
						alert("COOL, REFRESH THE LIST");
					}
					else {
						alert(data.message);
					}
				}
				else {
					alert('CANNOT CONNECT TO DATABASE');
				}
			})
		}
		else {
			alert('CANNOT HAVE EMPTY FILED');
		}
	})

	$('#downVoteCommentById').click(function () {
		var question_id = $('#comment_id').val();
		if (question_id) {

			rqra.downVoteCommentById(question_id, function (data) {
				if (data) {
					if (data.errorcode === 0) {
						alert("COOL, REFRESH THE LIST");
					}
					else {
						alert(data.message);
					}
				}
				else {
					alert('CANNOT CONNECT TO DATABASE');
				}
			})
		}
		else {
			alert('CANNOT HAVE EMPTY FILED');
		}
	})



	$('#search').click(function () {
		var query = $('#searchQuery').val();
		if (query) {

			rqra.searchQuestion(query, function (data) {

				if (data) {
					$('#search_results').empty();
					if (data.errorcode === 0) {
						$.each(data.questions, function (index, item) {
							console.log(item);
							var content = '<li class="questions_li">'
								+ '<p>' + item._id + '</p>'
								+ '<p>' + item._source.body + '</p>'
								+ '<p>' + item._source.category + '</p>'
								+ '<p>' + item._source.status + '</p>'
								+ '<p>' + item._source.timestamp + '</p>'
								+ '<p>' + item._source.title + '</p>'
								+ '<p>' + item._source.user + '</p>'
								+ '</li>';
							$('#search_results').append(content);
						});
					}
					else {
						alert(data.message);


					}

				}
				else {
					alert('CANNOT CONNECT TO DATABASE');


				}

			});


		}


	})

	$('#createQuestion').click(function (event) {
		var title = $('#new_question_title').val();
		var body = $('#new_question_body').val();
		if (title && body) {
			rqra.createQuestion(title, body, function (data) {
				if (data) {
					if (data.errorcode === 0) {
						alert('OK OK REFRESH NOW');
					}

				}

				else {
					alert('CANNOT CONNECT TO DATABASE');


				}

			})


		}

	})



	$('#getQuestionsByUserId').click(function (event) {
		var user_id = $("#question_user_id").val();
		if (user_id) {
			rqra.getQuestionsByUserId(user_id, function (data) {
				if (data) {


					$('#user_questions').empty();
					if (data.errorcode === 0 && data.questions.length > 0) {

						$.each(data.questions, function (index, item) {
							console.log(item);
							var content = '<li class="questions_li">'
								+ '<p>_id: ' + item._id + '</p>'
								+ '<p>title: ' + item._source.title + '</p>'
								+ '<p>body: ' + item._source.body + '</p>'
								+ '<p>category: ' + item._source.category + '</p>'
								+ '<p>status: ' + item._source.status + '</p>'
								+ '<p>timestamp: ' + item._source.timestamp + '</p>'
								+ '<p>user: ' + item._source.user + '</p>'
								+ '</li>';
							$('#user_questions').append(content);
						});
					}
					else {
						alert(data.message);
					}

				}
				else {
					alert('CANNOT CONNECT TO DATABASE');
				}
			});
		}
		else {
			alert('CANNOT BE EMPTY FILED');
		}


	});

	//comments

	$("#getALLComments").click(function (event) {

		loadAllComments(rqra);

	});


	$('#createComment').click(function (event) {
		var target_id = $('#new_comment_target_id').val();
		var title = $('#new_comment_title').val();
		var body = $('#new_comment_body').val();
		if (target_id && title && body) {
			rqra.createComment(target_id, title, body, function (data) {
				if (data) {
					if (data.errorcode === 0) {
						alert('OK OK REFRESH NOW');
					}

				}

				else {
					alert('CANNOT CONNECT TO DATABASE');


				}

			})


		}
		else{
			alert('CANNOT BE EMPTY FILED');
		}

	})


	$("#getCommentById").click(function (event) {
		var comment_id = $('#comment_id').val();
		if (comment_id) {
			rqra.getCommentById(comment_id, function (data) {
				if (data) {
					if (data.errorcode === 0) {
						$('#comment_title').val(data.comment.title);
						$('#comment_body').val(data.comment.body);
					}
					else {
						alert(data.message);
					}
				}
				else {
					alert('CANNOT CONNECT TO DATABASE');
				}
			})
		}
		else {
			alert('CANNOT BE EMPTY ID');
		}
	})


	$("#updateCommentById").click(function (event) {
		var comment_id = $('#comment_id').val();
		var new_title = $('#comment_title').val();
		var new_body = $('#comment_body').val();
		if (comment_id && new_title && new_body) {
			//rqra.updateCommentById('pJfzndwdadddQuOicWWAjx7F00', "i have no clue!!!" ,function(data){
			rqra.updateCommentById(comment_id, new_title, new_body, function (data) {

				if (data) {

					if (data.errorcode === 0) {

						alert("COOL,REFRESH THE LIST");
					}
					else {
						alert(data.message);
					}

				}
				else {
					alert('CANNOT CONNECT TO DATABASE');
				}
			})
		}
		else {
			alert('CANNOT HAVE EMPTY FILED');
		}
	})

	$('#deleteCommentById').click(function () {
		var comment_id = $('#comment_id').val();
		if (comment_id) {

			rqra.deleteCommentById(comment_id, function (data) {

				if (data) {

					if (data.errorcode === 0) {

						alert("COOL, REFRESH THE LIST");
					}
					else {
						alert(data.message);
					}

				}
				else {
					alert('CANNOT CONNECT TO DATABASE');
				}


			})


		}

		else {
			alert('CANNOT HAVE EMPTY FILED');
		}
	});



	$('#getCommentsByUserId').click(function (event) {
		var user_id = $("#comment_user_id").val();
		if (user_id) {
			rqra.getCommentsByUserId(user_id, function (data) {
				if (data) {
					console.log(data);
					$('#user_comments').empty();
					if (data.errorcode === 0 && data.comments.length > 0) {

						$.each(data.comments, function (index, item) {
							console.log(item);
							var content = '<li class="comments_li">'
								+ '<p>_id: ' + item._id + '</p>'
								+ '<p>body: ' + item._source.body + '</p>'
								+ '<p>downvote: ' + item._source.downvote + '</p>'
								+ '<p>isAnswered: ' + item._source.isAnswered + '</p>'
								+ '<p>objectType: ' + item._source.objectType + '</p>'
								+ '<p>target_uuid: ' + item._source.target_uuid + '</p>'
								+ '<p>timestamp: ' + item._source.timestamp + '</p>'
								+ '<p>title: ' + item._source.title + '</p>'
								+ '<p>upvote: ' + item._source.upvote + '</p>'
								+ '<p>user: ' + item._source.user + '</p>'
								+ '</li>';
							console.log(content);
							$('#user_comments').append(content);
						});
					}
					else {
						alert(data.message);
					}

				}
				else {
					alert('CANNOT CONNECT TO DATABASE');
				}
			});
		}
		else {
			alert('CANNOT BE EMPTY FILED');
		}


	});


	$('#getCommentsByTargetId').click(function () {
		var target_id = $('#question_id').val();
		if (target_id) {

			rqra.getCommentsByTargetId(target_id, function (data) {

				if (data) {
					console.log(data);
					if (data.errorcode === 0 && data.comments.length > 0) {


						$.each(data.comments, function (index, item) {

							var content = '<li class="comments_li">'
								+ '<p>_id: ' + item._id + '</p>'

								+ '<p>body: ' + item._source.body + '</p>'
								+ '<p>downvote: ' + item._source.downvote + '</p>'
								+ '<p>isAnswered: ' + item._source.isAnswered + '</p>'
								+ '<p>objectType: ' + item._source.objectType + '</p>'
								+ '<p>target_uuid: ' + item._source.target_uuid + '</p>'
								+ '<p>timestamp: ' + item._source.timestamp + '</p>'
								+ '<p>title: ' + item._source.title + '</p>'
								+ '<p>upvote: ' + item._source.upvote + '</p>'
								+ '<p>user: ' + item._source.user + '</p>'
								+ '</li>';
							$('#question_comments').append(content);
						});
					}
					else {
						alert(data.message);
					}

				}
				else {
					alert('CANNOT CONNECT TO DATABASE');
				}


			})


		}

		else {
			alert('CANNOT HAVE EMPTY FILED');
		}
	});


});

function loadAllQuestions(rqra) {

	rqra.getAllQuestions(function (data) {
		if (data) {
			$('#questions').empty();
			if (data.errorcode === 0 && data.questions.length > 0) {

				$.each(data.questions, function (index, item) {
					console.log(item);
					var content = '<li class="questions_li">'
						+ '<p>_id: ' + item._id + '</p>'
						+ '<p>title: ' + item._source.title + '</p>'
						+ '<p>body: ' + item._source.body + '</p>'
						+ '<p>category: ' + item._source.category + '</p>'
						+ '<p>status: ' + item._source.status + '</p>'
						+ '<p>timestamp: ' + item._source.timestamp + '</p>'
						+ '<p>user: ' + item._source.user + '</p>'
						+ '<p>followers: ' + item._source.followup + '</p>'

						+ '</li>';
					$('#questions').append(content);
				});
			}
			else {
				alert(data.message);
			}

		}
		else {
			alert('CANNOT CONNECT TO DATABASE');
		}
	});

}


function loadAllComments(rqra) {

	rqra.getAllComments(function (data) {
		if (data) {
			$('#comments').empty();

			if (data.errorcode === 0 && data.comments.length > 0) {

				$.each(data.comments, function (index, item) {
					console.log(item);
					var content = '<li class="comments_li">'
						+ '<p>_id: ' + item._id + '</p>'

						+ '<p>body: ' + item._source.body + '</p>'
						+ '<p>downvote: ' + item._source.downvote + '</p>'
						+ '<p>isAnswered: ' + item._source.isAnswered + '</p>'
						+ '<p>objectType: ' + item._source.objectType + '</p>'
						+ '<p>target_uuid: ' + item._source.target_uuid + '</p>'
						+ '<p>timestamp: ' + item._source.timestamp + '</p>'
						+ '<p>title: ' + item._source.title + '</p>'
						+ '<p>upvote: ' + item._source.upvote + '</p>'
						+ '<p>user: ' + item._source.user + '</p>'
						+ '</li>';
					$('#comments').append(content);
				});
			}
			else {
				alert(data.message);
			}

		}
		else {
			alert('CANNOT CONNECT TO DATABASE');
		}
	});

}