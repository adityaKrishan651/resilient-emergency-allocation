const { sequelize } = require('../models');
const { Resource } = require('../models');

/**
 * Finds the nearest available resource for a given emergency request.
 * @param {number} requestId - The ID of the emergency request.
 * @param {string} requestType - The type of the emergency request (e.g., 'medical').
 * @param {object} requestLocation - GeoJSON Point of the emergency.
 * @returns {Promise<Resource|null>} The nearest available resource, or null if none found.
 */
const findNearestResource = async (requestId, requestType, requestLocation) => {
    // Extract longitude and latitude from GeoJSON.
    // GeoJSON format: { type: 'Point', coordinates: [longitude, latitude] }
    const longitude = requestLocation.coordinates[0];
    const latitude = requestLocation.coordinates[1];

    // Raw SQL query using PostGIS's ST_Distance function.
    // This query finds available resources of a matching type, ordered by distance.
    // The '::geography' cast enables accurate distance calculation in meters.
    const query = `
        SELECT 
            *,
            ST_Distance(
                location::geography, 
                ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography
            ) AS distance
        FROM "resources"
        WHERE 
            "type" = :requestType 
            AND "status" = 'available'
        ORDER BY distance
        LIMIT 1;
    `;

    try {
        const [nearestResource] = await sequelize.query(query, {
            replacements: { longitude, latitude, requestType },
            model: Resource, // This tells Sequelize to return a Resource instance
            mapToModel: true,
        });

        return nearestResource || null;
    } catch (error) {
        console.error('Error in findNearestResource:', error);
        throw new Error('Failed to find nearest resource');
    }
};

module.exports = {
    findNearestResource
};
