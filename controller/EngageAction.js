var ES = require('../controller/queryES.js');
var Course = require('../models/course.js');
var async = require('async');
var User = require('../models/user.js');
var Star = require('../models/star.js');
var Like = require('../models/like.js');
var UserProfile = require('../models/userProfile.js');

var notificationHelper = exports.notificationHelper = function(notifications,callback){
	if(notifications){


		var new_list = [];

		var counter = 0;



		notifications.forEach(function(notification){

			counter ++;
			if (counter <6){  //only return the first 5
				var no = {};
				no.id = notification.notification.id;
				no.description = notification.notification.description;
				no.user = notification.user;
				no.avatar = notification.profile.profilePicture;
				no.type = notification.notificationListener.event;
				no.target = notification.notificationListener.target;

				new_list.push(no);
			}

		})

		callback(null,new_list);

	}
	else{
		callback('no notifications',notifications);
	}

}


var commentHelper = exports.commentHelper = function (comment, callback){

	if (comment) {
		var new_comment = {};
		new_comment.user = comment.user;
		new_comment.avatar = comment.profile;

		new_comment.uuid = comment._id;
		new_comment.like = comment._source.upvote;
		new_comment.body = comment._source.body;
		new_comment.target_uuid = comment._source.target_uuid;
		new_comment.createdAt = comment._source.created;
		new_comment.updatedAt = comment._source.timestamp;
		new_comment.parent_uuid = comment._source.commentParent;
		new_comment.owner = true;


		callback(null,new_comment);
	}

}




/*** This Helper formant the given raw json data into something more  meaningful
 to front end developer of Engage

It is written in controller level so other project using comments models won't be affected  */

var commentsHelper = exports.commentsHelper = function(json ,callback){


	if (json && json.total &&  json.hits){
		//only useful part of ES's returned data is the .hits part, save it

		var comments = json.hits;

		// a new list we are going to store formatted new json

		var new_comments = [];

		// a id name relationship list that developer can quickly access poster's name by comment id
		// this is used to fullfill a request that need a "reply to" filed for engage comment UI

		var id_name_list = [];

		// a child parent relationship list that developer can quickly access the parent id by giving child's id
		// this is used to find the ancestor of a replies in multi-threaded comments

		var child_parent_list = [];


		// reformart the comments to a standard json similar to what Sequelize returns;
		// this making front-end development easier because the naming convention
		// ex. timestamp is changed to updatedAt and _source layer is removed because it's not useful
		// some fileds not needed such as "downvote" is removed as well

		comments.forEach(function(comment){
			var new_comment = {};
			id_name_list[comment._id] = comment.user.firstName + ' ' + comment.user.lastName;
			child_parent_list[comment._id] = comment._source.commentParent;

			new_comment.user = comment.user;
			new_comment.avatar = comment.profile;

			new_comment.uuid = comment._id;
			new_comment.like = comment._source.upvote;
			new_comment.body = comment._source.body;
			new_comment.target_uuid = comment._source.target_uuid;
			new_comment.createdAt = comment._source.created;
			new_comment.updatedAt = comment._source.timestamp;
			new_comment.parent_uuid = comment._source.commentParent;
			new_comments.push(new_comment);

		})

		//buiding the id / name relastionship map
		new_comments.forEach(function(comment){
			comment.reply_to = id_name_list[comment.parent_uuid];
		})


		// two helper private functions here to find out who is the ancestor and the parent comment
		var getAncestor = function(child){
			var parent = getParent(child);
			if (parent){
				return getAncestor(parent);
			}
			else{
				return child;
			}

		}

		var getParent = function(child){
			return child_parent_list[child];
		}



		var map = [];
		var counter = 0;

		//creating the list we are going to return
		var super_new_comments = [];


		//first inset all the root/ancestor comment (which doesn't reply to other comments)
		new_comments.forEach(function(comment){
			if (!comment.parent_uuid){
				map[comment.uuid] = counter;
				counter ++;
				comment.replies = [];
				super_new_comments.push(comment)
			}
		})

		//then insert all sub replies into their ancestors
		new_comments.forEach(function(comment){
			if (comment.parent_uuid){
				super_new_comments[map[getAncestor(comment.uuid)]].replies.push(comment);
			}
		})

		//return the pretty formarted comments json objects
		//@see http://localhost:3000/api/resource/1/comments
		callback(null,super_new_comments);



	}
	else if(json.total === 0){
		callback(null,[]);
	}
	else{
		callback("Error on Getting Comments", null);
	}

}





