const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Resource = sequelize.define('Resource', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING, // e.g., "Ambulance Unit 12", "Fire Truck 5"
        allowNull: false
    },
    type: {
        type: DataTypes.STRING, // Should match request types, e.g., 'medical', 'fire'
        allowNull: false
    },
    location: {
        type: DataTypes.GEOMETRY('POINT'),
        allowNull: false
    },
    // latitude: { type: DataTypes.FLOAT, allowNull: false },
    // longitude: { type: DataTypes.FLOAT, allowNull: false },
    status: {
        type: DataTypes.ENUM('available', 'allocated', 'busy', 'offline'),
        defaultValue: 'available'
    },
    driverId: {
        type: DataTypes.STRING // Could be a name or ID of the assigned driver
    }
}, {
    tableName: 'resources'
});

module.exports = Resource;