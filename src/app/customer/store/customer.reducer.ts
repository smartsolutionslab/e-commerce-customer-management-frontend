import { createReducer, on } from '@ngrx/store';
import { CustomerState, initialCustomerState } from './customer.state';
import * as CustomerActions from './customer.actions';

export const customerReducer = createReducer(
  initialCustomerState,

  // Load Customers
  on(CustomerActions.loadCustomers, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CustomerActions.loadCustomersSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    customers: response.customers,
    pagination: {
      currentPage: response.page,
      pageSize: response.pageSize,
      totalCount: response.totalCount,
      totalPages: Math.ceil(response.totalCount / response.pageSize)
    }
  })),

  on(CustomerActions.loadCustomersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Customer
  on(CustomerActions.loadCustomer, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CustomerActions.loadCustomerSuccess, (state, { customer }) => ({
    ...state,
    loading: false,
    selectedCustomer: customer
  })),

  on(CustomerActions.loadCustomerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Create Customer
  on(CustomerActions.createCustomer, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CustomerActions.createCustomerSuccess, (state) => ({
    ...state,
    loading: false
  })),

  on(CustomerActions.createCustomerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update Customer
  on(CustomerActions.updateCustomer, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CustomerActions.updateCustomerSuccess, (state) => ({
    ...state,
    loading: false
  })),

  on(CustomerActions.updateCustomerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Delete Customer
  on(CustomerActions.deleteCustomer, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CustomerActions.deleteCustomerSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    customers: state.customers.filter(customer => customer.id !== id)
  })),

  on(CustomerActions.deleteCustomerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Clear Selected Customer
  on(CustomerActions.clearSelectedCustomer, (state) => ({
    ...state,
    selectedCustomer: null
  }))
);
