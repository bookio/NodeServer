
var Model = {};

Model.Client      = require('./model/client');
Model.User        = require('./model/user');
Model.Session     = require('./model/session');
Model.Category    = require('./model/category');
Model.Customer    = require('./model/customer');
Model.Reservation = require('./model/reservation');
Model.Rental      = require('./model/rental');
Model.Group       = require('./model/group');
Model.Option      = require('./model/options');
Model.Setting     = require('./model/setting');
Model.Icon        = require('./model/icon');
Model.Schedule    = require('./model/schedule');

Model.Session.belongsTo(Model.User, {foreignKey: 'user_id'});

Model.User.belongsTo(Model.Client, {foreignKey: 'client_id'});
Model.User.hasOne(Model.Session, {foreignKey: 'user_id'});


Model.Category.belongsTo(Model.Client, {foreignKey: 'client_id'});
Model.Category.hasMany(Model.Rental, {foreignKey: 'category_id'});

Model.Customer.belongsTo(Model.Client, {foreignKey: 'client_id'});

Model.Rental.belongsTo(Model.Client, {foreignKey: 'client_id'});
Model.Rental.hasMany(Model.Reservation, {foreignKey: 'rental_id'});
Model.Rental.belongsTo(Model.Category, {foreignKey: 'category_id'});

Model.Reservation.belongsTo(Model.Client, {foreignKey: 'client_id'});
Model.Reservation.belongsTo(Model.Rental, {foreignKey: 'rental_id'});
Model.Reservation.belongsTo(Model.Customer, {foreignKey: 'customer_id'});

Model.Setting.belongsTo(Model.Client, {foreignKey: 'client_id'});

Model.Schedule.belongsTo(Model.Client, {foreignKey: 'client_id'});

//Model.Group.belongsTo(Model.Client, {foreignKey: 'client_id'});

Model.Client.hasMany(Model.Reservation, {foreignKey: 'client_id'});
Model.Client.hasMany(Model.Rental, {foreignKey: 'client_id'});
Model.Client.hasMany(Model.Customer, {foreignKey: 'client_id'});
Model.Client.hasMany(Model.Category, {foreignKey: 'client_id'});
Model.Client.hasMany(Model.User, {foreignKey: 'client_id'});
Model.Client.hasMany(Model.Setting, {foreignKey: 'client_id'});
Model.Client.hasMany(Model.Schedule, {foreignKey: 'client_id'});
//Model.Client.hasMany(Model.Group, {foreignKey: 'client_id'});



module.exports = Model;
