
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGenetics } from '@/hooks/useGenetics';
import { useAuth } from '@/context/AuthContext';
import { Plus, Search, Filter, Sprout, Eye, Edit3 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

const VarietiesPage: React.FC = () => {
  console.log('🌱 VarietiesPage: Component rendering started');
  
  const navigate = useNavigate();
  const { companyVarieties, crops, isLoadingCompanyVarieties } = useGenetics();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [cropFilter, setCropFilter] = useState<string>('all');
  const [filteredVarieties, setFilteredVarieties] = useState<any[]>([]);

  console.log('🌱 VarietiesPage: Current state', {
    user: user ? { id: user.id, role: user.role } : null,
    companyVarieties: companyVarieties?.length || 0,
    crops: crops?.length || 0,
    isLoadingCompanyVarieties,
    searchQuery,
    cropFilter
  });

  useEffect(() => {
    console.log('🌱 VarietiesPage: useEffect triggered', { companyVarieties, searchQuery, cropFilter });
    
    if (companyVarieties) {
      let filtered = companyVarieties;

      if (searchQuery) {
        filtered = filtered.filter(variety =>
          variety.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          variety.crop?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (cropFilter !== 'all') {
        filtered = filtered.filter(variety => variety.cropId === cropFilter);
      }

      console.log('🌱 VarietiesPage: Filtered varieties', filtered);
      setFilteredVarieties(filtered);
    }
  }, [companyVarieties, searchQuery, cropFilter]);

  console.log('🌱 VarietiesPage: About to render, checking conditions');

  if (!user) {
    console.log('🌱 VarietiesPage: No user, showing login message');
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="navy-card p-8 text-center">
            <h2 className="text-xl font-medium text-red-600 mb-4">Acceso denegado</h2>
            <p className="text-red-700">Debe iniciar sesión para acceder a esta página.</p>
          </Card>
        </div>
      </div>
    );
  }

  console.log('🌱 VarietiesPage: User found, continuing with main render');

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100">
      <div className="p-6 max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="bg-gradient-to-r from-navy-800 to-navy-900 rounded-2xl p-8 text-white shadow-2xl">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                  <Sprout className="h-8 w-8" />
                  Gestión de Variedades
                </h1>
                <p className="text-navy-100 text-lg">
                  Administre y desarrolle sus variedades genéticas
                </p>
              </div>

              {user.role === 'geneticsCompany' && (
                <div className="mt-4 md:mt-0">
                  <Button
                    className="bg-white text-navy-600 hover:bg-navy-50 shadow-lg font-semibold"
                    onClick={() => {
                      console.log('🌱 VarietiesPage: Navigating to /varieties/new');
                      navigate('/varieties/new');
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Nueva Variedad
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        <Card className="navy-card mb-8">
          <CardHeader>
            <CardTitle className="text-navy-700 flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros de Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-navy-600" />
                <Input
                  placeholder="Buscar variedades por nombre o cultivo..."
                  value={searchQuery}
                  onChange={(e) => {
                    console.log('🌱 VarietiesPage: Search query changed', e.target.value);
                    setSearchQuery(e.target.value);
                  }}
                  className="pl-10 border-navy-200 focus:border-navy-500 focus:ring-navy-500"
                />
              </div>

              <div className="flex items-center gap-3 min-w-fit">
                <span className="text-sm font-medium text-navy-700">Cultivo:</span>
                <select
                  value={cropFilter}
                  onChange={(e) => {
                    console.log('🌱 VarietiesPage: Crop filter changed', e.target.value);
                    setCropFilter(e.target.value);
                  }}
                  className="border border-navy-200 rounded-lg px-4 py-2 text-sm bg-white text-navy-700 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-200 transition-all"
                >
                  <option value="all">Todos los cultivos</option>
                  {crops?.map(crop => (
                    <option key={crop.id} value={crop.id}>{crop.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoadingCompanyVarieties ? (
          <Card className="navy-card">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600 mx-auto mb-4"></div>
              <p className="text-navy-700">Cargando variedades...</p>
            </CardContent>
          </Card>
        ) : filteredVarieties.length > 0 ? (
          <Card className="navy-card">
            <CardHeader>
              <CardTitle className="text-navy-700 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Sprout className="h-5 w-5" />
                  Variedades Registradas
                </span>
                <Badge variant="outline" className="text-navy-600 border-navy-200">
                  {filteredVarieties.length} {filteredVarieties.length === 1 ? 'variedad' : 'variedades'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-navy-100">
                      <TableHead className="text-navy-700 font-semibold">Nombre</TableHead>
                      <TableHead className="text-navy-700 font-semibold">Cultivo</TableHead>
                      <TableHead className="text-navy-700 font-semibold">Descripción</TableHead>
                      <TableHead className="text-navy-700 font-semibold">Fecha de Creación</TableHead>
                      <TableHead className="text-right text-navy-700 font-semibold">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVarieties.map((variety) => (
                      <TableRow key={variety.id} className="hover:bg-navy-25 transition-colors border-navy-50">
                        <TableCell className="font-medium text-gray-900">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-navy-500 rounded-full"></div>
                            {variety.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-navy-100 text-navy-700">
                            {variety.crop?.name}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600 max-w-xs truncate">
                          {variety.description || 'Sin descripción'}
                        </TableCell>
                        <TableCell className="text-gray-500">
                          {new Date(variety.createdAt).toLocaleDateString('es-ES')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                console.log('🌱 VarietiesPage: Navigating to variety detail', variety.id);
                                navigate(`/varieties/${variety.id}`);
                              }}
                              className="border-navy-200 text-navy-600 hover:bg-navy-50"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                            {user.role === 'geneticsCompany' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  console.log('🌱 VarietiesPage: Navigating to variety edit', variety.id);
                                  navigate(`/varieties/${variety.id}/edit`);
                                }}
                                className="border-blue-200 text-blue-600 hover:bg-blue-50"
                              >
                                <Edit3 className="h-4 w-4 mr-1" />
                                Editar
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="navy-card">
            <CardContent className="p-12 text-center">
              <div className="mx-auto bg-navy-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Sprout className="h-8 w-8 text-navy-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No se encontraron variedades
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || cropFilter !== 'all' 
                  ? 'No hay variedades que coincidan con los filtros aplicados.'
                  : 'Aún no tienes variedades registradas. ¡Crea tu primera variedad!'
                }
              </p>
              {user.role === 'geneticsCompany' && (!searchQuery && cropFilter === 'all') && (
                <Button
                  onClick={() => {
                    console.log('🌱 VarietiesPage: Navigating to create variety from empty state');
                    navigate('/varieties/new');
                  }}
                  className="bg-navy-900 hover:bg-navy-800 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" /> Crear Primera Variedad
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VarietiesPage;
