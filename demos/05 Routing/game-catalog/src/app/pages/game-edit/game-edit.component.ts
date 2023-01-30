import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game-edit',
  templateUrl: './game-edit.component.html',
  styleUrls: ['./game-edit.component.css'],
})
export class GameEditComponent {
  id: string;
  constructor(private route: ActivatedRoute) {
    this.id = '';
    this.route.params.subscribe((params) => {
      this.id = params['id'];
    });
  }
}
