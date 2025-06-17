
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLots } from '@/hooks/useLots';
import { QrCode, Search, Scan, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const LotLookupPage: React.FC = () => {
  const [lotCode, setLotCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const { getLotByCode } = useLots();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check for QR code parameter on mount
  useEffect(() => {
    const codeFromQR = searchParams.get('code');
    if (codeFromQR) {
      console.log('QR Code detected, setting lot code:', codeFromQR);
      setLotCode(codeFromQR);
      // Auto-search when coming from QR code
      handleSearchWithCode(codeFromQR);
    }
  }, [searchParams]);

  const handleSearchWithCode = async (code: string) => {
    if (!code.trim()) return;
    
    setIsSearching(true);
    setSearchError(null);
    
    try {
      console.log('🔍 Searching for lot with code:', code);
      const lot = await getLotByCode(code.trim());
      
      if (lot) {
        console.log('✅ Lot found, navigating to public details:', lot);
        navigate(`/public-lot/${lot.code}`);
      } else {
        console.log('❌ Lot not found for code:', code);
        setSearchError('Lote no encontrado. Verifique el código e intente nuevamente.');
      }
    } catch (error) {
      console.error('💥 Error searching lot:', error);
      setSearchError('Error al buscar el lote. Por favor intente nuevamente.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = () => handleSearchWithCode(lotCode);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-navy-200/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-navy-300/15 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-gradient-radial from-navy-100/10 to-transparent rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 p-6 md:p-12">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="p-6 bg-gradient-to-br from-navy-900 to-navy-800 rounded-3xl shadow-2xl">
                <QrCode className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-serif font-bold bg-gradient-to-r from-navy-900 to-navy-700 bg-clip-text text-transparent mb-4">
              Consulta de Lotes
            </h1>
            <p className="text-xl text-navy-600 max-w-2xl mx-auto leading-relaxed">
              Verifique la autenticidad y calidad de sus semillas ingresando el código del lote o escaneando el código QR
            </p>
          </div>
        </div>

        {/* Main Search Card */}
        <div className="max-w-2xl mx-auto mb-16">
          <Card className="navy-card shadow-2xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-navy-900 to-navy-800 text-white p-8">
              <CardTitle className="text-2xl font-serif text-center flex items-center justify-center space-x-3">
                <Scan className="h-8 w-8" />
                <span>Búsqueda de Lote</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-8 space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-navy-400" />
                <Input
                  type="text"
                  placeholder="Ingrese código del lote (ej: LOT-001-2024)"
                  value={lotCode}
                  onChange={(e) => setLotCode(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-12 py-4 text-lg border-navy-200 focus:border-navy-500 focus:ring-navy-500 bg-white/80 rounded-xl"
                  disabled={isSearching}
                />
                {isSearching && (
                  <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-navy-400 animate-spin" />
                )}
              </div>
              
              {searchError && (
                <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{searchError}</p>
                </div>
              )}
              
              <Button 
                onClick={handleSearch}
                disabled={!lotCode.trim() || isSearching}
                className="w-full py-4 text-lg bg-gradient-to-r from-navy-900 to-navy-800 hover:from-navy-800 hover:to-navy-700 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl group"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Buscar Lote
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="navy-card p-6 text-center group hover:scale-105 transition-all duration-300">
            <div className="p-4 bg-gradient-to-br from-navy-100 to-navy-50 w-16 h-16 flex items-center justify-center rounded-2xl mx-auto mb-4 group-hover:scale-110 transition-transform">
              <QrCode className="h-8 w-8 text-navy-700" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-navy-900 mb-3">Código QR</h3>
            <p className="text-navy-600 leading-relaxed">
              Escanee el código QR del empaque para acceso instantáneo a la información del lote
            </p>
          </div>
          
          <div className="navy-card p-6 text-center group hover:scale-105 transition-all duration-300">
            <div className="p-4 bg-gradient-to-br from-emerald-100 to-emerald-50 w-16 h-16 flex items-center justify-center rounded-2xl mx-auto mb-4 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="h-8 w-8 text-emerald-700" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-navy-900 mb-3">Verificación</h3>
            <p className="text-navy-600 leading-relaxed">
              Confirme la autenticidad y calidad superior de sus semillas con certificación oficial
            </p>
          </div>
          
          <div className="navy-card p-6 text-center group hover:scale-105 transition-all duration-300">
            <div className="p-4 bg-gradient-to-br from-amber-100 to-amber-50 w-16 h-16 flex items-center justify-center rounded-2xl mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Search className="h-8 w-8 text-amber-700" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-navy-900 mb-3">Trazabilidad</h3>
            <p className="text-navy-600 leading-relaxed">
              Acceda al historial completo de pruebas y resultados de calidad del lote
            </p>
          </div>
        </div>

        {/* Info Section */}
        <div className="max-w-4xl mx-auto text-center">
          <Card className="navy-card p-8 bg-gradient-to-r from-navy-50 to-white border-navy-200/40">
            <h3 className="text-2xl font-serif font-semibold text-navy-900 mb-4">
              ¿Cómo funciona la consulta de lotes?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-navy-900 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-navy-900 mb-2">Localice el Código</h4>
                  <p className="text-navy-600 text-sm">Encuentre el código del lote en el empaque de las semillas o escanee el código QR</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-navy-900 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-navy-900 mb-2">Ingrese el Código</h4>
                  <p className="text-navy-600 text-sm">Digite el código en el campo de búsqueda o deje que el QR lo complete automáticamente</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-navy-900 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-navy-900 mb-2">Ver Resultados</h4>
                  <p className="text-navy-600 text-sm">Acceda a toda la información de calidad, pruebas realizadas y certificaciones</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <p className="text-navy-500">
            © 2025 SeedQuality - Sistema de Gestión de Calidad de Semillas
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LotLookupPage;
