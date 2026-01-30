
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Property } from '../../types';

const defaultProperty: Property = {
  id: 'prop-1',
  name: 'Om Sai PG for Gents',
  address: 'HSR Layout Sector 2, Bangalore, Karnataka',
  totalRooms: 12,
  rentPerBed: 8500,
  dueDay: 5,
};

const initialState: Property = JSON.parse(localStorage.getItem('property') || JSON.stringify(defaultProperty));

const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    updateProperty: (state, action: PayloadAction<Property>) => {
      const newState = { ...state, ...action.payload };
      localStorage.setItem('property', JSON.stringify(newState));
      return newState;
    },
  },
});

export const { updateProperty } = propertySlice.actions;
export default propertySlice.reducer;
