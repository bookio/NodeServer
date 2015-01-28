var Sequelize = require('sequelize');
var sequelize = require('../sequelize.js');

module.exports = sequelize.define('schedules', {

	'entity': {
		type          : Sequelize.STRING,
		defaultValue  : '',
		allowNull     : false
	},
	'entity_id': {
		type          : Sequelize.INTEGER,
		allowNull     : false
	},
	'tag': {
		type          : Sequelize.STRING,
		defaultValue  : '',
		allowNull     : false
	},

	'begin_at': {
		type          : Sequelize.DATE,
		allowNull     : false
	},

	'end_at': {
		type          : Sequelize.DATE,
		allowNull     : false
	}


}, { 
	updatedAt: 'updated_at', 
	createdAt: 'created_at'
});