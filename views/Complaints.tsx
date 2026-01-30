
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addComplaint, updateComplaintStatus } from '../store/slices/complaintSlice';
import { ComplaintStatus, ComplaintCategory, UserRole, Complaint } from '../types';
import { 
  Plus, 
  Clock, 
  CheckCircle, 
  MessageSquare, 
  Filter, 
  AlertTriangle,
  Image as ImageIcon
} from 'lucide-react';

const Complaints: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const complaints = useSelector((state: RootState) => state.complaints.list);
  const tenants = useSelector((state: RootState) => state.tenants.list);
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    category: ComplaintCategory.OTHERS,
    description: ''
  });

  const filteredComplaints = user?.role === UserRole.TENANT 
    ? complaints.filter(c => c.tenantId === user.id)
    : complaints;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const complaint: Complaint = {
      id: `c-${Date.now()}`,
      tenantId: user.id,
      category: newComplaint.category,
      description: newComplaint.description,
      status: ComplaintStatus.OPEN,
      createdAt: new Date().toISOString()
    };
    
    dispatch(addComplaint(complaint));
    setIsModalOpen(false);
    setNewComplaint({ category: ComplaintCategory.OTHERS, description: '' });
  };

  const handleStatusUpdate = (id: string, status: ComplaintStatus) => {
    dispatch(updateComplaintStatus({ id, status }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="text-indigo-600" size={24} />
          <h2 className="text-xl font-bold">Maintenance Requests</h2>
        </div>
        {user?.role === UserRole.TENANT && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100"
          >
            <Plus size={20} />
            Raise Issue
          </button>
        )}
      </div>

      {/* Complaints List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredComplaints.map(complaint => {
          const tenant = tenants.find(t => t.id === complaint.tenantId);
          return (
            <div key={complaint.id} className="bg-white rounded-2xl border shadow-sm flex flex-col">
              <div className="p-5 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                    complaint.category === ComplaintCategory.WATER ? 'bg-blue-100 text-blue-700' :
                    complaint.category === ComplaintCategory.ELECTRICITY ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {complaint.category}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                    complaint.status === ComplaintStatus.OPEN ? 'bg-red-100 text-red-600' :
                    complaint.status === ComplaintStatus.IN_PROGRESS ? 'bg-indigo-100 text-indigo-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {complaint.status.replace('_', ' ')}
                  </span>
                </div>
                
                <p className="text-gray-900 font-medium mb-2">{complaint.description}</p>
                
                <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                  <Clock size={14} />
                  <span>Raised on {new Date(complaint.createdAt).toLocaleDateString()}</span>
                </div>

                {user?.role === UserRole.OWNER && (
                  <div className="mt-4 pt-4 border-t flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-700">
                      {tenant?.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">{tenant?.name}</p>
                      <p className="text-[10px] text-gray-500">Room {tenant?.roomId}</p>
                    </div>
                  </div>
                )}
              </div>

              {user?.role === UserRole.OWNER && complaint.status !== ComplaintStatus.RESOLVED && (
                <div className="bg-gray-50 p-3 rounded-b-2xl border-t flex gap-2">
                  <button 
                    onClick={() => handleStatusUpdate(complaint.id, ComplaintStatus.IN_PROGRESS)}
                    className="flex-1 bg-white border border-gray-200 py-1.5 rounded-lg text-xs font-bold text-indigo-600 hover:bg-indigo-50"
                  >
                    Start Work
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(complaint.id, ComplaintStatus.RESOLVED)}
                    className="flex-1 bg-white border border-gray-200 py-1.5 rounded-lg text-xs font-bold text-green-600 hover:bg-green-50"
                  >
                    Resolve
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {filteredComplaints.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center text-gray-400">
            <CheckCircle size={48} className="mb-4 opacity-10" />
            <p>No complaints found</p>
          </div>
        )}
      </div>

      {/* New Complaint Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-2xl w-full max-w-md z-10 shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-indigo-50">
              <h2 className="text-xl font-bold text-indigo-900">New Complaint</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select 
                  className="w-full border rounded-xl px-4 py-2 bg-gray-50 focus:ring-2 focus:ring-indigo-600"
                  value={newComplaint.category}
                  onChange={e => setNewComplaint({...newComplaint, category: e.target.value as ComplaintCategory})}
                >
                  {Object.values(ComplaintCategory).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full border rounded-xl px-4 py-2 bg-gray-50 focus:ring-2 focus:ring-indigo-600 resize-none"
                  placeholder="Explain the issue in detail..."
                  value={newComplaint.description}
                  onChange={e => setNewComplaint({...newComplaint, description: e.target.value})}
                ></textarea>
              </div>
              <div className="bg-gray-50 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 transition-all">
                <ImageIcon size={32} className="mb-2" />
                <span className="text-xs font-semibold">Upload Photo (Optional)</span>
              </div>
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border rounded-xl font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-2 bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100"
                >
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaints;
