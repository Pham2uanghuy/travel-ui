// src/pages/TourDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tour } from '../../utils/types';
import { getTourById } from '../../services/tourService';

const TourDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [tour, setTour] = useState<Tour | null>(null);

    useEffect(() => {
        const fetchTour = async () => {
            try {
                const tourData = await getTourById(Number(id));
                setTour(tourData);
            } catch (error) {
                console.error("Error fetching tour:", error);
            }
        };
        fetchTour();
    }, [id]);

    if (!tour) return <p className="text-center text-gray-600">Loading...</p>;

    return (
        <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-4xl font-bold text-blue-700 mb-6">{tour.tourName}</h1>

            <div className="mb-6">
                <p className="mb-2"><strong>Transportation:</strong> {tour.transportation}</p>
                <p className="mb-2"><strong>Max Customer:</strong> {tour.maxCustomer}</p>
                <p className="mb-2"><strong>Duration:</strong> {tour.tourDuration}</p>
                <p className="mb-2"><strong>Price:</strong> <span className="text-green-600 font-semibold">${tour.price}</span></p>
                <p className="mb-4"><strong>Description:</strong> {tour.description}</p>
            </div>

            <section className="mb-8">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4">Destinations</h2>
                <ul className="space-y-2">
                    {tour.destinations.map((dest) => (
                        <li
                            key={dest.id}
                            className="bg-blue-50 p-3 rounded-lg shadow-md hover:bg-blue-100 transition duration-300">
                            {dest.name}
                        </li>
                    ))}
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4">Activities</h2>
                <ul className="space-y-2">
                    {tour.activities.map((activity) => (
                        <li
                            key={activity.id}
                            className="bg-green-50 p-3 rounded-lg shadow-md hover:bg-green-100 transition duration-300">
                            {activity.name}
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2 className="text-3xl font-semibold text-gray-800 mb-4">Services</h2>
                <ul className="space-y-2">
                    {tour.tourServices.map((service) => (
                        <li
                            key={service.id}
                            className="bg-yellow-50 p-3 rounded-lg shadow-md hover:bg-yellow-100 transition duration-300">
                            {service.name} - <span className="text-green-600 font-semibold">${service.price}</span>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default TourDetailPage;
