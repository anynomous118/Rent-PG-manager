
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addTenant, updateTenant, deactivateTenant } from '../store/slices/tenantSlice';
import { Tenant, UserRole } from '../types';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Phone, 
  Calendar, 
  Home as RoomIcon,
  X,
  UserPlus
} from 'lucide-react';

const TenantManagement: React.FC = () => {
  const tenants = useSelector((state: RootState) => state.tenants.list);
  const dispatch = useDispatch();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<Partial<Tenant>>({
    name: '',
    mobile: '',
    roomId: '',
    bedNumber: '',
    monthlyRent: 8500,
    depositAmount: 17000,
    joiningDate: new Date().toISOString().split('T')[0],
    isActive: true,
    role: UserRole.TENANT
  });

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.roomId.includes(searchQuery)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTenant: Tenant = {
      ...formData as Tenant,
      id: `t-${Date.now()}`,
      photo: `https://picsum.photos/seed/${formData.name}/200`
    };
    dispatch(addTenant(newTenant));
    setIsModalOpen(false);
    setFormData({
      name: '',
      mobile: '',
      roomId: '',
      bedNumber: '',
      monthlyRent: 8500,
      depositAmount: 17000,
      joiningDate: new Date().toISOString().split('T')[0],
      isActive: true,
      role: UserRole.TENANT
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name or room number..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white font-bold px-6 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-sm"
        >
          <Plus size={20} />
          Add New Tenant
        </button>
      </div>

      {/* Tenant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTenants.map(tenant => (
          <div key={tenant.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <img 
                    src={tenant.photo} 
                    alt={tenant.name} 
                    className="w-14 h-14 rounded-xl object-cover border-2 border-gray-50"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{tenant.name}</h3>
                    <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Room {tenant.roomId} / Bed {tenant.bedNumber}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-5">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Phone size={16} className="text-indigo-400" />
                  <span>+91 {tenant.mobile}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={16} className="text-indigo-400" />
                  <span>Joined {new Date(tenant.joiningDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 leading-tight">Monthly Rent</p>
                  <p className="text-md font-bold text-gray-900">₹{tenant.monthlyRent.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-gray-400 leading-tight">Security Deposit</p>
                  <p className="text-md font-bold text-gray-900">₹{tenant.depositAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-5 py-3 flex gap-2">
              <button 
                className="flex-1 bg-white border border-gray-200 text-gray-700 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-all"
                onClick={() => window.open(`https://wa.me/91${tenant.mobile}`)}
              >
                WhatsApp
              </button>
              <button className="flex-1 bg-white border border-gray-200 text-indigo-600 py-2 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-all">
                View Ledger
              </button>
            </div>
          </div>
        ))}
        {filteredTenants.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
            <UserPlus size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">No tenants found</p>
            <p className="text-sm">Try changing your search or add a new tenant</p>
          </div>
        )}
      </div>

      {/* Add Tenant Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-2xl w-full max-w-lg z-10 overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-indigo-50">
              <h2 className="text-xl font-bold text-indigo-900">Register New Tenant</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Full Name</label>
                  <input 
                    type="text" required
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-600"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Mobile Number</label>
                  <input 
                    type="tel" maxLength={10} required
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-600"
                    value={formData.mobile}
                    onChange={e => setFormData({...formData, mobile: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Room Number</label>
                  <input 
                    type="text" required
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-600"
                    value={formData.roomId}
                    onChange={e => setFormData({...formData, roomId: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Bed (optional)</label>
                  <input 
                    type="text"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-600"
                    value={formData.bedNumber}
                    onChange={e => setFormData({...formData, bedNumber: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Monthly Rent (₹)</label>
                  <input 
                    type="number" required
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-600"
                    value={formData.monthlyRent}
                    onChange={e => setFormData({...formData, monthlyRent: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Security Deposit (₹)</label>
                  <input 
                    type="number" required
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-600"
                    value={formData.depositAmount}
                    onChange={e => setFormData({...formData, depositAmount: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Joining Date</label>
                  <input 
                    type="date" required
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-600"
                    value={formData.joiningDate}
                    onChange={e => setFormData({...formData, joiningDate: e.target.value})}
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 mt-6 shadow-lg shadow-indigo-100">
                Confirm Registration
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantManagement;
