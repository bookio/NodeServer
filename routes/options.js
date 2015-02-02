var router  = require('express').Router();
var sprintf = require('../sprintf');
var Server  = require('../server');
var Model   = require('../model');

 
router.get('/', function (request, response) {

	var server = new Server(request, response);
	
	server.authenticate().then(function(session) {
		Model.Option.findAll({where: {client_id: session.client_id}}).then(function(data) {
			server.reply(data);


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

		Model.Option.findOne({where: {client_id: session.client_id, id:request.params.id}, include: [{model:Model.Schedule}]}).then(function(option) {
			if (option == null) {
				server.error(sprintf('Option with id %s not found.', request.params.id));
				return null;
			}
			
			server.reply(option);

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

		var option = Model.Option.build(request.body);
		
		option.client_id = session.client_id;
		
		option.save().then(function(option) {
		
			server.reply(option);
		
		}).catch(function(error){
			server.error(error);
			
		});
		
	}).catch(function(error) {
		server.error(error);
	});
	

});

router.put('/:id', function (request, response) {

	var server = new Server(request, response);

	server.authenticate().then(function(session) {
		Model.Option.update(request.body, {returning: true, where: {client_id:session.client_id, id:request.params.id}, include: [{model:Model.Schedule}]}).then(function(data) {
			
			if (!data || data.length != 2)
				throw new Error('Invalid results.');

			if (data[0] != 1)
				throw new Error('Option not found.');
				
			server.reply(data[1][0]);

			
		}).catch(function(error) {
			server.error(sprintf('Update Option with ID %s failed. %s', request.params.id, error.message));
		});
						
		
	}).catch(function(error) {
		server.error(error);
	});
	
});

router.delete('/:id', function(request, response) {

	var server = new Server(request, response);
	
	server.authenticate().then(function(session) {

		Model.Option.destroy({where: {client_id:session.client_id, id:request.params.id}}).then(function(data) {
			server.reply(null);

		}).catch(function(error) {
			server.error(error);
		});
		
	}).catch(function(error) {
		server.error(error);
	});
	
});


module.exports = router;

