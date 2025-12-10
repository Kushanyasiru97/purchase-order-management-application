import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [PaginatorModule,DropdownModule,FormsModule,ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})
export class PaginatorComponent {
  @Input() totalRecords!:number;
  @Input() rows!:number;
  @Input() first!:number;
  @Output() paginationChanged = new EventEmitter<{ first: number; rows: number }>();
  
    
    last:number = 10;
    // rows:number =10;
    currentPage = 0;
    
     options = [
        { label: 5, value: 5 },
        { label: 10, value: 10 },
        { label: 20, value: 20 },
        { label: 100, value: 100 }
    ];

onRowsChange(newRows: any) {
  this.rows = Number(newRows); // ensure numeric
  this.first = 0;
  this.emitPagination();
}

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.emitPagination();
  }

  private emitPagination() {
    this.paginationChanged.emit({
      first: this.first,
      rows: this.rows,
    });
  }

}
