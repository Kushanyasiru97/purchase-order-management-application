export interface DropdownOption {
  label: string;
  value: any;
}

export interface TopPanelConfig {
  // Search Configuration
  searchPlaceholder: string;
  searchTooltip?: string;
  showSearch: boolean;
  searchButtonLabel: string;

  // Date Filter Configuration
  showDateFilter: boolean;
  dateRangePlaceholder: string;
  numberOfMonths: number;
  yearRange: string;

  showTitle?: boolean;
  Title?: string;
  TitleClass?: string;
  TitleStyle?: { [key: string]: any };

  // Dropdown Configuration
  showDropdown?: boolean;
  dropdownLabel?: string;
  dropdownPlaceholder?: string;
  dropdownTooltip?: string;
  dropdownOptions?: DropdownOption[];

  // Custom Button Configuration
  showCustomButton?: boolean;
  customButtonLabel?: string;
  customButtonIcon?: string;
  customButtonImage?: string;
  customButtonImageAlt?: string;
  customButtonImageWidth?: string;
  customButtonImageHeight?: string;
  customButtonClass?: string;
  customButtonStyle?: { [key: string]: any };
  customButtonDisabled?: boolean;
}

export interface TopPanelFilters {
  searchTerm: string;
  dateRange: Date[];
  dropdownValue?: any;
}

export interface BaseFieldConfig<T extends string> {
  key: T;
  label: string;
  type: 'text' | 'number' | 'date' | 'dropdown' | 'textarea' | 'phone' | 'address';
  required?: boolean;
  options?: any[];
  placeholder?: string;
}