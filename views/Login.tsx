
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import { UserRole, User } from '../types';
import { Phone, ArrowRight, ShieldCheck } from 'lucide-react';

const Login: React.FC = () => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const dispatch = useDispatch();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length === 10) {
      setStep('otp');
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '1234') {
      // Mock Login Logic
      let mockUser: User;
      if (mobile === '9999999999') {
        mockUser = { id: 'o1', name: 'Rajesh Kumar', mobile, role: UserRole.OWNER };
      } else {
        mockUser = { id: 't1', name: 'Rahul Sharma', mobile, role: UserRole.TENANT, roomId: '101' };
      }
      dispatch(loginSuccess(mockUser));
    } else {
      alert('Invalid OTP. Use 1234');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel - Branding */}
      <div className="md:w-1/2 bg-indigo-700 flex flex-col justify-center items-center text-white p-12">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl">
            <ShieldCheck className="text-indigo-700" size={48} />
          </div>
          <h1 className="text-4xl font-extrabold mb-4">BharatRent</h1>
          <p className="text-xl text-indigo-100 mb-8">
            The easiest way to manage your PG or rental property in India.
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold">10k+</p>
              <p className="text-xs text-indigo-200">Properties</p>
            </div>
            <div>
              <p className="text-3xl font-bold">50k+</p>
              <p className="text-xs text-indigo-200">Tenants</p>
            </div>
            <div>
              <p className="text-3xl font-bold">4.8★</p>
              <p className="text-xs text-indigo-200">Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="md:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-500 mt-2">Login to manage your property</p>
          </div>

          {step === 'mobile' ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <span className="text-sm font-semibold">+91</span>
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                    placeholder="9876543210"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">Enter 9999999999 for Owner demo</p>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group"
              >
                Send OTP
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter 4-digit OTP</label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="block w-full text-center text-3xl tracking-[1em] py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  placeholder="0000"
                />
                <p className="text-sm text-center text-gray-500 mt-4">
                  Didn't receive? <button type="button" className="text-indigo-600 font-semibold" onClick={() => setStep('mobile')}>Resend</button>
                </p>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-indigo-700 transition-all"
              >
                Verify & Login
              </button>
              <p className="text-xs text-center text-gray-400">Use 1234 for demo</p>
            </form>
          )}

          <div className="mt-12 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              New owner? <a href="#" className="text-indigo-600 font-semibold">Register your PG</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
