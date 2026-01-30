
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Complaint, ComplaintStatus, ComplaintCategory } from '../../types';

interface ComplaintState {
  list: Complaint[];
}

const mockComplaints: Complaint[] = [
  {
    id: 'c1',
    tenantId: 't1',
    category: ComplaintCategory.WIFI,
    description: 'Wi-Fi is not working in room 101 since morning.',
    status: ComplaintStatus.OPEN,
    createdAt: new Date().toISOString()
  }
];

const initialState: ComplaintState = {
  list: JSON.parse(localStorage.getItem('complaints') || JSON.stringify(mockComplaints)),
};

const complaintSlice = createSlice({
  name: 'complaints',
  initialState,
  reducers: {
    addComplaint: (state, action: PayloadAction<Complaint>) => {
      state.list.unshift(action.payload);
      localStorage.setItem('complaints', JSON.stringify(state.list));
    },
    updateComplaintStatus: (state, action: PayloadAction<{ id: string; status: ComplaintStatus }>) => {
      const complaint = state.list.find(c => c.id === action.payload.id);
      if (complaint) {
        complaint.status = action.payload.status;
        if (action.payload.status === ComplaintStatus.RESOLVED) {
          complaint.resolvedAt = new Date().toISOString();
        }
        localStorage.setItem('complaints', JSON.stringify(state.list));
      }
    },
  },
});

export const { addComplaint, updateComplaintStatus } = complaintSlice.actions;
export default complaintSlice.reducer;
