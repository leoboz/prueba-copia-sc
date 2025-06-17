
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTests } from '@/hooks/useTests';
import { Test, Parameter } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import TestTemplateForm from './TestTemplateForm';
import { toast } from '@/hooks/use-toast';

const TestTemplateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTestWithParameters, updateTestTemplate } = useTests();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: test, isLoading, error } = getTestWithParameters(id || '');

  React.useEffect(() => {
    console.log('TestTemplateDetail mounted, id:', id);
    return () => console.log('TestTemplateDetail unmounted');
  }, [id]);

  React.useEffect(() => {
    if (error) {
      toast({ title: 'Error', description: 'No se pudo cargar la plantilla', variant: 'destructive' });
      navigate('/test-templates');
    }
  }, [error, navigate]);

  const handleUpdateTemplate = async (formData: any) => {
    if (!test) return;
    try {
      await updateTestTemplate.mutateAsync({
        test: { ...test, name: formData.name, description: formData.description },
        parameters: formData.parameters.map((param: any, index: number) => ({
          ...param,
          id: test.parameters[index]?.id,
          test_id: test.id,
        })),
      });
      setIsEditDialogOpen(false);
      toast({ title: 'Plantilla actualizada', description: 'Actualización exitosa' });
    } catch (error) {
      console.error('Error updating test template:', error);
      toast({ title: 'Error', description: 'No se pudo actualizar la plantilla', variant: 'destructive' });
    }
  };

  const formatValidation = (parameter: Parameter) => {
    const validation = parameter.validation;
    if (!validation) return 'Sin reglas';
    const rules = [];
    if (validation.required) rules.push('Obligatorio');
    if (validation.min !== undefined) rules.push(`Mín: ${validation.min}`);
    if (validation.max !== undefined) rules.push(`Máx: ${validation.max}`);
    return rules.join(', ');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100">
        <div className="p-6 max-w-7xl mx-auto">
          <Card className="navy-card p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600 mx-auto mb-4"></div>
            <span className="text-navy-700">Cargando...</span>
          </Card>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100">
        <div className="p-6 max-w-7xl mx-auto">
          <Card className="navy-card p-12 text-center">
            <p className="text-navy-600 mb-4">Plantilla no encontrada</p>
            <Button variant="ghost" onClick={() => navigate('/test-templates')} className="text-navy-600 hover:bg-navy-50">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100">
      <div className="p-6 max-w-7xl mx-auto">
        <Button variant="ghost" className="mb-6 text-navy-600 hover:bg-navy-50" onClick={() => navigate('/test-templates')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>

        <div className="bg-gradient-to-r from-navy-800 to-navy-900 rounded-2xl p-8 text-white shadow-2xl mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-4xl font-serif text-white mb-2">{test.name}</h1>
              <Badge className="bg-white text-navy-900 hover:bg-navy-50">Plantilla de Prueba</Badge>
            </div>
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-navy-900 hover:bg-navy-50">
                  <Edit className="mr-2 h-4 w-4" /> Editar
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[650px]">
                <DialogHeader>
                  <DialogTitle>Editar Plantilla</DialogTitle>
                </DialogHeader>
                <TestTemplateForm
                  onSubmit={handleUpdateTemplate}
                  initialData={{
                    name: test.name,
                    description: test.description,
                    parameters: test.parameters.map((param) => ({
                      name: param.name,
                      description: param.description,
                      type: param.type,
                      validation: param.validation || { required: false },
                    })),
                  }}
                  isEditing
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="navy-card lg:col-span-1">
            <CardContent className="pt-6">
              <h2 className="text-xl font-serif text-navy-900 mb-4">Detalles</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-navy-700">Descripción</h3>
                  <p className="mt-1 text-navy-900">{test.description || 'Sin descripción'}</p>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-navy-700">Creado</h3>
                  <p className="mt-1 text-navy-900">{new Date(test.createdAt).toLocaleDateString()}</p>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-navy-700">Actualizado</h3>
                  <p className="mt-1 text-navy-900">{new Date(test.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="navy-card lg:col-span-2">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-serif text-navy-900">Parámetros</h2>
                <Badge className="bg-navy-600 text-white">{test.parameters.length} {test.parameters.length === 1 ? 'parámetro' : 'parámetros'}</Badge>
              </div>
              {test.parameters.length ? (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {test.parameters.map((param) => (
                    <Card key={param.id} className="bg-navy-50/50 border border-navy-200/40">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-navy-900">{param.name}</h3>
                            <p className="text-sm text-navy-600">{param.description || 'Sin descripción'}</p>
                          </div>
                          <Badge className="bg-navy-600 text-white">
                            {param.type === 'number' || param.type === 'numeric' ? 'Número' :
                             param.type === 'range' ? 'Rango' :
                             param.type === 'boolean' ? 'Si/No' :
                             param.type === 'select' ? 'Selección' :
                             param.type === 'text' ? 'Texto' : param.type}
                          </Badge>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center text-xs">
                            <span className="text-navy-700">Validación:</span>
                            <span className="ml-2 text-navy-900">{formatValidation(param)}</span>
                          </div>
                          {param.validation?.required && (
                            <div className="flex items-center mt-1 text-xs">
                              <Check className="h-3 w-3 text-emerald-500 mr-1" />
                              <span className="text-navy-700">Obligatorio</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-navy-600">Sin parámetros definidos</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TestTemplateDetail;
