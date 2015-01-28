var Sequelize = require('sequelize');
var sequelize = require('../sequelize.js');

module.exports = sequelize.define('options', {

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

	'selection': {
		type          : Sequelize.INTEGER,
		defaultValue  : 0,
		allowNull     : false
	},

	'units': {
		type          : Sequelize.INTEGER,
		defaultValue  : 1,
		allowNull     : false
	},

	'unit': {
		type          : Sequelize.STRING,
		defaultValue  : '',
		allowNull     : false
	}

}, { 
	updatedAt: 'updated_at', 
	createdAt: 'created_at'
});
