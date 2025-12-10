import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  constructor() { }
  iconDelete = 'pi pi-trash';
  iconConfirm = 'pi pi-thumbs-up';
  @Input() visible = false;
  @Input() message = '';
  @Input() header = 'Confirmation';
  @Input() showReject = true;
  @Input() showDelete = false;
  @Input() showConfirm = false;
  acceptLabel = 'Yes';
  rejectLabel = 'No';
  deleteLabel = 'Delete'
  rejectClass = 'btn-cancel';
  deleteClass = 'btn-delete d-block gap-1';
  confirmClass = 'btn-confirm d-block gap-1';


  @Output() accept = new EventEmitter<void>();
  @Output() reject = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  ngOnInit() {
    
  }

  onAccept() {
    this.accept.emit();
  }

  onReject() {
    this.reject.emit();
  }

  onDelete() {
    this.delete.emit();
  }
}
