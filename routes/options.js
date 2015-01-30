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

		Model.Option.findOne({where: {client_id: session.client_id, id:request.params.id}}).then(function(option) {
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


module.exports = router;

