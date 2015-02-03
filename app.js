var express = require('express');
var app = express();
var cors = require('cors');
var sprintf = require('./sprintf.js');
var bodyParser = require('body-parser');
var sequelize = require('./sequelize.js');
var Sequelize = require('sequelize');



/*
var session = require('express-session');
 
app.use(session({secret: 'keyboard cat', resave: false, saveUninitialized: true}));
*/


app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors());

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
	
		// Remove the inital "Basic "
		var authorization = request.headers.authorization.split(' ')[1];
		
		// Decode
		authorization = new Buffer(authorization, 'base64').toString('ascii');	
	
		var credentials = authorization.split(':');
	
		if (credentials.length != 2)
			throw new Error('There is no authorization specified in the http header.');	
	
	
		var username = credentials[0];
		var password = credentials[1];
		

		function getUser(username) {
			return Model.User.findOne({where:{username:username}}).then(function(user) {
				if (user != null)
					return user;

				return sequelize.transaction(function(t){
					return Model.Client.create({name:'Bookio'}, {transaction:t}).then(function(client) {
						
						var attrs = {};					
						attrs.username  = username;
						attrs.name      = username;
						attrs.password  = password;
						attrs.client_id = client.id;
						
						return Model.User.create(attrs, {transaction:t}).then(function(user){
							return user;

						});
					});
				});
			});
			
		}
		

		function getSession(user) {
			return Model.Session.findOne({where: {user_id: user.id}}).then(function(session) {
				
				if (session != null)
					return session;

				return Model.Session.create({user_id:user.id, client_id:user.client_id, sid:UUID.v1()}, {returning:true});
			});
			
		}


		getUser(username).then(function(user) {
			return getSession(user).then(function(session) {

				return Model.Session.findOne({where: {id: session.id}, include: [{model:Model.User, include:[{model:Model.Client}]}]}).then(function(session) {
					
					// Create a new session
					if (session == null)
						throw new Error('Could not create a session.');

					server.reply({sid: session.sid, user:session.user, client:session.user.client});
					
				});
			});
				
		}).catch(function(error) {
			server.error(error);			
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
	var hash = require('password-hash');

	
	var server = new Server(request, response);

	try {
		// Remove the inital "Basic "
		var authorization = request.headers.authorization.split(' ')[1];
		
		// Decode
		authorization = new Buffer(authorization, 'base64').toString('ascii');	
	
		var credentials = authorization.split(':');
	
		if (credentials.length != 2)
			throw new Error('There is no authorization specified in the http header.');	
			
		var username = credentials[0];
		var password = credentials[1];
		
		var query = {
			where: Sequelize.or(
				{name: username},
				{username: username}
			)
		};
		
		Model.User.findOne(query).then(function(user) {

			if (user == null)
				throw new Error('Invalid user name.');

			if (user.password != '' && !hash.verify(password, user.password))
				throw new Error('Invalid password.');

				
			Model.Session.findOne({where: {user_id: user.id}, include: [{model:Model.User, include:[{model:Model.Client}]}]}).then(function(session) {
				
				// Create a new session
				if (session == null) {
					Model.Session.create({user_id:user.id, sid:UUID.v1(), client_id:user.client_id}).then(function() {
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
