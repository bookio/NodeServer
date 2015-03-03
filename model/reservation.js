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
	},
	
	'arrived': {
		type          : Sequelize.INTEGER,
		defaultValue  : 0,
		allowNull     : false
	},
	'price': {
		type          : Sequelize.FLOAT,
		defaultValue  : null,
		allowNull     : true
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

	if (typeof reservation.arrived == 'boolean')
		reservation.arrived = reservation.arrived + 0;

	if (typeof reservation.price == 'string') {
		reservation.price = reservation.price == '' ? null : parseFloat(reservation.price);

		if (isNaN(reservation.price)) {
			throw new Error("Price must be numeric or NULL.");
		}
	}

	return sequelize.Promise.resolve(reservation);
})