import { useAuthStore } from '../../stores/auth.store.ts';
import ManagerSideBar from '../../components/ManagerSideBar';
import AccountantSideBar from '../../components/AccountantSideBar';
import { Header } from '../../components/Header';
import Footer from '../../components/Footer';
import { Outlet } from 'react-router-dom';
import './Dashboard.css';

const Sidebar = () => {
    const { user } = useAuthStore();

    if (user?.role === 'MANAGER') return <ManagerSideBar />;
    if (user?.role === 'ACCOUNTANT') return <AccountantSideBar />;
    return null;
};

export const Dashboard = () => (
    <div className="dashboard-layout">
        <Header />
        <div className="dashboard-content">
            <Sidebar />
            <main className="main-area">
                <Outlet />
            </main>
        </div>
        <Footer />
    </div>
);

export default Dashboard;
