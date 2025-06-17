
# SeedQuality System

This document follows the best practices outlined in README_GUIDELINES.md and adheres to its rules for all updates.

## Overview

SeedQuality is a comprehensive seed quality management system designed to connect various stakeholders in the agricultural supply chain. The platform enables genetics companies to register crop varieties, multipliers to produce seed lots, laboratories to test seed quality, and farmers to verify seed authenticity and quality standards.

**User Roles:**
- **Admin**: System administrator with full access to all features and user management
- **Genetics Company**: Manages crop varieties, quality standards, and grants permissions to multipliers
- **Multiplier**: Produces seed lots from licensed varieties and submits samples for testing
- **Lab**: Conducts quality tests on seed samples and provides test results
- **Farmer**: End consumer who verifies seed quality through QR codes and lot lookup

## Tech Stack

**Frontend:**
- React 18.3.1 with TypeScript
- Vite for build and development tooling
- Tailwind CSS for styling with custom countryside theme
- Shadcn UI component library (50+ components)
- React Query (@tanstack/react-query) for data fetching and state management
- React Router DOM for navigation and routing
- Lucide React for icons and visual elements
- Recharts for data visualization and charts
- React Hook Form for form management and validation
- Zod for schema validation

**Backend:**
- Supabase for database, authentication, and real-time functionality
- PostgreSQL database with Row Level Security (RLS)
- Real-time subscriptions for live data updates
- Supabase Auth for user authentication and session management
- Supabase Storage for file and media management

**Other Tools:**
- QRCode library for QR code generation
- jsPDF for PDF generation and reports
- UUID for unique identifiers
- Date-fns for date manipulation
- Class Variance Authority (CVA) for component styling
- CLSX and Tailwind Merge for conditional styling

## Project Directory Structure

