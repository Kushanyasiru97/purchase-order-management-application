import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  OnInit, 
  OnChanges, 
  SimpleChanges, 
  ChangeDetectorRef 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';

export interface PurchaseOrderFormData {
  id: number | null;
  poNumber: string;
  poDescription: string;
  supplier: string;
  orderDate: Date | null;
  totalAmount: number | null;
  status: string;
}

export interface StatusOption {
  label: string;
  value: string;
}

function totalAmountValidator(control: AbstractControl) {
  const value = control.value;
  
  if (value === null || value === undefined || value === '') {
    return { required: true };
  }
  
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numericValue)) {
    return { invalidNumber: true };
  }
  
  if (numericValue <= 0) {
    return { invalidAmount: true };
  }
  
  if (numericValue > 99999999.99) {
    return { exceedsMaxAmount: true };
  }
  
  return null;
}

@Component({
  selector: 'app-side-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SidebarModule,
    ButtonModule,
    CalendarModule,
    DropdownModule,
    InputNumberModule
  ],
  templateUrl: './side-form.component.html',
  styleUrls: ['./side-form.component.scss']
})
export class SideFormComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() formData: PurchaseOrderFormData = this.getDefaultFormData();
  @Input() title: string = 'Add Purchase Order';
  @Input() subtitle: string = 'Create New Purchase Order';
  @Input() acceptButtonLabel: string = 'Save';
  @Input() closeButtonLabel: string = 'Close';
  @Input() showAcceptButton: boolean = true;
  @Input() readonly: boolean = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() acceptClicked = new EventEmitter<PurchaseOrderFormData>();
  @Output() closeClicked = new EventEmitter<void>();
  @Output() formDataChange = new EventEmitter<PurchaseOrderFormData>();
  @Output() validationError = new EventEmitter<string>();

  poForm: FormGroup;
  formSubmitted = false;
  private isFormInitializing = false;

  statusOptions: StatusOption[] = [
    { label: 'Draft', value: 'Draft' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Shipped', value: 'Shipped' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' }
  ];

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.poForm = this.createForm();
  }

  ngOnInit(): void {
    if (!this.formData || Object.keys(this.formData).length === 0) {
      this.formData = this.getDefaultFormData();
    }
    this.setupFormValueChanges();
    this.updateFormWithData(this.formData);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formData'] && !changes['formData'].firstChange) {
      this.updateFormWithData(this.formData);
    }

    if (changes['visible']) {
      if (this.visible) {
        this.formSubmitted = false;
        this.updateFormWithData(this.formData);
      } else {
        this.resetForm();
      }
    }

    if (changes['readonly'] && this.poForm) {
      if (this.readonly) {
        this.poForm.disable();
      } else {
        this.poForm.enable();
      }
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      id: [null],
      poNumber: ['', [Validators.required, Validators.minLength(3)]],
      poDescription: ['', [Validators.required, Validators.minLength(5)]],
      supplier: ['', [Validators.required, Validators.minLength(2)]],
      orderDate: [null, [Validators.required]],
      totalAmount: [null, [Validators.required, totalAmountValidator]],
      status: ['', [Validators.required]]
    });
  }

  private setupFormValueChanges(): void {
    this.poForm.valueChanges.subscribe(() => {
      if (!this.isFormInitializing) {
        this.updateFormDataFromForm();
      }
    });
  }

  private updateFormWithData(formData: PurchaseOrderFormData): void {
    this.isFormInitializing = true;
    
    const formValue: any = {
      id: formData.id,
      poNumber: formData.poNumber,
      poDescription: formData.poDescription,
      supplier: formData.supplier,
      orderDate: formData.orderDate,
      totalAmount: formData.totalAmount,
      status: formData.status
    };
    
    this.poForm.patchValue(formValue, { emitEvent: false });
    
    setTimeout(() => {
      this.isFormInitializing = false;
    }, 100);
  }

  private updateFormDataFromForm(): void {
    if (this.poForm && !this.isFormInitializing) {
      const formValue = this.poForm.value;
      
      this.formData = {
        ...this.formData,
        ...formValue,
        totalAmount: formValue.totalAmount
      };
      
      this.formDataChange.emit(this.formData);
    }
  }

  private getDefaultFormData(): PurchaseOrderFormData {
    return {
      id: null,
      poNumber: '',
      poDescription: '',
      supplier: '',
      orderDate: null,
      totalAmount: null,
      status: ''
    };
  }

  private resetForm(): void {
    this.formSubmitted = false;
    this.poForm.reset({
      id: null,
      poNumber: '',
      poDescription: '',
      supplier: '',
      orderDate: null,
      totalAmount: null,
      status: ''
    });
    this.poForm.markAsPristine();
    this.poForm.markAsUntouched();
  }

  hasFieldError(fieldName: string): boolean {
    const control = this.poForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched || this.formSubmitted));
  }

  getFieldError(fieldName: string): string {
    const control = this.poForm.get(fieldName);
    if (!control || !control.errors) return '';

    const errors = control.errors;
    const label = this.getFieldLabel(fieldName);

    if (errors['required']) {
      return `${label} is required`;
    }

    if (errors['minlength']) {
      return `${label} must be at least ${errors['minlength'].requiredLength} characters`;
    }

    if (errors['invalidNumber']) {
      return `${label} must be a valid number`;
    }

    if (errors['invalidAmount']) {
      return `${label} must be greater than 0`;
    }

    if (errors['exceedsMaxAmount']) {
      return `${label} cannot exceed 99,999,999.99`;
    }

    return 'Invalid value';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      poNumber: 'PO Number',
      poDescription: 'PO Description',
      supplier: 'Supplier Name',
      orderDate: 'Order Date',
      totalAmount: 'Total Amount',
      status: 'Status'
    };
    return labels[fieldName] || fieldName;
  }

  get isFormValid(): boolean {
    return this.poForm.valid;
  }

  onSidebarHide(): void {
    this.visibleChange.emit(false);
    this.closeClicked.emit();
  }

  onClose(): void {
    this.visibleChange.emit(false);
    this.closeClicked.emit();
  }

  onAccept(): void {
    this.formSubmitted = true;

    Object.keys(this.poForm.controls).forEach(key => {
      this.poForm.get(key)?.markAsTouched();
    });

    if (!this.isFormValid) {
      this.validationError.emit('Please fill all required fields correctly');
      return;
    }

    this.updateFormDataFromForm();
    this.acceptClicked.emit(this.formData);
  }
}