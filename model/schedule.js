var Sequelize = require('sequelize');
var sequelize = require('../sequelize.js');

module.exports = sequelize.define('schedules', {

	'tag': {
		type          : Sequelize.STRING,
		defaultValue  : '',
		allowNull     : false
	},
	
	'slots': {
		type          : Sequelize.ARRAY(Sequelize.INTEGER),
		defaultValue  : [],
		allowNull     : true
	}

}, { 
	updatedAt: 'updated_at', 
	createdAt: 'created_at'
});
