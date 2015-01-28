var express = require('express');
var router  = express.Router();
var sprintf = require('../sprintf');
var Sequelize = require('sequelize');

var Model = require('../model');
var Server = require('../server');


router.get('/search/:text', function (request, response) {

	var server = new Server(request, response);
		
	server.authenticate().then(function(currentuser) {

		var text = request.params.text;
	
		var query = {
			where: Sequelize.and(
				{ client_id: currentuser.client_id },
				Sequelize.or(
					{ name:  {ilike: '%' + text + '%'} },
					{ email:  {ilike: '%' + text + '%'} }
				)
			)
		};

		
		Model.Customer.findAll(query).then(function(customers) {
			server.reply(customers);

		}).catch(function(error) {
			server.error(error);
		});
			
		
	}).catch(function(error) {
		server.error(error);
	});
	
});



router.get('/', function (request, response) {

	var server = new Server(request, response);
		
	server.authenticate().then(function(currentuser) {

		Model.Customer.findAll({where: {client_id: currentuser.client_id}}).then(function(customers) {
			server.reply(customers);
			
		}).catch(function(error) {
			server.error(error);
		});
		
		
	}).catch(function(error) {
		server.error(error);
	});
	
});



router.delete('/:id', function(request, response) {

	var server = new Server(request, response);
	
	server.authenticate().then(function(currentuser) {

		Model.Customer.destroy({where: {client_id: currentuser.client_id, id:request.params.id}}).then(function() {
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
		
	server.authenticate().then(function(currentuser) {

		Model.Customer.findOne({where: {client_id: currentuser.client_id, id:request.params.id}}).then(function(customer) {

			if (customer == null)
				throw new Error(sprintf('Customer with ID %s not found.', request.params.id));

			server.reply(customer);
			
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
		var customer = Model.Customer.build(request.body);
		
		customer.client_id = currentuser.client_id;
		
		customer.save().then(function(customer) {
		
			server.reply(customer);
		
		}).catch(function(error){
			server.error(error);
			
		});

		
	}).catch(function(error) {
		server.error(error);
	});
	

});


router.put('/:id', function (request, response) {


	var server = new Server(request, response);
		
	server.authenticate().then(function(currentuser) {

		Model.Customer.findOne({where: {client_id: currentuser.client_id, id:request.params.id}}).then(function(customer) {
			
			if (customer == null)
				throw new Error(sprintf('Customer with ID %s not found.', request.params.id));
				
			customer.update(request.body).then(function(customer) {
			
				server.reply(customer);
			
			}).catch(function(error) {
				server.error(error);
			});
			
		}).catch(function(error) {
			server.error(error);
		});

	
	}).catch(function(error) {
		server.error(error);
	});
	

});





module.exports = router;

