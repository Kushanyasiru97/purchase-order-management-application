import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { TopPanelConfig, TopPanelFilters } from '../../models/top-panel.interface';
import { TooltipModule } from 'primeng/tooltip';

export interface AutocompleteItem {
  id: number;
  displayText: string;
  address: string;
  cityState: string;
  originalData: any;
}

@Component({
  selector: 'app-top-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CalendarModule,
    DropdownModule,
    AutoCompleteModule,
    TooltipModule
  ],
  templateUrl: './top-panel.component.html',
  styleUrls: ['./top-panel.component.scss']
})
export class TopPanelComponent {
  @Input() config: TopPanelConfig = {
    searchPlaceholder: 'Search...',
    searchTooltip: 'Search',
    showSearch: true,
    showDateFilter: true,
    dateRangePlaceholder: 'Date Range',
    searchButtonLabel: 'Search',
    numberOfMonths: 2,
    yearRange: '2000:2030',
    showDropdown: false,
    dropdownPlaceholder: 'Status',
    dropdownOptions: [],
    showCustomButton: false,
    customButtonLabel: 'Action',
    customButtonClass: 'btn-primary',
    customButtonStyle: {},
    customButtonDisabled: false,
    showTitle: false,
    Title: 'Dashboard',
    TitleClass: 'text-2xl font-bold text-[#001a4c]',
    TitleStyle: {}
  };
  @Input() isDashboard: boolean = false;

  @Input() dateRange: Date[] = [];
  @Input() btnColor: string = '';

  @Output() filtersChange = new EventEmitter<TopPanelFilters>();
  @Output() searchEvent = new EventEmitter<string>();
  @Output() dateRangeChange = new EventEmitter<Date[]>();
  @Output() dateRangeClear = new EventEmitter<Date[]>();
  @Output() dropdownChange = new EventEmitter<any>();
  @Output() customButtonClick = new EventEmitter<void>();

  searchTerm = '';
  showDatePicker = false;
  fromDate!: Date | null;
  toDate!: Date | null;
  dropdown1Value: any = null;

  private appliedSearchTerm = '';
  private appliedAutocompleteTerm = '';

  ngOnInit(): void {
    if (this.dateRange && this.dateRange.length === 2) {
      this.fromDate = this.dateRange[0];
      this.toDate = this.dateRange[1];
    }
    if (this.isDashboard) {
      this.toDate = new Date();
      this.fromDate = new Date(this.toDate.getFullYear(), this.toDate.getMonth(), 1);
      this.dateRange = [this.fromDate, this.toDate];
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.date-picker-dropdown')) {
      this.showDatePicker = false;
    }
  }

  @HostListener('click', ['$event'])
  onComponentClick(event: Event): void {
    event.stopPropagation();
  }

  onSearch(): void {
      const term = this.searchTerm.trim();
      this.appliedSearchTerm = term;
      this.searchEvent.emit(term);
      this.emitFiltersChange();
  }

  onSearchInputChange(): void {
    const currentTerm = this.searchTerm.trim();
    if (currentTerm === '' && this.appliedSearchTerm !== '') {
      this.appliedSearchTerm = '';
      this.searchEvent.emit('');
      this.emitFiltersChange();
    }
  }

  toggleDatePicker(): void {
    this.showDatePicker = !this.showDatePicker;
  }

  closeDatePicker(): void {
    this.showDatePicker = false;
  }

  onFromDateChange(date: Date): void {
    this.fromDate = date;
    if (this.toDate && this.fromDate && this.toDate < this.fromDate) {
      this.toDate = null;
    }
    this.checkAndApplyDateRange();
  }

  onToDateChange(date: Date): void {
    this.toDate = date;
    if (this.fromDate && this.toDate && this.fromDate > this.toDate) {
      this.fromDate = null;
    }
    this.checkAndApplyDateRange();
  }

  private checkAndApplyDateRange(): void {
    if (this.fromDate && this.toDate) {
      this.dateRange = [this.fromDate, this.toDate];
      this.dateRangeChange.emit(this.dateRange);
      this.emitFiltersChange();
      this.closeDatePicker();
    }
  }

  clearDateRange(): void {
    this.fromDate = null;
    this.toDate = null;
    this.dateRange = [];
    this.dateRangeChange.emit(this.dateRange);
    this.dateRangeClear.emit(this.dateRange);
    this.emitFiltersChange();
    this.closeDatePicker();
  }

  hasDateRange(): boolean {
    return this.dateRange && this.dateRange.length === 2;
  }

  getDateRangeDisplayText(): string {
    if (this.hasDateRange()) {
      const [from, to] = this.dateRange;
      return `${this.formatDate(from)} — ${this.formatDate(to)}`;
    }
    return this.config.dateRangePlaceholder || 'Date range';
  }

  onDropdown1Change(event: any): void {
    this.dropdown1Value = event.value;
    this.dropdownChange.emit(this.dropdown1Value);
    this.emitFiltersChange();
  }

  clearAllFilters(): void {
    this.searchTerm = '';
    this.appliedSearchTerm = '';
    this.fromDate = null;
    this.toDate = null;
    this.dateRange = [];
    this.dropdown1Value = null;
    this.searchEvent.emit('');
    this.dateRangeChange.emit([]);
    this.dropdownChange.emit(null);
    this.emitFiltersChange();
  }

  private emitFiltersChange(): void {
    const searchTerm = this.appliedSearchTerm;
    this.filtersChange.emit({
      searchTerm: searchTerm,
      dateRange: this.dateRange,
      dropdownValue: this.dropdown1Value,
    });
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  hasActiveFilters(): boolean {
    const hasSearchTerm = this.appliedSearchTerm.trim() !== '';
    return hasSearchTerm ||
      this.dateRange.length === 2 ||
      this.dropdown1Value !== null 
  }

  onCustomButtonClick(): void {
    this.customButtonClick.emit();
  }

  getCustomButtonStyle(): any {
    const baseStyle = this.config.customButtonStyle || {};
    if (this.btnColor && !baseStyle['background-color'] && !baseStyle['backgroundColor']) {
      return {
        ...baseStyle,
        'background-color': this.btnColor
      };
    }
    return baseStyle;
  }
}

export { TopPanelConfig, TopPanelFilters };