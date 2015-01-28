var express = require('express');
var router  = express.Router();
var sprintf = require('../sprintf');


var Customer = require('../model/customer.js');

var Server = require('../server.js');



router.get('/', function (request, response) {

	var server = new Server(request, response);
		
	server.authenticate().then(function(currentUser) {
		if (currentUser != null) {

			Customer.findAll({where: {client_id: currentUser.client_id}}).then(function(data) {
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

			Customer.destroy({where: {client_id: currentuser.client_id, id:request.params.id}}).then(function() {
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

			Customer.findOne({where: {client_id: currentUser.client_id, id:request.params.id}}).then(function(customer) {

				if (customer != null) {
					server.reply(customer);
				}
				else {
					server.error(sprintf('Customer with ID %s not found.', request.params.id));
				}
			});
			
		}
		
	}).catch(function(error) {
		server.error(error);
	});


});



router.post('/', function (request, response) {

	var server = new Server(request, response);
		
	server.authenticate().then(function(currentUser) {
		if (currentUser != null) {
			var customer = Customer.build(request.body);
			
			customer.client_id = currentUser.client_id;
			
			customer.save().then(function(data) {
			
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
			Customer.findOne({where: {client_id: currentUser.client_id, id:request.params.id}}).then(function(customer) {
				
				if (customer != null) {
					customer.update(request.body).then(function(customer) {
					
						server.reply(customer);
					
					}).catch(function(error) {
						server.error(error);
					});
				}
				else {
					server.error(sprintf('Customer with ID %s not found.', request.params.id));
				}
				
			});

		}
		
	}).catch(function(error) {
		server.error(error);
	});
	

});





module.exports = router;

