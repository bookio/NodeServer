var router  = require('express').Router();
var sprintf = require('../sprintf');
var Server  = require('../server');
var Model   = require('../model');

/*

	def generate
		begin
			
			index = 0
			count = params[:count].to_i()
			name  = params[:name]
			
			result  = []
			rentals = current_session.user.client.rentals
			
			if rentals.count == 0
				ActiveRecord::Base.transaction do
					while index < count do
					
						rental = rentals.new()
						
						if count <= 1
							rental.name = name
						else
							rental.name = sprintf('%s %d', name, index + 1)
						end
						
						rental.icon_id = 0
						rental.option_ids = []
						rental.save
						
						index += 1
	
						result.push rental
					end
				
				end   	
			end
			
			
			render :json => result
		rescue Exception => exception
			error exception.message, :not_found
		end
	
	end
*/

router.post('/generate/:what/:count', function (request, response) {

	var server = new Server(request, response);
	
	server.authenticate().then(function(session) {

		Model.Rental.count({where: {client_id: session.client_id}}).then(function(count) {
		
			var data = [];
			
			if (count == 0) {
				
				request.params.count = parseInt(request.params.count);
	
				for (var i = 0; i < request.params.count; i++) {
					
					var attributes = {};
					attributes.client_id  = session.client_id;
					attributes.icon_id    = 0;
					attributes.option_ids = [];
					
					if (request.params.count == 1)
						attributes.name = request.params.what;
					else
						attributes.name = sprintf('%s %d', request.params.what, i + 1);

					data.push(attributes);
					
				}
				
			}

			if (data.length > 0) {
				Model.Rental.bulkCreate(data).then(function(result){
					server.reply(result);
					
				}).catch(function(error){
					server.error(error);		
				});
				
			}
			else {
				server.reply([]);
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

		Model.Rental.findAll({where: {client_id: session.client_id}}).then(function(rental) {
		
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
	
	server.authenticate().then(function(session) {
		Model.Rental.findOne({where: {client_id: session.client_id, id:request.params.id}}).then(function(rental) {
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
		
	server.authenticate().then(function(session) {

		var rental = Model.Rental.build(request.body);
		
		// Attach it to my client
		rental.client_id = session.client_id;
		
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

/*
router.put('/:id', function (request, response) {

	var server = new Server(request, response);

	server.authenticate().then(function(session) {
		Model.Rental.findOne({where: {client_id:session.client_id, id:request.params.id}}).then(function(rental) {
			
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

*/

router.put('/:id', function (request, response) {

	var server = new Server(request, response);

	server.authenticate().then(function(session) {
		Model.Rental.update(request.body, {returning: true, where: {client_id:session.client_id, id:request.params.id}}).then(function(data) {
			
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



router.delete('/:id', function(request, response) {

	var server = new Server(request, response);
	
	server.authenticate().then(function(session) {

		Model.Rental.destroy({where: {id:request.params.id}}).then(function(data) {
			server.reply(null);

		}).catch(function(error) {
			server.error(error);
		});
		
	}).catch(function(error) {
		server.error(error);
	});
	
});


module.exports = router;

