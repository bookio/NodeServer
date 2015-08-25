var Sequelize = require('sequelize');
var sequelize = require('../sequelize.js');

module.exports = sequelize.define('customers', {

	'name': {
		type          : Sequelize.STRING,
		defaultValue  : '',
		allowNull     : false
	},

	'phone': {
		type          : Sequelize.STRING,
		defaultValue  : '',
		allowNull     : false
	},

	'email': {
		type          : Sequelize.STRING,
		defaultValue  : '',
		allowNull     : false
	},

	'notes': {
		type          : Sequelize.TEXT,
		defaultValue  : '',
		allowNull     : false
	},

	'location': {
		type          : Sequelize.TEXT,
		defaultValue  : '',
		allowNull     : false
	},
	
	'twitter': {
		type          : Sequelize.STRING,
		defaultValue  : '',
		allowNull     : false
	}
	

}, { 
	updatedAt: 'updated_at', 
	createdAt: 'created_at'
});
