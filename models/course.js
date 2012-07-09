var fs      = require("fs")
var config  = JSON.parse(fs.readFileSync("config.json"));
var Sequelize = require('sequelize');
var CourseMember = require('./courseMember.js').CourseMember;
var db = new Sequelize(
	config.mysqlDatabase["db-name"],	
	config.mysqlDatabase["user"],
	config.mysqlDatabase["password"],
	
	{
		port: config.mysqlDatabase["port"],
		host: config.mysqlDatabase["host"]
		//logging: false
	}
);


var Course = exports.Course = db.define('Course', {
	uuid: {type: Sequelize.STRING, primaryKey: true},
	title: {type: Sequelize.STRING, allowNull: false},
	section: {type: Sequelize.STRING, allowNull: false},
	subject: {type: Sequelize.STRING, allowNull: false},
	number: {type: Sequelize.INTEGER, allowNull: false},
	instructor: {type: Sequelize.STRING, allowNull: false},
	meetingtimes: {type: Sequelize.TEXT}
});

exports.selectCourse = function(args, callback){
	Course.find({where: args}).success(function(course){
		callback(null, course);
	}).error(function(error){
		callback(error, null);
		console.log("Couldn't select course " + error);
	});
}

exports.selectCourses = function(args, callback){
	Course.findAll({where: args}).success(function(courses){
		callback(null, courses);
	}).error(function(error){
		callback(error, null);
		console.log("Couldn't select course " + error);
	});
}

exports.getInstructor = function(args, callback){
	Course.find({where: args}).success(function(course){
		var CourseUser = require('./user.js').User;
		CourseUser.find({where: {uuid: course.instructor}}).success(function(courseInstructor){
			callback(null, courseInstructor);
		}).error(function(error){
			callback(error, null);
		});
	})
}

//Gets all users that are associated to a certain course
exports.getCourseMembers = function(args, callback){
	var User = require('./user.js').User;
	CourseMember.findAll({where: args}).success(function(memberRows){
		
		//Build list of user uuids
		if(memberRows.length > 0){
			var i;
			var userUUIDs = [];
			for(i=0; i<memberRows.length; ++i){
				userUUIDs.push(memberRows[i].user);
			}
		}

		//If there are any users, get them
		if(userUUIDs){
			User.findAll({where: {uuid: userUUIDs}}).success(function(users){
				callback(null, users);
			}).error(function(error){
				callback(error, null);
				console.log("Couldn't find course members " + error);
			})	
		}
		else{
			callback(null, []);
		}

	}).error(function(error){
		console.log("Can't find course " + error);
		callback(error, null);
	})
}