```
/.git: Version control repository
/.gitignore: Specifies files to ignore in version control
/bun.lockb: Bun package manager lock file
/components.json: Shadcn UI components configuration
/eslint.config.js: ESLint configuration for code linting
/index.html: Main HTML entry point
/package-lock.json: NPM package lock file
/package.json: Node.js project dependencies and scripts
/postcss.config.js: PostCSS configuration for CSS processing
/public: Static assets directory
  /public/bg-barn.jpg: Background image asset
  /public/bg-fields.jpg: Background image asset
  /public/bg-wood.jpg: Background image asset
  /public/favicon.ico: Website favicon
  /public/placeholder.svg: Placeholder image asset
  /public/robots.txt: Search engine crawler instructions
/src: Contains application source code
  /src/App.css: Main application styles
  /src/App.tsx: Root React component with routing configuration
  /src/main.tsx: React application entry point
  /src/index.css: Global CSS styles with Tailwind directives
  /src/vite-env.d.ts: Vite environment type definitions
  /src/components: Reusable UI components and shared functionality
    /src/components/AppLayout.tsx: Main application layout with sidebar navigation
    /src/components/admin: Admin-specific components
      /src/components/admin/UserEditModal.tsx: User editing modal
      /src/components/admin/UserInviteModal.tsx: User invitation modal
      /src/components/admin/UserRoleBadge.tsx: User role display badge
      /src/components/admin/UserStatusIndicator.tsx: User status indicator
      /src/components/admin/UsersTable.tsx: Users management table
    /src/components/auth: Authentication components
      /src/components/auth/ForgotPasswordModal.tsx: Password reset modal
    /src/components/common: Common shared components
      /src/components/common/StandardPageHeader.tsx: Standard page header component
    /src/components/lots: Lot management components
      /src/components/lots/LotCard.tsx: Individual lot display card
      /src/components/lots/LotCreateForm.tsx: Lot creation form
      /src/components/lots/LotFilterBar.tsx: Lot filtering interface
      /src/components/lots/LotTable.tsx: Lots table component
      /src/components/lots/LotsList.tsx: Lots listing component
      /src/components/lots/QRCodeModal.tsx: QR code display modal
      /src/components/lots/SampleCreationModal.tsx: Sample creation modal
      /src/components/lots/details: Lot detail components
        /src/components/lots/details/ActionsSidebar.tsx: Lot actions sidebar
        /src/components/lots/details/BasicInfoCard.tsx: Basic lot information
        /src/components/lots/details/LabelStatusCard.tsx: Label status display
        /src/components/lots/details/LotClassificationCard.tsx: Lot classification
        /src/components/lots/details/LotDetailsHeader.tsx: Lot details header
        /src/components/lots/details/LotDetailsUtils.ts: Lot utilities (TypeScript)
        /src/components/lots/details/LotDetailsUtils.tsx: Lot utilities (React)
        /src/components/lots/details/LotGenealogyTree.tsx: Lot genealogy visualization
        /src/components/lots/details/LotOriginCard.tsx: Lot origin information
        /src/components/lots/details/LotPhotosUpload.tsx: Photo upload component
        /src/components/lots/details/LotQRCode.tsx: QR code component
        /src/components/lots/details/ParameterEvolutionChart.tsx: Parameter charts
        /src/components/lots/details/SamplesTimeline.tsx: Samples timeline
        /src/components/lots/details/TestResultsDisplay.tsx: Test results display
        /src/components/lots/details/TestResultsHistoryCard.tsx: Test results history
        /src/components/lots/details/genealogy: Genealogy tree components
          /src/components/lots/details/genealogy/TreeConnections.tsx: Tree connections
          /src/components/lots/details/genealogy/TreeLegend.tsx: Tree legend
          /src/components/lots/details/genealogy/TreeNodes.tsx: Tree nodes
          /src/components/lots/details/genealogy/treeUtils.ts: Tree utilities
          /src/components/lots/details/genealogy/types.ts: Tree type definitions
      /src/components/lots/form: Lot form components
        /src/components/lots/form/AdditionalNotesSection.tsx: Additional notes section
        /src/components/lots/form/BasicInfoSection.tsx: Basic info section
        /src/components/lots/form/ClassificationSection.tsx: Classification section
        /src/components/lots/form/OriginInfoSection.tsx: Origin info section
        /src/components/lots/form/ProductionDetailsSection.tsx: Production details
        /src/components/lots/form/types.ts: Form type definitions
      /src/components/lots/genetics: Genetics company lot components
        /src/components/lots/genetics/GeneticsLotsTable.tsx: Genetics lots table
      /src/components/lots/multiplier: Multiplier-specific lot components
        /src/components/lots/multiplier/AdvancedFilters.tsx: Advanced filtering
        /src/components/lots/multiplier/ColumnSelector.tsx: Column selection
        /src/components/lots/multiplier/DataViewHeader.tsx: Data view header
        /src/components/lots/multiplier/LotsDataTable.tsx: Data table component
        /src/components/lots/multiplier/MultiplierLotsHeader.tsx: Lots header
        /src/components/lots/multiplier/MultiplierLotsSearch.tsx: Search component
        /src/components/lots/multiplier/types.ts: Type definitions
      /src/components/lots/wizard: Lot creation wizard
        /src/components/lots/wizard/LotCreationWizard.tsx: Main wizard component
        /src/components/lots/wizard/hooks: Wizard hooks
          /src/components/lots/wizard/hooks/useOriginLotFilters.ts: Origin lot filters
          /src/components/lots/wizard/hooks/useWizardState.ts: Wizard state management
        /src/components/lots/wizard/steps: Wizard step components
          /src/components/lots/wizard/steps/LotCustomizationStep.tsx: Customization step
          /src/components/lots/wizard/steps/LotReviewStep.tsx: Review step
          /src/components/lots/wizard/steps/LotTypeSelectionStep.tsx: Type selection
          /src/components/lots/wizard/steps/NewLotDetailsStep.tsx: Details step
          /src/components/lots/wizard/steps/OriginChoiceStep.tsx: Origin choice
          /src/components/lots/wizard/steps/OriginLotSelectionStep.tsx: Origin selection
    /src/components/multiplier: Multiplier-specific components
      /src/components/multiplier/samples: Multiplier sample components
        /src/components/multiplier/samples/MultiplierSamplesHeader.tsx: Samples header
        /src/components/multiplier/samples/SampleStatsCards.tsx: Sample statistics
        /src/components/multiplier/samples/SamplesGrid.tsx: Samples grid layout
        /src/components/multiplier/samples/SamplesSearchFilter.tsx: Search/filter
    /src/components/plants: Plant management components
      /src/components/plants/CreatePlantModal.tsx: Plant creation modal
      /src/components/plants/GeneticsCompanyPlantsView.tsx: Genetics company plants view
      /src/components/plants/MultiplierPlantsView.tsx: Multiplier plants view
      /src/components/plants/PlantVerificationTable.tsx: Plant verification table
    /src/components/samples: Sample management components
      /src/components/samples/AccessDeniedState.tsx: Access denied state
      /src/components/samples/AuthenticationLoader.tsx: Auth loading state
      /src/components/samples/DebugInfo.tsx: Debug information display
      /src/components/samples/ErrorState.tsx: Error state component
      /src/components/samples/LabSampleDetail.tsx: Lab sample details
      /src/components/samples/LabelDebugger.tsx: Label debugging tool
      /src/components/samples/LoadingState.tsx: Loading state component
      /src/components/samples/MultiplierSampleDetail.tsx: Multiplier sample details
      /src/components/samples/NavigationHeader.tsx: Navigation header
      /src/components/samples/NotFoundState.tsx: Not found state
      /src/components/samples/SampleCard.tsx: Sample display card
      /src/components/samples/SampleDetail.tsx: Sample detail component
      /src/components/samples/SampleDetailHeader.tsx: Sample detail header
      /src/components/samples/SampleForm.tsx: Sample creation/edit form
      /src/components/samples/SampleInfoDisplay.tsx: Sample information display
      /src/components/samples/SampleStatusBadge.tsx: Sample status badge
      /src/components/samples/StatusActions.tsx: Status action buttons
      /src/components/samples/TestResultsCard.tsx: Test results card
      /src/components/samples/test-results: Test result components
        /src/components/samples/test-results/ParameterInput.tsx: Parameter input
        /src/components/samples/test-results/ParameterInputGroup.tsx: Input group
        /src/components/samples/test-results/ParameterTooltip.tsx: Parameter tooltip
        /src/components/samples/test-results/ParameterValidationStatus.tsx: Validation
        /src/components/samples/test-results/TestResultForm.tsx: Test result form
    /src/components/security: Security components
      /src/components/security/SecurePublicAccess.tsx: Secure public access
    /src/components/standards: Standards management components
      /src/components/standards/ExistingStandardsList.tsx: Existing standards list
      /src/components/standards/NoParametersWarning.tsx: No parameters warning
      /src/components/standards/StandardsHeader.tsx: Standards header
      /src/components/standards/StandardsLoading.tsx: Standards loading state
      /src/components/standards/StandardsMainContent.tsx: Main content
      /src/components/standards/StandardsStatistics.tsx: Standards statistics
      /src/components/standards/StandardsTableCreation.tsx: Standards table creation
    /src/components/ui: Shadcn UI component library (50+ components)
      /src/components/ui/accordion.tsx: Accordion component
      /src/components/ui/alert-dialog.tsx: Alert dialog component
      /src/components/ui/alert.tsx: Alert component
      /src/components/ui/aspect-ratio.tsx: Aspect ratio component
      /src/components/ui/avatar.tsx: Avatar component
      /src/components/ui/badge.tsx: Badge component
      /src/components/ui/breadcrumb.tsx: Breadcrumb component
      /src/components/ui/button.tsx: Button component
      /src/components/ui/calendar.tsx: Calendar component
      /src/components/ui/card.tsx: Card component
      /src/components/ui/carousel.tsx: Carousel component
      /src/components/ui/chart.tsx: Chart component
      /src/components/ui/checkbox.tsx: Checkbox component
      /src/components/ui/collapsible.tsx: Collapsible component
      /src/components/ui/command.tsx: Command component
      /src/components/ui/context-menu.tsx: Context menu component
      /src/components/ui/dialog.tsx: Dialog component
      /src/components/ui/drawer.tsx: Drawer component
      /src/components/ui/dropdown-menu.tsx: Dropdown menu component
      /src/components/ui/form.tsx: Form component
      /src/components/ui/hover-card.tsx: Hover card component
      /src/components/ui/input-otp.tsx: OTP input component
      /src/components/ui/input.tsx: Input component
      /src/components/ui/label.tsx: Label component
      /src/components/ui/menubar.tsx: Menubar component
      /src/components/ui/navigation-menu.tsx: Navigation menu component
      /src/components/ui/pagination.tsx: Pagination component
      /src/components/ui/popover.tsx: Popover component
      /src/components/ui/progress.tsx: Progress component
      /src/components/ui/radio-group.tsx: Radio group component
      /src/components/ui/resizable.tsx: Resizable component
      /src/components/ui/scroll-area.tsx: Scroll area component
      /src/components/ui/select.tsx: Select component
      /src/components/ui/separator.tsx: Separator component
      /src/components/ui/sheet.tsx: Sheet component
      /src/components/ui/sidebar.tsx: Sidebar component
      /src/components/ui/skeleton.tsx: Skeleton component
      /src/components/ui/slider.tsx: Slider component
      /src/components/ui/sonner.tsx: Sonner toast component
      /src/components/ui/switch.tsx: Switch component
      /src/components/ui/table.tsx: Table component
      /src/components/ui/tabs.tsx: Tabs component
      /src/components/ui/textarea.tsx: Textarea component
      /src/components/ui/toast.tsx: Toast component
      /src/components/ui/toaster.tsx: Toaster component
      /src/components/ui/toggle-group.tsx: Toggle group component
      /src/components/ui/toggle.tsx: Toggle component
      /src/components/ui/tooltip.tsx: Tooltip component
      /src/components/ui/use-toast.ts: Toast hook utilities
    /src/components/varieties: Variety management components
      /src/components/varieties/AccessDeniedCard.tsx: Access denied card
      /src/components/varieties/VarietyForm.tsx: Variety form
      /src/components/varieties/VarietyFormActions.tsx: Variety form actions
  /src/context: React context providers
    /src/context/AuthContext.tsx: Authentication state management
  /src/hooks: Custom React hooks
    /src/hooks/lots: Lot-specific hooks (refactored architecture)
      /src/hooks/lots/fetchLotByCode.ts: Fetch lot by code utility
      /src/hooks/lots/fetchLots.ts: Fetch lots utility
      /src/hooks/lots/lotMutations.ts: Lot mutation operations
      /src/hooks/lots/types: Lot type definitions
        /src/hooks/lots/types/lotTransformTypes.ts: Lot transform types
      /src/hooks/lots/useLotQueries.ts: Lot query hooks
      /src/hooks/lots/utils: Lot utilities
        /src/hooks/lots/utils/lotDataTransformer.ts: Data transformer
        /src/hooks/lots/utils/lotQueryBuilder.ts: Query builder
    /src/hooks/multiplier: Multiplier-specific hooks
      /src/hooks/multiplier/multiplierUtils.ts: Multiplier utilities
    /src/hooks/test-results: Test results management hooks
      /src/hooks/test-results/fetchTestResults.ts: Fetch test results
      /src/hooks/test-results/recalculateLotLabels.ts: Lot label recalculation utility
      /src/hooks/test-results/sampleLabelUtils.ts: Sample label utilities
      /src/hooks/test-results/saveTestResults.ts: Save test results
      /src/hooks/test-results/saveTestResultsToDatabase.ts: Database operations
    /src/hooks/use-mobile.tsx: Mobile detection hook
    /src/hooks/use-toast.ts: Toast notification hook
    /src/hooks/useAdminUsers.ts: Admin user management hook
    /src/hooks/useCampaigns.ts: Campaign management hook
    /src/hooks/useCategories.ts: Categories management hook
    /src/hooks/useFetchSamples.ts: Sample fetching hook
    /src/hooks/useGenetics.ts: Genetics company operations hook
    /src/hooks/useLotLabels.ts: Lot labels hook
    /src/hooks/useLotTypes.ts: Lot types hook
    /src/hooks/useLots.ts: Main lot management hook (refactored)
    /src/hooks/useMenuPermissions.ts: Menu permissions hook
    /src/hooks/useParameterLabels.ts: Parameter labels hook
    /src/hooks/useParametersForStandards.ts: Parameters for standards hook
    /src/hooks/useParentLots.ts: Parent lots hook
    /src/hooks/usePlants.ts: Plants management hook
    /src/hooks/useSampleDetails.ts: Sample details management hook
    /src/hooks/useSampleLabels.ts: Sample labels hook
    /src/hooks/useSampleStatuses.ts: Sample statuses hook
    /src/hooks/useSampleTypes.ts: Sample types hook
    /src/hooks/useSamples.ts: Sample data management hook
    /src/hooks/useStandards.ts: Standards management hook
    /src/hooks/useTestResults.ts: Test results hook
    /src/hooks/useTestResultsEnhanced.ts: Enhanced test results hook
    /src/hooks/useTests.ts: Tests management hook
    /src/hooks/useUnits.ts: Units management hook
    /src/hooks/useUsers.ts: User management hook
    /src/hooks/useVarieties.ts: Varieties management hook
    /src/hooks/useVarietyPermissions.ts: Variety permissions hook
  /src/integrations: External service integrations
    /src/integrations/supabase: Supabase configuration and types
      /src/integrations/supabase/client.ts: Supabase client configuration
      /src/integrations/supabase/queryLogger.ts: Query performance logging
      /src/integrations/supabase/types.ts: TypeScript type definitions
  /src/lib: Utility libraries
    /src/lib/utils.ts: General utility functions
  /src/pages: Application page components organized by feature category
    /src/pages/core: System and infrastructure pages
      /src/pages/core/auth: Authentication pages
        /src/pages/core/auth/Login.tsx: User login page
      /src/pages/core/system: System pages
        /src/pages/core/system/NotFound.tsx: 404 error page
    /src/pages/menu: Menu-driven feature pages (sidebar navigation)
      /src/pages/menu/admin: Admin-only pages
        /src/pages/menu/admin/MenuManagement.tsx: Menu permissions management
        /src/pages/menu/admin/PlantsManagement.tsx: Plants management
        /src/pages/menu/admin/UsersManagement.tsx: User administration
      /src/pages/menu/dashboard: Dashboard pages
        /src/pages/menu/dashboard/index.tsx: Role-based dashboard router
        /src/pages/menu/dashboard/AdminDashboard.tsx: Admin dashboard
        /src/pages/menu/dashboard/FarmerDashboard.tsx: Farmer dashboard
        /src/pages/menu/dashboard/GeneticsCompanyDashboard.tsx: Genetics company dashboard
        /src/pages/menu/dashboard/LabDashboard.tsx: Lab dashboard
        /src/pages/menu/dashboard/MultiplierDashboard.tsx: Multiplier dashboard
      /src/pages/menu/lot-lookup: Lot lookup functionality
        /src/pages/menu/lot-lookup/index.tsx: Public lot verification page
      /src/pages/menu/lots: Lot management pages
        /src/pages/menu/lots/index.tsx: Role-based lot router
        /src/pages/menu/lots/CreateLot.tsx: Lot creation page
        /src/pages/menu/lots/genetics: Genetics company lot pages
          /src/pages/menu/lots/genetics/GeneticsCompanyLotsPage.tsx: Genetics company lots
        /src/pages/menu/lots/lab: Lab-specific lot pages
          /src/pages/menu/lots/lab/LabLotsPage.tsx: Lab lots overview
        /src/pages/menu/lots/multiplier: Multiplier-specific lot pages
          /src/pages/menu/lots/multiplier/MultiplierLotsDataView.tsx: Data view page
          /src/pages/menu/lots/multiplier/MultiplierLotsPage.tsx: Multiplier lots management
      /src/pages/menu/samples: Sample management pages
        /src/pages/menu/samples/index.tsx: Role-based sample router
        /src/pages/menu/samples/SampleDetailPage.tsx: Sample detail redirector
        /src/pages/menu/samples/lab: Lab-specific sample pages
          /src/pages/menu/samples/lab/LabSampleDetailPage.tsx: Lab sample details
          /src/pages/menu/samples/lab/LabSamplesPage.tsx: Lab samples list
        /src/pages/menu/samples/multiplier: Multiplier-specific sample pages
          /src/pages/menu/samples/multiplier/MultiplierSampleDetailPage.tsx: Multiplier sample details
          /src/pages/menu/samples/multiplier/MultiplierSamplesPage.tsx: Multiplier samples list
      /src/pages/menu/varieties: Variety management pages
        /src/pages/menu/varieties/index.tsx: Varieties list and management
        /src/pages/menu/varieties/CreateVariety.tsx: Variety creation page
        /src/pages/menu/varieties/EditVariety.tsx: Variety editing page
        /src/pages/menu/varieties/VarietyDetail.tsx: Variety detail page
    /src/pages/Claims: Claims management pages
      /src/pages/Claims/index.tsx: Claims handling page
    /src/pages/Index.tsx: Application landing page
    /src/pages/LabSamples.tsx: Legacy lab samples page (deprecated)
    /src/pages/Login: Legacy login pages (deprecated)
      /src/pages/Login/index.tsx: Legacy login page
    /src/pages/LotDetails.tsx: Individual lot details page
    /src/pages/NotFound.tsx: Legacy 404 page (deprecated)
    /src/pages/Permissions: Permission management pages
      /src/pages/Permissions/GeneticsCompanyPermissionsPage.tsx: Genetics company permissions
      /src/pages/Permissions/index.tsx: Permission management router
    /src/pages/PublicLotDetails.tsx: Public lot details page
    /src/pages/ResetPassword.tsx: Password reset page
    /src/pages/StandardsForm.tsx: Standards creation form
    /src/pages/StandardsManagementPage.tsx: Standards management
    /src/pages/TestTemplates: Test template pages
      /src/pages/TestTemplates/index.tsx: Test templates list
      /src/pages/TestTemplates/TestTemplateDetail.tsx: Test template details
      /src/pages/TestTemplates/TestTemplateForm.tsx: Test template form
  /src/styles: Styling and design guidelines
    /src/styles/visual-guidelines.md: Visual design guidelines for consistent UI
  /src/types: TypeScript type definitions
    /src/types/index.ts: Main type definitions
    /src/types/lot-lookup.ts: Lot lookup specific types
    /src/types/master-data.ts: Master data types
    /src/types/organization.ts: Organization types
  /src/utils: Utility functions
    /src/utils/addMenuManagementItem.sql: SQL script for adding menu management
    /src/utils/addDataViewMenuItem.sql: SQL script for adding data view menu item
    /src/utils/dataExport.ts: Data export utilities
    /src/utils/iconMapping.ts: Icon mapping utilities
    /src/utils/labelDebugHelper.ts: Label debugging utilities
    /src/utils/lotStatusUtils.ts: Lot status utilities
    /src/utils/lotTypeUtils.ts: Lot type utilities
    /src/utils/pdfGenerator.ts: PDF generation utilities
    /src/utils/qrCode.ts: QR code utilities
/supabase: Supabase configuration
  /supabase/config.toml: Supabase project configuration
  /supabase/migrations: Database migration files
    /supabase/migrations/20250609143353-388ca780-2f5f-4692-a59b-33f1aa675156.sql: Data view menu item migration
/tailwind.config.ts: Tailwind CSS configuration with custom theme
/tsconfig.json: TypeScript configuration
/tsconfig.app.json: TypeScript app-specific configuration
/tsconfig.node.json: TypeScript Node.js configuration
/vite.config.ts: Vite build tool configuration
/README.md: Project documentation
/READMEGUIDELINES.md: README writing guidelines
```

