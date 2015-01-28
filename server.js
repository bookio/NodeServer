
var Model   = require('./model');
var Session = Model.Session;
var User    = Model.User;



module.exports = function(request, response) {
	

	var self = this;
	
	self.error = function(error) {
		var text = '#ERROR#';
		
		if (error.message != undefined)
			text = error.message;
		else
			text = error;
		console.log('reply:', error);
		response.status(404).json({error:text});	
	}
	
	self.reply = function(data) {
		response.status(200).json(data);	
		
	}


     
/*
	self.authenticate = function() {
		return Session.findOne({where: {sid: request.headers.authorization}}).then(function(session) {
			if (session == null)
				throw new Error('Invalid session ID.');

			return User.findOne({where:{id: session.user_id}}).then(function(user) {
				if (user == null)
					throw new Error('Invalid user ID.');
					
				return user;
			});
		});
	}
*/

	self.authenticate = function() {
		return Session.findOne({where: {sid: request.headers.authorization}, include: [{model:Model.User}]  }).then(function(session) {
			if (session == null)
				throw new Error('Invalid session ID.');
				
			return session.user;
		});
	}

};



