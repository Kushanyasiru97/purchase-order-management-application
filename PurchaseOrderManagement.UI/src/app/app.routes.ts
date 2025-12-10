import { Routes } from '@angular/router';
import { HomeScreenComponent } from './pages/home-screen/home-screen.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeScreenComponent,
    },
    {
        path: 'purchase-orders',
        component: HomeScreenComponent,
        data: { title: 'Purchase Order Management' }
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];