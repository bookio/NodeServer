var router  = require('express').Router();
var sprintf = require('../sprintf');
var Server  = require('../server');
var Model   = require('../model');

 
router.get('/', function (request, response) {

	var server = new Server(request, response);
	
	server.authenticate().then(function(session) {
		Model.Setting.findAll({where: {client_id: session.client_id}}).then(function(data) {
			server.reply(data);
		
		}).catch(function(error) {
			server.error(error);
		});
		
	}).catch(function(error) {
		server.error(error);
	});
	
});


router.get('/:section', function (request, response) {

	var server = new Server(request, response);

	server.authenticate().then(function(session) {
		Model.Setting.findAll({where: {client_id: session.client_id, section:request.params.section}}).then(function(settings) {
			
			var names = {};
			
			for (var index in settings) {
				var setting = settings[index];
				
				names[setting.name] = setting.value;
			}
			
			server.reply(names);
		
		}).catch(function(error) {
			server.error(error);
		});
		
	}).catch(function(error) {
		server.error(error);
	});
	
});

router.get('/:section/:name', function (request, response) {

	var server = new Server(request, response);

	server.authenticate().then(function(session) {
		Model.Setting.findOne({where: {client_id: session.client_id, section:request.params.section,  name:request.params.name }}).then(function(setting) {
			server.reply(setting == {} ? {} : setting.value);
		
		}).catch(function(error) {
			server.error(error);
		});
		
	}).catch(function(error) {
		server.error(error);
	});
	
});

router.put('/:section/:name', function (request, response) {

	var server = new Server(request, response);
	var extend = require('extend');
	
	server.authenticate().then(function(session) {
		Model.Setting.findOne({where: {client_id: session.client_id, section:request.params.section, name:request.params.name }}).then(function(setting) {
			
			if (setting != null) {

				var value = {};
				extend(true, value, setting.value);
				extend(true, value, request.body);
				
				setting.value = value;
				
				setting.save({value:value}).then(function(setting){

					server.reply(setting.value);
					
				}).catch(function(error){
					server.error(error);
					
				});
			}
			else {
				Model.Setting.create({client_id:session.client_id, name:request.params.name, section:request.params.section, value:request.body}).then(function(setting){
					server.reply(setting.value);
					
				}).catch(function(error){
					server.error(error);
					
				});
			}
		
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
		Model.Setting.findOne({where: {client_id: session.client_id, id:request.params.id}}).then(function(setting) {
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

