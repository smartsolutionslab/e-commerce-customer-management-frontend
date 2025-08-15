import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CustomerState } from './customer.state';

export const selectCustomerState = createFeatureSelector<CustomerState>('customers');

export const selectAllCustomers = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.customers
);

export const selectSelectedCustomer = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.selectedCustomer
);

export const selectCustomersLoading = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.loading
);

export const selectCustomersError = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.error
);

export const selectCurrentPage = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.pagination.currentPage
);

export const selectPageSize = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.pagination.pageSize
);

export const selectTotalCount = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.pagination.totalCount
);

export const selectTotalPages = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.pagination.totalPages
);

export const selectCustomerById = (id: string) => createSelector(
  selectAllCustomers,
  (customers) => customers.find(customer => customer.id === id)
);
