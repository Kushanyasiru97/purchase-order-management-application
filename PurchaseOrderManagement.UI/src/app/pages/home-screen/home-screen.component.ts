import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
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
  providers: [ConfirmationService, MessageService],
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
  status!: string;
  totalRecords = 0;
  loading = false;
  po_id!: number;
  
  first = 0;
  rows = 10;
  
  
  sidebarVisible = false;
  sidebarTitle = '';
  sidebarSubtitle = '';
  acceptButtonLabel = '';
  
  
  private mockPurchaseOrders: PurchaseOrder[] = [
    {
      id: 1,
      po_number: 'PO-2024-001',
      po_description: 'Office supplies and equipment for Q1',
      supplier: 'ABC Supplies Inc.',
      order_date: '2024-01-15',
      total_amount: 15000.50,
      status: 'Approved',
      items_count: 12
    },
    {
      id: 2,
      po_number: 'PO-2024-002',
      po_description: 'IT hardware and networking equipment',
      supplier: 'XYZ Trading Co.',
      order_date: '2024-02-20',
      total_amount: 8500.00,
      status: 'Pending',
      items_count: 8
    },
    {
      id: 3,
      po_number: 'PO-2024-003',
      po_description: 'Raw materials for manufacturing',
      supplier: 'Global Materials Ltd.',
      order_date: '2024-03-10',
      total_amount: 25000.75,
      status: 'Completed',
      items_count: 20
    },
    {
      id: 4,
      po_number: 'PO-2024-004',
      po_description: 'Software licenses and subscriptions',
      supplier: 'Tech Solutions Inc.',
      order_date: '2024-03-25',
      total_amount: 12000.00,
      status: 'Approved',
      items_count: 15
    },
    {
      id: 5,
      po_number: 'PO-2024-005',
      po_description: 'Office furniture and fixtures',
      supplier: 'Office Supplies Pro',
      order_date: '2024-04-05',
      total_amount: 3500.25,
      status: 'Cancelled',
      items_count: 5
    },
    {
      id: 6,
      po_number: 'PO-2024-006',
      po_description: 'Industrial machinery and tools',
      supplier: 'Industrial Equipment Co.',
      order_date: '2024-04-15',
      total_amount: 45000.00,
      status: 'Pending',
      items_count: 25
    },
    {
      id: 7,
      po_number: 'PO-2024-007',
      po_description: 'Renewable energy equipment',
      supplier: 'Green Energy Supplies',
      order_date: '2024-05-01',
      total_amount: 18500.50,
      status: 'Approved',
      items_count: 18
    },
    {
      id: 8,
      po_number: 'PO-2024-008',
      po_description: 'Building materials for construction project',
      supplier: 'Construction Materials Ltd.',
      order_date: '2024-05-20',
      total_amount: 32000.00,
      status: 'Completed',
      items_count: 30
    }
  ];

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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeData();
  }

  ngAfterViewInit(): void {}

  private initializeData(): void {
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
    const existingNumbers = this.mockPurchaseOrders
      .map(po => {
        const match = po.po_number.match(/PO-(\d{4})-(\d+)/);
        return match ? parseInt(match[2]) : 0;
      });
    
    const maxNumber = Math.max(...existingNumbers, 0);
    const nextNumber = (maxNumber + 1).toString().padStart(3, '0');
    
    return `PO-${currentYear}-${nextNumber}`;
  }

  getPurchaseOrders(currentPage: number, searchTerm?: any): void {
    this.loading = true;
    
    setTimeout(() => {
      let filteredOrders = [...this.mockPurchaseOrders];
      
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
      
      const startIndex = (currentPage - 1) * this.rows;
      const endIndex = startIndex + this.rows;
      this.visibleProducts = filteredOrders.slice(startIndex, endIndex);
      
      this.loading = false;
    }, 500);
  }

  openCreateNewOrder(): void {
    this.selectedProduct = null;
    this.isCreateAction = true;
    this.isUpdateAction = false;
    
    this.sidebarTitle = 'Create Purchase Order';
    this.sidebarSubtitle = 'Add New Purchase Order Details';
    this.acceptButtonLabel = 'Create';
    
    this.formData = {
      id: null,
      poNumber: this.getNextPONumber(),
      poDescription: "",
      supplier: "",
      orderDate: new Date(),
      totalAmount: 0,
      status: "Draft"
    };
    
    this.sidebarVisible = true;
    this.formSubmitted = false;
  }

  openEditOrder(order: PurchaseOrder): void {
    this.selectedProduct = order;
    this.isCreateAction = false;
    this.isUpdateAction = true;
    
    this.sidebarTitle = 'Edit Purchase Order';
    this.sidebarSubtitle = 'Update Purchase Order Details';
    this.acceptButtonLabel = 'Update';
    
    this.formData = {
      id: order.id,
      poNumber: order.po_number,
      poDescription: order.po_description,
      supplier: order.supplier,
      orderDate: new Date(order.order_date),
      totalAmount: order.total_amount,
      status: order.status
    };
    
    this.sidebarVisible = true;
    this.formSubmitted = false;
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
    const orderDate = formData.orderDate instanceof Date 
      ? formData.orderDate.toISOString().split('T')[0]
      : formData.orderDate;

    const newOrder: PurchaseOrder = {
      id: this.mockPurchaseOrders.length > 0 
        ? Math.max(...this.mockPurchaseOrders.map(o => o.id)) + 1 
        : 1,
      po_number: formData.poNumber,
      po_description: formData.poDescription,
      supplier: formData.supplier,
      order_date: orderDate || new Date().toISOString().split('T')[0],
      total_amount: this.parseNumber(formData.totalAmount),
      status: formData.status,
      items_count: 0
    };

    this.mockPurchaseOrders.unshift(newOrder);
    this.showSuccessMessage('Purchase order created successfully!');
    this.closeSidebar();
    
    this.getPurchaseOrders(1);
  }

  updatePurchaseOrder(formData: PurchaseOrderFormData): void {
    if (!formData.id) {
      this.showErrorMessage('Invalid purchase order');
      return;
    }

    const orderIndex = this.mockPurchaseOrders.findIndex(o => o.id === formData.id);
    
    if (orderIndex !== -1) {
      const orderDate = formData.orderDate instanceof Date 
        ? formData.orderDate.toISOString().split('T')[0]
        : formData.orderDate;

      this.mockPurchaseOrders[orderIndex] = {
        ...this.mockPurchaseOrders[orderIndex],
        po_number: formData.poNumber,
        po_description: formData.poDescription,
        supplier: formData.supplier,
        order_date: orderDate || this.mockPurchaseOrders[orderIndex].order_date,
        total_amount: this.parseNumber(formData.totalAmount),
        status: formData.status
      };

      this.showSuccessMessage('Purchase order updated successfully!');
      this.closeSidebar();
      
      const currentPage = Math.floor(this.first / this.rows) + 1;
      this.getPurchaseOrders(currentPage);
    } else {
      this.showErrorMessage('Failed to update purchase order');
    }
  }

  onFiltersChange(filters: TopPanelFilters): void {
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
      const orderIndex = this.mockPurchaseOrders.findIndex(o => o.id === this.po_id);
      
      if (orderIndex !== -1) {
        this.mockPurchaseOrders.splice(orderIndex, 1);
        this.showSuccessMessage('Purchase order deleted successfully!');
        
        const currentPage = Math.floor(this.first / this.rows) + 1;
        this.getPurchaseOrders(currentPage);
      } else {
        this.showErrorMessage('Failed to delete purchase order');
      }
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