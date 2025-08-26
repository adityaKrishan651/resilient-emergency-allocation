import { useState } from 'react';
import './AddResourceForm.css';

function AddResourceForm({ onResourceCreated, apiBaseUrl }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'medical',
    status: 'available',
    driverId: '',
    longitude: '-122.42',
    latitude: '37.78'
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

      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error('Resource name is required.');
      }

      const requestBody = {
        name: formData.name.trim(),
        type: formData.type,
        status: formData.status,
        driverId: formData.driverId.trim(),
        location: {
          type: 'Point',
          coordinates: [longitude, latitude]
        }
      };

      console.log('Sending resource creation request:', requestBody);

      const response = await fetch(`http://localhost:5050/api/resources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      // Check if the response is OK before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} ${response.statusText}. ${errorText}`);
      }

      // Parse the JSON response
      const result = await response.json();

      setMessage('✅ Resource created successfully!');
      // Reset form but keep the type and status selections
      setFormData({
        name: '',
        type: formData.type,
        status: formData.status,
        driverId: '',
        longitude: '-122.42',
        latitude: '37.78'
      });
      
      // Notify parent component to refresh the list
      if (onResourceCreated) {
        onResourceCreated();
      }

    } catch (error) {
      console.error('Error creating resource:', error);
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
    <div className="add-resource-form">
      <h3>Add New Resource</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Resource Name:*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Ambulance-1, Fire-Truck-5"
          />
        </div>

        <div className="form-group">
          <label>Resource Type:*</label>
          <select name="type" value={formData.type} onChange={handleChange} required>
            <option value="medical">Medical</option>
            <option value="fire">Fire</option>
            <option value="police">Police</option>
            <option value="rescue">Rescue</option>
            <option value="utility">Utility</option>
          </select>
        </div>

        <div className="form-group">
          <label>Initial Status:*</label>
          <select name="status" value={formData.status} onChange={handleChange} required>
            <option value="available">Available</option>
            <option value="offline">Offline</option>
            <option value="busy">Busy</option>
          </select>
        </div>

        <div className="form-group">
          <label>Driver ID:</label>
          <input
            type="text"
            name="driverId"
            value={formData.driverId}
            onChange={handleChange}
            placeholder="e.g., driver-123 (optional)"
          />
        </div>

        <div className="form-group">
          <label>Latitude:*</label>
          <input
            type="number"
            step="any"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            required
            placeholder="e.g., 37.78"
          />
        </div>

        <div className="form-group">
          <label>Longitude:*</label>
          <input
            type="number"
            step="any"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            required
            placeholder="e.g., -122.42"
          />
        </div>

        <button type="submit" disabled={isSubmitting} className="submit-btn">
          {isSubmitting ? 'Creating...' : 'Add Resource'}
        </button>

        {message && <div className="form-message">{message}</div>}
      </form>
    </div>
  );
}

export default AddResourceForm;
