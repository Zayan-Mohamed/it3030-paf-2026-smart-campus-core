import { mockFacilities } from '../data/mockFacilities.js';

// Mock facility service functions
// TODO: Replace with actual API calls when backend is ready

export async function getFacilities() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  return [...mockFacilities];
}

export async function getFacilityById(id) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  const facility = mockFacilities.find(facility => facility.id === parseInt(id));

  if (!facility) {
    throw new Error('Facility not found');
  }

  return facility;
}

export async function createFacility(data) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Validate required fields
  if (!data.name || !data.facilityType || !data.location || !data.capacity || !data.status) {
    throw new Error('Missing required fields');
  }

  const newFacility = {
    ...data,
    id: Math.max(...mockFacilities.map(f => f.id)) + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // In a real app, this would be sent to the backend
  console.log('Creating facility:', newFacility);

  return newFacility;
}

export async function updateFacility(id, data) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Check if facility exists
  const existingFacility = mockFacilities.find(f => f.id === parseInt(id));
  if (!existingFacility) {
    throw new Error('Facility not found');
  }

  const updatedFacility = {
    ...data,
    id: parseInt(id),
    updatedAt: new Date().toISOString()
  };

  console.log('Updating facility:', updatedFacility);

  return updatedFacility;
}

export async function deleteFacility(id) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Check if facility exists
  const facility = mockFacilities.find(f => f.id === parseInt(id));
  if (!facility) {
    throw new Error('Facility not found');
  }

  console.log('Deleting facility with ID:', id);

  return true;
}