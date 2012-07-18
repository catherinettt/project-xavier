var User        = require(__dirname + "/../../models/user");
var UserProfile = require(__dirname + "/../../models/userProfile");
var Course      = require(__dirname + "/../../models/course");
var OrganizationAction = require(__dirname + "/../../controller/OrganizationAction");
var QueryES = require('./../../controller/queryES.js');
var nlp = require('./../../controller/nlp.js');
var question = require('./../../models/question.js');
var comment = require('./../../models/comment.js');

exports.index = function(request, response) {
	response.render('common/index', { title: "Homepage" });
}

exports.logout = function(request, response) {
	console.log('loging out...');	
	request.session.destroy();	
	response.redirect('home');
}

exports.login = function(request, response) {
	var CAS = require('mikeklem-cas');
	var cas = new CAS({base_url: 'https://cas.sfu.ca/cgi-bin/WebObjects/cas.woa/wa/serviceValidate', service: 'http://'+request.headers['host']+'/login'});
	console.log('http://'+request.headers['host']+request.url);
	
	//Pass ticket to CAS Validation url, or redirect to the CAS login page to get a ticket
	var ticket = request.query["ticket"];
	
	if (ticket) {
		cas.validate(ticket, function(err, status, username) {
			if (err) {
				// Handle the error
	        	response.send({error: err});
	    	}
	    	
	    	//Todo: proper redirection to page after login
	    	else {
	        	// Log the user in and store user in the session
	        	User.selectUser({"userID":username}, function(error, user){
	        		if(!error){
	        			//If no user was found in the database, create a new one
	        			if(!user){
	        				var newUser = {
								firstName: ""
								, lastName: ""
								, userID: username
								, email: username + "@sfu.ca"
							}
	        				User.createUser(newUser, function(error, user){
	        					if(error){
		        					response.send(error);
	        					}
	        					else{
	        						request.session.user = user;
									response.send(request.session);									
	        					}
	        				})

	        			}
						else{
							//what to do if user is found in database
							request.session.user = user;
							response.send(request.session);							
						}
	        		}
	        		else{
	        			response.send(error);
	        		}
	        	});
	      	}
	    });
	} 
	else{
		var myService = require('querystring').stringify({
			service: 'http://'+request.headers['host']+request.url
		});
		response.redirect('https://cas.sfu.ca/cgi-bin/WebObjects/cas.woa/wa/login?' + myService);
	}
}

exports.user = function(request, response) {
	var user_id = request.params.id;
	
	if (request.method === "GET") {
		User.selectUser({ uuid: user_id }, function(error, result) {
			if (result) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, user: result }));
			} else {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: "User not found" }));
			}
		});
	}
}

exports.userProfile = function(request,response){
	var user_id = request.params.id;

	if (request.method === "GET") {
		UserProfile.getUserProfile(user_id, function(error, result) {
			if (result) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, profile: result }));
			} else {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: "User not found" }));
			}

		});

	}

	if (request.method === "PUT") {
		UserProfile.updateProfile(user_id, request.body, function(error, result) {
			if (result) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, user: result }));
			} else {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: "User not found" }));
			}

		});
	}

}

exports.userPreferredName = function(request, response) {
	if (request.method === "PUT") {
		if(request.session && request.session.user){
			User.setPreferedName(request.session.user.uuid, request.body.name, function(error, result) {
				if (result) {
					response.writeHead(200, { 'Content-Type': 'application/json' });
					response.end(JSON.stringify({ errorcode: 0, user: result }));
				} else {
					response.writeHead(200, { 'Content-Type': 'application/json' });
					response.end(JSON.stringify({ errorcode: 1, message: "User not found" }));
				}
			});
		}else{
			response.writeHead(200, { 'Content-Type': 'application/json' });
			response.end(JSON.stringify({ errorcode: 1, message: 'You aren\'t logged in' }));
		}
	}
}


exports.userQuery = function(request, response) {
	if (request.method === "POST" && request.body.where) {
		User.selectUsers(request.body.where, function(error, result) {
			if (result) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, users: result }));
			} else {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: "User not found" }));
			}
		});
	}
}

exports.userCourses = function(request, response) {
	if (request.method === "GET") {

		if(request.session && request.session.user){
			User.getUserCourses(request.session.user.uuid, function(error, result) {
				if (result) {
					response.writeHead(200, { 'Content-Type': 'application/json' });
					response.end(JSON.stringify({ errorcode: 0, courses: result }));
				} else if(error){
					response.writeHead(200, { 'Content-Type': 'application/json' });
					response.end(JSON.stringify({ errorcode: 1, message: error }));
				}
				else{
					response.writeHead(200, { 'Content-Type': 'application/json' });
					response.end(JSON.stringify({ errorcode: 0, courses: [] }));
				}
			});
		}else{
			response.writeHead(200, { 'Content-Type': 'application/json' });
			response.end(JSON.stringify({ errorcode: 1, message: 'You aren\'t logged in' }));
		}
	}
}

