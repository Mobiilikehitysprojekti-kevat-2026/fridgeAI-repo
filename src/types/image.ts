export interface CapturedImage {
  uri: string;
  width: number;
  height: number;
  sizeKB: number;
}

export interface ProcessedImage extends CapturedImage {
  mimeType: 'image/jpeg';
}