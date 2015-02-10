var express = require('express');
var router  = express.Router();
var sprintf = require('../sprintf');

var Model    = require('../model');
var Session  = Model.Session;
var Client   = Model.Client;
var Category = Model.Category;

var Server   = require('../server.js');


router.post('/query', function (request, response) {

	var server = new Server(request, response);
		
	server.authenticate().then(function(session) {

		var query = {
			where: Sequelize.and({client_id: session.client_id}, eval(request.body))	
		};

		Model.Category.findAll(query).then(function(result) {
		
			server.reply(result);
		
		}).catch(function(error) {
			server.error(error);
			
		});
		
	}).catch(function(error) {
		server.error(error);
	});	

});


router.get('/active', function (request, response) {

	var server = new Server(request, response);
		
	server.authenticate().then(function(session) {
	
		var query = {
			where: {client_id: session.client_id},
			include: [{
				model: Model.Rental,
				where: {category_id: {ne:null}, available: {ne:0}},
				required: true,
				attributes: []
			}]
		};

		Category.findAll(query).then(function(data) {

			server.reply(data);


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
	

		Category.findAll({where: {client_id: session.client_id}}).then(function(data) {
			server.reply(data);


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

		Category.destroy({where: {client_id: session.client_id, id:request.params.id}}).then(function() {
			server.reply(null);

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

		Category.findOne({where: {client_id: session.client_id, id:request.params.id}}).then(function(category) {

			if (category != null) {
				server.reply(category);
			}
			else {
				server.error(sprintf('Category with ID %s not found.', request.params.id));
			}
				
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

		var category = Model.Category.build(request.body);
		
		category.client_id = session.client_id;
		
		category.save().then(function(data) {
		
			server.reply(data);
		
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
		Category.findOne({where: {client_id: session.client_id, id:request.params.id}}).then(function(category) {
			
			if (category != null) {
				category.update(request.body).then(function(category) {
				
					server.reply(category);
				
				}).catch(function(error) {
					server.error(error);
				});
			}
			else {
				server.error(sprintf('Category with ID %s not found.', request.params.id));
			}
			
		}).catch(function(error) {
			server.error(error);
		});
		
	}).catch(function(error) {
		server.error(error);
	});
	

});




module.exports = router;

