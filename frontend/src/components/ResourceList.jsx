import './ResourceList.css';

function ResourceList({ resources }) {

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'available': return 'status-available';
      case 'allocated': return 'status-allocated';
      case 'busy': return 'status-busy';
      case 'offline': return 'status-offline';
      default: return 'status-unknown';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available': return '🟢 Available';
      case 'allocated': return '🔵 Allocated';
      case 'busy': return '🟡 Busy';
      case 'offline': return '⚫ Offline';
      default: return '❓ Unknown';
    }
  };

  // Sort resources: available first, then by type
  const sortedResources = [...resources].sort((a, b) => {
    if (a.status === 'available' && b.status !== 'available') return -1;
    if (a.status !== 'available' && b.status === 'available') return 1;
    return a.type.localeCompare(b.type);
  });

  return (
    <div className="resource-list">
      {sortedResources.length === 0 ? (
        <p className="no-data">No resources registered. Use the form above to add resources.</p>
      ) : (
        sortedResources.map(resource => (
          <div key={resource.id} className="resource-card">
            <div className="resource-header">
              <h3>{resource.name}</h3>
              <span className={`status-badge ${getStatusBadgeClass(resource.status)}`}>
                {getStatusText(resource.status)}
              </span>
            </div>
            
            <div className="resource-details">
              <p><strong>Type:</strong> <span className="resource-type">{resource.type}</span></p>
              <p>
                <strong>Location:</strong> 
                {resource.location?.coordinates ? 
                  ` ${resource.location.coordinates[1].toFixed(4)}, ${resource.location.coordinates[0].toFixed(4)}` 
                  : ' N/A'
                }
              </p>
              {resource.driverId && <p><strong>Driver:</strong> {resource.driverId}</p>}
              <p><strong>ID:</strong> #{resource.id}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ResourceList;
