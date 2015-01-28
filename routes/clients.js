var router  = require('express').Router();
var sprintf = require('../sprintf');
var Server  = require('../server');
var Model   = require('../model');

 
router.get('/', function (request, response) {

	var server = new Server(request, response);
	
	server.authenticate().then(function(currentuser) {

		Model.Client.findAll({where: {id: currentuser.client_id}}).then(function(clients) {
			server.reply(clients);

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
		Model.Client.findOne({where: {id: currentuser.client_id, id:request.params.id}}).then(function(client) {
			if (client == null)
				throw new Error(sprintf('Client with id %s not found.', request.params.id));

			server.reply(client);
		
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
		Model.Client.update(request.body, {returning: true, where: {id:currentuser.client_id, id:request.params.id}}).then(function(data) {
			
			if (!data || data.length != 2)
				throw new Error('Invalid results.');

			if (data[0] != 1)
				throw new Error('Client not found.');
				
			server.reply(data[1][0]);

			
		}).catch(function(error) {
			server.error(sprintf('Update Client with ID %s failed. %s', request.params.id, error.message));
		});
						
		
	}).catch(function(error) {
		server.error(error);
	});
	
});


router.delete('/:id', function(request, response) {

	var server = new Server(request, response);
	
	server.authenticate().then(function(currentuser) {

		Model.Client.destroy({where: {id:request.params.id}}).then(function() {
			server.reply(null);

		}).catch(function(error) {
			server.error(error);
		});
		
	}).catch(function(error) {
		server.error(error);
	});
	
});


module.exports = router;

