var router  = require('express').Router();
var sprintf = require('../sprintf');
var Server  = require('../server');
var Model   = require('../model');

 
router.get('/', function (request, response) {

	var server = new Server(request, response);
	
	server.authenticate().then(function(session) {

		Model.Reservation.findAll({where: {client_id: session.client_id}}).then(function(reservation) {
			server.reply(reservation);

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
		Model.Reservation.findOne({where: {client_id: session.client_id, id:request.params.id}}).then(function(reservation) {
			if (reservation == null)
				throw new Error(sprintf('Reservation with id %s not found.', request.params.id));

			server.reply(reservation);
		
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


		console.log('New reservation', request.body);
		
		var reservation = Model.Reservation.build(request.body);
		
		// Attach it to my client
		reservation.client_id = session.client_id;
		
		// Save it
		reservation.save().then(function(reservation) {
		
			server.reply(reservation);
		
		}).catch(function(error) {
			server.error(error);
			
		});
		
	}).catch(function(error) {
		server.error(error);
	});	

});

router.put('/:id', function (request, response) {

	var server = new Server(request, response);

	server.authenticate().then(function(session) {
		Model.Reservation.update(request.body, {returning: true, where: {client_id:session.client_id, id:request.params.id}}).then(function(data) {
			
			if (!data || data.length != 2)
				throw new Error('Invalid results.');

			if (data[0] != 1)
				throw new Error('Rental not found.');
				
			server.reply(data[1][0]);

			
		}).catch(function(error) {
			server.error(sprintf('Update Reservation with ID %s failed. %s', request.params.id, error.message));
		});
						
		
	}).catch(function(error) {
		server.error(error);
	});
	
});


router.delete('/:id', function(request, response) {

	var server = new Server(request, response);
	
	server.authenticate().then(function(session) {

		Model.Reservation.destroy({where: {id:request.params.id}}).then(function(data) {
			server.reply(null);

		}).catch(function(error) {
			server.error(error);
		});
		
	}).catch(function(error) {
		server.error(error);
	});
	
});


module.exports = router;

