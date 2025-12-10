import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

@Injectable({
  providedIn: 'root'
})
export class InputValidationService {
  
  constructor() {}

  /**
   * Validate PO Number format
   */
  validatePONumber(poNumber: string): ValidationResult {
    const errors: string[] = [];
    
    if (!poNumber || poNumber.trim() === '') {
      errors.push('PO Number is required');
      return { isValid: false, errors };
    }
    
    poNumber = poNumber.trim();
    
    if (poNumber.length < 3 || poNumber.length > 50) {
      errors.push('PO Number must be between 3 and 50 characters');
    }
    
    const validFormat = /^[A-Z]{2,4}-\d{4}-\d{3,6}$/i.test(poNumber);
    if (!validFormat) {
      errors.push('PO Number must follow format: PO-YYYY-XXX (e.g., PO-2025-001)');
    }
    
    if (this.containsSQLInjection(poNumber)) {
      errors.push('PO Number contains invalid characters');
    }
    
    if (this.containsXSS(poNumber)) {
      errors.push('PO Number contains invalid characters');
    }
    
    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate supplier name
   */
  validateSupplierName(supplierName: string): ValidationResult {
    const errors: string[] = [];
    
    if (!supplierName || supplierName.trim() === '') {
      errors.push('Supplier name is required');
      return { isValid: false, errors };
    }
    
    supplierName = supplierName.trim();
    
    if (supplierName.length < 2 || supplierName.length > 100) {
      errors.push('Supplier name must be between 2 and 100 characters');
    }
    
    const validFormat = /^[a-zA-Z0-9\s\-'&.,()]+$/;
    if (!validFormat.test(supplierName)) {
      errors.push('Supplier name contains invalid characters');
    }
    
    if (this.containsSQLInjection(supplierName)) {
      errors.push('Supplier name contains potentially harmful characters');
    }
    
    if (this.containsXSS(supplierName)) {
      errors.push('Supplier name contains potentially harmful characters');
    }
    
    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate description
   */
  validateDescription(description: string): ValidationResult {
    const errors: string[] = [];
    
    if (!description || description.trim() === '') {
      errors.push('Description is required');
      return { isValid: false, errors };
    }
    
    description = description.trim();
    
    if (description.length < 5 || description.length > 500) {
      errors.push('Description must be between 5 and 500 characters');
    }
    
    if (this.containsSQLInjection(description)) {
      errors.push('Description contains potentially harmful characters');
    }
    
    if (this.containsXSS(description)) {
      errors.push('Description contains potentially harmful characters');
    }
    
    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate amount (currency)
   */
  validateAmount(amount: number | string): ValidationResult {
    const errors: string[] = [];
    
    if (amount === null || amount === undefined || amount === '') {
      errors.push('Amount is required');
      return { isValid: false, errors };
    }
    
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(numAmount)) {
      errors.push('Amount must be a valid number');
      return { isValid: false, errors };
    }
    
    if (numAmount < 0.01) {
      errors.push('Amount must be greater than 0');
    }
    
    if (numAmount > 99999999.99) {
      errors.push('Amount exceeds maximum allowed value');
    }
    
    const decimalPlaces = (numAmount.toString().split('.')[1] || '').length;
    if (decimalPlaces > 2) {
      errors.push('Amount can have maximum 2 decimal places');
    }
    
    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate date
   */
  validateOrderDate(date: Date | string | null): ValidationResult {
    const errors: string[] = [];
    
    if (!date) {
      errors.push('Order date is required');
      return { isValid: false, errors };
    }
    
    let dateObj: Date;
    
    if (typeof date === 'string') {
      dateObj = new Date(date);
    } else {
      dateObj = date;
    }
    
    if (isNaN(dateObj.getTime())) {
      errors.push('Invalid date format');
      return { isValid: false, errors };
    }
    
    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
    if (dateObj < tenYearsAgo) {
      errors.push('Order date cannot be more than 10 years in the past');
    }
    
    const oneYearAhead = new Date();
    oneYearAhead.setFullYear(oneYearAhead.getFullYear() + 1);
    if (dateObj > oneYearAhead) {
      errors.push('Order date cannot be more than 1 year in the future');
    }
    
    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate status
   */
  validateStatus(status: string): ValidationResult {
    const errors: string[] = [];
    const validStatuses = ['Draft', 'Approved', 'Shipped', 'Completed', 'Cancelled'];
    
    if (!status || status.trim() === '') {
      errors.push('Status is required');
      return { isValid: false, errors };
    }
    
    if (!validStatuses.includes(status)) {
      errors.push('Invalid status value');
    }
    
    return { isValid: errors.length === 0, errors };
  }

  /**
   * Check for SQL injection patterns
   */
  private containsSQLInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|DECLARE)\b)/gi,
      /(--|;|\/\*|\*\/|xp_|sp_)/gi,
      /('|('')|;|--|\/\*|\*\/)/gi
    ];
    
    return sqlPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Check for XSS patterns
   */
  private containsXSS(input: string): boolean {
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<embed[^>]*>/gi,
      /<object[^>]*>/gi
    ];
    
    return xssPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Sanitize input string
   */
  sanitizeInput(input: string): string {
    if (!input) return '';
    
    let sanitized = input.replace(/[\x00-\x1F\x7F]/g, '');
    sanitized = sanitized.trim();
    sanitized = this.encodeHtmlEntities(sanitized);
    
    return sanitized;
  }

  /**
   * Encode HTML entities
   */
  private encodeHtmlEntities(input: string): string {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  /**
   * Custom validator for Angular forms - PO Number
   */
  poNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      const result = this.validatePONumber(control.value);
      return result.isValid ? null : { poNumber: result.errors.join(', ') };
    };
  }

  /**
   * Custom validator for Angular forms - Supplier Name
   */
  supplierNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      const result = this.validateSupplierName(control.value);
      return result.isValid ? null : { supplierName: result.errors.join(', ') };
    };
  }

  /**
   * Custom validator for Angular forms - Amount
   */
  amountValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value && control.value !== 0) {
        return null;
      }
      
      const result = this.validateAmount(control.value);
      return result.isValid ? null : { amount: result.errors.join(', ') };
    };
  }

  /**
   * Custom validator for Angular forms - Description
   */
  descriptionValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      const result = this.validateDescription(control.value);
      return result.isValid ? null : { description: result.errors.join(', ') };
    };
  }

  /**
   * Validate entire purchase order
   */
  validatePurchaseOrder(order: any): { isValid: boolean; errors: { [key: string]: string[] } } {
    const errors: { [key: string]: string[] } = {};
    
    const poNumberResult = this.validatePONumber(order.poNumber);
    if (!poNumberResult.isValid) {
      errors['poNumber'] = poNumberResult.errors;
    }
    
    const descriptionResult = this.validateDescription(order.poDescription);
    if (!descriptionResult.isValid) {
      errors['poDescription'] = descriptionResult.errors;
    }
    
    const supplierResult = this.validateSupplierName(order.supplierName || order.supplier);
    if (!supplierResult.isValid) {
      errors['supplier'] = supplierResult.errors;
    }
    
    const amountResult = this.validateAmount(order.totalAmount);
    if (!amountResult.isValid) {
      errors['totalAmount'] = amountResult.errors;
    }
    
    const dateResult = this.validateOrderDate(order.orderDate);
    if (!dateResult.isValid) {
      errors['orderDate'] = dateResult.errors;
    }
    
    const statusResult = this.validateStatus(order.status);
    if (!statusResult.isValid) {
      errors['status'] = statusResult.errors;
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}