import React, { useEffect, useState } from 'react';
import { createPartnerPayment } from '../../services/partnerPayment';
import { getActiveContracts } from '../../services/contract';
import { getAllPartners } from '../../services/partner';
import { useNavigate } from 'react-router-dom';
import { PartnerPayment, Contract, Partner } from '../../utils/types';
import PartnerInfo from '../../components/Partner/PartnerInfo';
import TourServiceInfo from '../../components/TourService/tourservice';
import EmployeeInfo from '../../components/Employee/EmployeeInfo';

const AddPartnerPayment: React.FC = () => {
  const [form, setForm] = useState<PartnerPayment>({
    contractId: 0,
    paymentMethod: '',
    paymentAmount: 0,
  });

  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState<number | null>(null);

  const [allContracts, setAllContracts] = useState<Contract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  const navigate = useNavigate();

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const employeeId = user?.id ?? 0;
  const role = user?.role ?? '';

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [contractData, partnerData] = await Promise.all([
          getActiveContracts(),
          getAllPartners()
        ]);
        setAllContracts(contractData);
        setPartners(partnerData);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedPartnerId !== null) {
      const filtered = allContracts.filter(c => c.partnerId === selectedPartnerId);
      setFilteredContracts(filtered);
    } else {
      setFilteredContracts([]);
    }
  }, [selectedPartnerId, allContracts]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedValue = ['paymentAmount', 'contractId'].includes(name) ? Number(value) : value;

    setForm(prev => ({
      ...prev,
      [name]: updatedValue,
    }));

    if (name === 'contractId') {
      const selected = filteredContracts.find(c => c.id === Number(value));
      setSelectedContract(selected || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createPartnerPayment(form, employeeId);
      alert('Tạo thanh toán thành công');
      navigate('/dashboard/partnerpayment');
    } catch (error: any) {
      if (error.response) {
        alert('Lỗi khi tạo thanh toán:\n' + JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
        alert('Không kết nối được với server.');
      } else {
        alert('Lỗi không xác định: ' + error.message);
      }
    }
  };

  if (role !== 'ACCOUNTANT') {
    return <div className="p-6 text-red-600">Bạn không có quyền tạo thanh toán mới.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tạo thanh toán cho đối tác</h1>

      {/* Chọn đối tác */}
      <div className="mb-4">
        <label className="block mb-1">Chọn đối tác</label>
        <select
          value={selectedPartnerId ?? ''}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedPartnerId(value ? Number(value) : null);
            setSelectedContract(null);
            setForm({ ...form, contractId: 0 });
          }}
          className="w-full border px-2 py-1"
        >
          <option value="">-- Chọn đối tác --</option>
          {partners.map(p => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Chọn hợp đồng của đối tác đã chọn */}
      {selectedPartnerId && (
        <div className="mb-4">
          <label className="block mb-1">Chọn hợp đồng</label>
          <select
            name="contractId"
            value={form.contractId}
            onChange={handleChange}
            className="w-full border px-2 py-1"
            required
          >
            <option value="">-- Chọn hợp đồng --</option>
            {filteredContracts.map((contract) => (
              <option key={contract.id} value={contract.id}>
                Hợp đồng #{contract.id} - {contract.paymentStatus}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Thông tin hợp đồng */}
      {selectedContract && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <h2 className="font-semibold mb-2">Chi tiết hợp đồng</h2>
          <ul className="list-disc ml-5 space-y-1 text-sm">
            <li><strong>ID:</strong> {selectedContract.id}</li>
            <li><strong>Payment Status:</strong> {selectedContract.paymentStatus}</li>
            <li><strong>Ngày ký:</strong> {selectedContract.signDate}</li>
            <li><strong>Ngày hết hạn:</strong> {selectedContract.expirationDate}</li>
            <li><strong>Số tiền:</strong> {selectedContract.amount.toLocaleString()}</li>
          </ul>

          <div className="mt-4">
            <p className="font-semibold mb-1">Thông tin đối tác:</p>
            <PartnerInfo partnerId={selectedContract.partnerId} />
          </div>
          <div className="mt-4">
            <p className="font-semibold mb-1">Dịch vụ tour:</p>
            <TourServiceInfo tourServiceId={selectedContract.serviceId} />
          </div>
          <div className="mt-4">
            <p className="font-semibold mb-1">Nhân viên ký hợp đồng:</p>
            <EmployeeInfo employeeId={selectedContract.employeeId} />
          </div>
        </div>
      )}

      {/* Thông tin thanh toán */}
      {selectedContract && (
        <>
          <div className="mb-4 mt-6">
            <label className="block mb-1">Phương thức thanh toán</label>
            <select
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
              className="w-full border px-2 py-1"
              required
            >
              <option value="">Chọn phương thức</option>
              <option value="CASH">Tiền mặt</option>
              <option value="BANK_TRANSFER">Chuyển khoản</option>
              <option value="CREDIT_CARD">Thẻ tín dụng</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Số tiền</label>
            <input
              type="number"
              name="paymentAmount"
              value={form.paymentAmount}
              onChange={handleChange}
              className="w-full border px-2 py-1"
              required
              min={0}
            />
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Lưu thanh toán
          </button>
        </>
      )}
    </div>
  );
};

export default AddPartnerPayment;
