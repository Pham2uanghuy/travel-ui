
import { Outlet } from 'react-router-dom';
import "./Dashboard.css"
import { Header } from '../../components/Header';
import AccountantSideBar from '../../components/AccountantSideBar';
import Footer from '../../components/Footer';
export const AccountantDashboard = () => (
    <div className="dashboard-layout">
        <Header />
        <div className="dashboard-content">
            <AccountantSideBar />
            <main className="main-area">
                <Outlet /> { }
            </main>
        </div>
        <Footer />
    </div>
);