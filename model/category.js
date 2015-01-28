var Sequelize = require('sequelize');
var sequelize = require('../sequelize.js');

module.exports = sequelize.define('categories', {
	'name': {
		type          : Sequelize.STRING,
		defaultValue  : '',
		allowNull     : false
	},
	
	'description': {
		type          : Sequelize.TEXT,
		defaultValue  : '',
		allowNull     : false
	},
	
	'image': {
		type          : Sequelize.TEXT,
		defaultValue  : '',
		allowNull     : false
	},
	
	'available': {
		type          : Sequelize.INTEGER,
		defaultValue  : 1,
		allowNull     : false
	},
	
	'automatic': {
		type          : Sequelize.INTEGER,
		defaultValue  : 1,
		allowNull     : false
	}
}, { 
	updatedAt: 'updated_at', 
	createdAt: 'created_at'
});



