var Sequelize = require('sequelize');
var sequelize = require('../sequelize.js');

module.exports = sequelize.define('clients', {
	'name': {
		type          : Sequelize.STRING,
		defaultValue  : '',
		allowNull     : false
	},
	
	'logo': {
		type          : Sequelize.TEXT,
		defaultValue  : '',
		allowNull     : false
	},
	
	'email': {
		type          : Sequelize.STRING,
		defaultValue  : '',
		allowNull     : false
	},
	
	'twitter': {
		type          : Sequelize.STRING,
		defaultValue  : '',
		allowNull     : false
	},
	
	'facebook': {
		type          : Sequelize.STRING,
		defaultValue  : '',
		allowNull     : false
	},
	
	'address': {
		type          : Sequelize.STRING,
		defaultValue  : '',
		allowNull     : false
	},
	
	'phone': {
		type          : Sequelize.STRING,
		defaultValue  : '',
		allowNull     : false
	},
	
	'www': {
		type          : Sequelize.STRING,
		defaultValue  : '',
		allowNull     : false
	}
}, { 
	updatedAt: 'updated_at', 
	createdAt: 'created_at'
});



