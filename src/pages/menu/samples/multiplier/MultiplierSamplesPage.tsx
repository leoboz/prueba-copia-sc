
import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useFetchSamples } from '@/hooks/useFetchSamples';
import { useLots } from '@/hooks/useLots';
import { Activity } from 'lucide-react';
import MultiplierSamplesHeader from '@/components/multiplier/samples/MultiplierSamplesHeader';
import SampleStatsCards from '@/components/multiplier/samples/SampleStatsCards';
import SamplesSearchFilter from '@/components/multiplier/samples/SamplesSearchFilter';
import SamplesGrid from '@/components/multiplier/samples/SamplesGrid';

const MultiplierSamplesPage: React.FC = () => {
  const { user } = useAuth();
  const { samples, isLoading } = useFetchSamples();
  const { lots } = useLots();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Enhanced filtering logic for both multipliers and lab users
  const filteredSamples = useMemo(() => {
    if (!samples || !user) return [];
    
    console.log('🔍 Filtering samples for user:', user.id, 'role:', user.role);
    console.log('📊 Total samples available:', samples.length);
    
    let userSamples: typeof samples = [];
    
    if (user.role === 'multiplier') {
      // For multipliers: show samples for lots they own
      const userLotIds = lots?.filter(lot => lot.userId === user.id).map(lot => lot.id) || [];
      userSamples = samples.filter(sample => userLotIds.includes(sample.lotId));
      console.log('👨‍🌾 Multiplier samples (for their lots):', userSamples.length);
    } else if (user.role === 'lab') {
      // For lab users: show samples assigned to them (where sample.userId = current user.id)
      userSamples = samples.filter(sample => sample.userId === user.id);
      console.log('🧪 Lab samples (assigned to this lab):', userSamples.length);
      console.log('🔬 Lab user samples:', userSamples.map(s => ({ 
        id: s.id, 
        assignedTo: s.userId, 
        lotCode: s.lot?.code,
        status: s.status 
      })));
    } else {
      console.log('❓ Unknown user role:', user.role);
    }

    // Apply search filter
    if (searchTerm) {
      userSamples = userSamples.filter(sample => 
        sample.lot?.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sample.lot?.variety?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sample.lot?.variety?.crop?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sample.internal_code?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      userSamples = userSamples.filter(sample => sample.status === statusFilter);
    }

    console.log('✅ Final filtered samples:', userSamples.length);
    return userSamples;
  }, [samples, user, lots, searchTerm, statusFilter]);

  const sampleStats = useMemo(() => {
    if (!filteredSamples) return null;

    return {
      total: filteredSamples.length,
      completed: filteredSamples.filter(s => s.status === 'completed').length,
      testing: filteredSamples.filter(s => s.status === 'testing').length,
      pending: filteredSamples.filter(s => ['submitted', 'received', 'confirmed'].includes(s.status)).length
    };
  }, [filteredSamples]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-50 via-white to-navy-100/30">
        <Card className="p-12 max-w-md mx-auto shadow-2xl border-navy-200/40 bg-white/90 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
              <Activity className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-medium text-red-600 mb-4">Acceso Denegado</h2>
            <p className="text-navy-600">Debe iniciar sesión para acceder a esta página.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100/20">
      <div className="p-6 max-w-7xl mx-auto">
        <MultiplierSamplesHeader />
        
        {sampleStats && <SampleStatsCards stats={sampleStats} />}
        
        <SamplesSearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        
        <SamplesGrid
          samples={filteredSamples}
          isLoading={isLoading}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
        />
      </div>
    </div>
  );
};

export default MultiplierSamplesPage;
