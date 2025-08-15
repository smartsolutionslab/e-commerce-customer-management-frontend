export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phoneNumber?: string;
  dateOfBirth: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt?: string;
  addresses: Address[];
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface CreateCustomerRequest {
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
}

export interface UpdateCustomerRequest {
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phoneNumber?: string;
}

export interface CustomersResponse {
  customers: Customer[];
  totalCount: number;
  page: number;
  pageSize: number;
}
