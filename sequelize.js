var Sequelize = require('sequelize');

//var url = 'postgres://kvfqksuntzehlc:dwO7w6TE7naBA56bMf55dgNTPV@ec2-54-204-47-70.compute-1.amazonaws.com:5432/d3uoq4q0g7rpeb?ssl=true&sslmode=require';


var sequelize = new Sequelize('dakh54pfbr5h44', 'tngvlsuocnzuzw', 'mShWT2fKPbmoXsG7cDE0PH21Jl', {
	host: 'ec2-50-16-190-77.compute-1.amazonaws.com',
	dialect: 'postgres',
	port:5432,
	protocol: 'postgres',
	timezone: 'UTC',
	ssl: true,
	native: true
});



module.exports = sequelize;
