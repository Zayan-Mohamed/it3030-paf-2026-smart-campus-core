import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminFacilitiesLayout } from '../components/facilities/AdminFacilitiesLayout';
import { FacilityForm } from '../components/facilities/FacilityForm';
import {
  getFacility,
  updateFacility,
  type FacilityPayload,
} from '../lib/facilityService';
import { useAuth } from '../contexts/AuthContext';
import type { Facility } from '../types';

export const EditFacility = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { facilityId } = useParams<{ facilityId: string }>();
  const [facility, setFacility] = useState<Facility | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !facilityId) {
      return;
    }

    let active = true;

    const loadFacility = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getFacility(facilityId);
        if (active) {
          setFacility(data);
        }
      } catch (loadError) {
        if (active) {
          const message = loadError instanceof Error ? loadError.message : 'Failed to load facility';
          setError(message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadFacility();

    return () => {
      active = false;
    };
  }, [facilityId, token]);

  const handleSubmit = async (payload: FacilityPayload) => {
    if (!token || !facilityId) {
      throw new Error('Unable to update facility.');
    }

    await updateFacility(token, facilityId, payload);
    navigate('/admin/facilities');
  };

  return (
    <AdminFacilitiesLayout
      title="Facilities & Assets"
      subtitle="Update facility details while staying inside the existing admin layout."
    >
      {loading ? (
        <section className="section">
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center text-slate-500">
            Loading facility...
          </div>
        </section>
      ) : error ? (
        <section className="section">
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
            {error}
          </div>
        </section>
      ) : facility ? (
        <FacilityForm
          initialValues={facility}
          submitLabel="Update Facility"
          onCancel={() => navigate('/admin/facilities')}
          onSubmit={handleSubmit}
        />
      ) : (
        <section className="section">
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
            <h2 className="text-lg font-semibold text-slate-900">Facility not found</h2>
            <p className="mt-2 text-sm text-slate-500">
              The selected facility could not be loaded.
            </p>
          </div>
        </section>
      )}
    </AdminFacilitiesLayout>
  );
};