**Note**: Maintainers can generate the directory tree using `tree -a -I '.git'` (Unix) or `dir /s /a` (Windows) and manually add descriptions for each file/directory.

## Database Schema

**Complete Database Schema - All Tables**

| Table | Column | Type | Constraints | Purpose |
|-------|--------|------|-------------|---------|
| action_logs | id | UUID | Primary Key | Unique action log identifier |
| action_logs | user_id | UUID | Foreign Key (users), Not Null | Reference to user performing action |
| action_logs | action | TEXT | Not Null | Description of action performed |
| action_logs | details | JSONB | Nullable | Additional action details in JSON format |
| action_logs | timestamp | TIMESTAMP WITH TIME ZONE | Default: now() | When action occurred |
| campaigns | id | UUID | Primary Key | Unique campaign identifier |
| campaigns | name | TEXT | Not Null | Campaign name |
| campaigns | description | TEXT | Nullable | Campaign description |
| campaigns | start_date | DATE | Nullable | Campaign start date |
| campaigns | end_date | DATE | Nullable | Campaign end date |
| campaigns | created_by | UUID | Foreign Key (users) | Reference to creator |
| campaigns | created_at | TIMESTAMP WITH TIME ZONE | Default: now() | Creation timestamp |
| campaigns | updated_at | TIMESTAMP WITH TIME ZONE | Default: now() | Last update timestamp |
| categories | id | UUID | Primary Key | Unique category identifier |
| categories | name | TEXT | Not Null | Category name |
| categories | description | TEXT | Nullable | Category description |
| categories | created_at | TIMESTAMP WITH TIME ZONE | Default: now() | Creation timestamp |
| categories | updated_at | TIMESTAMP WITH TIME ZONE | Default: now() | Last update timestamp |
| crops | id | UUID | Primary Key | Unique crop identifier |
| crops | name | TEXT | Not Null | Crop name (e.g., Wheat, Corn, Soybean) |
| crops | scientific_name | TEXT | Nullable | Scientific name of crop |
| crops | created_at | TIMESTAMP WITH TIME ZONE | Default: now() | Creation timestamp |
| crops | updated_at | TIMESTAMP WITH TIME ZONE | Default: now() | Last update timestamp |
| lot_labels | id | UUID | Primary Key | Unique lot label identifier |
| lot_labels | name | TEXT | Not Null | Label name (Standard, Superior, Retenido, No analizado) |
| lot_labels | description | TEXT | Nullable | Label description |
| lot_labels | created_at | TIMESTAMP WITH TIME ZONE | Default: now() | Creation timestamp |
| lot_labels | updated_at | TIMESTAMP WITH TIME ZONE | Default: now() | Last update timestamp |
| lot_types | id | UUID | Primary Key | Unique lot type identifier |
| lot_types | name | TEXT | Not Null | Type name (Original, Derived) |
| lot_types | description | TEXT | Nullable | Type description |
| lot_types | created_at | TIMESTAMP WITH TIME ZONE | Default: now() | Creation timestamp |
| lot_types | updated_at | TIMESTAMP WITH TIME ZONE | Default: now() | Last update timestamp |
| lots | id | UUID | Primary Key | Unique lot identifier |
| lots | code | TEXT | Unique, Not Null | Lot tracking code for identification |
| lots | variety_id | UUID | Foreign Key (varieties), Not Null | Reference to variety |
| lots | user_id | UUID | Foreign Key (users), Not Null | Reference to multiplier user |
| lots | lot_type_id | UUID | Foreign Key (lot_types) | Reference to lot type |
| lots | parent_lot_id | UUID | Foreign Key (lots) | Reference to parent lot for derived lots |
| lots | campaign_id | UUID | Foreign Key (campaigns) | Reference to production campaign |
| lots | status | TEXT | Default: 'retenido' | Lot status (standard, superior, retenido) |
| lots | calculated_label_id | UUID | Foreign Key (lot_labels) | Calculated quality label based on test results |
| lots | overridden | BOOLEAN | Default: false | Whether status was manually overridden |
| lots | override_reason | TEXT | Nullable | Reason for status override |
| lots | overridden_by | UUID | Foreign Key (users) | User who overrode the status |
| lots | qr_url | TEXT | Nullable | QR code URL for lot verification |
| lots | harvest_date | DATE | Nullable | Date of harvest |
| lots | processing_date | DATE | Nullable | Date of processing |
| lots | estimated_weight | DECIMAL | Nullable | Estimated weight in kg |
| lots | actual_weight | DECIMAL | Nullable | Actual weight in kg |
| lots | moisture_content | DECIMAL | Nullable | Moisture content percentage |
| lots | storage_location | TEXT | Nullable | Storage facility location |
| lots | notes | TEXT | Nullable | Additional notes |
| lots | created_at | TIMESTAMP WITH TIME ZONE | Default: now() | Creation timestamp |
| lots | updated_at | TIMESTAMP WITH TIME ZONE | Default: now() | Last update timestamp |
| media | id | UUID | Primary Key | Unique media identifier |
| media | lot_id | UUID | Foreign Key (lots), Not Null | Reference to associated lot |
| media | url | TEXT | Not Null | Media file URL in storage |
| media | type | TEXT | Not Null | Media type (image, video, document) |
| media | created_at | TIMESTAMP WITH TIME ZONE | Default: now() | Creation timestamp |
| media | updated_at | TIMESTAMP WITH TIME ZONE | Default: now() | Last update timestamp |
| menu_items | id | UUID | Primary Key | Unique menu item identifier |
| menu_items | name | TEXT | Not Null | Menu item display name |
| menu_items | href | TEXT | Not Null | Menu item URL path |
| menu_items | icon_name | TEXT | Not Null | Lucide icon name for menu |
| menu_items | description | TEXT | Nullable | Menu item description |
| menu_items | is_active | BOOLEAN | Default: true | Whether menu item is active |
| menu_items | sort_order | INTEGER | Default: 0 | Display order in menu |
| menu_items | created_at | TIMESTAMP WITH TIME ZONE | Default: now() | Creation timestamp |
| menu_items | updated_at | TIMESTAMP WITH TIME ZONE | Default: now() | Last update timestamp |
| organizations | id | UUID | Primary Key | Unique organization identifier |
| organizations | name | TEXT | Not Null | Organization name |
| organizations | type | TEXT | Not Null | Organization type (genetics, multiplier, lab) |
| organizations | email | TEXT | Nullable | Contact email |
| organizations | phone | TEXT | Nullable | Contact phone number |
| organizations | address | TEXT | Nullable | Physical address |
| organizations | created_at | TIMESTAMP WITH TIME ZONE | Default: now() | Creation timestamp |
| organizations | updated_at | TIMESTAMP WITH TIME ZONE | Default: now() | Last update timestamp |
| parameter_labels | id | UUID | Primary Key | Unique parameter label identifier |
| parameter_labels | parameter_id | UUID | Foreign Key (parameters), Not Null | Reference to parameter |
| parameter_labels | label_id | UUID | Foreign Key (sample_labels), Not Null | Reference to quality label |
| parameter_labels | min_value | DECIMAL | Nullable | Minimum value for this label |
| parameter_labels | max_value | DECIMAL | Nullable | Maximum value for this label |
| parameter_labels | created_at | TIMESTAMP WITH TIME ZONE | Default: now() | Creation timestamp |
| parameter_labels | updated_at | TIMESTAMP WITH TIME ZONE | Default: now() | Last update timestamp |
| parameters | id | UUID | Primary Key | Unique parameter identifier |
| parameters | test_id | UUID | Foreign Key (tests), Not Null | Reference to test |
| parameters | name | TEXT | Not Null | Parameter name |
| parameters | type | TEXT | Nullable | Parameter data type |
| parameters | unit_id | UUID | Foreign Key (units) | Reference to measurement unit |
| parameters | description | TEXT | Nullable | Parameter description |
| parameters | validation | JSONB | Default: '{"required": false}' | Validation rules in JSON |
| parameters | created_at | TIMESTAMP WITH TIME ZONE | Default: now() | Creation timestamp |
| parameters | updated_at | TIMESTAMP WITH TIME ZONE | Default: now() | Last update timestamp |
| plants | id | UUID | Primary Key | Unique plant identifier |
| plants | variety_id | UUID | Foreign Key (varieties), Not Null | Reference to variety |
| plants | multiplier_id | UUID | Foreign Key (users), Not Null | Reference to multiplier |
| plants | genetics_company_id | UUID | Foreign Key (users), Not Null | Reference to genetics company |
| plants | planted_area | DECIMAL | Nullable | Planted area in hectares |
| plants | planting_date | DATE | Nullable | Date of planting |
| plants | expected_harvest_date | DATE | Nullable | Expected harvest date |
| plants | field_location | TEXT | Nullable | Field location description |
| plants | status | TEXT | Default: 'pending' | Plant status (pending, approved, rejected) |
| plants | notes | TEXT | Nullable | Additional notes |
| plants | created_at | TIMESTAMP WITH TIME ZONE | Default: now() | Creation timestamp |
| plants | updated_at | TIMESTAMP WITH TIME ZONE | Default: now() | Last update timestamp |
| qr_configs | id | UUID | Primary Key | Unique QR config identifier |
| qr_configs | user_id | UUID | Foreign Key (users), Not Null | Reference to user |
| qr_configs | display_fields | ARRAY | Default: ['varietyName', 'cropName', 'status', 'testResults'] | Fields to display in QR |
| qr_configs | created_at | TIMESTAMP WITH TIME ZONE | Default: now() | Creation timestamp |
| qr_configs | updated_at | TIMESTAMP WITH TIME ZONE | Default: now() | Last update timestamp |
| role_menu_permissions | id | UUID | Primary Key | Unique permission identifier |
| role_menu_permissions | menu_item_id | UUID | Foreign Key (menu_items), Not Null | Reference to menu item |
| role_menu_permissions | role | TEXT | Not Null | User role (admin, multiplier, lab, etc.) |
| role_menu_permissions | is_visible | BOOLEAN | Default: true | Whether menu is visible for role |
| role_menu_permissions | created_at | TIMESTAMP WITH TIME ZONE | Default: now() | Creation timestamp |
| role_menu_permissions | updated_at | TIMESTAMP WITH TIME ZONE | Default: now() | Last update timestamp |
| sample_labels | id | UUID | Primary Key | Unique sample label identifier |
| sample_labels | name | TEXT | Not Null | Label name (Standard, Superior, Calidad Standard, Calidad Superior, Retenido) |
| sample_labels | description | TEXT | Nullable | Label description |
| sample_labels | created_at | TIMESTAMP WITH TIME ZONE | Default: now() | Creation timestamp |
| sample_labels | updated_at | TIMESTAMP WITH TIME ZONE | Default: now() | Last update timestamp |
| sample_statuses | id | UUID | Primary Key | Unique sample status identifier |
| sample_statuses | name | TEXT | Not Null | Status name (received, testing, completed) |
| sample_statuses | description | TEXT | Nullable | Status description |
| sample_statuses | created_at | TIMESTAMP WITH TIME ZONE | Default: now() | Creation timestamp |
| sample_statuses | updated_at | TIMESTAMP WITH TIME ZONE | Default: now() | Last update timestamp |
| sample_types | id | UUID | Primary Key | Unique sample type identifier |
| sample_types | name | TEXT | Not Null | Type name (quality, purity, germination) |
| sample_types | description | TEXT | Nullable | Type description |
| sample_types | created_at | TIMESTAMP WITH TIME ZONE | Default: now() | Creation timestamp |
| sample_types | updated_at | TIMESTAMP WITH TIME ZONE | Default: now() | Last update timestamp |
| samples | id | UUID | Primary Key | Unique sample identifier |
| samples | lot_id | UUID | Foreign Key (lots), Not Null | Reference to seed lot |
| samples | user_id | UUID | Foreign Key (users), Not Null | Reference to creating user |
| samples | sample_type_id | UUID | Foreign Key (sample_types), Not Null | Reference to sample type |
| samples | test_ids | ARRAY | Not Null | Array of test IDs for this sample |
| samples | status | TEXT | Default: 'received' | Sample workflow status |
| samples | label_id | UUID | Foreign Key (sample_labels) | Reference to quality label |
| samples | label | TEXT | Nullable | Legacy label field |
| samples | internal_code | TEXT | Nullable | Internal tracking code |
| samples | estimated_result_date | TIMESTAMP WITH TIME ZONE | Nullable | Expected completion date |
| samples | created_at | TIMESTAMP WITH TIME ZONE | Default: now() | Creation timestamp |
| samples | updated_at | TIMESTAMP WITH TIME ZONE | Default: now() | Last update timestamp |
| standards | id | UUID | Primary Key | Unique standard identifier |
| standards | test_id | UUID | Foreign Key (tests), Not Null | Reference to test |
| standards | parameter_id | UUID | Foreign Key (parameters), Not Null | Reference to parameter |
| standards | label_id | UUID | Foreign Key (sample_labels), Not Null | Reference to quality label |
| standards | created_by | UUID | Foreign Key (users), Not Null | Reference to creator |
| standards | criteria | JSONB | Not Null | Standard criteria rules in JSON |
| standards | created_at | TIMESTAMP WITH TIME ZONE | Default: now() | Creation timestamp |
| standards | updated_at | TIMESTAMP WITH TIME ZONE | Default: now() | Last update timestamp |
| test_result_labels | id | UUID | Primary Key | Unique test result label identifier |
| test_result_labels | test_result_id | UUID | Foreign Key (test_results), Not Null | Reference to test result |
| test_result_labels | label_id | UUID | Foreign Key (sample_labels), Not Null | Reference to assigned label |
| test_result_labels | created_at | TIMESTAMP WITH TIME ZONE | Default: now() | Creation timestamp |
| test_result_labels | updated_at | TIMESTAMP WITH TIME ZONE | Default: now() | Last update timestamp |
| test_results | id | UUID | Primary Key | Unique test result identifier |
| test_results | sample_id | UUID | Foreign Key (samples), Not Null | Reference to sample |
| test_results | test_id | UUID | Foreign Key (tests), Not Null | Reference to test |
| test_results | parameter_id | UUID | Foreign Key (parameters), Not Null | Reference to parameter |
| test_results | value | TEXT | Not Null | Test result value |
| test_results | is_valid | BOOLEAN | Default: true | Whether result is valid |
| test_results | created_at | TIMESTAMP WITH TIME ZONE | Default: now() | Creation timestamp |
| test_results | updated_at | TIMESTAMP WITH TIME ZONE | Default: now() | Last update timestamp |
| tests | id | UUID | Primary Key | Unique test identifier |
| tests | name | TEXT | Not Null | Test name |
| tests | description | TEXT | Nullable | Test description |
| tests | created_by | UUID | Foreign Key (users) | Reference to creator |
| tests | is_template | BOOLEAN | Default: false | Whether test is a template |
| tests | created_at | TIMESTAMP WITH TIME ZONE | Default: now() | Creation timestamp |
| tests | updated_at | TIMESTAMP WITH TIME ZONE | Default: now() | Last update timestamp |
| units | id | UUID | Primary Key | Unique unit identifier |
| units | name | TEXT | Not Null | Unit name (%, kg, cm, etc.) |
| units | symbol | TEXT | Not Null | Unit symbol |
| units | description | TEXT | Nullable | Unit description |
| units | created_at | TIMESTAMP WITH TIME ZONE | Default: now() | Creation timestamp |
| units | updated_at | TIMESTAMP WITH TIME ZONE | Default: now() | Last update timestamp |
| user_activity_logs | id | UUID | Primary Key | Unique activity log identifier |
| user_activity_logs | user_id | UUID | Foreign Key (users), Not Null | Reference to user |
| user_activity_logs | action | TEXT | Not Null | Action performed |
| user_activity_logs | details | JSONB | Nullable | Additional action details in JSON |
| user_activity_logs | ip_address | INET | Nullable | User's IP address |
| user_activity_logs | user_agent | TEXT | Nullable | User's browser/device info |
| user_activity_logs | created_at | TIMESTAMP WITH TIME ZONE | Default: now() | Creation timestamp |
| user_invitations | id | UUID | Primary Key | Unique invitation identifier |
| user_invitations | email | TEXT | Not Null | Invited user email |
| user_invitations | role | TEXT | Not Null | Invited user role |
| user_invitations | token | TEXT | Not Null | Invitation token |
| user_invitations | invited_by | UUID | Foreign Key (users) | Reference to inviting user |
| user_invitations | expires_at | TIMESTAMP WITH TIME ZONE | Not Null | Invitation expiration |
| user_invitations | accepted_at | TIMESTAMP WITH TIME ZONE | Nullable | When invitation was accepted |
| user_invitations | created_at | TIMESTAMP WITH TIME ZONE | Default: now() | Creation timestamp |
| users | id | UUID | Primary Key | Unique user identifier |
| users | name | TEXT | Nullable | User's display name |
| users | email | TEXT | Nullable | User's email address |
| users | role | TEXT | Nullable | User's role in the system |
| users | organization_id | UUID | Foreign Key (organizations) | Reference to user's organization |
| users | is_active | BOOLEAN | Default: true | Whether user account is active |
| users | last_login_at | TIMESTAMP WITH TIME ZONE | Nullable | Last login timestamp |
| users | created_at | TIMESTAMP WITH TIME ZONE | Default: now() | Creation timestamp |
| users | updated_at | TIMESTAMP WITH TIME ZONE | Default: now() | Last update timestamp |
| varieties | id | UUID | Primary Key | Unique variety identifier |
| varieties | name | TEXT | Not Null | Variety name |
| varieties | description | TEXT | Nullable | Variety description |
| varieties | crop_id | UUID | Foreign Key (crops) | Reference to parent crop |
| varieties | category_id | UUID | Foreign Key (categories) | Reference to variety category |
| varieties | created_by | UUID | Foreign Key (users) | Reference to genetics company owner |
| varieties | created_at | TIMESTAMP WITH TIME ZONE | Default: now() | Creation timestamp |
| varieties | updated_at | TIMESTAMP WITH TIME ZONE | Default: now() | Last update timestamp |
| variety_permissions | id | UUID | Primary Key | Unique permission identifier |
| variety_permissions | variety_id | UUID | Foreign Key (varieties), Not Null | Reference to variety |
| variety_permissions | user_id | UUID | Foreign Key (users), Not Null | Reference to multiplier user |
| variety_permissions | granted_by | UUID | Foreign Key (users), Not Null | Reference to granting user |
| variety_permissions | constraints | JSONB | Nullable | Permission constraints in JSON |
| variety_permissions | expires_at | TIMESTAMP WITH TIME ZONE | Nullable | Permission expiration |
| variety_permissions | granted_at | TIMESTAMP WITH TIME ZONE | Default: now() | When permission was granted |
| variety_permissions | created_at | TIMESTAMP WITH TIME ZONE | Default: now() | Creation timestamp |
| variety_permissions | updated_at | TIMESTAMP WITH TIME ZONE | Default: now() | Last update timestamp |

