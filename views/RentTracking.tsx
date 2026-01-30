
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { updateRentStatus, addRentRecord } from '../store/slices/rentSlice';
import { RentStatus, RentRecord } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  IndianRupee, 
  Share2,
  FileText,
  Search,
  Filter
} from 'lucide-react';

const RentTracking: React.FC = () => {
  const tenants = useSelector((state: RootState) => state.tenants.list.filter(t => t.isActive));
  const rentRecords = useSelector((state: RootState) => state.rent.records);
  const property = useSelector((state: RootState) => state.property);
  const dispatch = useDispatch();

  const [monthFilter, setMonthFilter] = useState(new Date().getMonth());
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleRecordPayment = (tenantId: string, amount: number) => {
    // Check if record exists
    const existing = rentRecords.find(r => r.tenantId === tenantId && r.month === monthFilter && r.year === yearFilter);
    
    if (existing) {
      dispatch(updateRentStatus({ 
        id: existing.id, 
        status: RentStatus.PAID, 
        method: 'UPI', 
        date: new Date().toISOString().split('T')[0] 
      }));
    } else {
      const newRecord: RentRecord = {
        id: `r-${Date.now()}`,
        tenantId,
        month: monthFilter,
        year: yearFilter,
        amount,
        status: RentStatus.PAID,
        paymentMethod: 'UPI',
        paymentDate: new Date().toISOString().split('T')[0]
      };
      dispatch(addRentRecord(newRecord));
    }
  };

  const filteredTenants = tenants.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-wrap gap-3">
          <select 
            className="border rounded-xl px-4 py-2 bg-gray-50 focus:ring-2 focus:ring-indigo-600"
            value={monthFilter}
            onChange={(e) => setMonthFilter(parseInt(e.target.value))}
          >
            {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <select 
            className="border rounded-xl px-4 py-2 bg-gray-50 focus:ring-2 focus:ring-indigo-600"
            value={yearFilter}
            onChange={(e) => setYearFilter(parseInt(e.target.value))}
          >
            {[2023, 2024, 2025].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search tenant..."
            className="pl-10 pr-4 py-2 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-600"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Rent List */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Tenant</th>
              <th className="px-6 py-4">Room</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredTenants.map(tenant => {
              const record = rentRecords.find(r => r.tenantId === tenant.id && r.month === monthFilter && r.year === yearFilter);
              const status = record?.status || RentStatus.UNPAID;

              return (
                <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                        {tenant.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-gray-900">{tenant.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {tenant.roomId}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    ₹{tenant.monthlyRent.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      status === RentStatus.PAID ? 'bg-green-100 text-green-700' : 
                      status === RentStatus.OVERDUE ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {status === RentStatus.PAID ? <CheckCircle2 size={14} /> : status === RentStatus.OVERDUE ? <XCircle size={14} /> : <Clock size={14} />}
                      {status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {status !== RentStatus.PAID ? (
                        <>
                          <button 
                            onClick={() => handleRecordPayment(tenant.id, tenant.monthlyRent)}
                            className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all"
                          >
                            Mark Paid
                          </button>
                          <button 
                            onClick={() => window.open(`https://wa.me/91${tenant.mobile}?text=Hi ${tenant.name}, your rent of ₹${tenant.monthlyRent} for ${months[monthFilter]} is pending. Please pay by the ${property.dueDay}th.`)}
                            className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-200 transition-all"
                          >
                            Remind
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="text-gray-400 hover:text-indigo-600 p-2" title="View Receipt">
                            <FileText size={18} />
                          </button>
                          <button className="text-gray-400 hover:text-indigo-600 p-2" title="Share Status">
                            <Share2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredTenants.length === 0 && (
          <div className="py-12 text-center text-gray-400 italic">No tenants found matching criteria</div>
        )}
      </div>
    </div>
  );
};

export default RentTracking;
