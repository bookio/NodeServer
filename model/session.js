var Sequelize = require('sequelize');
var sequelize = require('../sequelize.js');

module.exports = sequelize.define('sessions', {
	

	'sid': {
		type: Sequelize.STRING
	}
	
}, {
	updatedAt: 'updated_at',
	createdAt: 'created_at'
	
});