**RLS Policies:**

Currently, no Row Level Security (RLS) policies are configured in the database. For production security, the following RLS policies should be implemented:

**Recommended RLS Policies to Implement:**

| Policy Name | Table | Operation | Roles | Condition | Purpose |
|-------------|-------|-----------|-------|-----------|---------|
| Users view own profile | users | SELECT | authenticated | `auth.uid() = id` | Users can only view their own profile |
| Multiplier lots access | lots | SELECT, INSERT, UPDATE | authenticated | `user_id = auth.uid() OR role = 'admin'` | Multipliers access their own lots |
| Lab samples access | samples | SELECT, UPDATE | authenticated | `EXISTS(SELECT 1 FROM lots WHERE lots.id = samples.lot_id)` | Labs access submitted samples |
| Genetics varieties access | varieties | SELECT, INSERT, UPDATE | authenticated | `created_by = auth.uid() OR role = 'admin'` | Genetics companies manage their varieties |
| Public lot verification | lots | SELECT | anonymous, authenticated | `TRUE` | Public access for QR code verification |
| Test results privacy | test_results | SELECT | authenticated | `sample_id IN (SELECT id FROM samples WHERE user_id = auth.uid())` | Test results access control |

## Functions & Hooks

### Authentication Management

**useAuth**
- **Purpose**: Manages user authentication state and profile information across the application.
- **Returns**: User object with role and permissions, login/logout functions, loading state, and error handling.
- **Example**:
  ```typescript
  const { user, login, logout, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Login onLogin={login} />;
  ```

