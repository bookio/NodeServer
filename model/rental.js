var Sequelize = require('sequelize');
var sequelize = require('../sequelize.js');

module.exports = sequelize.define('rentals', {

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
	'location': {
		type          : Sequelize.STRING,
		defaultValue  : '',
		allowNull     : false
	},
	'depth': {
		type          : Sequelize.INTEGER,
		defaultValue  : 1,
		allowNull     : false
	},
	'seats': {
		type          : Sequelize.INTEGER,
		defaultValue  : 1,
		allowNull     : false
	},
	'available': {
		type          : Sequelize.INTEGER,
		defaultValue  : 1,
		allowNull     : false
	},
	'style': {
		type          : Sequelize.STRING,
		defaultValue  : '',
		allowNull     : false
	},
	'latitude': {
		type          : Sequelize.FLOAT,
		defaultValue  : 0,
		allowNull     : true
	},
	'longitude': {
		type          : Sequelize.FLOAT,
		defaultValue  : 0,
		allowNull     : true
	},	
	'option_ids': {
		type          : Sequelize.ARRAY(Sequelize.INTEGER),
		defaultValue  : [],
		allowNull     : true
	},
	'data': {
		type          : Sequelize.JSON,
		defaultValue  : {},
		allowNull     : false
	},
	'image': {
		type          : Sequelize.TEXT,
		defaultValue  : '',
		allowNull     : false
	}
	
	
	
}, { 
	updatedAt: 'updated_at', 
	createdAt: 'created_at'
});
