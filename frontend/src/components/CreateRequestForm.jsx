import { useState } from 'react';
import './CreateRequestForm.css';

function CreateRequestForm({ onRequestCreated, apiBaseUrl }) {
  const [formData, setFormData] = useState({
    type: 'medical',
    urgency: 'medium',
    longitude: '-122.41',
    latitude: '37.77'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      // Convert string coordinates to numbers
      const longitude = parseFloat(formData.longitude);
      const latitude = parseFloat(formData.latitude);
      
      // Validate coordinates
      if (isNaN(longitude) || isNaN(latitude)) {
        throw new Error('Please enter valid numeric values for longitude and latitude.');
      }

      const requestBody = {
        type: formData.type,
        urgency: formData.urgency,
        location: {
          type: 'Point',
          coordinates: [longitude, latitude] // Note: GeoJSON is [longitude, latitude]
        }
      };

      console.log('Sending request:', requestBody); // Debug log

      const response = await fetch(`http://localhost:5050/api/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      // Check if the response is OK before trying to parse JSON
      if (!response.ok) {
        // Try to get error message from response
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} ${response.statusText}. ${errorText}`);
      }

      // Now parse the JSON response
      const result = await response.json();

      setMessage('✅ Emergency request created successfully!');
      setFormData({ type: 'medical', urgency: 'medium', longitude: '-122.41', latitude: '37.77' });
      
      // Notify parent component to refresh the list
      if (onRequestCreated) {
        onRequestCreated();
      }

    } catch (error) {
      console.error('Error creating request:', error);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="create-request-form">
      <h3>Create New Emergency Request</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Emergency Type:</label>
          <select name="type" value={formData.type} onChange={handleChange} required>
            <option value="medical">Medical</option>
            <option value="fire">Fire</option>
            <option value="police">Police</option>
            <option value="natural disaster">Natural Disaster</option>
          </select>
        </div>

        <div className="form-group">
          <label>Urgency Level:</label>
          <select name="urgency" value={formData.urgency} onChange={handleChange} required>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="form-group">
          <label>Latitude:</label>
          <input
            type="number"
            step="any"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            required
            placeholder="e.g., 37.77"
          />
        </div>

        <div className="form-group">
          <label>Longitude:</label>
          <input
            type="number"
            step="any"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            required
            placeholder="e.g., -122.41"
          />
        </div>

        <button type="submit" disabled={isSubmitting} className="submit-btn">
          {isSubmitting ? 'Creating...' : 'Create Emergency Request'}
        </button>

        {message && <div className="form-message">{message}</div>}
      </form>
    </div>
  );
}

export default CreateRequestForm;
