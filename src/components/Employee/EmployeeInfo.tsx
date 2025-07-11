import React, { useEffect, useState } from 'react';
import { getEmployeeById } from '../../services/employee';
import { Employee } from '../../utils/types';

interface EmployeeInfoProps {
    employeeId: number;
}

const EmployeeInfo: React.FC<EmployeeInfoProps> = ({ employeeId }) => {
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const data = await getEmployeeById(employeeId);
                setEmployee(data);
            } catch (err) {
                setError('Không thể tải thông tin nhân viên.');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [employeeId]);

    if (loading) return <p>Đang tải thông tin nhân viên...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!employee) return null;

    return (
        <div className="p-4 rounded shadow mt-4">
            <p><strong>Họ tên:</strong> {employee.fullname}</p>
            <p><strong>Ngày sinh:</strong> {new Date(employee.dateofbirth).toLocaleDateString()}</p>
            <p><strong>Giới tính:</strong> {employee.gender}</p>
            <p><strong>Địa chỉ:</strong> {employee.address}</p>
            <p><strong>Email:</strong> {employee.email}</p>
            <p><strong>SĐT:</strong> {employee.phonenumber}</p>
            <p><strong>Vị trí:</strong> {employee.position}</p>
            <p><strong>Phòng ban:</strong> {employee.department}</p>
        </div>
    );
};

export default EmployeeInfo;
