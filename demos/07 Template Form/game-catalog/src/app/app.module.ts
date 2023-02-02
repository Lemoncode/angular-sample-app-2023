import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CardGameComponent } from './pages/game-list/card-game/card-game.component';
import { SellerListComponent } from './seller-list/seller-list.component';
import { GameListComponent } from './pages/game-list/game-list.component';
import { GameEditComponent } from './pages/game-edit/game-edit.component';
import { FieldErrorDisplayComponent } from './common/field-error-display/field-error-display.component';

const appRoutes: Routes = [
  { path: '', component: GameListComponent },
  { path: 'edit', component: GameEditComponent },
  { path: 'edit/:id', component: GameEditComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    CardGameComponent,
    SellerListComponent,
    GameListComponent,
    GameEditComponent,
    FieldErrorDisplayComponent,
  ],
  imports: [BrowserModule, RouterModule.forRoot(appRoutes), FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
