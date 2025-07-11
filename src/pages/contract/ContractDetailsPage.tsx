import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getContractById } from '../../services/contract';
import { Contract } from '../../utils/types';
import TourServiceInfo from '../../components/TourService/tourservice';  // Đường dẫn đúng tùy dự án
import PartnerInfo from '../../components/Partner/PartnerInfo';
import EmployeeInfo from '../../components/Employee/EmployeeInfo';

const ContractDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [contract, setContract] = useState<Contract | null>(null);

    useEffect(() => {
        const fetchContract = async () => {
            try {
                if (id) {
                    const data = await getContractById(Number(id));
                    setContract(data);
                }
            } catch (error) {
                alert('Không tìm thấy hợp đồng');
                console.error(error);
            }
        };

        fetchContract();
    }, [id]);

    if (!contract) return <div className="p-6">Đang tải dữ liệu hợp đồng...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Chi tiết hợp đồng #{contract.id}</h1>
            <ul className="list-disc pl-6 space-y-2">
                <li>Thông tin đối tác</li>
                <PartnerInfo partnerId={contract.partnerId} />
                <li>Thông tin dịch vụ Tour</li>
                <TourServiceInfo tourServiceId={contract.serviceId} />
                <li>Thông tin nhân viên kí hợp đồng</li>
                <EmployeeInfo employeeId={contract.employeeId} />
                <li><strong>Payment Status:</strong> {contract.paymentStatus}</li>
                <li><strong>Ngày ký:</strong> {contract.signDate}</li>
                <li><strong>Ngày hết hạn:</strong> {contract.expirationDate}</li>
                <li><strong>Số tiền:</strong> {contract.amount.toLocaleString()}</li>
            </ul>


        </div>
    );
};

export default ContractDetailsPage;
