
import QRCode from 'qrcode';

/**
 * Generates a QR code for a given lot code
 * @param lotCode The lot code to encode in the QR
 * @returns Promise that resolves to a data URL containing the QR code
 */
export const generateQRCodeForLot = async (lotCode: string): Promise<string> => {
  try {
    // Create a URL that will direct to the public lot details page
    const publicLotUrl = `${window.location.origin}/public-lot/${encodeURIComponent(lotCode)}`;
    
    console.log('🔗 Generating QR code for public lot URL:', publicLotUrl);
    
    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(publicLotUrl, {
      width: 256,
      margin: 3,
      color: {
        dark: '#002738', // Navy color for QR
        light: '#FFFFFF', // White background
      },
      errorCorrectionLevel: 'M',
    });
    
    console.log('✅ QR code generated successfully for lot:', lotCode);
    return qrDataUrl;
  } catch (error) {
    console.error('💥 Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};
