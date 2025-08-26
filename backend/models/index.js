const sequelize = require('../config/database');
const EmergencyRequest = require('./EmergencyRequest');
const Resource = require('./Resource');

// Define associations here if needed in the future (e.g., Request has one allocated Resource)
// Request.belongsTo(Resource);
// Resource.hasMany(Request);

const syncModels = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        // `force: false` is crucial. It doesn't drop existing tables.
        // Use `force: true` only in development to wipe and recreate tables.
        await sequelize.sync({ force: false });
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database or sync models:', error);
    }
};

module.exports = {
    sequelize,
    EmergencyRequest,
    Resource,
    syncModels
};
