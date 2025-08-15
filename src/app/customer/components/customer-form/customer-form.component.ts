import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Customer } from '../../models/customer.model';
import { CustomerState } from '../../store/customer.state';
import * as CustomerActions from '../../store/customer.actions';
import * as CustomerSelectors from '../../store/customer.selectors';

@Component({
  selector: 'app-customer-form',
  template: `
    <div class="max-w-2xl mx-auto p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">
          {{ isEditMode ? 'Edit Customer' : 'Create Customer' }}
        </h1>
      </div>

      <form [formGroup]="customerForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Personal Information -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
          
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                id="firstName"
                formControlName="firstName"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
              <div *ngIf="customerForm.get('firstName')?.invalid && customerForm.get('firstName')?.touched" 
                   class="mt-1 text-sm text-red-600">
                First name is required
              </div>
            </div>

            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                id="lastName"
                formControlName="lastName"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
              <div *ngIf="customerForm.get('lastName')?.invalid && customerForm.get('lastName')?.touched" 
                   class="mt-1 text-sm text-red-600">
                Last name is required
              </div>
            </div>

            <div class="sm:col-span-2">
              <label for="middleName" class="block text-sm font-medium text-gray-700">Middle Name (Optional)</label>
              <input
                type="text"
                id="middleName"
                formControlName="middleName"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                formControlName="email"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
              <div *ngIf="customerForm.get('email')?.invalid && customerForm.get('email')?.touched" 
                   class="mt-1 text-sm text-red-600">
                <span *ngIf="customerForm.get('email')?.errors?.['required']">Email is required</span>
                <span *ngIf="customerForm.get('email')?.errors?.['email']">Invalid email format</span>
              </div>
            </div>

            <div>
              <label for="phoneNumber" class="block text-sm font-medium text-gray-700">Phone Number (Optional)</label>
              <input
                type="tel"
                id="phoneNumber"
                formControlName="phoneNumber"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            </div>

            <div class="sm:col-span-2">
              <label for="dateOfBirth" class="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                formControlName="dateOfBirth"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
              <div *ngIf="customerForm.get('dateOfBirth')?.invalid && customerForm.get('dateOfBirth')?.touched" 
                   class="mt-1 text-sm text-red-600">
                Date of birth is required
              </div>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div *ngIf="error$ | async as error" class="bg-red-50 border border-red-200 rounded-md p-4">
          <p class="text-red-800">{{ error }}</p>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3">
          <ec-button variant="outline" type="button" (clicked)="onCancel()">
            Cancel
          </ec-button>
          <ec-button 
            variant="primary" 
            type="submit"
            [loading]="loading$ | async"
            [disabled]="customerForm.invalid">
            {{ isEditMode ? 'Update' : 'Create' }} Customer
          </ec-button>
        </div>
      </form>
    </div>
  `
})
export class CustomerFormComponent implements OnInit, OnDestroy {
  customerForm: FormGroup;
  isEditMode = false;
  customerId: string | null = null;
  
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<CustomerState>
  ) {
    this.loading$ = this.store.select(CustomerSelectors.selectCustomersLoading);
    this.error$ = this.store.select(CustomerSelectors.selectCustomersError);
    
    this.customerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      middleName: [''],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      dateOfBirth: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.customerId;

    if (this.isEditMode && this.customerId) {
      this.store.dispatch(CustomerActions.loadCustomer({ id: this.customerId }));
      
      this.store.select(CustomerSelectors.selectSelectedCustomer)
        .pipe(takeUntil(this.destroy$))
        .subscribe(customer => {
          if (customer) {
            this.customerForm.patchValue({
              firstName: customer.firstName,
              lastName: customer.lastName,
              middleName: customer.middleName,
              email: customer.email,
              phoneNumber: customer.phoneNumber,
              dateOfBirth: customer.dateOfBirth.split('T')[0] // Extract date part
            });
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(CustomerActions.clearSelectedCustomer());
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      const formValue = this.customerForm.value;
      
      if (this.isEditMode && this.customerId) {
        this.store.dispatch(CustomerActions.updateCustomer({
          id: this.customerId,
          customer: {
            email: formValue.email,
            firstName: formValue.firstName,
            lastName: formValue.lastName,
            middleName: formValue.middleName || undefined,
            phoneNumber: formValue.phoneNumber || undefined
          }
        }));
      } else {
        this.store.dispatch(CustomerActions.createCustomer({
          customer: {
            email: formValue.email,
            firstName: formValue.firstName,
            lastName: formValue.lastName,
            middleName: formValue.middleName || undefined,
            dateOfBirth: formValue.dateOfBirth
          }
        }));
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/customers']);
  }
}