exports.course = function(request, response) {

	var course_id = request.params.id;
	
	if (request.method === "GET") {
		Course.selectCourse({ uuid: course_id }, function(error, result) {
			if (result) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, course: result }));
			} else {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: "Course not found" }));
			}
		});
	}
}


exports.courseMembers = function(request,response){
	var course_id = request.params.id;
	if (request.method === "GET") {
		Course.getCourseMembers(course_id, function(error, result) {
			if (result) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, members: result }));
			} else {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: "Course not found" }));
			}
		});
	}
}

exports.courseQuery = function(request, response) {
	if (request.method === "POST" && request.body.where) {
		Course.selectCourses(request.body.where, function(error, result) {
			if (result) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, courses: result }));
			} else {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: "Course not found" }));
			}
		});
	}
}

exports.courseInstructor = function(request, response){
	var course_id = request.params.id;
	if(request.method === "GET"){
		Course.getInstructor(course_id, function(error, result){
			if(result){
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, instructor: result }));
			}
			else if(error){
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: error }));
			}
			else{
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: "Instructor not found" }));
			}
		})
	}
}

exports.courseResources = function(request, response){
	var course_id = request.params.id;
	if(request.method === "GET"){
		OrganizationAction.getResourcesByCourseUUID({course:course_id}, function(error, result){
			if(result){
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, instructor: result }));
			}
			else if(error){
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: error }));
			}
			else{
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: "Instructor not found" }));
			}
		})
	}
}

//section materials
exports.addResourceToSection = function(request, response){
	if(request.method === "POST"){
		OrganizationAction.addResourceToSection(request.body, function(error, result){
			if (result) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, sectionMaterial: result }));
			} else {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: "Failed to add resource to section" }));
			}
		})
	}
}

exports.updateResourceFromSectionToSection = function(request, response){
	if(request.method === "PUT"){
		OrganizationAction.updateResourceFromSectionToSection(request.body, function(error, result){
			if (result) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, sectionMaterial: result }));
			} else {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: "Failed to update resource to new section" }));
			}
		})
	}
}

exports.removeResourceFromSection = function(request, response){
	if(request.method === "DELETE"){
		OrganizationAction.removeResourceFromSection(request.body, function(error, result){
			if (result) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, sectionMaterial: result }));
			} else {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: "Failed to remove resource from section" }));
			}
		})
	}
}

exports.addSection = function(request, response){
	if(request.method === "POST"){
		OrganizationAction.addSection(request.body, function(error, result){
			if (result) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, section: result }));
			} else {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: "Failed to add section" }));
			}
		})
	}
}

exports.updateSection = function(request, response){
	if(request.method === "PUT"){
		OrganizationAction.updateSection(request.body, function(error, result){
			if (result) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, section: result }));
			} else {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: "Failed to update section" }));
			}
		})
	}
}
exports.removeSection = function(request, response){
	if(request.method === "DELETE"){
		OrganizationAction.removeSection(request.body, function(error, result){
			if (result) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, section: result }));
			} else {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: "Failed to remove section" }));
			}
		})
	}
}

exports.sectionsInCourse = function(request, response){
	if(request.method === "POST"){
		OrganizationAction.sectionsInCourse(request.body, function(error, result){
			if (result) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, sectionsInCourse: result }));
			} else {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: "Failed to get all sections in a course" }));
			}
		})
	}
}

exports.resourcesInSection = function(appType, request, response){
	if(request.method === "POST"){
		var args = request.body;
		args.appType = appType;

		OrganizationAction.resourcesInSection(args, function(error, result){
			if (result) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, resourcesInSection: result }));
			} else {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: "Failed to get all resources in a section" }));
			}
		})
	}
}

exports.numberOfResourcesInCourse = function(request, response){
	if(request.method === "POST"){
		OrganizationAction.numberOfResourcesInCourse(request.body, function(error, result){
			if (result) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, numberOfResourcesInCourse: result }));
			} else {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: "Failed to get count of resources in a course" }));
			}
		})
	}
}


//increment the view count for a question
//@params request.params.uid
exports.questionViewCountRoute = function(appType, request, response){
	if (request.method === "PUT") {
		var uuid = request.params.uid;
		QueryES.questionViewCount(uuid, appType, function(err, result) {
			if (result) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, question: result }));
			} else {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: err }));
			}
		});

	}
}

//TODO:deprecated
exports.instructorQuestionsRoute = function(appType, request, response){
	if (request.method === "GET") {
		QueryES.getInstructorQuestion(appType, request.params.page, function(err, result) {
			if (result) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, question: result }));
			} else {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: err }));
			}
		});

	}
}

