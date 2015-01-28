var Sequelize = require('sequelize');
var sequelize = require('../sequelize.js');

module.exports = sequelize.define('groups', {

	'name': {
		type          : Sequelize.STRING,
		defaultValue  : '',
		allowNull     : false
	}
	


}, { 
	updatedAt: 'updated_at', 
	createdAt: 'created_at'
});
