import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { customerReducer } from './store/customer.reducer';
import { CustomerEffects } from './store/customer.effects';
import { CustomerService } from './services/customer.service';

import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { CustomerDetailComponent } from './components/customer-detail/customer-detail.component';
import { CustomerFormComponent } from './components/customer-form/customer-form.component';

const routes = [
  {
    path: '',
    component: CustomerListComponent
  },
  {
    path: 'new',
    component: CustomerFormComponent
  },
  {
    path: ':id',
    component: CustomerDetailComponent
  },
  {
    path: ':id/edit',
    component: CustomerFormComponent
  }
];

@NgModule({
  declarations: [
    CustomerListComponent,
    CustomerDetailComponent,
    CustomerFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('customers', customerReducer),
    EffectsModule.forFeature([CustomerEffects])
  ],
  providers: [
    CustomerService
  ]
})
export class CustomerModule { }
