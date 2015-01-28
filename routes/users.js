var router  = require('express').Router();
var sprintf = require('../sprintf');
var Server  = require('../server');
var Model   = require('../model');
var uuid    = require('node-uuid');
/*
			session = current_session
			
			user = session.user.client.users.find_by_guest(true)
			
			if user == nil 
				user = session.user.client.users.new
				user.username = SecureRandom.uuid()
				user.password = ""
				user.guest = true
				user.save!
			end
			
			render :json => user
		rescue Exception => exception
			error exception.message, :not_found
		end
*/

router.get('/guest', function (request, response) {

	var server = new Server(request, response);
	
	server.authenticate().then(function(currentuser) {

		Model.User.findOne({where: {client_id: currentuser.client_id, guest:1}}).then(function(user) {
		
			if (user == null) {
				var attributes = {};
				attributes.username = uuid.v1();
				attributes.guest = 1;
				attributes.client_id = currentuser.client_id;
				
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
	
	server.authenticate().then(function(currentuser) {

		Model.User.findAll({where: {client_id: currentuser.client_id}}).then(function(user) {
		
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
	
	server.authenticate().then(function(currentuser) {
		Model.User.findOne({where: {client_id: currentuser.client_id, id:request.params.id}}).then(function(user) {
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
		
	server.authenticate().then(function(currentuser) {

		var user = Model.User.build(request.body);
		
		// Attach it to my client
		user.client_id = currentuser.client_id;
		
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

	server.authenticate().then(function(currentuser) {
		Model.User.update(request.body, {returning: true, where: {client_id:currentuser.client_id, id:request.params.id}}).then(function(data) {
			
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
	

});


router.delete('/:id', function(request, response) {

	var server = new Server(request, response);
	
	server.authenticate().then(function(currentuser) {

		Model.User.destroy({where: {client_id: currentuser.client_id, id:request.params.id}}).then(function() {
			server.reply(null);

		}).catch(function(error) {
			server.error(error);
		});
		
	}).catch(function(error) {
		server.error(error);
	});
	
});


module.exports = router;