### Lot Management (Refactored Architecture)

**useLots**
- **Purpose**: Main hook that combines lot operations and provides unified interface with performance logging.
- **Returns**: Lots array, CRUD operations (createLot, updateLotStatus, getLotByCode), loading states, and error handling.
- **Example**:
  ```typescript
  const { lots, createLot, getLotByCode, updateLotStatus, isLoading } = useLots();
  const handleCreateLot = async (data) => {
    const newLot = await createLot.mutateAsync(data);
  };
  ```

**useLotsQuery**
- **Purpose**: React Query hook for fetching all lots with intelligent caching and performance monitoring.
- **Returns**: Lots data with relationships (variety, crop), loading state, refetch function, and error handling.
- **Example**:
  ```typescript
  const { data: lots, isLoading, refetch } = useLotsQuery();
  ```

**useLotByCodeQuery**
- **Purpose**: React Query hook for fetching a single lot by code with intelligent caching and performance logging.
- **Parameters**: code (string): Lot code to fetch
- **Returns**: Lot data with full relationships, loading state, enabled based on code presence.
- **Example**:
  ```typescript
  const { data: lot, isLoading } = useLotByCodeQuery(lotCode);
  ```

**useCreateLot**
- **Purpose**: Mutation hook for creating new lots with automatic QR code generation and database logging.
- **Parameters**: Lot creation data (code, varietyId, userId)
- **Returns**: Mutation function with success/error handling and automatic cache invalidation.
- **Example**:
  ```typescript
  const createLot = useCreateLot();
  await createLot.mutateAsync({ code, varietyId, multiplierId });
  ```

