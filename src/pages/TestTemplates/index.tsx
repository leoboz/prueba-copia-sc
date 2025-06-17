
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTests } from '@/hooks/useTests';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, FlaskConical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import TestTemplateForm from './TestTemplateForm';

const TestTemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tests, isLoading, createTestTemplate, refetch } = useTests();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter test templates to only show those created by the current company
  const companyTests = tests?.filter(
    (test) => test.isTemplate && test.createdBy === user?.id
  ) || [];

  // Apply search
  const filteredTests = companyTests.filter((test) =>
    searchTerm === '' || test.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTemplate = async (formData: any) => {
    try {
      await createTestTemplate.mutateAsync({
        test: {
          name: formData.name,
          description: formData.description,
          created_by: user?.id,
          is_template: true,
        },
        parameters: formData.parameters,
      });
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error creating test template:', error);
    }
  };

  const handleViewTemplate = (testId: string) => {
    navigate(`/test-templates/${testId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-navy-800 to-navy-900 rounded-2xl p-8 text-white shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-serif flex items-center mb-2">
                  <FlaskConical className="mr-4 h-10 w-10" />
                  Plantillas de Pruebas
                </h1>
                <p className="text-navy-100 text-lg">
                  Defina pruebas estándar para control de calidad de semillas
                </p>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-white text-navy-900 hover:bg-navy-50">
                    <Plus className="mr-2 h-4 w-4" /> Nueva Plantilla
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[650px]">
                  <DialogHeader>
                    <DialogTitle>Crear Nueva Plantilla de Prueba</DialogTitle>
                    <DialogDescription>Defina los parámetros para esta plantilla de prueba.</DialogDescription>
                  </DialogHeader>
                  <TestTemplateForm onSubmit={handleCreateTemplate} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-navy-600/60" />
            <Input
              placeholder="Buscar plantillas..."
              className="pl-10 border-navy-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <Card className="navy-card p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600 mx-auto mb-4"></div>
            <span className="text-navy-700">Cargando plantillas...</span>
          </Card>
        ) : (
          <>
            {filteredTests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTests.map((test) => (
                  <Card
                    key={test.id}
                    className="navy-card cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                    onClick={() => handleViewTemplate(test.id)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl font-serif text-navy-900">{test.name}</CardTitle>
                      <div className="flex justify-between items-center">
                        <Badge className="bg-navy-600 text-white hover:bg-navy-700">
                          Plantilla
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-navy-600 line-clamp-2 text-sm mb-2">
                        {test.description || 'Sin descripción'}
                      </p>
                      <Separator className="my-2" />
                      <div className="text-xs text-navy-600">
                        Creada: {new Date(test.createdAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="navy-card p-12 text-center">
                <div className="mx-auto bg-navy-100/50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <FlaskConical className="h-8 w-8 text-navy-600 opacity-70" />
                </div>
                <h3 className="text-xl font-serif text-navy-900 mb-2">No hay plantillas</h3>
                <p className="text-navy-600 max-w-md mx-auto mb-6">
                  {searchTerm
                    ? 'No se encontraron plantillas con los filtros aplicados.'
                    : 'Aún no ha creado ninguna plantilla de prueba. Cree su primera plantilla para comenzar.'}
                </p>
                {searchTerm && (
                  <Button variant="outline" onClick={() => setSearchTerm('')} className="border-navy-200 text-navy-600 hover:bg-navy-50">
                    Limpiar búsqueda
                  </Button>
                )}
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TestTemplatesPage;
