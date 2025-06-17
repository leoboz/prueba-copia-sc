
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SecurePublicAccessProps {
  lotCode: string;
  children: (lot: any) => React.ReactNode;
}

const SecurePublicAccess: React.FC<SecurePublicAccessProps> = ({ lotCode, children }) => {
  const [lot, setLot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessAttempts, setAccessAttempts] = useState(0);
  const maxAttempts = 5;

  useEffect(() => {
    const fetchPublicLot = async () => {
      if (accessAttempts >= maxAttempts) {
        setError('Demasiados intentos de acceso. Contacte al administrador.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Log public access attempt
        try {
          await supabase.rpc('log_security_event', {
            p_action: 'public_lot_access_attempt',
            p_table_name: 'lots',
            p_details: { 
              lot_code: lotCode,
              ip_address: 'unknown',
              access_attempts: accessAttempts + 1
            }
          });
        } catch (logError) {
          console.warn('Failed to log security event for public access');
        }

        setAccessAttempts(prev => prev + 1);

        // Fetch lot data with minimal information for public access
        // Removed the non-existent 'status' column
        const { data, error } = await supabase
          .from('lots')
          .select(`
            id,
            code,
            calculated_label_id,
            final_label_id,
            created_at,
            updated_at,
            variety:varieties(
              name,
              crop:crops(name)
            ),
            user:users(name),
            samples(
              id,
              status,
              created_at,
              test_results(
                id,
                value,
                created_at,
                parameter:parameters(name)
              )
            )
          `)
          .eq('code', lotCode)
          .single();

        if (error) {
          console.error('Error fetching public lot:', error);
          setError('Lote no encontrado o no disponible públicamente');
          setLoading(false);
          return;
        }

        // Validate that the lot can be accessed publicly
        if (!data) {
          setError('Lote no disponible para consulta pública');
          setLoading(false);
          return;
        }

        setLot(data);
        setError(null);
        
      } catch (err: any) {
        console.error('Error in public lot access:', err);
        setError('Error al acceder a la información del lote');
      } finally {
        setLoading(false);
      }
    };

    if (lotCode) {
      fetchPublicLot();
    }
  }, [lotCode, accessAttempts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100/30 flex items-center justify-center p-4">
        <div className="text-center p-6 md:p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-navy-200/50 max-w-sm w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600 mx-auto mb-4"></div>
          <p className="text-navy-700 font-medium">Verificando acceso seguro...</p>
          <div className="flex items-center justify-center mt-2 text-sm text-navy-500">
            <Shield className="h-4 w-4 mr-1" />
            Consulta protegida
          </div>
        </div>
      </div>
    );
  }

  if (error || !lot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full mx-auto bg-white/90 backdrop-blur-sm shadow-xl border border-navy-200/50">
          <CardContent className="text-center py-8">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-navy-800 mb-2">
              Acceso no autorizado
            </h2>
            <p className="text-navy-600 mb-4">
              {error || 'No se pudo acceder a la información del lote'}
            </p>
            {accessAttempts >= maxAttempts && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">
                  Por seguridad, el acceso ha sido temporalmente restringido.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children(lot)}</>;
};

export default SecurePublicAccess;
