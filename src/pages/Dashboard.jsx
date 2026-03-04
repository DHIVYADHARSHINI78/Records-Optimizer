import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import PatientCard from '../components/PatientCard';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // --- PAGINATION & SORT STATES ---
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('name'); 
  const itemsPerPage = 5;

  const searchInputRef = useRef(null);
  const renderCount = useRef(0);
  renderCount.current++;

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      setPatients(response.data);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
    if (searchInputRef.current) searchInputRef.current.focus();
  }, [fetchPatients]);

  const handleSelect = useCallback((patient) => {
    setSelectedPatient(prev => prev?.id === patient.id ? null : patient);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // --- FILTER & SORT LOGIC ---
  const filteredAndSortedPatients = useMemo(() => {
    const term = search.toLowerCase();
    let result = patients.filter(p => 
      p.name.toLowerCase().includes(term) || p.email.toLowerCase().includes(term)
    );

    return result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'company') return a.company.name.localeCompare(b.company.name);
      return 0;
    });
  }, [patients, search, sortBy]);

  // --- PAGINATION CALCULATION ---
  const totalPages = Math.ceil(filteredAndSortedPatients.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedPatients.slice(start, start + itemsPerPage);
  }, [filteredAndSortedPatients, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy]);

  return (
    <div className="container py-5">
      {/* HEADER SECTION */}
      <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
        <div>
          <h1 className="h3 fw-bold text-primary mb-0">🏥 Patient Records Optimizer</h1>
          <p className="text-muted small">Hospital Management System v2.0</p>
        </div>
        <div className="text-end">
          <div className="badge bg-dark p-2 mb-1">Renders: {renderCount.current}</div>
          <div className="text-muted" style={{ fontSize: '0.8rem' }}>Last Refreshed: {lastRefreshed || 'Never'}</div>
        </div>
      </div>

      {/* SEARCH & ACTIONS */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="input-group input-group-lg shadow-sm">
            <input
              ref={searchInputRef}
              type="text"
              className="form-control"
              placeholder="Search by patient name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <select 
            className="form-select form-select-lg shadow-sm" 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="company">Sort by Hospital</option>
          </select>
        </div>
        <div className="col-md-3">
          <button className="btn btn-primary btn-lg w-100 shadow-sm" onClick={fetchPatients} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh patients'}
          </button>
        </div>
      </div>

      {/* STATS STRIP */}
 {/* STATS STRIP - Updated to show Total Count */}
<div className="alert alert-info py-2 px-3 border-0 shadow-sm d-flex justify-content-between align-items-center">
  <span className="fw-semibold text-info-emphasis">
    📊 Total Records Found: {filteredAndSortedPatients.length} Patients
  </span>
  {selectedPatient && (
    <span className="badge bg-warning text-dark px-3 py-2 animate__animated animate__pulse animate__infinite">
      Active Selection: {selectedPatient.name}
    </span>
  )}
</div>
    {/* UPDATED SELECTED PATIENT PREVIEW (FULL PROFILE) */}
{selectedPatient && (
  <div className="card border-0 shadow-lg mb-5 bg-white border-start border-primary border-4 animate__animated animate__fadeInUp">
    <div className="card-body p-4">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h4 className="fw-bold text-primary mb-1">{selectedPatient.name}</h4>
          <div className="d-flex gap-2">
              <span className="badge bg-primary-subtle text-primary px-3">Full Profile View</span>
              <span className="badge bg-light text-muted border">UID: {selectedPatient.id}</span>
          </div>
        </div>
        <button className="btn-close shadow-none" onClick={() => setSelectedPatient(null)} aria-label="Close"></button>
      </div>

      <div className="row g-3">
        {/* Combined Address Logic */}
        <div className="col-md-8">
          <div className="p-3 rounded-3 h-100 shadow-sm" style={{ background: '#f8f9fa', border: '1px solid #e9ecef' }}>
            <small className="text-muted fw-bold text-uppercase d-block mb-2" style={{fontSize: '0.65rem', letterSpacing: '0.5px'}}>
              📍 Registered Residential Address
            </small>
            <p className="mb-0 fw-semibold text-dark">
              {selectedPatient.address?.suite}, {selectedPatient.address?.street}, {selectedPatient.address?.city}
            </p>
            <small className="text-primary x-small">Zip Code: {selectedPatient.address?.zipcode}</small>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="p-3 rounded-3 h-100 shadow-sm" style={{ background: '#f8f9fa', border: '1px solid #e9ecef' }}>
            <small className="text-muted fw-bold text-uppercase d-block mb-2" style={{fontSize: '0.65rem', letterSpacing: '0.5px'}}>
              🏥 Clinic Assignment
            </small>
            <p className="mb-0 fw-bold text-primary" style={{ fontSize: '1.1rem' }}>
              {selectedPatient.company?.name}
            </p>
            <small className="text-muted italic">Primary Healthcare Provider</small>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
      {/* PATIENT GRID / LOADING STATE */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted fw-bold">Syncing Patient Database...</p>
        </div>
      ) : (
        <>
          <div className="row g-4">
            {currentItems.length > 0 ? (
              currentItems.map(patient => (
                <div key={patient.id} className="col-md-6 col-lg-4">
                  <PatientCard 
                    patient={patient} 
                    handleSelect={handleSelect}
                    isSelected={selectedPatient?.id === patient.id}
                    searchTerm={search}
                  />
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <div className="display-1 text-muted opacity-25 mb-3">🔍</div>
                <h5 className="text-muted">No patient records match "{search}"</h5>
                <button className="btn btn-link text-decoration-none" onClick={() => setSearch('')}>Clear all filters</button>
              </div>
            )}
          </div>

          {/* PAGINATION UI */}
          {totalPages > 1 && (
            <nav className="mt-5">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link shadow-sm border-0 mx-1" onClick={() => setCurrentPage(p => p - 1)}>Previous</button>
                </li>
                
                {[...Array(totalPages)].map((_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                    <button className="page-link shadow-sm border-0 mx-1 rounded" onClick={() => setCurrentPage(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link shadow-sm border-0 mx-1" onClick={() => setCurrentPage(p => p + 1)}>Next</button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}

      {/* FLOATING SCROLL BUTTON */}
      <button 
        className="btn btn-primary shadow-lg position-fixed bottom-0 end-0 m-4 rounded-circle d-flex align-items-center justify-content-center"
        style={{ width: '55px', height: '55px', zIndex: 1000, transition: '0.3s' }}
        onClick={scrollToTop}
        title="Go to Top"
      >
        <span className="fs-4">↑</span>
      </button>
    </div>
  );
};

export default Dashboard;