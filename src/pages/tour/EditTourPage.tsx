import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTourById, updateTour } from '../../services/tourService'; // giả sử có 2 API này
import { getDestinations } from '../../services/destinationService';
import { getActivities } from '../../services/activityService';
import { getTourServices } from '../../services/tourServiceService';
import { Tour, Destination, Activity, TourService } from '../../utils/types';

const EditTourPage = () => {
    const { id } = useParams<{ id: string }>(); // lấy id từ URL
    const navigate = useNavigate();

    const [tourName, setTourName] = useState('');
    const [transportation, setTransportation] = useState('');
    const [maxCustomer, setMaxCustomer] = useState<number | ''>('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [tourDuration, setTourDuration] = useState('');
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [tourServices, setTourServices] = useState<TourService[]>([]);
    const [selectedDestinations, setSelectedDestinations] = useState<number[]>([]);
    const [selectedActivities, setSelectedActivities] = useState<number[]>([]);
    const [selectedTourServices, setSelectedTourServices] = useState<number[]>([]);

    // Load data chung
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [destResponse, actResponse, serResponse] = await Promise.all([
                    getDestinations(),
                    getActivities(),
                    getTourServices()
                ]);
                setDestinations(destResponse);
                setActivities(actResponse);
                setTourServices(serResponse);
            } catch (error) {
                console.error("Error fetching data:", error);
                alert("Failed to load data. Please try again.");
            }
        };
        fetchData();
    }, []);

    // Load tour info khi có id (lần đầu hoặc khi id thay đổi)
    useEffect(() => {
        if (!id) return;
        const fetchTour = async () => {
            try {
                const tour = await getTourById(Number(id));
                if (!tour) {
                    alert("Tour not found.");
                    navigate('/dashboard/manage-tours');
                    return;
                }
                setTourName(tour.tourName);
                setTransportation(tour.transportation);
                setMaxCustomer(tour.maxCustomer);
                setDescription(tour.description);
                setPrice(tour.price);
                setTourDuration(tour.tourDuration);
                setSelectedDestinations(tour.destinations.map(d => d.id));
                setSelectedActivities(tour.activities.map(a => a.id));
                setSelectedTourServices(tour.tourServices.map(s => s.id));
            } catch (error) {
                console.error("Error fetching tour:", error);
                alert("Failed to load tour data.");
            }
        };
        fetchTour();
    }, [id]);

    const handleSelectionChange = (
        id: number,
        selectedArray: number[],
        setSelected: React.Dispatch<React.SetStateAction<number[]>>
    ) => {
        if (selectedArray.includes(id)) {
            setSelected(selectedArray.filter(item => item !== id));
        } else {
            setSelected([...selectedArray, id]);
        }
    };

    const handleUpdateTour = async () => {
        if (!tourName || !transportation || !maxCustomer || !price || !tourDuration) {
            alert("Please fill in all required fields.");
            return;
        }

        const selectedDestinationsObjects = destinations.filter(dest => selectedDestinations.includes(dest.id));
        const selectedActivitiesObjects = activities.filter(act => selectedActivities.includes(act.id));
        const selectedTourServicesObjects = tourServices.filter(service => selectedTourServices.includes(service.id));

        const updatedTour: Tour = {
            tourName,
            transportation,
            maxCustomer: Number(maxCustomer),
            description,
            price: Number(price),
            tourDuration,
            destinations: selectedDestinationsObjects,
            activities: selectedActivitiesObjects,
            tourServices: selectedTourServicesObjects
        };

        try {
            await updateTour(Number(id), updatedTour);
            alert("Tour updated successfully!");
            navigate('/dashboard/manage-tours');
        } catch (error) {
            console.error("Error updating tour:", error);
            alert("Failed to update tour. Please try again.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-3xl font-bold mb-6 text-center">Edit Tour</h2>

            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Tour Name</label>
                <input
                    type="text"
                    value={tourName}
                    onChange={(e) => setTourName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Transportation</label>
                <input
                    type="text"
                    value={transportation}
                    onChange={(e) => setTransportation(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Max Customer</label>
                <input
                    type="number"
                    value={maxCustomer}
                    onChange={(e) => {
                        const val = e.target.value;
                        setMaxCustomer(val === '' ? '' : Number(val));
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Price</label>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => {
                        const val = e.target.value;
                        setPrice(val === '' ? '' : Number(val));
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Duration</label>
                <input
                    type="text"
                    value={tourDuration}
                    onChange={(e) => setTourDuration(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
            </div>

            {/* Destinations */}
            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Destinations</label>
                {destinations.map(dest => (
                    <label key={dest.id} className="block">
                        <input
                            type="checkbox"
                            checked={selectedDestinations.includes(dest.id)}
                            onChange={() => handleSelectionChange(dest.id, selectedDestinations, setSelectedDestinations)}
                            className="mr-2"
                        />
                        {dest.name}
                    </label>
                ))}
            </div>

            {/* Activities */}
            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Activities</label>
                {activities.map(act => (
                    <label key={act.id} className="block">
                        <input
                            type="checkbox"
                            checked={selectedActivities.includes(act.id)}
                            onChange={() => handleSelectionChange(act.id, selectedActivities, setSelectedActivities)}
                            className="mr-2"
                        />
                        {act.name}
                    </label>
                ))}
            </div>

            {/* Tour Services */}
            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Tour Services</label>
                {tourServices.map(service => (
                    <label key={service.id} className="block">
                        <input
                            type="checkbox"
                            checked={selectedTourServices.includes(service.id)}
                            onChange={() => handleSelectionChange(service.id, selectedTourServices, setSelectedTourServices)}
                            className="mr-2"
                        />
                        {service.name}
                    </label>
                ))}
            </div>

            <button
                type="button"
                onClick={handleUpdateTour}
                className="w-full py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
            >
                Save Changes
            </button>
        </div>
    );
};

export default EditTourPage;
