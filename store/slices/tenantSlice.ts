
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tenant, UserRole } from '../../types';

interface TenantState {
  list: Tenant[];
}

const mockTenants: Tenant[] = [
  {
    id: 't1',
    name: 'Rahul Sharma',
    mobile: '9876543210',
    role: UserRole.TENANT,
    roomId: '101',
    bedNumber: 'A',
    joiningDate: '2023-10-01',
    monthlyRent: 8500,
    depositAmount: 17000,
    isActive: true,
    photo: 'https://picsum.photos/seed/rahul/200'
  },
  {
    id: 't2',
    name: 'Amit Patel',
    mobile: '9988776655',
    role: UserRole.TENANT,
    roomId: '102',
    bedNumber: 'B',
    joiningDate: '2023-11-15',
    monthlyRent: 9000,
    depositAmount: 18000,
    isActive: true,
    photo: 'https://picsum.photos/seed/amit/200'
  }
];

const initialState: TenantState = {
  list: JSON.parse(localStorage.getItem('tenants') || JSON.stringify(mockTenants)),
};

const tenantSlice = createSlice({
  name: 'tenants',
  initialState,
  reducers: {
    addTenant: (state, action: PayloadAction<Tenant>) => {
      state.list.push(action.payload);
      localStorage.setItem('tenants', JSON.stringify(state.list));
    },
    updateTenant: (state, action: PayloadAction<Tenant>) => {
      const index = state.list.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
        localStorage.setItem('tenants', JSON.stringify(state.list));
      }
    },
    deactivateTenant: (state, action: PayloadAction<string>) => {
      const tenant = state.list.find(t => t.id === action.payload);
      if (tenant) {
        tenant.isActive = false;
        localStorage.setItem('tenants', JSON.stringify(state.list));
      }
    },
  },
});

export const { addTenant, updateTenant, deactivateTenant } = tenantSlice.actions;
export default tenantSlice.reducer;
