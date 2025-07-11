import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tour } from '../../utils/types';
import { toast } from 'react-toastify';

interface TourTableProps {
    tours: Tour[];
    onDelete: (id: number) => Promise<boolean>;
}

const TourTable: React.FC<TourTableProps> = ({ tours, onDelete }) => {
    const navigate = useNavigate();

    // Sắp xếp tours theo id tăng dần
    const sortedTours = [...tours].sort((a, b) => (a.id ?? 0) - (b.id ?? 0));

    const handleEdit = (tourId: number) => {
        navigate(`/dashboard/tours/edit/${tourId}`);
    };

    const handleDelete = async (tourId: number) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa tour này?");
        if (!confirmDelete) return;

        try {
            const isDeleted = await onDelete(tourId);
            console.log("Xóa tour:", isDeleted);
            if (isDeleted) {
                toast.success("Xóa tour thành công!");
            } else {
                toast.error("Không thể xóa tour, vui lòng thử lại.");
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
            console.error("Lỗi khi xóa tour:", error);
        }
    };

    return (
        <table className="min-w-full divide-y divide-gray-200 mt-4">
            <thead className="bg-gray-100">
                <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">STT</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Tên Tour</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Phương tiện</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Khách tối đa</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Giá</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Thời lượng</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Mô tả</th>
                    <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 uppercase">Hành động</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {sortedTours.map((tour, index) => (
                    <tr key={tour.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{index + 1}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-blue-600 hover:underline cursor-pointer">
                            <Link to={`/dashboard/tours/${tour.id}`}>
                                {tour.tourName}
                            </Link>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{tour.transportation}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{tour.maxCustomer}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{tour.price} VND</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{tour.tourDuration}</td>
                        <td
                            className="px-4 py-2 max-w-xs truncate text-sm text-gray-700"
                            title={tour.description}
                        >
                            {tour.description}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-center">
                            <button
                                onClick={() => tour.id !== undefined && handleEdit(tour.id)}
                                className="text-blue-600 hover:text-blue-900 mr-2"
                            >
                                Sửa
                            </button>
                            <button
                                onClick={() => tour.id !== undefined && handleDelete(tour.id)}
                                className="text-red-600 hover:text-red-900"
                            >
                                Xóa
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TourTable;
