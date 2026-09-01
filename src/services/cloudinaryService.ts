// services/cloudinaryService.ts

const CLOUDINARY_CLOUD_NAME = 'sbgyq8es';
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export interface CloudinaryUploadResponse {
  public_id: string;
  url: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export class CloudinaryService {
  static async uploadImage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      // IMPORTANT: Add upload_preset for unsigned uploads
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'royal_furniture';
      formData.append('upload_preset', uploadPreset);
      formData.append('resource_type', 'auto');
      formData.append('folder', 'royalfurnitures');
      formData.append('quality', 'auto');
      formData.append('fetch_format', 'auto');

      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Upload failed');
      }

      const data: CloudinaryUploadResponse = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  }

  static async uploadMultipleImages(files: File[]): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }

  static generateOptimizedUrl(url: string, width?: number, height?: number, quality: string = 'auto'): string {
    if (!url || !url.includes('cloudinary')) {
      return url;
    }

    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    
    if (uploadIndex === -1) return url;

    let transforms = [quality];
    if (width || height) {
      const w = width ? `w_${width}` : '';
      const h = height ? `h_${height}` : '';
      const dimensions = `${w}${w && h ? ',' : ''}${h}`;
      if (dimensions) {
        transforms.unshift(`c_limit,${dimensions}`);
      }
    }

    const baseUrl = parts.slice(0, uploadIndex + 1).join('/');
    const publicId = parts.slice(uploadIndex + 2).join('/');
    
    return `${baseUrl}/${transforms.join('/')}/${publicId}`;
  }

  static deleteImage(public_id: string): Promise<void> {
    console.log('To delete image, use Cloudinary dashboard or implement backend endpoint');
    return Promise.resolve();
  }
}

export default CloudinaryService;