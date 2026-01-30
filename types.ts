
export enum UserRole {
  OWNER = 'OWNER',
  TENANT = 'TENANT',
  CARETAKER = 'CARETAKER'
}

export enum RentStatus {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
  OVERDUE = 'OVERDUE'
}

export enum ComplaintStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED'
}

export enum ComplaintCategory {
  WATER = 'Water',
  ELECTRICITY = 'Electricity',
  CLEANING = 'Cleaning',
  WIFI = 'Wi-Fi',
  PLUMBING = 'Plumbing',
  OTHERS = 'Others'
}

export interface User {
  id: string;
  name: string;
  mobile: string;
  role: UserRole;
  photo?: string;
  roomId?: string;
  propertyId?: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  totalRooms: number;
  rentPerBed: number;
  dueDay: number; // e.g., 5th of every month
}

export interface Tenant extends User {
  roomId: string;
  bedNumber?: string;
  joiningDate: string;
  monthlyRent: number;
  depositAmount: number;
  isActive: boolean;
  idProofUrl?: string;
}

export interface RentRecord {
  id: string;
  tenantId: string;
  month: number; // 0-11
  year: number;
  amount: number;
  status: RentStatus;
  paymentDate?: string;
  paymentMethod?: 'CASH' | 'UPI' | 'TRANSFER';
}

export interface Complaint {
  id: string;
  tenantId: string;
  category: ComplaintCategory;
  description: string;
  status: ComplaintStatus;
  createdAt: string;
  photoUrl?: string;
  resolvedAt?: string;
}
