var router  = require('express').Router();
var sprintf = require('../sprintf');
var Server  = require('../server');
var Model   = require('../model');

 
router.get('/', function (request, response) {

	var server = new Server(request, response);
	
	server.authenticate().then(function(currentuser) {
		Model.Setting.findAll({where: {client_id: currentuser.client_id}}).then(function(data) {
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
	
	server.authenticate().then(function(currentuser) {
		Model.Setting.findOne({where: {client_id: currentuser.client_id, id:request.params.id}}).then(function(setting) {
			if (setting == null) {
				server.error(sprintf('Setting with id %s not found.', request.params.id));
				return null;
			}
			
			server.reply(setting);

		}).catch(function(error) {
			server.error(error);
		});
		
	}).catch(function(error) {
		server.error(error);
	});
	
});


module.exports = router;

