import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Crop as CropIcon, Download } from 'lucide-react';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  onImageRemove: () => void;
  currentImage?: string;
  maxSize?: number;
  aspectRatio?: number;
  className?: string;
}

export const ImageUpload = ({
  onImageSelect,
  onImageRemove,
  currentImage,
  maxSize = 5 * 1024 * 1024, // 5MB
  aspectRatio,
  className = "",
}: ImageUploadProps) => {
  const { t } = useLanguage();
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [imgRef, setImgRef] = useState<HTMLImageElement | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize) {
      toast.error(`File size must be less than ${maxSize / 1024 / 1024}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result as string;
      if (aspectRatio) {
        setImageToCrop(imageUrl);
        setShowCropDialog(true);
      } else {
        onImageSelect(file, imageUrl);
      }
    };
    reader.readAsDataURL(file);
  }, [maxSize, aspectRatio, onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false,
  });

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setImgRef(e.currentTarget);
    
    if (aspectRatio) {
      const crop = centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 90,
          },
          aspectRatio,
          width,
          height,
        ),
        width,
        height,
      );
      setCrop(crop);
    }
  };

  const getCroppedImg = (image: HTMLImageElement, crop: Crop): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('No 2d context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY,
    );

    return new Promise((resolve) => {
      canvas.toBlob(resolve as BlobCallback, 'image/jpeg', 0.9);
    });
  };

  const handleCropComplete = async () => {
    if (!imgRef || !crop) return;

    try {
      const croppedBlob = await getCroppedImg(imgRef, crop);
      const croppedFile = new File([croppedBlob], 'cropped-image.jpg', {
        type: 'image/jpeg',
      });
      
      const preview = URL.createObjectURL(croppedBlob);
      onImageSelect(croppedFile, preview);
      setShowCropDialog(false);
      setImageToCrop(null);
    } catch (error) {
      toast.error('Failed to crop image');
    }
  };

  return (
    <>
      <div className={`space-y-4 ${className}`}>
        {currentImage ? (
          <div className="relative group">
            <img
              src={currentImage}
              alt="Uploaded"
              className="w-full h-48 object-cover rounded-lg border"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setImageToCrop(currentImage);
                  setShowCropDialog(true);
                }}
              >
                <CropIcon className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={onImageRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">
              {isDragActive ? 'Drop image here' : t('common.upload')}
            </p>
            <p className="text-sm text-muted-foreground">
              Drag & drop an image or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Max size: {maxSize / 1024 / 1024}MB
            </p>
          </div>
        )}
      </div>

      {/* Crop Dialog */}
      <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {imageToCrop && (
              <div className="max-h-96 overflow-auto">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  aspect={aspectRatio}
                >
                  <img
                    src={imageToCrop}
                    onLoad={onImageLoad}
                    alt="Crop preview"
                    className="max-w-full h-auto"
                  />
                </ReactCrop>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCropDialog(false)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleCropComplete}>
                <Download className="h-4 w-4 mr-2" />
                Apply Crop
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};