var Sequelize = require('sequelize');
var sequelize = require('../sequelize.js');

module.exports = sequelize.define('icons', {

	'tag': {
		type          : Sequelize.STRING,
		defaultValue  : '',
		allowNull     : false
	},

	'image': {
		type          : Sequelize.STRING,
		defaultValue  : '',
		allowNull     : false
	}

}, { 
	updatedAt: 'updated_at', 
	createdAt: 'created_at'
});
