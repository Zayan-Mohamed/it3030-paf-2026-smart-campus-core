import { useNavigate } from 'react-router-dom';
import { AdminFacilitiesLayout } from '../components/facilities/AdminFacilitiesLayout';
import { FacilityForm } from '../components/facilities/FacilityForm';
import { createFacility, type FacilityPayload } from '../lib/facilityService';
import { useAuth } from '../contexts/AuthContext';

export const AddFacility = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (payload: FacilityPayload) => {
    if (!token) {
      throw new Error('You must be signed in to create a facility.');
    }

    await createFacility(token, payload);
    navigate('/admin/facilities');
  };

  return (
    <AdminFacilitiesLayout
      title="Facilities & Assets"
      subtitle="Create a new facility record inside the existing admin workspace."
    >
      <FacilityForm
        submitLabel="Create Facility"
        onCancel={() => navigate('/admin/facilities')}
        onSubmit={handleSubmit}
      />
    </AdminFacilitiesLayout>
  );
};
