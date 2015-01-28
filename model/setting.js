var Sequelize = require('sequelize');
var sequelize = require('../sequelize.js');

module.exports = sequelize.define('settings', {

	'section': {
		type          : Sequelize.STRING,
		defaultValue  : '',
		allowNull     : false
	},
	'name': {
		type          : Sequelize.TEXT,
		defaultValue  : '',
		allowNull     : false
	},
	'value': {
		type          : Sequelize.BLOB,
		defaultValue  : null,
		allowNull     : true
	}
}, { 
	updatedAt: 'updated_at', 
	createdAt: 'created_at'
});
