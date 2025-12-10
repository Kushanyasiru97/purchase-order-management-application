import { Routes } from '@angular/router';
import { HomeScreenComponent } from './pages/home-screen/home-screen.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeScreenComponent,
        data: { title: 'Purchase Order Management' }
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