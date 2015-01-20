var express = require('express');
var app = express();
var url = 'postgres://kvfqksuntzehlc:dwO7w6TE7naBA56bMf55dgNTPV@ec2-54-204-47-70.compute-1.amazonaws.com:5432/d3uoq4q0g7rpeb?ssl=true';
var pg = require('pg');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));



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
	
	console.log('Connecting...');
	
	pg.connect(url, function(err, client, done) {
		if (err) {
			console.error(err);
		}
		else {
			
			client.query('SELECT * FROM rentals where client_id=1 and id=' + request.params.id, function(err, result) {
				done();

				if (err) { 
					console.error(err); response.send("Error " + err); 
				}
				else {
					response.send(JSON.stringify(result.rows));
				}
			});
			
		}
	});
});

app.get('/', function(request, response) {
	console.log('ConnectingX...');
	
	pg.connect(url, function(err, client, done) {
		client.query('SELECT * FROM clients', function(err, result) {
			done();
			if (err) { 
				console.error(err); response.send("Error " + err); 
			}
			else {
				response.send(result.rows);
			}
		});
	});

});

app.listen(app.get('port'), function() {
	console.log("Node app is running at localhost:" + app.get('port'));
});

