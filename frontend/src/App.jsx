import { useState, useEffect } from 'react'
import './App.css'
import RequestList from './components/RequestList'
import ResourceList from './components/ResourceList'
import Header from './components/Header'
import CreateRequestsForm from './components/CreateRequestForm';
import AddResourceForm from './components/AddResourceForm';


function App() {
  const [requests, setRequests] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Base URL for our backend API
  const API_BASE_URL = 'http://localhost:5050/api';


  // Fetch data from backend
  const fetchData = async () => {
    try {
      setError('');
      const [requestsRes, resourcesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/requests`),
        fetch(`${API_BASE_URL}/resources`)
      ]);

      if (!requestsRes.ok || !resourcesRes.ok) {
        throw new Error('Failed to fetch data from server');
      }

      const requestsData = await requestsRes.json();
      const resourcesData = await resourcesRes.json();

      setRequests(requestsData);
      setResources(resourcesData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Could not connect to the server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

	const handleRequestCreated = () => {
		fetchData();
	}

	const handleResourceCreated = () => {
		fetchData();
	}


  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Set up polling for real-time updates every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <div className="loading">Loading system data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="app">
      <Header />
      <div className="dashboard">
	  <div className="dashboard-column">
	  <CreateRequestsForm />
	  </div>
        <div className="dashboard-column">
          <h2>Emergency Requests</h2>
          <RequestList requests={requests} onUpdate={fetchData} apiBaseUrl={API_BASE_URL} />
        </div>
	  <div className="dashboard-column">
	  	<AddResourceForm onResourceCreated={handleResourceCreated} apiBaeUrl={API_BASE_URL} />
	  </div>
        <div className="dashboard-column">
          <h2>Available Resources</h2>
          <ResourceList resources={resources} />
        </div>
      </div>
    </div>
  );
}

export default App
