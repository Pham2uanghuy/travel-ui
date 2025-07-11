import React, { useEffect, useState } from 'react';
import { PartnerPayment, Employee } from '../../utils/types';
import { getAllPartnerPayments, payPartnerPayment } from '../../services/partnerPayment';
import { getAllEmployees } from '../../services/employee';
import { useNavigate } from 'react-router-dom';

const AccountantPaymentsPage: React.FC = () => {
    const [payments, setPayments] = useState<PartnerPayment[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const navigate = useNavigate();

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const employeeId = user?.id ?? 0;
    const role = user?.role ?? '';

    useEffect(() => {
        if (role !== 'ACCOUNTANT') {
            alert('Bạn không có quyền truy cập trang này.');
            navigate('/');
            return;
        }

        const fetchData = async () => {
            try {
                const [paymentResult, employeeResult] = await Promise.all([
                    getAllPartnerPayments(),
                    getAllEmployees()
                ]);
                setPayments(paymentResult);
                setEmployees(employeeResult);
            } catch (error) {
                alert('Lỗi khi tải dữ liệu');
                console.error(error);
            }
        };

        fetchData();
    }, [role, navigate]);

    const handlePay = async (id: number) => {
        if (!employeeId) {
            alert('Không tìm thấy thông tin nhân viên. Vui lòng đăng nhập lại.');
            return;
        }

        try {
            await payPartnerPayment(id, employeeId);
            alert('Thanh toán thành công');
            const result = await getAllPartnerPayments();
            setPayments(result);
        } catch (error) {
            alert('Lỗi khi thanh toán');
            console.error(error);
        }
    };

    const getEmployeeName = (id?: number): string => {
        if (!id) return '--';
        const emp = employees.find(e => e.id === id);
        return emp ? emp.fullname : `ID ${id}`;
    };
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '--';
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' });
    };
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Quản lý thanh toán - Kế toán</h1>
            <button
                className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => navigate('/dashboard/add-partner-payment')}
            >
                Thêm payment mới
            </button>

            <table className="w-full border border-collapse border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-2 py-1">ID</th>
                        <th className="border px-2 py-1">Hợp đồng</th>
                        <th className="border px-2 py-1">Phương thức</th>
                        <th className="border px-2 py-1">Số tiền</th>
                        <th className="border px-2 py-1">Trạng thái</th>
                        <th className="border px-2 py-1">Ngày tạo</th>
                        <th className="border px-2 py-1">Ngày duyệt</th>
                        <th className="border px-2 py-1">Ngày thanh toán</th>
                        <th className="border px-2 py-1">Người tạo</th>
                        <th className="border px-2 py-1">Người duyệt</th>
                        <th className="border px-2 py-1">Người thanh toán</th>
                        <th className="border px-2 py-1">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((p) => (
                        <tr key={p.id} className="border-t">
                            <td className="border px-2 py-1">{p.id}</td>
                            <td
                                className="border px-2 py-1 text-blue-600 hover:underline cursor-pointer"
                                onClick={() => navigate(`/dashboard/contract-detail/${p.contractId}`)}
                            >
                                {p.contractId}
                            </td>
                            <td className="border px-2 py-1">{p.paymentMethod}</td>
                            <td className="border px-2 py-1">{p.paymentAmount.toLocaleString()}</td>
                            <td className="border px-2 py-1">{p.status || 'DRAFT'}</td>
                            <td className="border px-2 py-1">{formatDate(p.createdAt)}</td>
                            <td className="border px-2 py-1">{formatDate(p.approvedAt)}</td>
                            <td className="border px-2 py-1">{formatDate(p.paidAt)}</td>
                            <td className="border px-2 py-1">{getEmployeeName(p.createdByEmployeeId)}</td>
                            <td className="border px-2 py-1">{getEmployeeName(p.approvedByEmployeeId)}</td>
                            <td className="border px-2 py-1">{getEmployeeName(p.paidByEmployeeId)}</td>
                            <td className="border px-2 py-1">
                                {p.status === 'APPROVED' && p.id ? (
                                    <button
                                        className="bg-green-600 text-white px-2 py-1 rounded"
                                        onClick={() => handlePay(p.id!)}
                                    >
                                        Thanh toán
                                    </button>
                                ) : (
                                    <span>--</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AccountantPaymentsPage;
