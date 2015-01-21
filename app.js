var express = require('express');
var app = express();
var url = 'postgres://kvfqksuntzehlc:dwO7w6TE7naBA56bMf55dgNTPV@ec2-54-204-47-70.compute-1.amazonaws.com:5432/d3uoq4q0g7rpeb?ssl=true';
var pg = require('pg');
var sprintf = require('./sprintf.js');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));


function Rental() {

	var self = this;

	self.
	self.id = 0;
	
	self.save = function() {
		
	}		
}



function getClientID(client, request) {
	

	client.query('SELECT client_id FROM users WHERE id=(SELECT user_id FROM sessions WHERE sid=$1)', [request.headers.authorization], function(error, result) {


		if (error)
			throw error; 
			
		console.log(result.rows);
			
	});

}
app.get('/db', function (request, response) {
	
	console.log('Connecting...');
	
	pg.connect(url, function(err, client, done) {
		if (err) {
			console.error(err);
		}
		else {
			
			client.query('SELECT * FROM clients', function(err, result) {
				done();

				if (err) { 
					console.error(err); response.send("Error " + err); 
				}
				else {
					response.send(result.rows);
				}
			});
			
		}
	});
});


app.get('/rentals/:id', function (request, response) {
	
	console.log('Request:', request.headers.authorization);
//	console.log('Response:', response);
	
	try {
		pg.connect(url, function(error, client, done) {
			if (error)
				throw error;
			
			getClientID(client, request);

			client.query('SELECT * FROM rentals WHERE client_id=$1 AND id=$2', [request.params.id, 1], function(error, result) {
				done();

				if (error)
					throw error; 
					
				response.send(JSON.stringify(result.rows, null, 4));
			});
				
		});
		
	}
	catch (error) {
		console.error(error);
		
	}
	
});



app.listen(app.get('port'), function() {
	console.log("Node app is running at localhost:" + app.get('port'));
});

