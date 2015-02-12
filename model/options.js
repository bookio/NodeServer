var Sequelize = require('sequelize');
var sequelize = require('../sequelize');
var sprintf   = require('../sprintf');

var Model = module.exports = sequelize.define('options', {

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
	},

	'image': {
		type          : Sequelize.TEXT,
		defaultValue  : '',
		allowNull     : false
	}

}, { 
	updatedAt: 'updated_at', 
	createdAt: 'created_at',
	
});



Model.afterDestroy(function(option, options, fn) {
	
	// UPDATE rentals SET option_ids = array_remove(option_ids, 5) WHERE 5 = ANY (option_ids)
	var sql = sprintf('UPDATE rentals SET option_ids = array_remove(option_ids, %d) WHERE %d = ANY (option_ids)', option.id, option.id);

	return sequelize.query(sql).then(function(){
		fn(null, option);
	});	
});

/*

Model.afterBulkDestroy(function(options) {
	
	console.log('*******************************afterBulkDestroy', options);
	// UPDATE rentals SET option_ids = array_remove(option_ids, 5) WHERE 5 = ANY (option_ids)
	//var sql = sprintf('UPDATE rentals SET option_ids = array_remove(option_ids, %d) WHERE %d = ANY (option_ids)', option.id, option.id);

	return sequelize.Promise.resolve();
});

*/
