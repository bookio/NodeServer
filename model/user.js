var Sequelize = require('sequelize');
var sequelize = require('../sequelize');

module.exports = sequelize.define('users', {


	'name': {
		type          : Sequelize.STRING,
		defaultValue  : '',
		allowNull     : false
	},
	
	'email': {
		type          : Sequelize.STRING,
		defaultValue  : '',
		allowNull     : false
	},
	
	'username': {
		type          : Sequelize.STRING,
		defaultValue  : '',
		allowNull     : false
	},

	'password': {
		type          : Sequelize.STRING,
		defaultValue  : '',
		allowNull     : false
	},
	
	
	'guest': {
		type          : Sequelize.INTEGER,
		defaultValue  : 0,
		allowNull     : false
	}
}, {
	updatedAt: 'updated_at', 
	createdAt: 'created_at'
});


