import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer, CreateCustomerRequest, UpdateCustomerRequest, CustomersResponse } from '../models/customer.model';

@Injectable()
export class CustomerService {
  private readonly baseUrl = '/api/v1/customers';

  constructor(private http: HttpClient) {}

  getCustomers(page: number = 1, limit: number = 20, search?: string): Observable<CustomersResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<CustomersResponse>(this.baseUrl, { params });
  }

  getCustomer(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/${id}`);
  }

  createCustomer(customer: CreateCustomerRequest): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(this.baseUrl, customer);
  }

  updateCustomer(id: string, customer: UpdateCustomerRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, customer);
  }

  deleteCustomer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
