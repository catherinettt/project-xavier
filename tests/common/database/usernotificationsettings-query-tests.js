var should = require('should');
var fs      = require("fs")
var config  = JSON.parse(fs.readFileSync("config.json"));
var queries = require('../../../database/db-queries.js');
var UserNotificationSettings = require('../../../models/userNotificationSettings.js');

module.exports = {

	userTests:{
		
		setUp: function(callback){
			queries.dropDB(config.mysqlDatabase["db-name"], function(){
				queries.createDB(config.mysqlDatabase["db-name"], function(){
					queries.insertData(
						'./database/test-data.json'
						, config.mysqlDatabase["db-name"]
						, config.mysqlDatabase["user"]
						, config.mysqlDatabase["password"]
						, config.mysqlDatabase["host"]
						, callback
					);
				});
			});
		},
		tearDown: function(callback){
			queries.dropDB(config.mysqlDatabase["db-name"], function(){
				callback();
			});
		},		
		"Find user notification settings": function(test){
		  
		    var args = {
				user : 'aka87',
				app  : 1
		    }
		    
		    UserNotificationSettings.findNotificationSettings( args, function( error, notificationSettings ){
		    	test.ok( notificationSettings.should.have.property('notificationOnNewResource', 0 ));
		    	test.done();
		    });
		},
		
		
    	"Add user notification settings": function(test){
			var args = {
				user : 'yk38',
				app  : 3
			}
			
			UserNotificationSettings.addNotificationSetting( args, function( error, newNotificationSetting){
				UserNotificationSettings.findNotificationSettings( args, function( error, notificationSettings ){
		    		test.ok( notificationSettings.should.have.property('notificationOnNewResource', 0 ));
		    		test.done();
		    	});
			
			});
		},
		
		
			"Upate user notification settings ":function(test){
			var args = {
				user : 'aka87',
				app  : 1,
		    	
		    	notificationOnNewResource : 3,
  				notificationOnLike      : 2,
  				notificationOnComment   : 1,
  				notificationOnStar      : 3
			}
			UserNotificationSettings.findNotificationSettings( args, function( error, notificationSettings ){
				
				args.usernotificationsettings = notificationSettings;
		    	test.ok( args.usernotificationsettings.should.have.property("notificationOnNewResource", 0));
		    	UserNotificationSettings.updateUserNotificationSettings( args, function( error, updatedSettings){
		    		console.log( error );
		    		test.ok( updatedSettings.should.have.property("notificationOnNewResource", 3));
		    		test.done();
		    	});
		    }); 
		}
	}
}