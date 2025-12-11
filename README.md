# Purchase Order Management Application

## Project Overview

This is a full-stack Purchase Order Management Application designed for procurement staff to efficiently manage purchase orders. The application provides a comprehensive CRUD interface with advanced features like filtering, sorting, pagination, and robust validation.

### Key Features
- View purchase orders in a tabular format
- Create, update, and delete purchase orders
- filtering by supplier, status, date range
- Sorting by PO number, Date and Total amount
- Pagination for large datasets
- Real-time input validation
- Responsive UI with professional design


## Architecture & Design Decisions

I chose **Clean Architecture** for this project because it provides several critical advantages that align perfectly with the requirements of a purchase order management system

### Why Clean Architecture?

#### 1. **Separation of Concerns**
Clean Architecture enforces strict separation between business logic, data access, and presentation layers. This means:
- Business rules (purchase order validation, status transitions) remain independent of frameworks
- Database implementation can be changed without affecting business logic
- UI changes don't impact core functionality

#### 2. **Testability**
Each layer can be tested independently:
- Domain entities can be unit tested without database
- Application services can be tested with mock repositories
- Controllers can be tested with mock services
This is crucial for a financial application where accuracy is paramount.

#### 3. **Business Logic Protection**
- Core business rules are isolated in the Domain layer
- Cannot be accidentally modified by UI or infrastructure changes
- Ensures data integrity and business rule consistency

---

## Project Architecture

### Backend Architecture (.NET)

The backend follows **Clean Architecture** with four distinct layers:


#### Layer Details:

**1. Domain Layer** (`Purchaseorder.cs`)
- Contains the `PurchaseOrder` entity
- Defines core business rules and constraints

**2. Application Layer**
- **DTOs**: `CreatePurchaseOrderDto`, `UpdatePurchaseOrderDto`, `PurchaseOrderDto`
  - Separate models for different operations
  - Validation attributes for data integrity
  
- **Interfaces**: `IPurchaseOrderService`, `IPurchaseOrderRepository`
  - Defines contracts for business operations
  
- **Services**: `PurchaseOrderService`
  - Implements business logic
  - Validates duplicate PO numbers
  - Handles error scenarios

**3. Infrastructure Layer**
- **DbContext**: `PurchaseOrderDbContext`
  - Entity Framework Core configuration
  - Database schema definition
  - Unique index on PO Number
  
- **Repository**: `PurchaseOrderRepository`
  - Implements data access operations
  - Async operations for better performance

**4. API Layer**
- **Controller**: `PurchaseOrderController`
  - RESTful API endpoints
  - HTTP status code handling
  - Model validation

### Frontend Architecture

The frontend follows **Angular best practices** with a component-based architecture:

#### Key Design Decisions:

**1. Reactive Forms**
- Used Angular Reactive Forms for better validation control
- Custom validators for business rules
- Real-time validation feedback

**2. Service Layer**
- `PurchaseOrderService`: Handles all HTTP communication

**4. Security Measures**
- Validation of all user inputs

---

## Backend Development Details

### Technology Stack
- **Asp.NET**: Modern, cross-platform framework
- **Entity Framework Core**: ORM for database operations
- **ASP.NET Core Web API**: RESTful API development
- **SQL Server**: Relational database (Code First approach)

### Key Backend Features

**1. Data Validation**
- Required field validation
- String length constraints
- Decimal precision (18,2) for amounts
- Date range validation
- Status enum validation

**2. Business Logic**
- Duplicate PO Number detection
- Unique constraint enforcement
- Status workflow validation
- Comprehensive error messages

**3. Database Design**
- Code First approach
- Automatic migrations
- Unique index on PoNumber

**4. API Design**
- RESTful endpoints
- Consistent error response format
- Async/await for better performance

---

## Frontend Development Details

### Technology Stack
- **Angular**: Modern frontend framework
- **TypeScript**: Type-safe development
- **PrimeNG**: Professional UI components
- **Tailwind CSS**: Utility-first styling

### User Experience Features

**1. Loading States**
- Spinner during data fetch
- Disabled buttons during operations
- Progress indicators

**2. Error Handling**
- Field-level validation messages
- Toast notifications for success/error
- Confirmation dialogs for destructive actions

**3. Data Formatting**
- Date: MM/DD/YYYY format
- Currency: LKR with 2 decimal places
- Status badges with color coding

**4. Responsive Design**
- Mobile-friendly layout
- Adaptive table columns
- Touch-friendly buttons

---

## Database Schema

```sql
Table: PurchaseOrders
├── PurchaseOrderId (PK, INT, IDENTITY)
├── PoNumber (NVARCHAR(50), UNIQUE, NOT NULL)
├── PoDescription (NVARCHAR(500), NOT NULL)
├── SupplierName (NVARCHAR(200), NOT NULL)
├── OrderDate (DATETIME, NOT NULL)
├── TotalAmount (DECIMAL(18,2), NOT NULL)
└── Status (NVARCHAR(20), NOT NULL)

Indexes:
- Primary Key on PurchaseOrderId
- Unique Index on PoNumber
```

---

## Setup Instructions

### Prerequisites
- **.NET SDK**
- **Node.js and npm**
- **SQL Server 2019+** (or SQL Server Express)
- **Visual Studio 2022** or **VS Code**
- **Angular CLI** (`npm install -g @angular/cli`)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PurchaseOrderManagement
   ```

2. **Update Database Connection String**
   - Open `appsettings.json`
   - Update the connection string:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=Your_Server_Name;Database=Your_Database_Name;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=True"
     }
   }
   ```

3. **Restore NuGet Packages**
   ```bash
   dotnet restore
   ```

4. **Apply Database Migrations**
   ```bash
   dotnet ef database update
   ```
   
   *If migrations don't exist, create them:*
   ```bash
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

5. **Run the Backend**
   ```bash
   dotnet run
   ```
   
   The API will be available at: `https://localhost:7096/api`

### Frontend Setup

1. **Navigate to Frontend Directory**
   ```bash
   cd purchase-order-frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Update API Base URL** (if different)
   - Open `src/environments/environment.ts`
   - Update `apiBaseUrl` if needed:
   ```typescript
   export const environment = {
     apiBaseUrl: 'https://localhost:7096/api/'
   };
   ```

4. **Run the Frontend**
   ```bash
   ng serve
   ```
   
   The application will be available at: `http://localhost:4200`

### Verification

1. Open browser and navigate to `http://localhost:4200`
2. You should see the Purchase Order Management interface
3. Try creating a new purchase order
4. Verify CRUD operations work correctly

---

## Assumptions Made

1. **Business Rules**
   - PO Number must be unique across all purchase orders
   - Total amount must have exactly 2 decimal places (LKR currency)
   - Order dates can be up to 10 years in the past and 1 year in the future
   - Valid status values: Draft, Approved, Shipped, Completed, Cancelled

2. **Data Constraints**
   - PO Number: 3-50 characters, alphanumeric with hyphens and underscores
   - Supplier Name: 2-100 characters
   - Description: 5-500 characters
   - Total Amount: 0.01 to 99,999,999.99

3. **User Interface**
   - Users need visual feedback for loading states
   - Confirmation required before deleting
   - Form validation should be real-time
   - Status displayed with color-coded badges

4. **Security**
   - All user inputs must be validated

5. **Performance**
   - Pagination set to reasonable page sizes
   - Async operations used throughout

6. **Authentication & Authorization**
   - Not implemented in this version
