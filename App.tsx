
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Layout from './components/Layout';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import TenantManagement from './views/TenantManagement';
import RentTracking from './views/RentTracking';
import Complaints from './views/Complaints';
import PropertySetup from './views/PropertySetup';

const App: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'tenants':
        return <TenantManagement />;
      case 'rent':
        return <RentTracking />;
      case 'complaints':
        return <Complaints />;
      case 'property':
        return <PropertySetup />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
