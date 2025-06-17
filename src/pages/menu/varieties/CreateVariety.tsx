
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGenetics } from '@/hooks/useGenetics';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Sprout } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import StandardPageHeader from '@/components/common/StandardPageHeader';
import VarietyForm from '@/components/varieties/VarietyForm';
import VarietyFormActions from '@/components/varieties/VarietyFormActions';
import AccessDeniedCard from '@/components/varieties/AccessDeniedCard';

const CreateVariety: React.FC = () => {
  console.log('🆕 CreateVariety: Component rendering started');
  
  const navigate = useNavigate();
  const { createVariety, crops, isLoadingCrops, technologies, isLoadingTechnologies } = useGenetics();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cropId: '',
    technologyId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log('🆕 CreateVariety: Current state', {
    user: user ? { id: user.id, role: user.role } : null,
    formData,
    isSubmitting,
    crops: crops?.length || 0,
    technologies: technologies?.length || 0,
    isLoadingCrops,
    isLoadingTechnologies
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🆕 CreateVariety: Form submission started', formData);
    
    if (!user?.id) {
      console.error('🆕 CreateVariety: No user ID available for variety creation');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('🆕 CreateVariety: Calling createVariety mutation');
      await createVariety.mutateAsync({
        name: formData.name,
        description: formData.description,
        cropId: formData.cropId,
        createdBy: user.id,
        technologyId: formData.technologyId === 'none' ? undefined : formData.technologyId || undefined,
      });

      console.log('🆕 CreateVariety: Variety created successfully');
      toast({
        title: "Variedad creada",
        description: "La variedad se ha creado exitosamente",
      });

      navigate('/varieties');
    } catch (error) {
      console.error('🆕 CreateVariety: Error creating variety:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la variedad",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== 'geneticsCompany') {
    console.log('🆕 CreateVariety: Access denied - user role:', user?.role);
    return (
      <AccessDeniedCard
        title="Acceso denegado"
        message="Solo las empresas genéticas pueden crear variedades."
      />
    );
  }

  const isFormValid = Boolean(formData.name && formData.cropId);
  console.log('🆕 CreateVariety: Form validation', { isFormValid, name: !!formData.name, cropId: !!formData.cropId });

  console.log('🆕 CreateVariety: Rendering main form');

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100">
      <div className="p-6 max-w-4xl mx-auto">
        <StandardPageHeader
          title="Nueva Variedad"
          subtitle="Crear una nueva variedad genética"
          icon={Sprout}
        >
          <Button
            variant="ghost"
            onClick={() => {
              console.log('🆕 CreateVariety: Navigating back to varieties');
              navigate('/varieties');
            }}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </StandardPageHeader>

        <Card className="navy-card">
          <CardHeader>
            <CardTitle className="text-navy-700 flex items-center gap-2">
              <Sprout className="h-5 w-5" />
              Información de la Variedad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <VarietyForm
                formData={formData}
                setFormData={setFormData}
                crops={crops}
                technologies={technologies}
                isLoadingCrops={isLoadingCrops}
                isLoadingTechnologies={isLoadingTechnologies}
              />
              <VarietyFormActions
                isSubmitting={isSubmitting}
                isLoadingCrops={isLoadingCrops}
                isLoadingTechnologies={isLoadingTechnologies}
                isFormValid={isFormValid}
                submitText="Crear Variedad"
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateVariety;
