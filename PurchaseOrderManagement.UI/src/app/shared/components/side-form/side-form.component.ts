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
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputValidationService } from '../../services/input-validation.service';

export interface PurchaseOrderFormData {
  id: number | null;
  poNumber: string;
  poDescription: string;
  supplier: string;
  orderDate: Date | null;
  totalAmount: number;
  status: string;
}

export interface StatusOption {
  label: string;
  value: string;
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
    DropdownModule
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
  @Input() rejectButtonLabel: string = 'Cancel';
  @Input() closeButtonLabel: string = 'Close';
  @Input() showAcceptButton: boolean = true;
  @Input() showRejectButton: boolean = false;
  @Input() readonly: boolean = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() acceptClicked = new EventEmitter<PurchaseOrderFormData>();
  @Output() rejectClicked = new EventEmitter<void>();
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

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private validationService: InputValidationService
  ) {
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
  }

  private createForm(): FormGroup {
    return this.fb.group({
      id: [null],
      poNumber: [
        '', 
        [
          Validators.required,
          this.validationService.poNumberValidator()
        ]
      ],
      poDescription: [
        '', 
        [
          Validators.required,
          this.validationService.descriptionValidator()
        ]
      ],
      supplier: [
        '', 
        [
          Validators.required,
          this.validationService.supplierNameValidator()
        ]
      ],
      orderDate: [
        null, 
        [Validators.required]
      ],
      totalAmount: [
        0, 
        [
          Validators.required, 
          Validators.min(0.01),
          this.validationService.amountValidator()
        ]
      ],
      status: [
        '', 
        [Validators.required]
      ]
    });
  }

  private setupFormValueChanges(): void {
    this.poForm.valueChanges.subscribe(() => {
      if (!this.isFormInitializing) {
        this.updateFormDataFromForm();
      }
    });
  }

  private updateFormWithData(data: PurchaseOrderFormData): void {
    this.isFormInitializing = true;
    
    const formDataToUpdate: any = { ...data };
    
    // Sanitize input data
    if (formDataToUpdate.poNumber) {
      formDataToUpdate.poNumber = this.validationService.sanitizeInput(formDataToUpdate.poNumber);
    }
    if (formDataToUpdate.poDescription) {
      formDataToUpdate.poDescription = this.validationService.sanitizeInput(formDataToUpdate.poDescription);
    }
    if (formDataToUpdate.supplier) {
      formDataToUpdate.supplier = this.validationService.sanitizeInput(formDataToUpdate.supplier);
    }
    
    // Ensure totalAmount is a number with 2 decimal places
    if (formDataToUpdate.totalAmount) {
      formDataToUpdate.totalAmount = parseFloat(
        parseFloat(formDataToUpdate.totalAmount.toString()).toFixed(2)
      );
    }
    
    // Convert date string to Date object if needed
    if (formDataToUpdate.orderDate) {
      if (typeof formDataToUpdate.orderDate === 'string') {
        formDataToUpdate.orderDate = new Date(formDataToUpdate.orderDate);
      }
    }
    
    this.poForm.patchValue(formDataToUpdate, { emitEvent: false });
    this.poForm.markAsPristine();
    
    setTimeout(() => {
      this.isFormInitializing = false;
    }, 100);
  }

  private updateFormDataFromForm(): void {
    if (this.poForm && !this.isFormInitializing) {
      const formValue = this.poForm.value;
      
      // Sanitize outputs
      if (formValue.poNumber) {
        formValue.poNumber = this.validationService.sanitizeInput(formValue.poNumber);
      }
      if (formValue.poDescription) {
        formValue.poDescription = this.validationService.sanitizeInput(formValue.poDescription);
      }
      if (formValue.supplier) {
        formValue.supplier = this.validationService.sanitizeInput(formValue.supplier);
      }
      
      // Ensure totalAmount has 2 decimal places
      if (formValue.totalAmount) {
        formValue.totalAmount = parseFloat(
          parseFloat(formValue.totalAmount.toString()).toFixed(2)
        );
      }
      
      this.formData = { ...this.formData, ...formValue };
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
      totalAmount: 0,
      status: ''
    };
  }

  private resetForm(): void {
    this.formSubmitted = false;
    this.poForm.reset(this.getDefaultFormData());
    this.poForm.markAsPristine();
    this.poForm.markAsUntouched();
  }

  getFormControl(fieldName: string) {
    return this.poForm.get(fieldName);
  }

  hasFieldError(fieldName: string): boolean {
    const control = this.getFormControl(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched || this.formSubmitted));
  }

  getFieldError(fieldName: string): string {
    const control = this.getFormControl(fieldName);
    if (!control || !control.errors) return '';

    const errors = control.errors;
    
    // Custom validation errors
    if (errors['poNumber']) {
      return errors['poNumber'];
    }
    if (errors['supplierName']) {
      return errors['supplierName'];
    }
    if (errors['description']) {
      return errors['description'];
    }
    if (errors['amount']) {
      return errors['amount'];
    }
    
    // Standard validation errors
    if (errors['required']) {
      return this.getRequiredErrorMessage(fieldName);
    }
    if (errors['min']) {
      if (fieldName === 'totalAmount') {
        return 'Total amount must be greater than 0';
      }
      return `${this.getFieldLabel(fieldName)} must be greater than 0`;
    }
    
    return 'Invalid input';
  }

  private getRequiredErrorMessage(fieldName: string): string {
    const fieldLabels: { [key: string]: string } = {
      poNumber: 'PO number',
      poDescription: 'PO description',
      supplier: 'Supplier name',
      orderDate: 'Order date',
      totalAmount: 'Total amount',
      status: 'Status'
    };
    
    const label = fieldLabels[fieldName] || fieldName;
    return `${label.charAt(0).toUpperCase() + label.slice(1)} is required`;
  }

  private getFieldLabel(fieldName: string): string {
    const fieldLabels: { [key: string]: string } = {
      poNumber: 'PO number',
      poDescription: 'PO description',
      supplier: 'Supplier name',
      orderDate: 'Order date',
      totalAmount: 'Total amount',
      status: 'Status'
    };
    
    return fieldLabels[fieldName] || fieldName;
  }

  private getFormValidationErrors(): string {
    const errors: string[] = [];
    
    Object.keys(this.poForm.controls).forEach(fieldName => {
      const control = this.poForm.get(fieldName);
      if (control && control.invalid) {
        const fieldError = this.getFieldError(fieldName);
        if (fieldError) {
          errors.push(fieldError);
        }
      }
    });
    
    return errors.length > 0 ? errors.join(', ') : 'Please fill in all required fields correctly.';
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
    this.poForm.markAllAsTouched();
    
    if (this.isFormValid) {
      // Perform final validation
      const validationResult = this.validationService.validatePurchaseOrder({
        poNumber: this.formData.poNumber,
        poDescription: this.formData.poDescription,
        supplierName: this.formData.supplier,
        totalAmount: this.formData.totalAmount,
        orderDate: this.formData.orderDate,
        status: this.formData.status
      });
      
      if (validationResult.isValid) {
        this.updateFormDataFromForm();
        this.acceptClicked.emit(this.formData);
      } else {
        const allErrors = Object.values(validationResult.errors).flat().join(', ');
        this.validationError.emit(allErrors);
      }
    } else {
      const errorMessage = this.getFormValidationErrors();
      this.validationError.emit(errorMessage);
    }
  }

  onReject(): void {
    this.rejectClicked.emit();
  }

  get isFormValid(): boolean {
    if (!this.poForm || this.readonly) {
      return true;
    }

    return this.poForm.valid;
  }
}