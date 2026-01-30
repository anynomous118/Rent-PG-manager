
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RentRecord, RentStatus } from '../../types';

interface RentState {
  records: RentRecord[];
}

const mockRentRecords: RentRecord[] = [
  {
    id: 'r1',
    tenantId: 't1',
    month: 4, // May
    year: 2024,
    amount: 8500,
    status: RentStatus.PAID,
    paymentDate: '2024-05-04',
    paymentMethod: 'UPI'
  },
  {
    id: 'r2',
    tenantId: 't2',
    month: 4,
    year: 2024,
    amount: 9000,
    status: RentStatus.UNPAID
  }
];

const initialState: RentState = {
  records: JSON.parse(localStorage.getItem('rent_records') || JSON.stringify(mockRentRecords)),
};

const rentSlice = createSlice({
  name: 'rent',
  initialState,
  reducers: {
    addRentRecord: (state, action: PayloadAction<RentRecord>) => {
      state.records.push(action.payload);
      localStorage.setItem('rent_records', JSON.stringify(state.records));
    },
    updateRentStatus: (state, action: PayloadAction<{ id: string; status: RentStatus; method?: 'CASH' | 'UPI' | 'TRANSFER'; date?: string }>) => {
      const record = state.records.find(r => r.id === action.payload.id);
      if (record) {
        record.status = action.payload.status;
        record.paymentMethod = action.payload.method;
        record.paymentDate = action.payload.date;
        localStorage.setItem('rent_records', JSON.stringify(state.records));
      }
    },
  },
});

export const { addRentRecord, updateRentStatus } = rentSlice.actions;
export default rentSlice.reducer;
