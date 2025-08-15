import { Customer } from '../models/customer.model';

export interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export const initialCustomerState: CustomerState = {
  customers: [],
  selectedCustomer: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0
  }
};
