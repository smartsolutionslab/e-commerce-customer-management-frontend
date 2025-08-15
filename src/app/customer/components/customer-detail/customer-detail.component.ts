import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Customer } from '../../models/customer.model';
import { CustomerState } from '../../store/customer.state';
import * as CustomerActions from '../../store/customer.actions';
import * as CustomerSelectors from '../../store/customer.selectors';

@Component({
  selector: 'app-customer-detail',
  template: `
    <div class="max-w-4xl mx-auto p-6">
      <!-- Loading -->
      <div *ngIf="loading$ | async" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error -->
      <div *ngIf="error$ | async as error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
        <p class="text-red-800">{{ error }}</p>
      </div>

      <!-- Customer Details -->
      <div *ngIf="customer$ | async as customer" class="space-y-6">
        <!-- Header -->
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900">
            {{ customer.firstName }} {{ customer.lastName }}
          </h1>
          <div class="flex space-x-3">
            <ec-button variant="outline" (clicked)="goBack()">
              Back
            </ec-button>
            <ec-button variant="primary" (clicked)="editCustomer(customer.id)">
              Edit Customer
            </ec-button>
          </div>
        </div>

        <!-- Customer Information -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Customer Information</h2>
          </div>
          <div class="px-6 py-4">
            <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt class="text-sm font-medium text-gray-500">Full Name</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ customer.firstName }} 
                  <span *ngIf="customer.middleName">{{ customer.middleName }} </span>
                  {{ customer.lastName }}
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Email</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ customer.email }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Phone Number</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ customer.phoneNumber || 'Not provided' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Date of Birth</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ customer.dateOfBirth | date:'mediumDate' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Status</dt>
                <dd class="mt-1">
                  <span [class]="getStatusClass(customer.status)"
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ customer.status }}
                  </span>
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Member Since</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ customer.createdAt | date:'mediumDate' }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Addresses -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 class="text-lg font-medium text-gray-900">Addresses</h2>
            <ec-button variant="outline" size="sm" (clicked)="addAddress(customer.id)">
              Add Address
            </ec-button>
          </div>
          <div class="px-6 py-4">
            <div *ngIf="customer.addresses.length === 0" class="text-center py-8">
              <p class="text-gray-500">No addresses found</p>
            </div>
            <div *ngFor="let address of customer.addresses" 
                 class="border rounded-lg p-4 mb-4 last:mb-0">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center mb-2">
                    <span *ngIf="address.isDefault" 
                          class="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded mr-2">
                      Default
                    </span>
                  </div>
                  <p class="text-sm text-gray-900">{{ address.street }}</p>
                  <p class="text-sm text-gray-900">
                    {{ address.city }}, {{ address.state }} {{ address.postalCode }}
                  </p>
                  <p class="text-sm text-gray-900">{{ address.country }}</p>
                </div>
                <div class="flex space-x-2">
                  <ec-button variant="ghost" size="sm" (clicked)="editAddress(address.id)">
                    Edit
                  </ec-button>
                  <ec-button variant="danger" size="sm" (clicked)="deleteAddress(address.id)">
                    Delete
                  </ec-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CustomerDetailComponent implements OnInit, OnDestroy {
  customer$: Observable<Customer | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<CustomerState>
  ) {
    this.customer$ = this.store.select(CustomerSelectors.selectSelectedCustomer);
    this.loading$ = this.store.select(CustomerSelectors.selectCustomersLoading);
    this.error$ = this.store.select(CustomerSelectors.selectCustomersError);
  }

  ngOnInit(): void {
    const customerId = this.route.snapshot.paramMap.get('id');
    if (customerId) {
      this.store.dispatch(CustomerActions.loadCustomer({ id: customerId }));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(CustomerActions.clearSelectedCustomer());
  }

  goBack(): void {
    this.router.navigate(['/customers']);
  }

  editCustomer(id: string): void {
    this.router.navigate(['/customers', id, 'edit']);
  }

  addAddress(customerId: string): void {
    // TODO: Implement address management
    console.log('Add address for customer:', customerId);
  }

  editAddress(addressId: string): void {
    // TODO: Implement address editing
    console.log('Edit address:', addressId);
  }

  deleteAddress(addressId: string): void {
    // TODO: Implement address deletion
    if (confirm('Are you sure you want to delete this address?')) {
      console.log('Delete address:', addressId);
    }
  }

  getStatusClass(status: string): string {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  }
}
