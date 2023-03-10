import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Seller } from '../model/seller.model';

@Component({
  selector: 'app-seller-list',
  templateUrl: './seller-list.component.html',
  styleUrls: ['./seller-list.component.css'],
})
export class SellerListComponent {
  @Input() sellers: Seller[];

  constructor() {
    this.sellers = [];
  }
}
