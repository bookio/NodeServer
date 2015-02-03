var Sequelize = require('sequelize');
var sequelize = require('../sequelize');

var Reservation = module.exports = sequelize.define('reservations', {

	'description': {
		type          : Sequelize.TEXT,
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
	},

	'payed': {
		type          : Sequelize.INTEGER,
		defaultValue  : 0,
		allowNull     : false
	},

	'delivered': {
		type          : Sequelize.INTEGER,
		defaultValue  : 0,
		allowNull     : false
	},

	'transferred': {
		type          : Sequelize.INTEGER,
		defaultValue  : 0,
		allowNull     : false
	}


}, { 
	updatedAt: 'updated_at', 
	createdAt: 'created_at'
});


Reservation.beforeValidate(function(reservation, options) {
  
	if (typeof reservation.payed == 'boolean')
		reservation.payed = reservation.payed + 0;

	if (typeof reservation.delivered == 'boolean')
		reservation.delivered = reservation.delivered + 0;

	if (typeof reservation.transferred == 'boolean')
		reservation.transferred = reservation.transferred + 0;

	return sequelize.Promise.resolve(reservation);
})