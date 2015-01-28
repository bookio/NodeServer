var router  = require('express').Router();
var sprintf = require('../sprintf');
var Server  = require('../server');
var Model   = require('../model');

 
router.get('/', function (request, response) {

	var server = new Server(request, response);
	
	Model.Session.findAll().then(function(rental) {
	
		server.reply(rental);
		
	}).catch(function(error) {
		server.error(error);
	});
	
});

router.get('/:id', function (request, response) {

	var server = new Server(request, response);
	
	Model.Session.findOne({where: {id:request.params.id}}).then(function(session) {
		if (session == null)
			throw new Error(sprintf('Session with id %s not found.', request.params.id));
		
		server.reply(session);
		
	}).catch(function(error) {
		server.error(error);
	});
	
});



router.post('/', function (request, response) {

	var UUID = require('node-uuid');
	var server = new Server(request, response);
		
	var session = Model.Session.build(request.body);
	
	session.sid = UUID.v1();
	
	// Save it
	session.save().then(function(session) {
	
		server.reply(session);
	
	}).catch(function(error) {
		server.error(error);
		
	});
});


router.delete('/:id', function(request, response) {

	var server = new Server(request, response);
	
	Model.Session.destroy({where: {id:request.params.id}}).then(function() {
		server.reply(null);

	}).catch(function(error) {
		server.error(error);
		
	});
	
	
});


module.exports = router;

