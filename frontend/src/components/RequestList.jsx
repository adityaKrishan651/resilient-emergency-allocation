import './RequestList.css';

function RequestList({ requests, onUpdate, apiBaseUrl }) {

  const handleAllocate = async (requestId) => {
    try {
      const response = await fetch(`${apiBaseUrl}/allocate/${requestId}`, {
        method: 'POST',
      });

      const result = await response.json();

      if (!response.ok) {
        alert(`Error: ${result.error}`);
        return;
      }

      alert(`Success: ${result.message}`);
      if (result.blockchainTransactionHash) {
        console.log('Blockchain TX Hash:', result.blockchainTransactionHash);
      }
      // Trigger a data refresh
      onUpdate();

    } catch (error) {
      console.error('Allocation error:', error);
      alert('Failed to allocate resource. Check console for details.');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'allocated': return 'status-allocated';
      case 'en_route': return 'status-en-route';
      case 'resolved': return 'status-resolved';
      default: return 'status-unknown';
    }
  };

  const getUrgencyBadgeClass = (urgency) => {
    switch (urgency) {
      case 'critical': return 'urgency-critical';
      case 'high': return 'urgency-high';
      case 'medium': return 'urgency-medium';
      case 'low': return 'urgency-low';
      default: return 'urgency-unknown';
    }
  };

  return (
    <div className="request-list">
      {requests.length === 0 ? (
        <p className="no-data">No emergency requests found.</p>
      ) : (
        requests.map(request => (
          <div key={request.id} className="request-card">
            <div className="request-header">
              <span className={`urgency-badge ${getUrgencyBadgeClass(request.urgency)}`}>
                {request.urgency}
              </span>
              <span className={`status-badge ${getStatusBadgeClass(request.status)}`}>
                {request.status}
              </span>
            </div>
            
            <div className="request-details">
              <h3>{request.type}</h3>
              <p>
                <strong>Location:</strong> 
                {request.location?.coordinates ? 
                  ` ${request.location.coordinates[1].toFixed(4)}, ${request.location.coordinates[0].toFixed(4)}` 
                  : ' N/A'
                }
              </p>
              <p><strong>ID:</strong> #{request.id}</p>
              <p><strong>Created:</strong> {new Date(request.createdAt).toLocaleTimeString()}</p>
            </div>

            {request.status === 'pending' && (
              <button 
                onClick={() => handleAllocate(request.id)}
                className="allocate-btn"
              >
                Allocate Resource
              </button>
            )}

            {request.status === 'allocated' && (
              <div className="allocation-info">
                ✅ Resource Allocated
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default RequestList;
