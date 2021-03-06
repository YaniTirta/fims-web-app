/**
 * Copyright 2017 The Mifos Initiative.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {Product} from '../../../../services/portfolio/domain/product.model';
import {ActivatedRoute, Router} from '@angular/router';
import {PortfolioStore} from '../store/index';
import {SelectAction, UPDATE} from '../store/product.actions';
import {Subscription} from 'rxjs';
import * as fromPortfolio from '../store';
import {FimsProduct} from '../store/model/fims-product.model';

@Component({
  templateUrl: './edit.component.html'
})
export class ProductEditComponent implements OnInit, OnDestroy{

  private productSubscription: Subscription;

  private actionsSubscription: Subscription;

  product: FimsProduct;

  constructor(private router: Router, private route: ActivatedRoute, private portfolioStore: PortfolioStore) {}

  ngOnInit() {
    this.productSubscription = this.portfolioStore.select(fromPortfolio.getSelectedProduct)
      .subscribe(product => this.product = product);

    this.actionsSubscription = this.route.params
      .map(params => new SelectAction(params['productId']))
      .subscribe(this.portfolioStore);
  }

  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();
    this.actionsSubscription.unsubscribe();
  }

  onSave(product: Product) {
    this.portfolioStore.dispatch({ type: UPDATE, payload: {
      product: product,
      activatedRoute: this.route
    }});
  }

  onCancel() {
    this.navigateAway();
  }

  private navigateAway() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
