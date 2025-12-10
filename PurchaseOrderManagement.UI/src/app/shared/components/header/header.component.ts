import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { filter, map } from 'rxjs/operators';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    AvatarModule,
    OverlayPanelModule,
    CommonModule,
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
    PasswordModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() fontColor: string = '#001a4c';
  pageTitle = 'Purchase Order Management';
  username: string = 'Admin';
  visibleDialog = false;
  loading: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    // Listen to route changes to update page title
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route.snapshot.data['title'] || 'Purchase Order Management System';
        })
      )
      .subscribe((title: string) => {
        this.pageTitle = title || 'Purchase Order Management';
      });
    }

  
}