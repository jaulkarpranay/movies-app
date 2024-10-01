import { Routes } from '@angular/router';
import { HomePage } from './home/home.component';
// import { ShowPage } from './show/show.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  // { path: 'show/:id', component: ShowPage },
];
