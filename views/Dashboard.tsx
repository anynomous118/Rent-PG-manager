
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { UserRole, RentStatus, ComplaintStatus } from '../types';
// Added CreditCard and MessageSquare to the imports
import { 
  Users, 
  IndianRupee, 
  AlertCircle, 
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  CreditCard,
  MessageSquare
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const tenants = useSelector((state: RootState) => state.tenants.list);
  const rentRecords = useSelector((state: RootState) => state.rent.records);
  const complaints = useSelector((state: RootState) => state.complaints.list);
  const property = useSelector((state: RootState) => state.property);

  const activeTenants = tenants.filter(t => t.isActive);
  const pendingComplaints = complaints.filter(c => c.status !== ComplaintStatus.RESOLVED);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyRentStatus = tenants.map(t => {
    const record = rentRecords.find(r => r.tenantId === t.id && r.month === currentMonth && r.year === currentYear);
    return {
      name: t.name,
      status: record?.status || RentStatus.UNPAID,
      amount: t.monthlyRent
    };
  });

  const totalCollected = rentRecords
    .filter(r => r.status === RentStatus.PAID && r.month === currentMonth && r.year === currentYear)
    .reduce((sum, r) => sum + r.amount, 0);

  const totalDue = monthlyRentStatus
    .filter(s => s.status !== RentStatus.PAID)
    .reduce((sum, s) => sum + s.amount, 0);

  const chartData = [
    { name: 'Paid', value: totalCollected, color: '#4f46e5' },
    { name: 'Pending', value: totalDue, color: '#f59e0b' },
  ];

  if (user?.role === UserRole.TENANT) {
    const myRentStatus = rentRecords.find(r => r.tenantId === user.id && r.month === currentMonth && r.year === currentYear);
    const myComplaints = complaints.filter(c => c.tenantId === user.id);

    return (
      <div className="space-y-6">
        <div className="bg-indigo-700 rounded-2xl p-6 text-white shadow-lg">
          <h2 className="text-2xl font-bold">Hello, {user.name}!</h2>
          <p className="opacity-90">Welcome to {property.name}</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 flex-1 min-w-[140px]">
              <p className="text-sm opacity-80 mb-1">Room No</p>
              <p className="text-xl font-bold">{user.roomId || 'N/A'}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 flex-1 min-w-[140px]">
              <p className="text-sm opacity-80 mb-1">Monthly Rent</p>
              <p className="text-xl font-bold">₹{activeTenants.find(t => t.id === user.id)?.monthlyRent.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <CreditCard className="text-indigo-600" size={20} />
              Rent Status
            </h3>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border">
              <div>
                <p className="text-sm text-gray-500">Current Month</p>
                <p className="text-lg font-bold">{new Date().toLocaleString('default', { month: 'long' })} {currentYear}</p>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                myRentStatus?.status === RentStatus.PAID ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {myRentStatus?.status || 'UNPAID'}
              </span>
            </div>
            {myRentStatus?.status !== RentStatus.PAID && (
              <button className="w-full mt-4 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all">
                Pay Rent Now
              </button>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <MessageSquare className="text-indigo-600" size={20} />
              Recent Complaints
            </h3>
            <div className="space-y-3">
              {myComplaints.slice(0, 3).map(c => (
                <div key={c.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{c.category}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[150px]">{c.description}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    c.status === ComplaintStatus.OPEN ? 'bg-red-100 text-red-600' :
                    c.status === ComplaintStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {c.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
              {myComplaints.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No complaints raised yet</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Owner Dashboard
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Tenants', value: activeTenants.length, icon: Users, color: 'indigo' },
          { label: 'Collection (Month)', value: `₹${totalCollected.toLocaleString()}`, icon: IndianRupee, color: 'green' },
          { label: 'Pending Rent', value: `₹${totalDue.toLocaleString()}`, icon: Clock, color: 'amber' },
          { label: 'Complaints', value: pendingComplaints.length, icon: AlertCircle, color: 'red' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center text-${stat.color}-600`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="text-indigo-600" size={20} />
              Monthly Collection Summary
            </h3>
            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Current Month</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="text-lg font-bold mb-4">Rent Delinquents</h3>
          <div className="space-y-4">
            {monthlyRentStatus
              .filter(s => s.status !== RentStatus.PAID)
              .slice(0, 5)
              .map((tenant, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                      {tenant.name.charAt(0)}
                    </div>
                    <p className="text-sm font-medium">{tenant.name}</p>
                  </div>
                  <p className="text-sm font-bold text-red-600">₹{tenant.amount.toLocaleString()}</p>
                </div>
              ))}
            {monthlyRentStatus.every(s => s.status === RentStatus.PAID) && (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="text-green-500" size={24} />
                </div>
                <p className="text-sm text-gray-500">All rents collected!</p>
              </div>
            )}
          </div>
          <button className="w-full mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
            View All Records
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