**useUpdateLotStatus**
- **Purpose**: Mutation hook for updating lot status with override capabilities and audit logging.
- **Parameters**: Lot ID, new status, optional override reason and overriding user
- **Returns**: Status update function with validation and error handling.
- **Example**:
  ```typescript
  const updateStatus = useUpdateLotStatus();
  await updateStatus.mutateAsync({ 
    lotId, 
    status: 'superior', 
    overrideReason: 'Exceptional quality',
    overriddenBy: userId 
  });
  ```

### Sample Management

**useFetchSamples**
- **Purpose**: Retrieves sample data with advanced filtering, role-based access, and performance logging.
- **Parameters**: filters (object): Optional filters for samples query (status, dateRange, lotId)
- **Returns**: Samples array with relationships, loading state, error object, and refetch function.
- **Example**:
  ```typescript
  const { data: samples, isLoading, error } = useFetchSamples({ 
    status: 'pending',
    dateRange: { start: '2024-01-01', end: '2024-12-31' }
  });
  ```

**useSampleDetails**
- **Purpose**: Handles comprehensive sample operations with validation and error handling.
- **Methods**:
  - getSample(id): Fetches sample by ID with full relationships
  - createSample(data): Creates new sample with validation
  - updateSample(id, data): Updates sample properties with audit logging
  - deleteSample(id): Soft delete sample with confirmation
