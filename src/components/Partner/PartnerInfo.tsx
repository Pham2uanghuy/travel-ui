import React, { useEffect, useState } from 'react';
import { Partner } from '../../utils/types';
import { getPartnerById } from '../../services/partner';

interface PartnerInfoProps {
    partnerId: number;
}

const PartnerInfo: React.FC<PartnerInfoProps> = ({ partnerId }) => {
    const [partner, setPartner] = useState<Partner | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPartner = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getPartnerById(partnerId);
                setPartner(data);
            } catch (err) {
                setError('Lỗi khi tải thông tin đối tác.');
            } finally {
                setLoading(false);
            }
        };

        fetchPartner();
    }, [partnerId]);

    if (loading) return <p>Đang tải thông tin đối tác...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!partner) return null;

    return (
        <div className=" p-4 rounded shadow mt-4">
            <p><strong>Tên đối tác:</strong> {partner.name}</p>
            <p><strong>Địa chỉ:</strong> {partner.address}</p>
            <p><strong>Email:</strong> {partner.email}</p>
            <p><strong>Số điện thoại:</strong> {partner.phonenumber}</p>
        </div>
    );
};

export default PartnerInfo;
