import React, { useEffect, useState } from 'react';
import { getTours, addTour, updateTour, deleteTour } from '../../services/tourService';
import { Tour } from '../../utils/types';
import TourTable from './TourTable';


const TourManagement: React.FC = () => {
    const [tours, setTours] = useState<Tour[]>([]);
    const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

    useEffect(() => {
        fetchTours();
    }, []);

    const fetchTours = async () => {
        const data = await getTours();
        setTours(data);
    };


    const handleDelete = async (id: number): Promise<boolean> => {
        const success = await deleteTour(id);
        if (success) {
            setTours((prev) => prev.filter((t) => t.id !== id));
        }
        return success;
    };

    return (
        <div>
            <h2>Quản lý Tour</h2>
            <TourTable tours={tours} onEdit={setSelectedTour} onDelete={handleDelete} />
        </div>
    );
};

export default TourManagement;