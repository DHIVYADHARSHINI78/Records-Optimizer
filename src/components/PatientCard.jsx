import React from 'react';

// Optimized Highlight Component
const Highlight = ({ text, highlight }) => {
  if (!highlight?.trim()) return <span>{text}</span>;
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) => 
        part.toLowerCase() === highlight.toLowerCase() 
          ? (
            <mark 
              key={i} 
              style={{ 
                backgroundColor: '#e0f2fe', 
                color: '#0369a1',          
                padding: '0 2px', 
                borderRadius: '4px',
                fontWeight: '600'
              }}
            >
              {part}
            </mark>
          ) 
          : part
      )}
    </span>
  );
};

const PatientCard = React.memo(({ patient, handleSelect, isSelected, searchTerm }) => {
  console.log("Child Rendered");
  return (
    <div className={`card h-100 patient-card-custom ${isSelected ? 'ring-active' : ''}`}>
      <div className="card-body p-4">
        
        {/* Header: Identity */}
        <div className="d-flex align-items-center mb-4">
          <div className="avatar-circle me-3">
            {patient.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <h6 className="card-title mb-0 fw-bold text-dark text-truncate" style={{fontSize: '1.05rem'}}>
              <Highlight text={patient.name} highlight={searchTerm} />
            </h6>
            <div className="badge bg-primary-subtle text-primary x-small mt-1 px-2 py-1">
              <Highlight text={patient.company?.name || "OPD Patient"} highlight={searchTerm} />
            </div>
          </div>
        </div>

        {/* Contact Info with Soft Icons */}
        <div className="small text-muted mb-4">
          <div className="d-flex align-items-center mb-2">
            <div className="bg-light rounded p-1 me-2 text-primary" style={{width: '28px', textAlign: 'center'}}>✉</div>
            <Highlight text={patient.email} highlight={searchTerm} />
          </div>
          <div className="d-flex align-items-center">
            <div className="bg-light rounded p-1 me-2 text-primary" style={{width: '28px', textAlign: 'center'}}>📞</div>
            <span>{patient.phone}</span>
          </div>
        </div>

        {/* New Stylized Button */}
        <button 
          className={`btn w-100 btn-details ${isSelected ? 'btn-primary text-white shadow' : ''}`}
          onClick={() => handleSelect(patient)}
        >
          {isSelected ? '✓ Patient Selected' : 'View Full Profile'}
        </button>
      </div>
    </div>
  );
});

export default PatientCard;