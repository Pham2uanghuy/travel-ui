// src/components/TourManagement/TourForm.tsx
import React, { useState, useEffect } from 'react';
import { Tour } from '../../utils/types';

interface TourFormProps {
    onSave: (tour: Tour) => void;
    initialData?: Tour | null;
}

const TourForm: React.FC<TourFormProps> = ({ onSave, initialData }) => {
    const [formData, setFormData] = useState<Tour>({
        id: 0,
        tourName: '',
        transportation: '',
        maxCustomer: 0,
        price: 0,
        tourDuration: '',
        description: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="tourName" placeholder="Tên tour" value={formData.tourName} onChange={handleChange} />
            <input name="transportation" placeholder="Phương tiện" value={formData.transportation} onChange={handleChange} />
            <input name="maxCustomer" placeholder="Khách tối đa" type="number" value={formData.maxCustomer} onChange={handleChange} />
            <input name="price" placeholder="Giá" type="number" value={formData.price} onChange={handleChange} />
            <input name="tourDuration" placeholder="Thời lượng" value={formData.tourDuration} onChange={handleChange} />
            <input name="description" placeholder="Mô tả" value={formData.description} onChange={handleChange} />
            <button type="submit">Lưu</button>
        </form>
    );
};

export default TourForm;
