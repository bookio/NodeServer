var express = require('express');
var router  = express.Router();
var sprintf = require('../sprintf');

var Model    = require('../model');
var Session  = Model.Session;
var Client   = Model.Client;
var Category = Model.Category;

var Server   = require('../server.js');



router.get('/', function (request, response) {

	var server = new Server(request, response);
		
	server.authenticate().then(function(currentUser) {
		if (currentUser != null) {

			Category.findAll({where: {client_id: currentUser.client_id}}).then(function(data) {
				server.reply(data);
			});
			
		}
		
	}).catch(function(error) {
		server.error(error);
	});
	
});



router.delete('/:id', function(request, response) {

	var server = new Server(request, response);
	
	server.authenticate().then(function(currentuser) {

		if (currentuser != null) {

			Category.destroy({where: {client_id: currentuser.client_id, id:request.params.id}}).then(function() {
				server.reply(null);
			});
			
		}
		
	}).catch(function(error) {
		server.error(error);
	});
	
});



router.get('/:id', function (request, response) {

	var server = new Server(request, response);
		
	server.authenticate().then(function(currentUser) {

		if (currentUser != null) {

			Category.findOne({where: {client_id: currentUser.client_id, id:request.params.id}}).then(function(category) {

				if (category != null) {
					server.reply(category);
				}
				else {
					server.error(sprintf('Category with ID %s not found.', request.params.id));
				}
			});
			
		}
		else
			console.log('asdgfsdgdfg');
		
	}).catch(function(error) {
		server.error(error);
	});


});



router.post('/', function (request, response) {

	var server = new Server(request, response);
		
	server.authenticate().then(function(currentUser) {
		if (currentUser != null) {
			var category = User.build(request.body);
			
			category.client_id = currentUser.client_id;
			
			category.save().then(function(data) {
			
				server.reply(data);
			
			}).catch(function(error){
				server.error(error);
				
			});

		}
		
	}).catch(function(error) {
		server.error(error);
	});
	

});


router.put('/:id', function (request, response) {


	var server = new Server(request, response);
		
	server.authenticate().then(function(currentUser) {
		if (currentUser != null) {
			Category.findOne({where: {client_id: currentUser.client_id, id:request.params.id}}).then(function(category) {
				
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
				
			});

		}
		
	}).catch(function(error) {
		server.error(error);
	});
	

});





module.exports = router;

