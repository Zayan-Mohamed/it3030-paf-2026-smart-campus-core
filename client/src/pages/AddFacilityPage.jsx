import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FacilityForm from '../components/facilities/FacilityForm';
import { createFacility } from '../services/facilityService';

const AddFacilityPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError('');

    try {
      await createFacility(formData);
      navigate('/facilities');
    } catch (err) {
      setError(err.message || 'Failed to create facility. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/facilities');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Add New Facility</h1>
        <p>Create a new facility for the campus</p>
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
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default AddFacilityPage;