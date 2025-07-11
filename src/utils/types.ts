export interface Partner {
    id: number;
    name: string;
    address: string;
    email: string;
    phonenumber: string;
}

export interface Destination {
    id: number;
    name: string;
    location: string;
}

export interface Activity {
    id: number;
    name: string;
    description: string;
    time: string;
}

export interface TourService {
    id: number;
    name: string;
    type: string;
    price: number;
    partnerId: number;
}
export interface ActivityOnTour {
    id: number;
    tourId?: number;       // tour liên kết qua id
    activityId: number;
}
export interface DestinationOnTour {
    id: number;
    tourId?: number;       // tour liên kết qua id
    destinationId: number;
}
export interface ServiceOnTour {
    id: number;
    tourId?: number;       // tour liên kết qua id
    serviceId: number;
}
export interface Tour {
    id?: number;
    tourName: string;
    transportation: string;
    maxCustomer: number;
    description: string;
    price: number;
    tourDuration: string;
    destinations: Destination[];
    activities: Activity[];
    tourServices: TourService[];
}

export interface Transaction {
    id: number;
    amount: number;
    method: string;
    date: string;
    tax: number;
    discount: number;
    customerId: number;
    employeeId: number;
    tourBookingId: number;
}

export interface RevenueDetail {
    month: number;
    transactionCount: number;
    customerCount: number;
    transactions: Transaction[];
    totalRevenue: number;
}

export interface User {
    id: number;
    email: string;
    role: string;
}


export type PaymentStatus = 'DRAFT' | 'APPROVED' | 'PAID';

export interface PartnerPayment {
    id?: number;
    contractId: number;
    paymentMethod: string;
    paymentAmount: number;
    status?: PaymentStatus;
    createdByEmployeeId?: number;
    approvedByEmployeeId?: number;
    paidByEmployeeId?: number;

    createdAt?: string;
    approvedAt?: string;
    paidAt?: string;
}

export interface Contract {
    id: number;
    serviceId: number;
    partnerId: number;
    paymentStatus: string;
    signDate: string;        // Sử dụng ISO string (YYYY-MM-DD)
    expirationDate: string;  // ISO string
    amount: number;
    employeeId: number;
}

export interface Employee {
    id: number;
    fullname: string;
    dateofbirth: string; // ISO string, ví dụ: "1990-05-14T17:00:00.000+00:00"
    gender: string;
    address: string;
    email: string;
    phonenumber: string;
    position: string;
    department: string;
}

export interface NotificationMessage {
    message: string;
    timestamp: string;
    sender: string;
}


export interface Customer {
    id?: number; // Dấu ? nghĩa là có thể không có (ví dụ khi tạo mới)
    fullname: string;
    email: string;
    phone?: string;
    address?: string;
    createdAt?: string; // Có thể dùng kiểu Date nếu bạn muốn xử lý ngày
    updatedAt?: string;
}