exports.questionRoute = function(appType, request, response) {
	var question_id = request.params.uid;
	if (request.method === "GET") {
		QueryES.getQuestion(question_id, appType, function(err, result) {
			if (result) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, question: result }));
			} else {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: err }));
			}
		});

	}

	//post a new question
	else if (request.method === "POST"){
		//if not log in, cannot create a question
		if(request.session && request.session.user){
			console.log(request.body.question);
			//user, title, body, category
			var newQuestion = new question(request.session.user.uuid
				,request.body.question.title
				,request.body.question.body
				,request.body.question.category);

			//TODO: sectionUuid
			//newQuestion.sectionUuid = request.body.sectionUuid;		//frontend
			newQuestion.sectionUuid = 'someTestSection';
			QueryES.addQuestion(newQuestion, appType, function(err, result) {
				if (result) {
					response.writeHead(200, { 'Content-Type': 'application/json' });
					response.end(JSON.stringify({ errorcode: 0, question: result}));
				} else {
					response.writeHead(200, { 'Content-Type': 'application/json' });
					response.end(JSON.stringify({ errorcode: 1, message: err }));
				}
			});
		}
		else{
			response.writeHead(200, { 'Content-Type': 'application/json' });
			response.end(JSON.stringify({ errorcode: 1, message: 'You aren\'t logged in' }));
		}

	}

	else if (request.method === "PUT") {
		//TODO: need update document and unit-test
		var questionTitle = request.body.title;
		var questionBody = request.body.body;

		QueryES.updateQuestion(question_id,questionTitle,questionBody, appType, function(result) {
			if (result) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, question: result }));
			} else {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: "Object not found" }));
			}
		});

	} else if (request.method === "DELETE") {
		QueryES.deleteQuestion(question_id, appType, function(err, result) {
			if (result) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, question: err }));
			} else {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: err }));
			}
		});
	}
}

exports.questionsRoute = function(appType, request, response){
	if (request.method === "GET") {
		QueryES.getAllQuestions( appType, request.params.page, function(err, result) {
			if (result) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, questions: result }));
			} else {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: err }));
			}
		});
	}

}

//TODO:deprecated
exports.questionsUnansweredRoute = function(appType, request, response){
	if (request.method === "GET") {
		QueryES.getAllUnansweredQuestions( appType, request.params.page, function(result) {
			if (result) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, questions: result }));
			} else {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: "Object not found" }));
			}
		});
	}
}

//TODO:deprecated
exports.questionsNewRoute = function(appType, request, response){
	if (request.method === "GET") {
		QueryES.getAllNewQuestions( appType, request.params.page, function(err, result) {
			if (result) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, questions: result }));
			} else {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: err }));
			}
		});
	}
}

exports.questionsAnsweredRoute = function(appType, request, response){
	if (request.method === "GET") {
		QueryES.getAllRecentlyAnsweredQuestions( appType, request.params.page,function(err, result) {
			if (result) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, questions: result }));
			} else {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: err }));
			}
		});
	}
}

exports.questionsByUserRoute = function(appType, request, response) {
	var userId = request.params.uid;

	if (request.method === "GET") {
		QueryES.getAllQuestionByUserID(userId, request.params.page, appType, function(err, result) {
			if (result) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, questions: result }));
			} else {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: err }));
			}
		});
	}
}

exports.followQuestionRoute = function(appType, request, response) {
	if (request.method === "PUT") {
		if(request.session && request.session.user){
			QueryES.addFollower(request.params.uid, request.session.user.uuid, appType, function(err, result) {
				if (result) {
					response.writeHead(200, { 'Content-Type': 'application/json' });
					response.end(JSON.stringify({ errorcode: 0, question: result}));
				} else {
					response.writeHead(200, { 'Content-Type': 'application/json' });
					response.end(JSON.stringify({ errorcode: 1, message: err }));
				}
			});
		}
		else{
			response.writeHead(200, { 'Content-Type': 'application/json' });
			response.end(JSON.stringify({ errorcode: 1, message: 'You aren\'t logged in' }));
		}

	}
}

exports.unfollowQuestionRoute = function(appType, request, response) {
	if (request.method === "PUT") {
		if(request.session && request.session.user){
			QueryES.removeFollower(request.params.uid, request.session.user.uuid, appType, function(err, result) {
				if (result) {
					response.writeHead(200, { 'Content-Type': 'application/json' });
					response.end(JSON.stringify({ errorcode: 0, question: result}));
				} else {
					response.writeHead(200, { 'Content-Type': 'application/json' });
					response.end(JSON.stringify({ errorcode: 1, message: err }));
				}
			});
		}
		else{
			response.writeHead(200, { 'Content-Type': 'application/json' });
			response.end(JSON.stringify({ errorcode: 1, message: 'You aren\'t logged in' }));
		}
	}
}

