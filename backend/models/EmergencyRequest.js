const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmergencyRequest = sequelize.define('EmergencyRequest', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    location: {
        type: DataTypes.GEOMETRY('POINT'), // Stores latitude & longitude. Requires PostGIS extension.
        allowNull: false
    },
    // Alternatively, if you don't want to use PostGIS, use two FLOAT columns:
    // latitude: { type: DataTypes.FLOAT, allowNull: false },
    // longitude: { type: DataTypes.FLOAT, allowNull: false },
    urgency: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false
    },
    type: {
        type: DataTypes.STRING, // e.g., 'medical', 'fire', 'natural disaster'
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'allocated', 'en_route', 'resolved'),
        defaultValue: 'pending'
    }
}, {
    tableName: 'emergency_requests'
});

module.exports = EmergencyRequest;