var weekHelper = exports.weekHelper = function(){
	Date.prototype.getWeek = function () {
		var onejan = new Date(this.getFullYear(), 0, 1);
		return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
	}

	var one_week = 7 * 24 * 60 * 60 * 1000;
	var current_date = new Date();
	var semester_start_date = new Date(Date.parse('2012-05-07T07:00:00.000Z'));
	return current_date.getWeek() - semester_start_date.getWeek() + 1;


}

//take a week number, return a range of date
//var weekHelper = exports.weekHelper = function(weekNumber){
//	Date.prototype.yyyymmdd = function() {
//		var yyyy = this.getFullYear().toString();
//		var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
//		var dd  = this.getDate().toString();
//		return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' +(dd[1]?dd:"0"+dd[0]); // padding
//	};
//
//
//
//	var semesterStart = new Date('2012-05-07T07:00:00.000Z');   //this is UTC time
//	var firstWeekEnd = new Date(semesterStart.getTime() + (6 - semesterStart.getDay())*24*60*60*1000); //notice sunday is the first day of week here
//	var startDate = new Date();
//	var endDate = new Date();
//	var oneWeek = 7*24*60*60*1000;
//	if (weekNumber === 1){
//		return {start:semesterStart.yyyymmdd(),end:firstWeekEnd.yyyymmdd()};
//	}
//	else{
//		var weekStart = new Date( firstWeekEnd.getTime()+ (weekNumber-2)* oneWeek);
//		var weekEnd  =  new Date( firstWeekEnd.getTime()+ (weekNumber-1)* oneWeek);
//		return {start:weekStart.yyyymmdd(), end:weekEnd.yyyymmdd()};
//
//
//	}
//}

//this function add the needed second level deatials into json object, use it from REST level code.
var resourceHelper = exports.resourceHelper = function(currentUser,resources,callback){

	var parsedResult;
	async.series({
		findCourseInfo:function (callback) {
			async.forEach(resources, function (resource, callback) {
				Course.selectCourse({'uuid':resource.course}, function (error, course) {
					if (course) {
						resource.course = course;
					}
					callback();
				})

			}, function (err) {
				callback(err)
			})

		},

		findUserInfo:function (callback) {
			async.forEach(resources, function (resource, callback) {

					User.selectUser({"uuid":resource.user}, function (error, user) {
						if (user) {
							resource.user = user;
						}
						callback();
					});
				},
				function (err) {

					callback(err)
				})


		},
		// notice we cannot directly attach to json a totalcomments because it's a squalize object
		// so we need to stringfy first then parse....so hacky...
		findUserProfile: function(callback){
			parsedResult = JSON.parse(JSON.stringify(resources));
			async.forEach(parsedResult, function (resource, callback) {

					UserProfile.getUserProfile(resource.user.uuid, function (error, profile) {
						if (profile) {
							resource.user.avatar = profile.profilePicture;
						}
						callback();
					});
				},
				function (err) {

					callback(err)
				})
		},



		findTotalComments:function (callback) {


			async.forEach(parsedResult, function (resource, callback) {
					ES.getCommentCount(2, resource.uuid, function (err, result) {

						resource.totalComments = result;


						callback();
					})
				}
				, function (err) {
					callback(err)
				})
		}
		,
		findIsLiked:function (callback) {


			async.forEach(parsedResult, function (resource, callback) {
					Like.isResourceLiked({user:currentUser.uuid, resource:resource.uuid},function(err,result){
						if  (result){
							resource.liked = true
						}
						else{

							resource.liked = false;
						}

						callback(err);



					})

				}
				, function (err) {
					callback(err)
				})
		}
		,
		findIsStarred:function (callback) {


			async.forEach(parsedResult, function (resource, callback) {
					Star.isResourceStarred({user:currentUser.uuid, resource:resource.uuid},function(err,result){
						if  (result){
							resource.starred = true
						}
						else{

							resource.starred = false;
						}

						callback(err);



					})

				}
				, function (err) {
					callback(err)
				})
		} ,
		findIsOwner:function (callback) {


			async.forEach(parsedResult, function (resource, callback) {


						if  (currentUser.uuid === resource.user.uuid || currentUser.type === 1 || currentUser.type === 2 ){
							resource.owner = true
						}
						else{

							resource.owner = false;
						}

						callback();





				}
				, function (err) {
					callback(err)
				})
		}


	}, function(err){


		callback(null, parsedResult);

	}) ;


}