- **Returns**: Sample operation functions with loading states and error handling.
- **Example**:
  ```typescript
  const { getSample, updateSample, createSample } = useSampleDetails();
  const handleStatusChange = async () => {
    await updateSample(sampleId, { 
      status: 'confirmed',
      estimatedResultDate: new Date('2024-06-15')
    });
  };
  ```

### Test Results Management

**fetchTestResults**
- **Purpose**: Fetches test results with comprehensive performance logging and caching strategies.
- **Parameters**: sampleId (string): ID of the sample to fetch results for
- **Returns**: Promise<TestResult[]>: Array of test results with parameter details and validation status.
- **Example**:
  ```typescript
  const results = await fetchTestResults(sampleId);
  console.log('Test results:', results);
  ```

**saveTestResultsToDatabase**
- **Purpose**: Saves test results to database with validation, label assignment, and lot label calculation.
- **Parameters**: testResults (array): Array of test result objects with validation
- **Returns**: Promise with success confirmation and error handling.
- **Example**:
  ```typescript
  await saveTestResultsToDatabase([
    { parameterId, value: '95%', sampleId, testId }
  ]);
  ```

**recalculateAllLotLabels**
- **Purpose**: One-time function to recalculate all lot labels based on current test results using the "highest bar" logic.
- **Returns**: Promise with updated count and error count.
- **Example**:
  ```typescript
  const { updatedCount, errorCount } = await recalculateAllLotLabels();
  console.log(`Updated ${updatedCount} lots, ${errorCount} errors`);
  ```

### User and Permission Management

**useAdminUsers**
- **Purpose**: Admin-specific user management operations including invitations and role management.
- **Returns**: User CRUD operations, invitation management, and role assignment functions.
- **Example**:
  ```typescript
  const { inviteUser, updateUserRole, deactivateUser } = useAdminUsers();
  ```

**useVarietyPermissions**
- **Purpose**: Manages variety access permissions between genetics companies and multipliers.
- **Methods**: grantPermission, revokePermission, getAuthorizedVarieties
- **Example**:
  ```typescript
  const { grantPermission, getAuthorizedVarieties } = useVarietyPermissions();
  ```

**useMenuPermissions**
- **Purpose**: Manages role-based menu visibility and access control.
- **Returns**: Menu configuration functions and permission checking utilities.
- **Example**:
  ```typescript
  const { updateMenuPermission, getVisibleMenus } = useMenuPermissions();
  ```

### Standards and Quality Management

**useStandards**
- **Purpose**: Manages quality standards creation, validation, and application to test results.
- **Returns**: Standards CRUD operations and validation functions.
- **Example**:
  ```typescript
  const { createStandard, validateAgainstStandards } = useStandards();
  ```

**useTests**
- **Purpose**: Manages test templates and test execution workflows.
- **Returns**: Test management operations and template handling.
- **Example**:
  ```typescript
  const { createTest, getTestTemplates } = useTests();
  ```

## Customer Journeys

### Lab User Journey

| User Role | Step | System Action | Database Change |
|-----------|------|---------------|-----------------|
| Lab | Login with lab credentials | POST /auth/login, useAuth.login() | Updates auth.sessions table |
| Lab | View pending samples dashboard | Navigate to /dashboard, useFetchSamples({ status: 'submitted' }) | Reads from samples table with status filter |
| Lab | Access lab samples page | Navigate to /samples (routed to LabSamplesPage) | N/A - client-side routing |
| Lab | Filter samples by date range | useFetchSamples({ dateRange: { start, end } }) | Queries samples with date constraints |
| Lab | View sample details | Navigate to /lab/samples/:id, getSample(id) | Reads sample with lot and variety relationships |
| Lab | Confirm sample reception | updateSample(id, { status: 'confirmed' }) | Updates samples.status and samples.updated_at |
| Lab | Record test parameters | saveTestResultsToDatabase(results) | Inserts records in test_results table |
| Lab | Validate test results | validateAgainstStandards(results) | Reads from standards table for validation |
| Lab | Assign quality label | updateSample(id, { label_id }) | Updates samples.label_id and creates test_result_labels |
| Lab | Auto-calculate lot label | calculateLotLabel(lotId) triggered by test results | Updates lots.calculated_label_id based on test result labels |
| Lab | Mark sample complete | updateSample(id, { status: 'completed' }) | Updates samples.status to 'completed' |
| Lab | Generate test report | generatePDF(sampleId) | Reads test_results for report generation |

### Multiplier User Journey

| User Role | Step | System Action | Database Change |
|-----------|------|---------------|-----------------|
| Multiplier | Login with credentials | POST /auth/login, useAuth.login() | Updates auth.sessions and users.last_login_at |
| Multiplier | View authorized varieties | getAuthorizedVarieties(userId) | Reads from variety_permissions with user filter |
| Multiplier | Access lots management | Navigate to /lots (routed to MultiplierLotsPage) | N/A - client-side routing |
| Multiplier | Access data view | Navigate to /lots/data-view (Vista de Datos menu) | N/A - client-side routing to LotsDataTable |
| Multiplier | Create new seed lot | Navigate to /lots/create, createLot(data) | Inserts record in lots table with QR generation |
| Multiplier | Select lot type | Choose Original or Derived lot type | Updates lots.lot_type_id |
| Multiplier | Link to parent lot | For derived lots, select parent_lot_id | Updates lots.parent_lot_id |
| Multiplier | Upload lot photos | uploadLotMedia(files) | Inserts records in media table with storage URLs |
| Multiplier | Submit sample for testing | createSample({ lotId, testIds, sampleTypeId }) | Inserts record in samples table |
| Multiplier | Select test parameters | updateSample(id, { test_ids }) | Updates samples.test_ids array |
| Multiplier | Set estimated completion | updateSample(id, { estimated_result_date }) | Updates samples.estimated_result_date |
| Multiplier | Access samples page | Navigate to /samples (routed to MultiplierSamplesPage) | N/A - client-side routing |
| Multiplier | View sample progress | Navigate to /multiplier/samples/:id | Reads sample status and test progress |
| Multiplier | Monitor test results | fetchTestResults(sampleId) | Reads from test_results with sample filter |
| Multiplier | Download QR code | generateQRCode(lotId) | Reads lot data for QR generation |
| Multiplier | View lot certification | getLotByCode(code) | Reads lots with variety and test results |

### Genetics Company Journey

| User Role | Step | System Action | Database Change |
|-----------|------|---------------|-----------------|
| Genetics Company | Login to platform | POST /auth/login, useAuth.login() | Updates auth.sessions and user activity logs |
| Genetics Company | Register new crop | createCrop({ name, scientific_name }) | Inserts record in crops table |
| Genetics Company | Create variety | createVariety({ name, description, cropId }) | Inserts record in varieties table |
| Genetics Company | Grant multiplier access | grantPermission({ varietyId, userId, constraints }) | Inserts record in variety_permissions table |
| Genetics Company | Set permission expiry | updatePermission(id, { expires_at }) | Updates variety_permissions.expires_at |
| Genetics Company | Access lots overview | Navigate to /lots (routed to GeneticsCompanyLotsPage) | N/A - client-side routing |
| Genetics Company | Monitor variety performance | getLotsForVariety(varietyId) | Reads lots filtered by variety_id |
| Genetics Company | Create test template | createTest({ name, description, parameters }) | Inserts records in tests and parameters tables |
| Genetics Company | Define quality standards | createStandard({ testId, parameterId, criteria }) | Inserts records in standards table |
| Genetics Company | Review test results | fetchTestResults() with variety filter | Reads aggregated test_results data |
| Genetics Company | Update quality criteria | updateStandard(id, { criteria }) | Updates standards.criteria JSONB field |
| Genetics Company | Revoke permissions | revokePermission(varietyId, userId) | Soft deletes variety_permissions record |

### Admin User Journey

