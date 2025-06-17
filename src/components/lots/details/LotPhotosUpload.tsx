
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X, Image, ImagePlus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface LotPhoto {
  id: string;
  url: string;
  type: string;
}

interface LotPhotosUploadProps {
  lotId: string;
  lotCode: string;
  photos: LotPhoto[];
  onPhotosUpdate: () => void;
}

const LotPhotosUpload: React.FC<LotPhotosUploadProps> = ({
  lotId,
  lotCode,
  photos,
  onPhotosUpdate
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Archivo no válido",
            description: "Solo se permiten archivos de imagen.",
            variant: "destructive",
          });
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "Archivo muy grande",
            description: "El archivo debe ser menor a 5MB.",
            variant: "destructive",
          });
          continue;
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${lotCode}_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('lot-photos')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast({
            title: "Error al subir imagen",
            description: uploadError.message,
            variant: "destructive",
          });
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('lot-photos')
          .getPublicUrl(fileName);

        // Save media record to database
        const { error: dbError } = await supabase
          .from('media')
          .insert({
            lot_id: lotId,
            type: 'image',
            url: urlData.publicUrl
          });

        if (dbError) {
          console.error('Database error:', dbError);
          toast({
            title: "Error al guardar imagen",
            description: dbError.message,
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Imágenes subidas",
        description: "Las imágenes se han subido exitosamente.",
      });

      onPhotosUpdate();
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al subir las imágenes.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeletePhoto = async (photoId: string, photoUrl: string) => {
    try {
      // Extract filename from URL
      const urlParts = photoUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('lot-photos')
        .remove([fileName]);

      if (storageError) {
        console.error('Storage delete error:', storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('media')
        .delete()
        .eq('id', photoId);

      if (dbError) {
        throw dbError;
      }

      toast({
        title: "Imagen eliminada",
        description: "La imagen se ha eliminado exitosamente.",
      });

      onPhotosUpdate();
    } catch (error: any) {
      console.error('Error deleting photo:', error);
      toast({
        title: "Error al eliminar imagen",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-navy-200/40 shadow-xl bg-gradient-to-br from-white to-navy-50/30 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-navy-900 to-navy-800 text-white">
        <CardTitle className="flex items-center text-xl font-serif">
          <div className="w-2 h-8 bg-gradient-to-b from-white to-navy-300 rounded-full mr-3"></div>
          <Camera className="h-6 w-6 mr-3" />
          Fotos del Lote
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Upload Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gradient-to-br from-navy-50 to-white rounded-lg border border-navy-200/30">
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-gradient-to-r from-navy-700 to-navy-800 hover:from-navy-800 hover:to-navy-900 text-white shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Subiendo...' : 'Subir Fotos'}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex items-center gap-2 text-sm text-navy-600">
              <ImagePlus className="h-4 w-4" />
              <span>Máximo 5MB por imagen • Formatos: JPG, PNG, WEBP</span>
            </div>
          </div>

          {/* Photos Grid */}
          {photos && photos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-navy-100 to-navy-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <img
                      src={photo.url}
                      alt={`Lote ${lotCode}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:shadow-xl w-8 h-8 p-0"
                    onClick={() => handleDeletePhoto(photo.id, photo.url)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-navy-300/50 rounded-xl bg-gradient-to-br from-navy-50 to-white">
              <div className="w-20 h-20 bg-gradient-to-br from-navy-100 to-navy-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Image className="h-10 w-10 text-navy-600" />
              </div>
              <h3 className="text-lg font-semibold text-navy-800 mb-2">
                No hay fotos del lote
              </h3>
              <p className="text-navy-600 mb-4">
                Sube fotos para mostrar el estado y progreso del lote
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="border-navy-300 text-navy-700 hover:bg-navy-50"
              >
                <Upload className="h-4 w-4 mr-2" />
                Subir primera foto
              </Button>
            </div>
          )}
          
          {/* Stats Footer */}
          {photos && photos.length > 0 && (
            <div className="pt-4 border-t border-navy-200/30">
              <div className="flex justify-between items-center text-sm text-navy-600">
                <span className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  {photos.length} foto{photos.length !== 1 ? 's' : ''} subida{photos.length !== 1 ? 's' : ''}
                </span>
                <span>Lote: {lotCode}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LotPhotosUpload;
