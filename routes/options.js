var router    = require('express').Router();
var sprintf   = require('../sprintf');
var Server    = require('../server');
var Model     = require('../model');
var sequelize = require('../sequelize');

 
router.get('/category/:id', function (request, response) {

	var server = new Server(request, response);
	
	server.authenticate().then(function(session) {

		var sql = sprintf('"options"."id" IN (SELECT DISTINCT UNNEST(option_ids) FROM rentals WHERE category_id = %d)', parseInt(request.params.id));

		var query = {
			where:
				sequelize.and({client_id: session.client_id}, sql)
		};
		
		Model.Option.findAll(query).then(function(data) {
			server.reply(data);


		}).catch(function(error) {
			server.error(error);
		});
		
	}).catch(function(error) {
		server.error(error);
	});
	
});
 
 
router.get('/rental/:id', function (request, response) {

	var server = new Server(request, response);
	
	server.authenticate().then(function(session) {

		//  select * from "options" where id = ANY(ARRAY[(select option_ids from rentals where id=186)])

		var sql = sprintf('"options"."id" = ANY(ARRAY[(select option_ids from rentals where id=%d)])', parseInt(request.params.id));

		var query = {
			where:
				sequelize.and({client_id: session.client_id}, sql)
		};
		
		Model.Option.findAll(query).then(function(data) {
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
		Model.Option.findAll({where: {client_id: session.client_id}, include: [{model:Model.Schedule, attributes:['tag','slots']}]}).then(function(data) {
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

		Model.Option.findOne({where: {client_id: session.client_id, id:request.params.id}, include: [{model:Model.Schedule, attributes:['tag','slots']}]}).then(function(option) {
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

		var attributes = request.body;
		attributes.client_id = session.client_id;

		sequelize.transaction(function(tx) {

			return Model.Option.create(attributes).then(function(option) {

					
				attributes.schedules = attributes.schedules == undefined ? [] : attributes.schedules;

				attributes.schedules.forEach(function(item) {
					item.option_id = option.id;
					item.client_id = option.client_id;
					
					item.slots.sort(function(a, b) {
						return b - a;
					});
				});

				return Model.Schedule.bulkCreate(attributes.schedules, {transaction:tx}).then(function(schedules){
					
					schedules.forEach(function(item) {
						delete item.dataValues.option_id;
						delete item.dataValues.client_id;
						delete item.dataValues.id;
						delete item.dataValues.created_at;
						delete item.dataValues.updated_at;
					});

					option.dataValues.schedules = schedules;
					
					return option;							
					
				});
			});		

		}).then(function(result){
			server.reply(result);
			
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
		
		sequelize.transaction(function(t) {
		
			return Model.Option.update(request.body, {returning: true, where: {client_id:session.client_id, id:request.params.id}, transaction:t}).then(function(data) {


				if (!data || data.length != 2)
					throw new Error('Invalid results.');
	
				if (data[0] != 1)
					throw new Error('Rental not found.');
					
				var option = data[1][0];
				var schedules = request.body.schedules == undefined ? [] : request.body.schedules;
	
				schedules.forEach(function(item) {
					item.option_id = option.id;
					item.client_id = option.client_id;
				});
				
				return Model.Schedule.destroy({where: {client_id:option.client_id, option_id:option.id}, transaction:t}).then(function(){

					return Model.Schedule.bulkCreate(schedules, {transaction:t}).then(function(schedules){
						
						schedules.forEach(function(item) {
							delete item.dataValues.option_id;
							delete item.dataValues.client_id;
							delete item.dataValues.id;
							delete item.dataValues.created_at;
							delete item.dataValues.updated_at;
						});

						option.dataValues.schedules = schedules;

						
						return option;							
						
					});
				
				});
			});

		}).then(function(result){
			server.reply(result);
			
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

		Model.Option.destroy({where: {client_id:session.client_id, id:request.params.id}, individualHooks: true}).then(function(data) {
			server.reply(null);

		}).catch(function(error) {
			server.error(error);
		});
		
	}).catch(function(error) {
		server.error(error);
	});
	
});


module.exports = router;

