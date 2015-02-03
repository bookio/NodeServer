var router    = require('express').Router();
var sprintf   = require('../sprintf');
var Server    = require('../server');
var Model     = require('../model');
var sequelize = require('../sequelize');

 
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

function recordsToSchedules(records) {
	var schedules = {};
	
	if (records != undefined) {
		records.forEach(function(item) {
	
			if (schedules[item.tag] == undefined)
				schedules[item.tag] = [];
				
			schedules[item.tag].push({begin_at: item.begin_at, end_at:item.end_at});
		});	
		
	}
	
	return schedules;
}

function scheduleToRecords(schedules, option) {

	var records = [];
	
	if (schedules != undefined) {
		// Convert to database format			
		for (var tag in schedules) {
			var items = schedules[tag];
			
			for (var index in items) {
				var item = items[index];
				records.push({tag:tag, begin_at:item.begin_at, end_at:item.end_at, client_id:option.client_id, option_id:option.id});
			}
		}
	}
	
	return records;
	
}

router.get('/:id', function (request, response) {

	var server = new Server(request, response);
	
	server.authenticate().then(function(session) {

		Model.Option.findOne({where: {client_id: session.client_id, id:request.params.id}, include: [{model:Model.Schedule}]}).then(function(option) {
			if (option == null) {
				server.error(sprintf('Option with id %s not found.', request.params.id));
				return null;
			}
			
			option = option.dataValues;
			
			var schedules = recordsToSchedules(option.schedules)
			

			// Modify the data structure			
			delete option.schedules;
			option.schedules = schedules;
					
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
	
	
		function destroySchedules(schedules, options) {
			if (schedules.length > 0)
				return Model.Schedule.destroy(options);
			else
				return sequelize.Promise.resolve();

		}
		
		function insertSchedules(schedules, options) {


			if (schedules.length > 0)
				return Model.Schedule.bulkCreate(schedules, options);
			else
				return sequelize.Promise.resolve([]);
		}
		
		sequelize.transaction(function(t) {
		
			return Model.Option.update(request.body, {returning: true, where: {client_id:session.client_id, id:request.params.id}, transaction:t}).then(function(data) {


				if (!data || data.length != 2)
					throw new Error('Invalid results.');
	
				if (data[0] != 1)
					throw new Error('Rental not found.');
					
				var option = data[1][0];
				var schedules = scheduleToRecords(request.body.schedules, option);
	
				return destroySchedules(schedules, {where: {client_id:option.client_id, option_id:option.id}, transaction:t}).then(function(){

					return insertSchedules(schedules, {transaction:t}).then(function(schedules){
						
						option.dataValues.schedules = recordsToSchedules(schedules);
						
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

/*

router.put('/:id', function (request, response) {

	var server = new Server(request, response);

	server.authenticate().then(function(session) {
		Model.Option.findOne({where: {client_id: session.client_id, id:request.params.id}}).then(function(option) {
			
			if (option == null)			
				server.error(sprintf('Option with ID %s not found.', request.params.id));
			
			option = request.body;
			
			var result = {};	
			var schedules = [];

			// Convert to database format			
			for (var tag in option.schedules) {
				var items = option.schedules[tag];
				
				for (var index in items) {
					var item = items[index];
					schedules.push({tag:tag, begin_at:item.begin_at, end_at:item.end_at, client_id:session.client_id, option_id:option.id});
				}

			}
			
			option.
			//console.log(schedules);
			console.log(option);
			
			result = option;
			
			Model.Schedule.destroy({where: {client_id:session.client_id + 1000, option_id:option.id}}).then(function(){
	
	
				console.log('destroy done');
				
			}).then(function(){
				console.log('returning result');
				server.reply(result);
				

			}).catch(function(error){
				server.error(error);
				
			});

				

			
		}).catch(function(error) {
			server.error(sprintf('Update Option with ID %s failed. %s', request.params.id, error.message));
		});
						
		
	}).catch(function(error) {
		server.error(error);
	});
	
});
*/

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

