
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { updateProperty } from '../store/slices/propertySlice';
// Added CheckCircle to the imports
import { Home, MapPin, CreditCard, Calendar, Save, CheckCircle } from 'lucide-react';

const PropertySetup: React.FC = () => {
  const property = useSelector((state: RootState) => state.property);
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState(property);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateProperty(formData));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Property Configuration</h2>
          <p className="text-gray-500">Update your PG details and rent policies</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Home size={20} />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">PG / Property Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-white border rounded-lg px-3 py-2 font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Address</label>
                  <textarea 
                    className="w-full bg-white border rounded-lg px-3 py-2 font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
                    rows={2}
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                  <CreditCard size={20} />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Standard Rent (₹)</label>
                  <input 
                    type="number" 
                    className="w-full bg-white border rounded-lg px-3 py-2 font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
                    value={formData.rentPerBed}
                    onChange={e => setFormData({...formData, rentPerBed: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                  <Calendar size={20} />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Rent Due Date</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Every month on</span>
                    <select 
                      className="bg-white border rounded-lg px-2 py-1 font-bold focus:ring-2 focus:ring-indigo-600 outline-none"
                      value={formData.dueDay}
                      onChange={e => setFormData({...formData, dueDay: Number(e.target.value)})}
                    >
                      {[1,2,3,4,5,6,7,8,9,10].map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
              isSaved ? 'bg-green-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
            }`}
          >
            {isSaved ? (
              <>
                <CheckCircle size={20} />
                Changes Saved!
              </>
            ) : (
              <>
                <Save size={20} />
                Save Settings
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PropertySetup;
