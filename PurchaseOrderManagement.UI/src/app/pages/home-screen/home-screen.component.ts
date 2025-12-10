import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { SidebarModule } from "primeng/sidebar";
import { CalendarModule } from "primeng/calendar";
import { ConfirmationService } from "primeng/api";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { InputSwitchModule } from "primeng/inputswitch";
import { ConfirmDialogComponent } from "../../shared/components/confirm-dialog/confirm-dialog.component";
import { PaginatorComponent } from "../../shared/components/paginator/paginator.component";
import { TopPanelComponent } from "../../shared/components/top-panel/top-panel.component";
import { TopPanelConfig, TopPanelFilters } from "../../shared/models/top-panel.interface";
import { SideFormComponent, PurchaseOrderFormData } from "../../shared/components/side-form/side-form.component";
import { HeaderComponent } from "../../shared/components/header/header.component";
import { PurchaseOrderService, PurchaseOrder as ApiPurchaseOrder } from "../../shared/services/purchase-order.service";

export interface PurchaseOrder {
  id: number;
  po_number: string;
  po_description: string;
  supplier: string;
  order_date: string;
  total_amount: number;
  status: string;
  items_count: number;
}

@Component({
  selector: "app-home-screen",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    TableModule,
    ButtonModule,
    DropdownModule,
    TopPanelComponent,
    TableModule,
    PaginatorComponent,
    ButtonModule,
    SidebarModule,
    CalendarModule,
    FormsModule,
    ConfirmDialogModule,
    ToastModule,
    ConfirmDialogComponent,
    InputSwitchModule,
    SideFormComponent,
    HeaderComponent
  ],
  providers: [ConfirmationService, MessageService, PurchaseOrderService],
  templateUrl: "./home-screen.component.html",
  styleUrls: ["./home-screen.component.scss"],
})
export class HomeScreenComponent implements OnInit, AfterViewInit {
  formSubmitted = false;
  private isRejectAction = false;
  private isUpdateAction = false;
  private isCreateAction = false;
  private isDeleteAction = false;
  searchColor = '#001a4c';

  topPanelConfig: TopPanelConfig = {
    searchPlaceholder: "Supplier Name",
    searchTooltip: "Search by PO Number or Supplier",
    showSearch: true,
    showDateFilter: true,
    showCustomButton: true,
    customButtonLabel: "Create New Order",
    customButtonImage: "assets/images/Add.svg",
    dateRangePlaceholder: "Date Range",
    searchButtonLabel: "Search",
    numberOfMonths: 2,
    yearRange: "2020:2030",
    showDropdown: true,
    dropdownPlaceholder: "",
    dropdownOptions: [
      { label: 'All Status', value: '' },
      { label: 'Draft', value: 'Draft' },
      { label: 'Approved', value: 'Approved' },
      { label: 'Shipped', value: 'Shipped' },
      { label: 'Completed', value: 'Completed' },
      { label: 'Cancelled', value: 'Cancelled' }
    ]
  };

  dateRange: Date[] = [];
  searchStr: string = '';
  status: string = '';
  totalRecords = 0;
  loading = false;
  po_id!: number;
  
  first = 0;
  rows = 10;
  
  sidebarVisible = false;
  sidebarTitle = '';
  sidebarSubtitle = '';
  acceptButtonLabel = '';
  
  // Store all purchase orders from API
  allPurchaseOrders: PurchaseOrder[] = [];
  visibleProducts: PurchaseOrder[] = [];

  showConfirm = false;
  confirmMessage = "";
  confirmHeader = "";
  confirmShowReject = true;
  confirmShowDelete = false;
  confirmShow = false;
  selectedProduct: PurchaseOrder | null = null;

  formData: PurchaseOrderFormData = {
    id: null,
    poNumber: "",
    poDescription: "",
    supplier: "",
    orderDate: null,
    totalAmount: 0,
    status: ""
  };

  constructor(
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private purchaseOrderService: PurchaseOrderService
  ) {
    console.log('HomeScreenComponent constructor called');
  }

  ngOnInit(): void {
    console.log('HomeScreenComponent ngOnInit called');
    this.initializeData();
  }

