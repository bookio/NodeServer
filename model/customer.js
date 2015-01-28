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
	}

}, { 
	updatedAt: 'updated_at', 
	createdAt: 'created_at'
});
