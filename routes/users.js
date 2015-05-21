var router       = require('express').Router();
var uuid         = require('node-uuid');
var passwordHash = require('password-hash');

var sprintf      = require('../sprintf');
var Server       = require('../server');
var Model        = require('../model');
var sequelize    = require('../sequelize')


router.get('/guest', function (request, response) {

	var server = new Server(request, response);
	
	server.authenticate().then(function(session) {

		Model.User.findOne({where: {client_id: session.client_id, status:1}}).then(function(user) {
		
			if (user == null) {
				var attributes = {};
				attributes.username = uuid.v1();
				attributes.status = 1;
				attributes.name = 'Guest user';
				attributes.client_id = session.client_id;
				
				Model.User.create(attributes).then(function(user) {
					server.reply(user);
					
				}).catch(function(error) {
					server.error(error);
				});
			}
			else {
				server.reply(user);
			}
			
		}).catch(function(error) {
			server.error(error);
		});
		
	}).catch(function(error) {
		server.error(error);
	});
	
});
 
router.get('/', function (request, response) {

	var server = new Server(request, response);
	
	server.authenticate().then(function(session) {

		Model.User.findAll({where: {client_id: session.client_id, status:0}}).then(function(user) {
		
			server.reply(user);
			
		}).catch(function(error) {
			server.error(error);
		});
		
	}).catch(function(error) {
		server.error(error);
	});
	
});

router.get('/:id', function (request, response) {

	var server = new Server(request, response);
	
	server.authenticate().then(function(session) {
		Model.User.findOne({where: {client_id: session.client_id, id:request.params.id}}).then(function(user) {
			if (user == null)
				throw new Error(sprintf('User with id %s not found.', request.params.id));
			
			server.reply(user);
			
		}).catch(function(error) {
			server.error(error);
		});
		
	}).catch(function(error) {
		server.error(error);
	});
	
});



router.post('/', function (request, response) {

	var server = new Server(request, response);
		
	server.authenticate().then(function(session) {

		var user = Model.User.build(request.body);
		
		// Attach it to my client
		user.client_id = session.client_id;
		
		if (request.body.password != undefined && request.body.password != '')
			user.password = passwordHash.generate(request.body.password);
		
		// Save it
		user.save().then(function(user) {
		
			server.reply(user);
		
		}).catch(function(error) {
			server.error(error);
			
		});
		
	}).catch(function(error) {
		server.error(error);
	});	

});


router.put('/:id', function (request, response) {

	var server = new Server(request, response);
	var extend = require('extend');

	server.authenticate().then(function(session) {

		var attributes = {};
		extend(true, attributes, request.body);

		function verifyPassword() {

			if (attributes.password == undefined) {
				return sequelize.Promise.resolve();
			}

			if (request.query.password == undefined)
				request.query.password = '';
			
			console.log(request.query);
			
			return Model.User.findOne({where: {client_id: session.client_id, id:request.params.id}}).then(function(user) {

				if (user == null)
					throw new Error(sprintf('User with id %s not found.', request.params.id));

				if (user.password == '' || user.password == request.query.password) {
					// OK
				}
				else {
					if (!passwordHash.verify(request.query.password, user.password))  {
						throw new Error('Invalid password.');
					}
					
				}
				if (attributes.password != '')
					attributes.password = passwordHash.generate(attributes.password);
					
			});
			
		}

		verifyPassword().then(function(){
			Model.User.update(attributes, {returning: true, where: {client_id:session.client_id, id:request.params.id}}).then(function(data) {
				
				if (!data || data.length != 2)
					throw new Error('Invalid results.');
	
				if (data[0] != 1)
					throw new Error('Rental not found.');
					
				server.reply(data[1][0]);
	
				
			}).catch(function(error) {
				server.error(sprintf('Update User with ID %s failed. %s', request.params.id, error.message));
			});
			
		}).catch(function(error) {
			server.error(error);
		});
		
	}).catch(function(error) {
		server.error(error);
	});
	

});


router.delete('/:id', function(request, response) {

	var server = new Server(request, response);
	
	server.authenticate().then(function(session) {

		Model.User.destroy({where: {client_id: session.client_id, id:request.params.id}}).then(function() {
			server.reply(null);

		}).catch(function(error) {
			server.error(error);
		});
		
	}).catch(function(error) {
		server.error(error);
	});
	
});


module.exports = router;

