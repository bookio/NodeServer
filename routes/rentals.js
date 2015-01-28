var router  = require('express').Router();
var sprintf = require('../sprintf');
var Server  = require('../server');
var Model   = require('../model');

 
router.get('/', function (request, response) {

	var server = new Server(request, response);
	
	server.authenticate().then(function(currentuser) {

		Model.Rental.findAll({where: {client_id: currentuser.client_id}}).then(function(rental) {
		
			server.reply(rental);
			
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
		Model.Rental.findOne({where: {client_id: currentuser.client_id, id:request.params.id}}).then(function(rental) {
			if (rental == null)
				throw new Error(sprintf('Rental with id %s not found.', request.params.id));
			
			server.reply(rental);
			
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

		var rental = Model.Rental.build(request.body);
		
		// Attach it to my client
		rental.client_id = currentuser.client_id;
		
		// Save it
		rental.save().then(function(rental) {
		
			server.reply(rental);
		
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
		Model.Rental.findOne({where: {client_id:currentuser.client_id, id:request.params.id}}).then(function(rental) {
			
			rental.update(request.body).then(function(rental) {
				server.reply(rental);				
			}).catch(function(error){
				server.error(error);
				
			});
				
			
		}).catch(function(error) {
			server.error(sprintf('Update Rental with ID %s failed. %s', request.params.id, error.message));
		});
						
		
	}).catch(function(error) {
		server.error(error);
	});
	

});
/*
router.put('/:id', function (request, response) {

	var server = new Server(request, response);

	server.authenticate().then(function(currentuser) {
		Model.Rental.update(request.body, {returning: true, where: {client_id:currentuser.client_id, id:request.params.id}}).then(function(data) {
			
			if (!data || data.length != 2)
				throw new Error('Invalid results.');

			if (data[0] != 1)
				throw new Error('Rental not found.');
				
			server.reply(data[1][0]);

			
		}).catch(function(error) {
			server.error(sprintf('Update Rental with ID %s failed. %s', request.params.id, error.message));
		});
						
		
	}).catch(function(error) {
		server.error(error);
	});
	

});
*/

module.exports = router;

