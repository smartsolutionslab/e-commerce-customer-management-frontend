import { createAction, props } from '@ngrx/store';
import { Customer, CreateCustomerRequest, UpdateCustomerRequest, CustomersResponse } from '../models/customer.model';

// Load Customers
export const loadCustomers = createAction(
  '[Customer] Load Customers',
  props<{ page: number; pageSize: number; search?: string }>()
);

export const loadCustomersSuccess = createAction(
  '[Customer] Load Customers Success',
  props<{ response: CustomersResponse }>()
);

export const loadCustomersFailure = createAction(
  '[Customer] Load Customers Failure',
  props<{ error: string }>()
);

// Load Customer
export const loadCustomer = createAction(
  '[Customer] Load Customer',
  props<{ id: string }>()
);

export const loadCustomerSuccess = createAction(
  '[Customer] Load Customer Success',
  props<{ customer: Customer }>()
);

export const loadCustomerFailure = createAction(
  '[Customer] Load Customer Failure',
  props<{ error: string }>()
);

// Create Customer
export const createCustomer = createAction(
  '[Customer] Create Customer',
  props<{ customer: CreateCustomerRequest }>()
);

export const createCustomerSuccess = createAction(
  '[Customer] Create Customer Success',
  props<{ id: string }>()
);

export const createCustomerFailure = createAction(
  '[Customer] Create Customer Failure',
  props<{ error: string }>()
);

// Update Customer
export const updateCustomer = createAction(
  '[Customer] Update Customer',
  props<{ id: string; customer: UpdateCustomerRequest }>()
);

export const updateCustomerSuccess = createAction(
  '[Customer] Update Customer Success'
);

export const updateCustomerFailure = createAction(
  '[Customer] Update Customer Failure',
  props<{ error: string }>()
);

// Delete Customer
export const deleteCustomer = createAction(
  '[Customer] Delete Customer',
  props<{ id: string }>()
);

export const deleteCustomerSuccess = createAction(
  '[Customer] Delete Customer Success',
  props<{ id: string }>()
);

export const deleteCustomerFailure = createAction(
  '[Customer] Delete Customer Failure',
  props<{ error: string }>()
);

// Clear Selected Customer
export const clearSelectedCustomer = createAction(
  '[Customer] Clear Selected Customer'
);
