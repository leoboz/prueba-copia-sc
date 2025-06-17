
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useAuth } from '@/context/AuthContext';
import { useGenetics } from '@/hooks/useGenetics';
import { useLots } from '@/hooks/useLots';
import { useCategories } from '@/hooks/useCategories';
import { usePlants } from '@/hooks/usePlants';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useUnits } from '@/hooks/useUnits';
import { useLotTypes, useLotTypeUnitPermissions } from '@/hooks/useLotTypes';
import { toast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formSchema, type LotFormData, validateLotFormData } from './form/types';
import { getLotTypeName, getOriginRequirement } from '@/utils/lotTypeUtils';
import BasicInfoSection from './form/BasicInfoSection';
import ClassificationSection from './form/ClassificationSection';
import ProductionDetailsSection from './form/ProductionDetailsSection';
import OriginInfoSection from './form/OriginInfoSection';
import AdditionalNotesSection from './form/AdditionalNotesSection';

const LotCreateForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { multiplierVarieties, isLoadingMultiplierVarieties } = useGenetics();
  const { createLot } = useLots();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const { data: plants, isLoading: isLoadingPlants } = usePlants();
  const { data: campaigns, isLoading: isLoadingCampaigns } = useCampaigns();
  const { data: units, isLoading: isLoadingUnits } = useUnits();
  const { data: lotTypes, isLoading: isLoadingLotTypes } = useLotTypes();
  const { data: lotTypeUnitPermissions } = useLotTypeUnitPermissions();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roleError, setRoleError] = useState(false);
  const [noPermissionsError, setNoPermissionsError] = useState(false);
  const [availableUnits, setAvailableUnits] = useState(units || []);

  // Check if user is a Multiplier
  useEffect(() => {
    if (user && user.role !== 'multiplier') {
      setRoleError(true);
      toast({
        title: "Error",
        description: "Solo los multiplicadores pueden crear lotes",
        variant: "destructive"
      });
    } else {
      setRoleError(false);
    }
  }, [user]);

  // Check if user has access to any varieties
  useEffect(() => {
    if (!isLoadingMultiplierVarieties && multiplierVarieties && multiplierVarieties.length === 0) {
      setNoPermissionsError(true);
    } else {
      setNoPermissionsError(false);
    }
  }, [multiplierVarieties, isLoadingMultiplierVarieties]);

  const form = useForm<LotFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      varietyId: '',
      categoryId: '',
      plantId: '',
      campaignId: '',
      lotTypeId: '',
      unitId: '',
      originType: 'none',
      originLotId: '',
      originText: '',
      notes: '',
    },
  });

  const watchedLotType = form.watch('lotTypeId');
  const watchedOriginType = form.watch('originType');
  const watchedVariety = form.watch('varietyId');
  const watchedCategory = form.watch('categoryId');
  const watchedPlant = form.watch('plantId');
  const watchedCampaign = form.watch('campaignId');

  // Filter units based on selected lot type
  useEffect(() => {
    if (watchedLotType && lotTypeUnitPermissions && units) {
      const allowedUnitIds = lotTypeUnitPermissions
        .filter(permission => permission.lotTypeId === watchedLotType && permission.isAllowed)
        .map(permission => permission.unitId);
      
      const filteredUnits = units.filter(unit => allowedUnitIds.includes(unit.id));
      setAvailableUnits(filteredUnits);
      
      // Clear unit selection if current unit is not allowed
      const currentUnitId = form.getValues('unitId');
      if (currentUnitId && !allowedUnitIds.includes(currentUnitId)) {
        form.setValue('unitId', '');
      }
    } else {
      setAvailableUnits(units || []);
    }
  }, [watchedLotType, lotTypeUnitPermissions, units, form]);

  // Filter plants to show only user's plants
  const userPlants = plants?.filter(plant => plant.multiplierId === user?.id) || [];

  const onSubmit = async (data: LotFormData) => {
    if (!user?.id || user.role !== 'multiplier') {
      setRoleError(true);
      toast({
        title: "Error",
        description: "Solo los multiplicadores pueden crear lotes",
        variant: "destructive"
      });
      return;
    }

    // Enhanced validation based on lot type
    if (lotTypes) {
      const validation = validateLotFormData(data, lotTypes, getLotTypeName, getOriginRequirement);
      if (!validation.success) {
        toast({
          title: "Error de validación",
          description: validation.error,
          variant: "destructive"
        });
        return;
      }
    }
    
    setIsSubmitting(true);
    
    try {
      await createLot.mutateAsync({
        code: data.code,
        varietyId: data.varietyId,
        userId: user.id,
        status: 'retenido',
        categoryId: data.categoryId,
        plantId: data.plantId,
        campaignId: data.campaignId || undefined,
        lotTypeId: data.lotTypeId,
        unitId: data.unitId,
        originLotId: data.originType === 'reference' ? data.originLotId : undefined,
        originText: data.originType === 'text' ? data.originText : undefined,
      });
      
      toast({
        title: "Lote creado",
        description: "El lote ha sido creado exitosamente",
      });
      
      navigate('/lots');
    } catch (error) {
      console.error("Error creating lot:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el lote. Por favor intente nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (roleError) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error de permisos</AlertTitle>
        <AlertDescription>
          Solo los multiplicadores pueden crear lotes. Por favor contacte al administrador
          del sistema si cree que esto es un error.
        </AlertDescription>
      </Alert>
    );
  }

  if (noPermissionsError) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Sin permisos</AlertTitle>
        <AlertDescription>
          No tiene permisos para utilizar ninguna variedad. Por favor contacte a las empresas
          genéticas para solicitar acceso a sus variedades.
        </AlertDescription>
      </Alert>
    );
  }

  const isLoading = isLoadingMultiplierVarieties || isLoadingCategories || isLoadingPlants || 
                   isLoadingCampaigns || isLoadingUnits || isLoadingLotTypes;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicInfoSection
          form={form}
          multiplierVarieties={multiplierVarieties}
          isLoadingMultiplierVarieties={isLoadingMultiplierVarieties}
        />

        <ClassificationSection
          form={form}
          categories={categories}
          lotTypes={lotTypes}
          isLoadingCategories={isLoadingCategories}
          isLoadingLotTypes={isLoadingLotTypes}
        />

        <ProductionDetailsSection
          form={form}
          userPlants={userPlants}
          campaigns={campaigns}
          availableUnits={availableUnits}
          watchedLotType={watchedLotType}
          isLoadingPlants={isLoadingPlants}
          isLoadingCampaigns={isLoadingCampaigns}
          isLoadingUnits={isLoadingUnits}
        />

        <OriginInfoSection
          form={form}
          watchedOriginType={watchedOriginType}
          watchedLotType={watchedLotType}
          watchedVariety={watchedVariety}
          watchedCategory={watchedCategory}
          watchedPlant={watchedPlant}
          watchedCampaign={watchedCampaign}
          lotTypes={lotTypes || []}
        />

        <AdditionalNotesSection form={form} />
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-countryside-green hover:bg-countryside-green-dark"
            disabled={isSubmitting || roleError || noPermissionsError || isLoading}
          >
            {isSubmitting ? 'Creando...' : 'Crear Lote'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LotCreateForm;
