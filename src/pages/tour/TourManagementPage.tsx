import React from 'react';
import { useNavigate } from 'react-router-dom';
import TourManagement from '../../components/TourManagement/TourManagement';

const TourManagementPage = () => {
  const navigate = useNavigate();

  const handleAddTour = () => {
    navigate('/dashboard/add-tour');
  };

  return (
    <div>
      <TourManagement />
      <button onClick={handleAddTour}>Thêm Tour</button>
    </div>
  );
};

export default TourManagementPage;