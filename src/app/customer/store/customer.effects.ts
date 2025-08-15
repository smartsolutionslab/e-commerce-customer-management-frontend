import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { CustomerService } from '../services/customer.service';
import * as CustomerActions from './customer.actions';

@Injectable()
export class CustomerEffects {

  loadCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.loadCustomers),
      switchMap(({ page, pageSize, search }) =>
        this.customerService.getCustomers(page, pageSize, search).pipe(
          map(response => CustomerActions.loadCustomersSuccess({ response })),
          catchError(error => of(CustomerActions.loadCustomersFailure({ 
            error: error.message || 'Failed to load customers' 
          })))
        )
      )
    )
  );

  loadCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.loadCustomer),
      switchMap(({ id }) =>
        this.customerService.getCustomer(id).pipe(
          map(customer => CustomerActions.loadCustomerSuccess({ customer })),
          catchError(error => of(CustomerActions.loadCustomerFailure({ 
            error: error.message || 'Failed to load customer' 
          })))
        )
      )
    )
  );

  createCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.createCustomer),
      switchMap(({ customer }) =>
        this.customerService.createCustomer(customer).pipe(
          map(response => CustomerActions.createCustomerSuccess({ id: response.id })),
          catchError(error => of(CustomerActions.createCustomerFailure({ 
            error: error.message || 'Failed to create customer' 
          })))
        )
      )
    )
  );

  createCustomerSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.createCustomerSuccess),
      tap(() => this.router.navigate(['/customers']))
    ),
    { dispatch: false }
  );

  updateCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.updateCustomer),
      switchMap(({ id, customer }) =>
        this.customerService.updateCustomer(id, customer).pipe(
          map(() => CustomerActions.updateCustomerSuccess()),
          catchError(error => of(CustomerActions.updateCustomerFailure({ 
            error: error.message || 'Failed to update customer' 
          })))
        )
      )
    )
  );

  updateCustomerSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.updateCustomerSuccess),
      tap(() => this.router.navigate(['/customers']))
    ),
    { dispatch: false }
  );

  deleteCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.deleteCustomer),
      switchMap(({ id }) =>
        this.customerService.deleteCustomer(id).pipe(
          map(() => CustomerActions.deleteCustomerSuccess({ id })),
          catchError(error => of(CustomerActions.deleteCustomerFailure({ 
            error: error.message || 'Failed to delete customer' 
          })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private customerService: CustomerService,
    private router: Router
  ) {}
}