| User Role | Step | System Action | Database Change |
|-----------|------|---------------|-----------------|
| Admin | Login with admin credentials | POST /auth/login, useAuth.login() | Updates auth.sessions with admin role |
| Admin | Access user management | Navigate to /admin/users | N/A - client-side routing |
| Admin | Invite new user | inviteUser({ email, role }) | Inserts record in user_invitations table |
| Admin | Activate user account | updateUser(id, { is_active: true }) | Updates users.is_active |
| Admin | Configure menu permissions | Navigate to /admin/menu | Reads from role_menu_permissions |
| Admin | Update role visibility | updateMenuPermission({ menuId, role, visible }) | Updates role_menu_permissions table |
| Admin | Monitor system activity | getActivityLogs() | Reads from user_activity_logs table |
| Admin | Override lot status | updateLotStatus({ lotId, status, reason, overriddenBy }) | Updates lots with override fields |
| Admin | Access all sample views | Navigate to /samples (full access mode) | Reads all samples regardless of ownership |
| Admin | Access data view | Navigate to /lots/data-view (Vista de Datos menu) | N/A - client-side routing with admin permissions |
| Admin | Manage quality standards | updateStandard(id, criteria) | Updates standards table |
| Admin | Review audit logs | getActionLogs() | Reads from action_logs table |
| Admin | Recalculate lot labels | recalculateAllLotLabels() | Updates lots.calculated_label_id for all lots |
| Admin | Deactivate user | updateUser(id, { is_active: false }) | Updates users.is_active and logs action |

### Farmer Journey

| User Role | Step | System Action | Database Change |
|-----------|------|---------------|-----------------|
| Farmer | Scan QR code on package | QR scanner redirects to /lot-lookup?code=X | N/A - client-side action |
| Farmer | Access lot verification | Navigate to /lot-lookup | N/A - public access page |
| Farmer | Enter lot code manually | useLotByCodeQuery(code) | Reads from lots table with public access |
| Farmer | View seed authenticity | LotDetails component loads | Reads lots, varieties, crops with relationships |
| Farmer | Check variety information | Display variety and crop details | Reads varieties and crops tables |
| Farmer | Access test results | fetchTestResults(sampleId) with public filter | Reads test_results for completed samples |
| Farmer | View quality certification | Display quality labels and standards | Reads sample_labels and standards |
| Farmer | Verify genetics company | Display genetics company information | Reads users table for variety creator |
| Farmer | Download certificate | generatePDF(lotId) with public template | Generates PDF from lot and test data |

## System/Database Actions

| Action | Triggered By | Database Tables Affected | Business Logic |
|--------|-------------|--------------------------|----------------|
| User Authentication | Login form submission | auth.sessions, users, user_activity_logs | Role validation, session creation, activity logging |
| Role-based Page Routing | Menu navigation | role_menu_permissions (reads) | Menu visibility check, access control |
| Data View Menu Access | Vista de Datos navigation | menu_items, role_menu_permissions (reads) | Advanced data table with sorting and filtering |
| Create Lot | useCreateLot mutation | lots, media (if photos), action_logs | QR code generation, status initialization |
| Submit Sample | Sample form submission | samples, user_activity_logs | Test selection validation, lab assignment |
| Update Sample Status | Lab status actions | samples, action_logs | Workflow validation, notification triggers |
| Record Test Results | Test result form submission | test_results, test_result_labels, samples | Standards validation, label assignment |
| Assign Quality Label | Test result evaluation | sample_labels, test_result_labels, lots | Standards comparison, automatic assignment |
| Calculate Lot Label | Test results completion | lots.calculated_label_id | "Highest bar" logic: Retenido > Standard > Superior |
| Update Lot Status | useUpdateLotStatus mutation | lots (status fields), action_logs | Override validation, audit trail |
| Grant Variety Permission | Permission form submission | variety_permissions, action_logs | Authorization check, expiry validation |
| Create Variety | Variety form submission | varieties, action_logs | Genetics company ownership validation |
| Menu Permission Update | Admin menu management | role_menu_permissions, action_logs | Role validation, permission cascading |
| User Activity Logging | All authenticated actions | user_activity_logs | IP tracking, action details, timestamp |
| Query Performance Logging | All database queries | Console logs (development) | Execution time tracking, bottleneck identification |
| QR Code Generation | Lot creation/access | lots (qr_url field) | URL generation, public access configuration |
| File Upload | Media upload actions | media, storage.objects | File validation, storage bucket management |
| Standards Validation | Test result submission | standards (reads), test_results | Criteria evaluation, label determination |
| Audit Trail Creation | Administrative actions | action_logs, user_activity_logs | Change tracking, compliance logging |
| Lot Label Recalculation | Admin recalculation trigger | lots.calculated_label_id | Fixes incorrect calculated labels across all lots |
| Plant Verification | Multiplier plant submission | plants | Genetics company approval workflow |
| Advanced Data Sorting | LotsDataTable column clicks | N/A - client-side sorting | Multi-column sorting with type-aware comparisons |
| Column Visibility Control | ColumnSelector interactions | N/A - client-side state | Dynamic table configuration |

## Version History

| Date | Changes | Author |
|------|---------|--------|
| 2025-06-12 | Updated README with Data View menu implementation and fixed sorting functionality in LotsDataTable | Lovable AI |
| 2025-06-04 | Updated README following guidelines with complete database schema and lot label recalculation features | Lovable AI |
| 2025-05-30 | Updated README following complete guidelines with all tables and comprehensive journeys | Lovable AI |
| 2025-05-30 | Added visual guidelines and fixed navy blue theme consistency | Lovable AI |
| 2025-05-30 | Reorganized project structure by menu categories with role-specific subfolders | Lovable AI |
| 2025-05-29 | Updated README with refactored architecture and performance logging | Lovable AI |
| 2025-05-28 | Updated README with comprehensive file structure and corrected database schema | Lovable AI |
| 2025-05-24 | Updated README to fully comply with guidelines | Lovable AI |
| 2025-05-23 | Added Project Directory Structure section | Lovable AI |
| 2025-05-22 | Initial comprehensive README with customer journeys and system actions | Lovable AI |

## Development

To start development:

1. Clone the repository
2. Install dependencies: `npm install`
3. Connect to Supabase project by configuring environment variables
4. Start development server: `npm run dev`
5. Access the application at `http://localhost:5173`

## Deployment

The application is built with Vite and can be deployed to any static hosting service. Backend services are provided by Supabase for database, authentication, and real-time functionality.

## Performance Monitoring

The application includes comprehensive query performance logging in development mode. All database queries through useLots, useFetchSamples, fetchTestResults, and other data hooks are automatically logged with execution times to help identify performance bottlenecks and optimize database operations.

## Security Considerations

- Implement Row Level Security (RLS) policies on all tables for production deployment
- Configure proper authentication flows with Supabase Auth
- Validate user permissions for all data access operations
- Enable audit logging for all administrative actions
- Secure file upload and storage access through Supabase Storage policies

## Quality Management Features

The system implements advanced quality management with automatic lot label calculation based on the "highest bar" principle:

- **Lot Label Calculation**: Automatically determines lot quality based on test results using hierarchical logic (Retenido > Standard > Superior)
- **Test Result Integration**: Links individual test parameters to sample labels and aggregates to lot-level classifications
- **Recalculation Utilities**: Provides tools to fix and recalculate lot labels when needed
- **Audit Trail**: Maintains complete history of quality decisions and label changes
- **Standards Validation**: Validates test results against predefined quality standards before label assignment

## Advanced Data Management

The system provides comprehensive data management capabilities:

- **Vista de Datos (Data View)**: Advanced data table with multi-column sorting, filtering, and customizable column visibility
- **Performance Optimized**: Client-side sorting and filtering for responsive user experience
- **Role-based Access**: Menu items and data access controlled by role permissions
- **Export Capabilities**: Data export functionality for reporting and analysis
- **Real-time Updates**: Live data synchronization using Supabase real-time subscriptions