exports.questionStatusRoute = function(appType, request, response) {
	if (request.method === "PUT") {
		QueryES.updateStatus(request.params.uid, appType, function(err, result) {
			if (result) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, question: result}));
			} else {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: err }));
			}
		});
	}
}

exports.commentRoute = function(appType, request, response) {
	if (request.method === "GET") {
		QueryES.getComment(request.params.uid, appType, function(err, result) {
			if (result) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, comment: result }));
			} else {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: err }));
			}
		});
	} else if (request.method === "POST"){
		if(request.session && request.session.user){
			var newComment = new comment(
				request.body.comment.target_uuid
				,request.session.user.uuid
				,request.body.comment.objectType
				,request.body.comment.body);

			QueryES.addComment(newComment, appType, function(err, result) {
				if (result) {
					response.writeHead(200, { 'Content-Type': 'application/json' });
					response.end(JSON.stringify({ errorcode: 0, comment: result}));
				} else {
					response.writeHead(200, { 'Content-Type': 'application/json' });
					response.end(JSON.stringify({ errorcode: 1, message: err }));
				}
			});
		}
		else{
			response.writeHead(200, { 'Content-Type': 'application/json' });
			response.end(JSON.stringify({ errorcode: 1, message: 'You aren\'t logged in' }));
		}
	} else if (request.method === "PUT") {
		QueryES.updateComment(request.params.uid, request.body.body, appType, function(err, result) {
			if (result) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, comment: result }));
			} else {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: err }));
			}
		});

	} else if (request.method === "DELETE") {
		QueryES.deleteComment(request.params.uid, appType, function(err, result) {
			if(result){
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, result: result }));
			}
			else{
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, error: err}));
			}
		});
	}
}

exports.commentsRoute = function(appType,request,response){
	if (request.method === "GET") {
		QueryES.getAllComments(appType, request.params.page, function(err, result) {
			if (result) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, comments: result }));
			} else {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: err }));
			}
		});
	}

}

exports.commentsByUserRoute = function(appType, request, response) {
	if (request.method === "GET") {
		QueryES.getAllCommentByUserID(request.params.uid, request.params.page, appType, function(err, result) {
			if (result) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, comments: result }));
			} else {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: err }));
			}
		});
	}

	//deprecated, used POST in commentRoute instead

//	else if (request.method === "POST") {
//		queryES.addComment(request.body.comment, appType, function(result) {
//			response.writeHead(200, { 'Content-Type': 'application/json' });
//			response.end(JSON.stringify({ errorcode: 0 }));
//		});
//	}
}

exports.commentVoteRoute = function(appType, request, response) {
	if (request.method === "PUT") {
		QueryES.updateVote(request.params.uid, request.params.dir, appType, function(err, result) {
			if (result) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, comment: result }));
			} else {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: err }));
			}
		});
	}
}

//TODO:deprecated
exports.commentAnsweredRoute = function(appType, request, response) {
	if (request.method === "PUT") {
		QueryES.updateIsAnswered(request.params.uid, appType, function(err, result) {
			if (result) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, comment: result }));
			} else {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: err }));
			}
		});
	}
}

exports.commentsByQuestionRoute = function(appType, request, response) {
	if (request.method === "GET") {
		QueryES.getCommentByTarget_uuid(request.params.uid, request.params.page, appType, function(err, result) {
			if (result) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 0, comments: result }));
			} else {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ errorcode: 1, message: err }));
			}
		});
	}
}

exports.searchRoute = function(appType, request, response) {
	var query = request.body.query;

	if (request.method === "POST") {

		nlp(query, function(query){
			console.log('query after nlp parsing is: ' + query);

			QueryES.searchAll(query, request.params.page, appType, function(result) {
				if (result) {
					response.writeHead(200, { 'Content-Type': 'application/json' });
					response.end(JSON.stringify({ errorcode: 0, questions: result }));
				} else {
					response.writeHead(200, { 'Content-Type': 'application/json' });
					response.end(JSON.stringify({ errorcode: 1, message: "Object not found" }));
				}
			});
		});
	}
}


/****NEW Question sort stuff*/
exports.searchQuestions = function(appType, request, response){
	var queryData = request.body;

	if (request.method === "POST") {

		nlp(queryData.searchQuery, function(query){
			console.log('query after nlp parsing is: ' + query);

			queryData.searchQuery = query;

			QueryES.searchQuestions(appType, request.params.page, queryData, function(result){
				if (result) {
					response.writeHead(200, { 'Content-Type': 'application/json' });
					response.end(JSON.stringify({ errorcode: 0, questions: result }));
				} else {
					response.writeHead(200, { 'Content-Type': 'application/json' });
					response.end(JSON.stringify({ errorcode: 1, message: "Object not found" }));
				}
			});

			QueryES.searchAll(query, request.params.page, appType, function(result) {

			});
		});
	}
}
