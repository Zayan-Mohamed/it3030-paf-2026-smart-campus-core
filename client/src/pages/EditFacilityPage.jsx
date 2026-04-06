import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FacilityForm from '../components/facilities/FacilityForm';
import { getFacilityById, updateFacility } from '../services/facilityService';

const EditFacilityPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [facility, setFacility] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFacility, setIsLoadingFacility] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadFacility = async () => {
      try {
        const facilityData = await getFacilityById(id);
        setFacility(facilityData);
      } catch (err) {
        setError('Failed to load facility. Please try again.');
      } finally {
        setIsLoadingFacility(false);
      }
    };

    loadFacility();
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError('');

    try {
      await updateFacility(id, formData);
      navigate('/facilities');
    } catch (err) {
      setError(err.message || 'Failed to update facility. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/facilities');
  };

  if (isLoadingFacility) {
    return (
      <div className="page-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading facility...</p>
        </div>
      </div>
    );
  }

  if (error && !facility) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Edit Facility</h1>
        </div>
        <div className="page-content">
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
          <button
            onClick={() => navigate('/facilities')}
            className="btn btn-secondary"
          >
            Back to Facilities
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Edit Facility</h1>
        <p>Update facility information</p>
      </div>

      <div className="page-content">
        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="form-card">
          <FacilityForm
            facility={facility}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default EditFacilityPage;