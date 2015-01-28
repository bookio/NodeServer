var express = require('express');
var app = express();
var sprintf = require('./sprintf.js');
var bodyParser = require('body-parser');
var sequelize = require('./sequelize.js');


app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use('/users', require('./routes/users'));
app.use('/categories', require('./routes/categories'));
app.use('/customers', require('./routes/customers'));
app.use('/rentals', require('./routes/rentals'));
app.use('/reservations', require('./routes/reservations'));
app.use('/options', require('./routes/options'));
app.use('/settings', require('./routes/settings'));
app.use('/groups', require('./routes/groups'));
app.use('/sessions', require('./routes/sessions'));
app.use('/icons', require('./routes/icons'));
app.use('/clients', require('./routes/clients'));


app.get('/verify', function (request, response) {

	var Model = require('./model');
	var Server = require('./server');

	var server = new Server(request, response);
	
	Model.Session.findOne({where: {sid: request.headers.authorization}, include: [{model:Model.User, include:[{model:Model.Client}]}]}).then(function(session) {
		if (session == null)
			throw new Error('Invalid session ID.');
	
		var result = {};
		result.sid = request.headers.authorization;
		result.user = session.user;		
		result.client = session.user.client;	
		
		server.reply(result);

		
	}).catch(function(error) {
		server.error(error);
	});	

});

app.get('/logout', function (request, response) {

	server.reply(null);
		

});


app.get('/signup', function (request, response) {

	var Model = require('./model');
	var Server = require('./server');
	var UUID = require('node-uuid');
	
	
	var server = new Server(request, response);

	try {
		console.log('autg', request.headers.authorization);
	
		// Remove the inital "Basic "
		var authorization = request.headers.authorization.split(' ')[1];
		
		// Decode
		authorization = new Buffer(authorization, 'base64').toString('ascii');	
	
		var credentials = authorization.split(':');
	
		if (credentials.length != 2)
			throw new Error('There is no authorization specified in the http header.');	
			
		var username = credentials[0];
		var password = credentials[1];
		
		Model.User.findOne({where:{username:username}}).then(function(user) {

			if (user == null)
				throw new Error('Invalid user name.');

				
			Model.Session.findOne({where: {user_id: user.id}, include: [{model:Model.User, include:[{model:Model.Client}]}]}).then(function(session) {
				
				// Create a new session
				if (session == null) {
					Model.Session.create({user_id:user.id, sid:UUID.v1()}).then(function() {
						Model.Session.findOne({where: {user_id: user.id}, include: [{model:Model.User, include:[{model:Model.Client}]}]}).then(function(session) {

							if (session == null)
								throw new Error('WTF?');
								
							server.reply({sid: session.sid, user:session.user, client:session.user.client});


						}).catch(function(error) {
							server.error(error);			
						});
						
					}).catch(function(error) {
						server.error(error);			
					});
					
				}
				else {
					server.reply({sid: session.sid, user:session.user, client:session.user.client});
					
				}
				
			}).catch(function(error) {
				server.error(error);			
			});
			
		}).catch(function(error) {
			server.error(error.message);			
		});
	
	}
	catch(error) {
		server.error(error);
		
	}
	
	

});


app.get('/login', function (request, response) {

	var Model = require('./model');
	var Server = require('./server');
	var UUID = require('node-uuid');
	
	
	var server = new Server(request, response);

	try {
		console.log('autg', request.headers.authorization);
	
		// Remove the inital "Basic "
		var authorization = request.headers.authorization.split(' ')[1];
		
		// Decode
		authorization = new Buffer(authorization, 'base64').toString('ascii');	
	
		var credentials = authorization.split(':');
	
		if (credentials.length != 2)
			throw new Error('There is no authorization specified in the http header.');	
			
		var username = credentials[0];
		var password = credentials[1];
		
		Model.User.findOne({where:{username:username}}).then(function(user) {

			if (user == null)
				throw new Error('Invalid user name.');

				
			Model.Session.findOne({where: {user_id: user.id}, include: [{model:Model.User, include:[{model:Model.Client}]}]}).then(function(session) {
				
				// Create a new session
				if (session == null) {
					Model.Session.create({user_id:user.id, sid:UUID.v1()}).then(function() {
						Model.Session.findOne({where: {user_id: user.id}, include: [{model:Model.User, include:[{model:Model.Client}]}]}).then(function(session) {

							if (session == null)
								throw new Error('WTF?');
								
							server.reply({sid: session.sid, user:session.user, client:session.user.client});


						}).catch(function(error) {
							server.error(error);			
						});
						
					}).catch(function(error) {
						server.error(error);			
					});
					
				}
				else {
					server.reply({sid: session.sid, user:session.user, client:session.user.client});
					
				}
				
			}).catch(function(error) {
				server.error(error);			
			});
			
		}).catch(function(error) {
			server.error(error.message);			
		});
	
	}
	catch(error) {
		server.error(error);
		
	}
	
	

});


app.listen(app.get('port'), function() {
	console.log("Node app is running on port " + app.get('port'));
});

module.exports = app;
