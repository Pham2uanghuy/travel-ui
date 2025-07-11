import React, { useEffect, useState } from 'react';
import { TourService } from '../../utils/types';
import { getTourServiceById } from '../../services/tourServiceService';

interface TourServiceInfoProps {
    tourServiceId: number;
}

const TourServiceInfo: React.FC<TourServiceInfoProps> = ({ tourServiceId }) => {
    const [tourService, setTourService] = useState<TourService | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTourService = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getTourServiceById(tourServiceId);
                if (data) {
                    setTourService(data);
                } else {
                    setError('Không tìm thấy dịch vụ tour.');
                }
            } catch (err) {
                setError('Lỗi khi tải thông tin dịch vụ tour.');
            } finally {
                setLoading(false);
            }
        };

        fetchTourService();
    }, [tourServiceId]);

    if (loading) return <p>Đang tải thông tin dịch vụ tour...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!tourService) return null;

    return (
        <div className=" p-4 rounded shadow mt-4">
            <p><strong>Tên dịch vụ:</strong> {tourService.name}</p>
            <p><strong>Loại dịch vụ:</strong> {tourService.type}</p>
            <p><strong>Giá:</strong> {tourService.price.toLocaleString()} VNĐ</p>
        </div>
    );
};

export default TourServiceInfo;
