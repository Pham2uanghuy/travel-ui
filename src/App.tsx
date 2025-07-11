import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import TourMagementPage from './pages/tour/TourManagementPage';
import AddTourPage from './pages/tour/AddTourPage';
import TourDetailPage from './pages/tour/TourDetailPage';
import RevenuePage from './pages/revenue/RevenuePage';
import RevenueDetailPage from './pages/revenue/RevenueDetailPage';
import EditTour from './pages/tour/EditTourPage';
import { ToastContainer } from 'react-toastify';
import { useAuthStore } from './stores/auth.store.ts';
import Dashboard from './pages/dashboard/DashBoard.tsx';
import ManagerPaymentsPage from './pages/partnerPayment/ManagerPaymentPage.tsx';
import AccountantPaymentsPage from './pages/partnerPayment/AccountantPaymentPage.tsx';
import AddPartnerPaymentPage from './pages/partnerPayment/AddPartnerPaymentPage.tsx';
import ContractDetailsPage from './pages/contract/ContractDetailsPage.tsx';


function App() {
    const { user, getSession } = useAuthStore();

    useEffect(() => {
        getSession();
    }, [getSession]);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />}>
                        {user?.role === 'MANAGER' && (
                            <>
                                <Route path="manage-tours" element={<TourMagementPage />} />
                                <Route path="add-tour" element={<AddTourPage />} />
                                <Route path="tours/:id" element={<TourDetailPage />} />
                                <Route path="tours/edit/:id" element={<EditTour />} />
                                <Route path="revenue" element={<RevenuePage />} />
                                <Route path="revenue/detail/:year/:month" element={<RevenueDetailPage />} />
                                <Route path="partnerpayment" element={<ManagerPaymentsPage />} />
                                <Route path="contract-detail/:id" element={<ContractDetailsPage />} />
                            </>
                        )}

                        {(user?.role === 'ACCOUNTANT') && (
                            <>
                                <Route path="partnerpayment" element={<AccountantPaymentsPage />} />
                                <Route path="add-partner-payment" element={<AddPartnerPaymentPage />} />
                                <Route path="contract-detail/:id" element={<ContractDetailsPage />} />
                            </>
                        )}
                    </Route>

                </Route>

                <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>

            <ToastContainer position="top-right" autoClose={3000} />
        </Router>
    );
}

export default App;
