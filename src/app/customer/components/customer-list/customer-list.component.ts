import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Customer } from '../../models/customer.model';
import { CustomerState } from '../../store/customer.state';
import * as CustomerActions from '../../store/customer.actions';
import * as CustomerSelectors from '../../store/customer.selectors';

@Component({
  selector: 'app-customer-list',
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Customers</h1>
        <ec-button variant="primary" (clicked)="createCustomer()">
          Add Customer
        </ec-button>
      </div>

      <!-- Search -->
      <div class="mb-4">
        <input
          type="text"
          placeholder="Search customers..."
          [(ngModel)]="searchTerm"
          (input)="onSearch()"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
      </div>

      <!-- Loading -->
      <div *ngIf="loading$ | async" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error -->
      <div *ngIf="error$ | async as error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
        <p class="text-red-800">{{ error }}</p>
      </div>

      <!-- Customer Table -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let customer of customers$ | async" 
                class="hover:bg-gray-50 cursor-pointer"
                (click)="viewCustomer(customer.id)">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ customer.firstName }} {{ customer.lastName }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ customer.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ customer.phoneNumber || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span [class]="getStatusClass(customer.status)"
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ customer.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ customer.createdAt | date:'short' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <ec-button variant="ghost" size="sm" (clicked)="editCustomer($event, customer.id)">
                  Edit
                </ec-button>
                <ec-button variant="danger" size="sm" (clicked)="deleteCustomer($event, customer.id)">
                  Delete
                </ec-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="mt-4 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {{ ((currentPage$ | async) - 1) * (pageSize$ | async) + 1 }} to 
          {{ Math.min((currentPage$ | async) * (pageSize$ | async), totalCount$ | async) }} of 
          {{ totalCount$ | async }} results
        </div>
        <div class="flex space-x-2">
          <ec-button 
            variant="outline" 
            size="sm"
            [disabled]="(currentPage$ | async) <= 1"
            (clicked)="previousPage()">
            Previous
          </ec-button>
          <ec-button 
            variant="outline" 
            size="sm"
            [disabled]="(currentPage$ | async) >= (totalPages$ | async)"
            (clicked)="nextPage()">
            Next
          </ec-button>
        </div>
      </div>
    </div>
  `
})
export class CustomerListComponent implements OnInit {
  customers$: Observable<Customer[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  currentPage$: Observable<number>;
  pageSize$: Observable<number>;
  totalCount$: Observable<number>;
  totalPages$: Observable<number>;

  searchTerm = '';

  constructor(
    private store: Store<CustomerState>,
    private router: Router
  ) {
    this.customers$ = this.store.select(CustomerSelectors.selectAllCustomers);
    this.loading$ = this.store.select(CustomerSelectors.selectCustomersLoading);
    this.error$ = this.store.select(CustomerSelectors.selectCustomersError);
    this.currentPage$ = this.store.select(CustomerSelectors.selectCurrentPage);
    this.pageSize$ = this.store.select(CustomerSelectors.selectPageSize);
    this.totalCount$ = this.store.select(CustomerSelectors.selectTotalCount);
    this.totalPages$ = this.store.select(CustomerSelectors.selectTotalPages);
  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.store.dispatch(CustomerActions.loadCustomers({
      page: 1,
      pageSize: 20,
      search: this.searchTerm || undefined
    }));
  }

  onSearch(): void {
    this.loadCustomers();
  }

  createCustomer(): void {
    this.router.navigate(['/customers/new']);
  }

  viewCustomer(id: string): void {
    this.router.navigate(['/customers', id]);
  }

  editCustomer(event: Event, id: string): void {
    event.stopPropagation();
    this.router.navigate(['/customers', id, 'edit']);
  }

  deleteCustomer(event: Event, id: string): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this customer?')) {
      this.store.dispatch(CustomerActions.deleteCustomer({ id }));
    }
  }

  getStatusClass(status: string): string {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  }

  previousPage(): void {
    // Implementation for pagination
  }

  nextPage(): void {
    // Implementation for pagination
  }
}