  ngAfterViewInit(): void {
    console.log('HomeScreenComponent ngAfterViewInit called');
    this.cdr.detectChanges();
  }

  private initializeData(): void {
    console.log('Initializing data...');
    this.getPurchaseOrders(1, '');
  }

  private parseNumber(value: any, defaultValue: number = 0): number {
    if (value === null || value === undefined || value === '') {
      return defaultValue;
    }
    const parsed = typeof value === 'string' ? parseFloat(value) : Number(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  private getNextPONumber(): string {
    const currentYear = new Date().getFullYear();
    const existingNumbers = this.allPurchaseOrders
      .map(po => {
        const match = po.po_number.match(/PO-(\d{4})-(\d+)/);
        return match ? parseInt(match[2]) : 0;
      });
    
    const maxNumber = Math.max(...existingNumbers, 0);
    const nextNumber = (maxNumber + 1).toString().padStart(3, '0');
    
    return `PO-${currentYear}-${nextNumber}`;
  }

  // Convert API response to display format
  private mapApiToDisplay(apiOrder: ApiPurchaseOrder): PurchaseOrder {
    return {
      id: apiOrder.purchaseOrderId || 0,
      po_number: apiOrder.poNumber,
      po_description: apiOrder.poDescription,
      supplier: apiOrder.supplierName,
      order_date: typeof apiOrder.orderDate === 'string' ? apiOrder.orderDate : new Date(apiOrder.orderDate).toISOString().split('T')[0],
      total_amount: apiOrder.totalAmount,
      status: apiOrder.status,
      items_count: 0 // This field doesn't exist in API, set default
    };
  }

  // Convert display format to API format
  private mapDisplayToApi(displayOrder: PurchaseOrderFormData): ApiPurchaseOrder {
    return {
      purchaseOrderId: displayOrder.id || undefined,
      poNumber: displayOrder.poNumber,
      poDescription: displayOrder.poDescription,
      supplierName: displayOrder.supplier,
      orderDate: displayOrder.orderDate ? new Date(displayOrder.orderDate) : new Date(),
      totalAmount: displayOrder.totalAmount,
      status: displayOrder.status
    };
  }

  getPurchaseOrders(currentPage: number, searchTerm?: any): void {
    console.log('getPurchaseOrders called', { currentPage, searchTerm });
    this.loading = true;
    
    // Call the API service
    this.purchaseOrderService.getPurchaseOrders().subscribe({
      next: (response: ApiPurchaseOrder[]) => {
        console.log('API Response received:', response);
        
        // Convert API response to display format
        this.allPurchaseOrders = response.map(order => this.mapApiToDisplay(order));
        console.log('Mapped orders:', this.allPurchaseOrders);
        
        let filteredOrders = [...this.allPurchaseOrders];
        
        // Apply search filter
        if (searchTerm?.searchstr) {
          const search = searchTerm.searchstr.toLowerCase();
          filteredOrders = filteredOrders.filter(order =>
            order.po_number.toLowerCase().includes(search) ||
            order.supplier.toLowerCase().includes(search)
          );
        }
        
        // Apply status filter
        if (searchTerm?.status_id) {
          filteredOrders = filteredOrders.filter(order =>
            order.status === searchTerm.status_id
          );
        }
        
        // Apply date range filter
        if (searchTerm?.start_date && searchTerm?.end_date) {
          const startDate = new Date(searchTerm.start_date);
          const endDate = new Date(searchTerm.end_date);
          
          filteredOrders = filteredOrders.filter(order => {
            const orderDate = new Date(order.order_date);
            return orderDate >= startDate && orderDate <= endDate;
          });
        }
        
        this.totalRecords = filteredOrders.length;
        
        // Apply pagination
        const startIndex = (currentPage - 1) * this.rows;
        const endIndex = startIndex + this.rows;
        this.visibleProducts = filteredOrders.slice(startIndex, endIndex);
        
        console.log('Visible products:', this.visibleProducts);
        console.log('Total records:', this.totalRecords);
        
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching purchase orders:', error);
        this.showErrorMessage('Failed to load purchase orders. Please check your connection.');
        this.loading = false;
        this.allPurchaseOrders = [];
        this.visibleProducts = [];
        this.totalRecords = 0;
        this.cdr.detectChanges();
      }
    });
  }

  openCreateNewOrder(): void {
    this.isCreateAction = true;
    this.isUpdateAction = false;
    
    const newPoNumber = this.getNextPONumber();
    
    this.formData = {
      id: null,
      poNumber: newPoNumber,
      poDescription: "",
      supplier: "",
      orderDate: new Date(),
      totalAmount: 0,
      status: "Draft"
    };
    
    this.sidebarTitle = "Add Purchase Order";
    this.sidebarSubtitle = "Create New Purchase Order";
    this.acceptButtonLabel = "Create";
    this.sidebarVisible = true;
  }

  openEditOrder(order: PurchaseOrder): void {
    this.isUpdateAction = true;
    this.isCreateAction = false;
    this.selectedProduct = order;
    
    this.formData = {
      id: order.id,
      poNumber: order.po_number,
      poDescription: order.po_description,
      supplier: order.supplier,
      orderDate: new Date(order.order_date),
      totalAmount: order.total_amount,
      status: order.status
    };
    
    this.sidebarTitle = "Edit Purchase Order";
    this.sidebarSubtitle = "Update Purchase Order Details";
    this.acceptButtonLabel = "Update";
    this.sidebarVisible = true;
  }

  private isFormValid(): boolean {
    return !!(
      this.formData.poNumber &&
      this.formData.poDescription &&
      this.formData.supplier &&
      this.formData.orderDate &&
      this.formData.totalAmount > 0 &&
      this.formData.status
    );
  }

  createPurchaseOrder(formData: PurchaseOrderFormData): void {
    const newOrder = this.mapDisplayToApi(formData);
    
    this.purchaseOrderService.createPurchaseOrder(newOrder).subscribe({
      next: (response) => {
        console.log('Create response:', response);
        this.showSuccessMessage('Purchase order created successfully!');
        this.closeSidebar();
        this.getPurchaseOrders(1);
      },
      error: (error) => {
        console.error('Error creating purchase order:', error);
        this.showErrorMessage('Failed to create purchase order');
      }
    });
  }

  updatePurchaseOrder(formData: PurchaseOrderFormData): void {
    if (!formData.id) {
      this.showErrorMessage('Invalid purchase order');
      return;
    }

    const updatedOrder = this.mapDisplayToApi(formData);
    
    this.purchaseOrderService.updatePurchaseOrder(updatedOrder).subscribe({
      next: (response) => {
        console.log('Update response:', response);
        this.showSuccessMessage('Purchase order updated successfully!');
        this.closeSidebar();
        const currentPage = Math.floor(this.first / this.rows) + 1;
        this.getPurchaseOrders(currentPage);
      },
      error: (error) => {
        console.error('Error updating purchase order:', error);
        this.showErrorMessage('Failed to update purchase order');
      }
    });
  }

  onFiltersChange(filters: TopPanelFilters): void {
    console.log('Filters changed:', filters);
    this.searchStr = filters.searchTerm;
    this.dateRange = filters.dateRange;
    this.status = filters.dropdownValue;

    const searchObj: any = {
      searchstr: this.searchStr,
      status_id: this.status
    };

    if (this.dateRange && this.dateRange.length === 2) {
      searchObj.start_date = this.dateRange[0].toISOString().split('T')[0];
      searchObj.end_date = this.dateRange[1].toISOString().split('T')[0];
    }

    this.getPurchaseOrders(1, searchObj);
  }

  onPaginationChanged(event: { first: number; rows: number }) {
    this.first = event.first;
    this.rows = event.rows;
    const currentPage = Math.floor(this.first / this.rows) + 1;
    this.getPurchaseOrders(currentPage);
  }

  closeSidebar(): void {
    this.sidebarVisible = false;
    this.selectedProduct = null;
    this.resetFormData();
    this.formSubmitted = false;
    this.isCreateAction = false;
    this.isUpdateAction = false;
  }

  onSideFormVisibleChange(visible: boolean): void {
    this.sidebarVisible = visible;
    if (!visible) {
      this.closeSidebar();
    }
  }

  onFormDataChange(updatedFormData: PurchaseOrderFormData): void {
    this.formData = { ...updatedFormData };
    
    if (this.formData.totalAmount && typeof this.formData.totalAmount === 'string') {
      const parsed = parseFloat(this.formData.totalAmount);
      if (!isNaN(parsed)) {
        this.formData.totalAmount = parsed;
      }
    }
    
    this.cdr.detectChanges();
  }

  private resetFormData(): void {
    this.formData = {
      id: null,
      poNumber: "",
      poDescription: "",
      supplier: "",
      orderDate: null,
      totalAmount: 0,
      status: ""
    };
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';

    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
      }
    } catch (error) {
      console.error('Date formatting error:', error);
    }

    return '';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'draft':
        return 'status-draft';
      case 'approved':
        return 'status-approved';
      case 'shipped':
        return 'status-shipped';
      case 'pending':
        return 'status-pending';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  hasActiveFilters(): boolean {
    return !!(this.searchStr || this.status || (this.dateRange && this.dateRange.length === 2));
  }

  openConfirmDelete(po_id: number) {
    this.po_id = po_id;
    this.confirmHeader = 'Delete Purchase Order';
    this.confirmMessage = 'Are you sure you want to delete this purchase order? This action cannot be undone.';
    this.confirmShowReject = true;
    this.confirmShowDelete = true;
    this.confirmShow = false;
    this.isDeleteAction = true;
    this.isUpdateAction = false;
    this.isCreateAction = false;
    this.isRejectAction = false;
    this.showConfirm = true;
  }

  confirmCreateOrUpdate(): void {
    if (this.isCreateAction) {
      this.confirmHeader = "Create Purchase Order";
      this.confirmMessage = "Are you sure you want to create this purchase order?";
    } else {
      this.confirmHeader = "Update Purchase Order";
      this.confirmMessage = "Are you sure you want to update this purchase order?";
    }
    
    this.confirmShowReject = true;
    this.confirmShowDelete = false;
    this.confirmShow = true;
    this.isRejectAction = false;
    this.isDeleteAction = false;
    this.showConfirm = true;
  }

  validateAndConfirmAccept(): void {
    this.formSubmitted = true;
    
    setTimeout(() => {
      if (this.isFormValid()) {
        this.confirmCreateOrUpdate();
      } else {
        this.showErrorMessage('Please fill in all required fields correctly.');
      }
    }, 150);
  }

  handleAccept(): void {
    this.showConfirm = false;
    
    if (this.isCreateAction) {
      if (this.isFormValid()) {
        this.createPurchaseOrder(this.formData);
      } else {
        this.showErrorMessage('Please fill in all required fields correctly.');
      }
    } else if (this.isUpdateAction) {
      if (this.isFormValid()) {
        this.updatePurchaseOrder(this.formData);
      } else {
        this.showErrorMessage('Please fill in all required fields correctly.');
      }
    }
    
    this.isCreateAction = false;
    this.isUpdateAction = false;
    this.isRejectAction = false;
    this.isDeleteAction = false;
  }

  handleReject(): void {
    this.showConfirm = false;
    if (this.isRejectAction) {
      this.showSuccessMessage('Action rejected!');
      this.closeSidebar();
    }
    
    this.isCreateAction = false;
    this.isUpdateAction = false;
    this.isRejectAction = false;
    this.isDeleteAction = false;
  }

  handleDelete(): void {
    this.showConfirm = false;
    
    if (this.isDeleteAction) {
      this.purchaseOrderService.deletePurchaseOrder(this.po_id).subscribe({
        next: (response) => {
          console.log('Delete response:', response);
          this.showSuccessMessage('Purchase order deleted successfully!');
          const currentPage = Math.floor(this.first / this.rows) + 1;
          this.getPurchaseOrders(currentPage);
        },
        error: (error) => {
          console.error('Error deleting purchase order:', error);
          this.showErrorMessage('Failed to delete purchase order');
        }
      });
    }
    
    this.isCreateAction = false;
    this.isUpdateAction = false;
    this.isRejectAction = false;
    this.isDeleteAction = false;
  }

  private showSuccessMessage(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
    });
  }

  private showErrorMessage(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }

  private showInfoMessage(message: string): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: message,
    });
  }
}