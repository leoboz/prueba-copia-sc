
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TestTube, Activity, TrendingUp, Eye } from 'lucide-react';

interface SampleStats {
  total: number;
  completed: number;
  testing: number;
  pending: number;
}

interface SampleStatsCardsProps {
  stats: SampleStats;
}

const SampleStatsCards: React.FC<SampleStatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="group relative overflow-hidden bg-gradient-to-br from-white to-navy-50/30 border-navy-200/40 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-500/5 to-navy-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-navy-600">Total Muestras</CardTitle>
            <TestTube className="h-5 w-5 text-navy-500" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold text-navy-900">{stats.total}</div>
          <p className="text-xs text-navy-600 mt-1">Muestras registradas</p>
        </CardContent>
      </Card>

      <Card className="group relative overflow-hidden bg-gradient-to-br from-white to-emerald-50/30 border-emerald-200/40 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-emerald-600">Completadas</CardTitle>
            <Activity className="h-5 w-5 text-emerald-500" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold text-emerald-700">{stats.completed}</div>
          <p className="text-xs text-emerald-600 mt-1">Análisis finalizados</p>
        </CardContent>
      </Card>

      <Card className="group relative overflow-hidden bg-gradient-to-br from-white to-amber-50/30 border-amber-200/40 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-amber-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-amber-600">En Análisis</CardTitle>
            <TrendingUp className="h-5 w-5 text-amber-500" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold text-amber-700">{stats.testing}</div>
          <p className="text-xs text-amber-600 mt-1">Procesándose</p>
        </CardContent>
      </Card>

      <Card className="group relative overflow-hidden bg-gradient-to-br from-white to-blue-50/30 border-blue-200/40 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-blue-600">Pendientes</CardTitle>
            <Eye className="h-5 w-5 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold text-blue-700">{stats.pending}</div>
          <p className="text-xs text-blue-600 mt-1">Esperando procesamiento</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SampleStatsCards;
