
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const EditVariety: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { companyVarieties, updateVariety, crops, technologies, isLoadingCompanyVarieties, isLoadingCrops, isLoadingTechnologies } = useGenetics();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cropId: '',
    technologyId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const variety = companyVarieties?.find(v => v.id === id);

  useEffect(() => {
    console.log('EditVariety: variety found:', variety);
    if (variety) {
      setFormData({
        name: variety.name,
        description: variety.description || '',
        cropId: variety.cropId,
        technologyId: variety.technologyId || 'none',
      });
    }
  }, [variety]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!variety || !user?.id) return;

    console.log('Submitting edit with formData:', formData);
    setIsSubmitting(true);
    try {
      await updateVariety.mutateAsync({
        ...variety,
        name: formData.name,
        description: formData.description,
        cropId: formData.cropId,
        technologyId: formData.technologyId === 'none' ? undefined : formData.technologyId || undefined,
      });

      toast({
        title: "Variedad actualizada",
        description: "La variedad se ha actualizado exitosamente",
      });

      navigate(`/varieties/${variety.id}`);
    } catch (error) {
      console.error('Error updating variety:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la variedad",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== 'geneticsCompany') {
    return (
      <AccessDeniedCard
        title="Acceso denegado"
        message="Solo las empresas genéticas pueden editar variedades."
      />
    );
  }

  if (isLoadingCompanyVarieties) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="navy-card p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600 mx-auto mb-4"></div>
            <p className="text-navy-700">Cargando variedad...</p>
          </Card>
        </div>
      </div>
    );
  }

  if (!variety) {
    return (
      <AccessDeniedCard
        title="Variedad no encontrada"
        message="La variedad que busca no existe o no tiene permisos para editarla."
      />
    );
  }

  if (variety.createdBy !== user.id) {
    return (
      <AccessDeniedCard
        title="Sin permisos"
        message="Solo puede editar las variedades que usted ha creado."
      />
    );
  }

  const isFormValid = Boolean(formData.name && formData.cropId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100">
      <div className="p-6 max-w-4xl mx-auto">
        <StandardPageHeader
          title="Editar Variedad"
          subtitle={variety.name}
          icon={Sprout}
        >
          <Button
            variant="ghost"
            onClick={() => navigate(`/varieties/${variety.id}`)}
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
                onCancel={() => navigate(`/varieties/${variety.id}`)}
                submitText="Guardar Cambios"
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditVariety;
