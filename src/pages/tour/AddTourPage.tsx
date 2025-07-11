import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addTour } from '../../services/tourService';
import { getDestinations } from '../../services/destinationService';
import { getActivities } from '../../services/activityService';
import { getTourServices } from '../../services/tourServiceService';
import { Tour, Destination, Activity, TourService } from '../../utils/types';

const AddTourPage = () => {
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

    // Hàm xử lý chọn/deselect checkbox cho multi-select
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

    const handleAddTour = async () => {
        if (!tourName || !transportation || !maxCustomer || !price || !tourDuration) {
            alert("Please fill in all required fields.");
            return;
        }

        // Lọc object theo id đã chọn
        const selectedDestinationsObjects = destinations.filter(dest => selectedDestinations.includes(dest.id));
        const selectedActivitiesObjects = activities.filter(act => selectedActivities.includes(act.id));
        const selectedTourServicesObjects = tourServices.filter(service => selectedTourServices.includes(service.id));

        const newTour: Tour = {
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
            const response = await addTour(newTour);
            console.log("Tour added successfully:", response);
            navigate('/dashboard/manage-tours');
        } catch (error) {
            console.error("Error adding tour:", error);
            alert("Failed to add tour. Please try again.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-3xl font-bold mb-6 text-center">Add New Tour</h2>

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

            {/* Multi-select destinations */}
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

            {/* Multi-select activities */}
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

            {/* Multi-select tourServices */}
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
                onClick={handleAddTour}
                className="w-full py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
            >
                Add Tour
            </button>
        </div>
    );
};

export default AddTourPage;
