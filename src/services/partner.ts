

import { api } from './api';  // api đã được config baseURL, headers, ...
import { Partner } from '../utils/types';

export const getAllPartners = async (): Promise<Partner[]> => {
    const response = await api.get<Partner[]>('/partners');
    return response.data;
};

export const getPartnerById = async (id: number): Promise<Partner> => {
    const response = await api.get<Partner>(`/partners/${id}`);
    return response.data;
};

export const addPartner = async (partner: Partner): Promise<Partner> => {
    const response = await api.post<Partner>('/partners', partner);
    return response.data;
};

export const updatePartner = async (id: number, partner: Partial<Partner>): Promise<Partner> => {
    // dùng PATCH để cập nhật partner
    const response = await api.patch<Partner>(`/partners/${id}`, partner);
    return response.data;
};

export const deletePartner = async (id: number): Promise<string> => {
    const response = await api.delete<string>(`/partners/${id}`);
    return response.data;
};
