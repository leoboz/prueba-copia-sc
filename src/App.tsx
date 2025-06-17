
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/pages/Login';
import ChangePassword from '@/pages/ChangePassword';
import Dashboard from '@/pages/menu/dashboard';
import Varieties from '@/pages/menu/varieties';
import CreateVariety from '@/pages/menu/varieties/CreateVariety';
import EditVariety from '@/pages/menu/varieties/EditVariety';
import VarietyDetail from '@/pages/menu/varieties/VarietyDetail';
import Lots from '@/pages/menu/lots';
import CreateLot from '@/pages/menu/lots/CreateLot';
import LotDetails from '@/pages/LotDetails';
import Samples from '@/pages/menu/samples';
import SampleDetailPage from '@/pages/menu/samples/SampleDetailPage';
import LabSamples from '@/pages/LabSamples';
import LabSamplesPage from '@/pages/menu/samples/lab/LabSamplesPage';
import LabSampleDetailPage from '@/pages/menu/samples/lab/LabSampleDetailPage';
import MultiplierSamplesPage from '@/pages/menu/samples/multiplier/MultiplierSamplesPage';
import MultiplierSampleDetailPage from '@/pages/menu/samples/multiplier/MultiplierSampleDetailPage';
import GeneticsCompanyLotsPage from '@/pages/menu/lots/genetics/GeneticsCompanyLotsPage';
import MultiplierLotsPage from '@/pages/menu/lots/multiplier/MultiplierLotsPage';
import MultiplierLotsDataView from '@/pages/menu/lots/multiplier/MultiplierLotsDataView';
import LabLotsPage from '@/pages/menu/lots/lab/LabLotsPage';
import TestTemplates from '@/pages/TestTemplates';
import TestTemplateForm from '@/pages/TestTemplates/TestTemplateForm';
import TestTemplateDetail from '@/pages/TestTemplates/TestTemplateDetail';
import StandardsManagementPage from '@/pages/StandardsManagementPage';
import StandardsForm from '@/pages/StandardsForm';
import Claims from '@/pages/Claims';
import MenuManagement from '@/pages/menu/admin/MenuManagement';
import UsersManagement from '@/pages/menu/admin/UsersManagement';
import PlantsManagement from '@/pages/menu/admin/PlantsManagement';
import Permissions from '@/pages/Permissions';
import GeneticsCompanyPermissionsPage from '@/pages/Permissions/GeneticsCompanyPermissionsPage';
import ResetPassword from '@/pages/ResetPassword';
import LotLookup from '@/pages/menu/lot-lookup';
import PublicLotDetails from '@/pages/PublicLotDetails';
import NotFound from '@/pages/core/system/NotFound';
import AppLayout from '@/components/AppLayout';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';

const queryClient = new QueryClient();

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, requiresPasswordChange } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-navy-600 mx-auto"></div>
          <p className="mt-4 text-navy-700">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiresPasswordChange) {
    return <Navigate to="/change-password" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/lot-lookup" element={<LotLookup />} />
              <Route path="/lot-lookup/:code" element={<PublicLotDetails />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Protected routes with AppLayout */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="varieties" element={<Varieties />} />
                <Route path="varieties/create" element={<CreateVariety />} />
                <Route path="varieties/edit/:id" element={<EditVariety />} />
                <Route path="varieties/:id" element={<VarietyDetail />} />
                <Route path="lots" element={<Lots />} />
                <Route path="lots/create" element={<CreateLot />} />
                <Route path="lots/:id" element={<LotDetails />} />
                <Route path="lots/genetics" element={<GeneticsCompanyLotsPage />} />
                <Route path="lots/multiplier" element={<MultiplierLotsPage />} />
                <Route path="lots/multiplier/data-view" element={<MultiplierLotsDataView />} />
                <Route path="lots/lab" element={<LabLotsPage />} />
                <Route path="samples" element={<Samples />} />
                <Route path="samples/:id" element={<SampleDetailPage />} />
                <Route path="samples/lab" element={<LabSamplesPage />} />
                <Route path="samples/lab/:id" element={<LabSampleDetailPage />} />
                <Route path="samples/multiplier" element={<MultiplierSamplesPage />} />
                <Route path="samples/multiplier/:id" element={<MultiplierSampleDetailPage />} />
                <Route path="lab-samples" element={<LabSamples />} />
                <Route path="test-templates" element={<TestTemplates />} />
                <Route path="test-templates/create" element={<TestTemplateForm onSubmit={async () => {}} />} />
                <Route path="test-templates/:id" element={<TestTemplateDetail />} />
                <Route path="test-templates/:id/edit" element={<TestTemplateForm onSubmit={async () => {}} />} />
                <Route path="standards" element={<StandardsManagementPage />} />
                <Route path="standards/create" element={<StandardsForm tests={[]} labels={[]} onSubmit={async () => {}} />} />
                <Route path="claims" element={<Claims />} />
                <Route path="admin/menu" element={<MenuManagement />} />
                <Route path="admin/users" element={<UsersManagement />} />
                <Route path="admin/plants" element={<PlantsManagement />} />
                <Route path="permissions" element={<Permissions />} />
                <Route path="permissions/genetics" element={<GeneticsCompanyPermissionsPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
