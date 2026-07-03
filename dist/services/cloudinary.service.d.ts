export type CloudinaryUploadKind = 'image' | 'video' | 'raw';
export declare class CloudinaryConfigError extends Error {
    constructor();
}
export type UploadToCloudinaryResult = {
    cdnUrl: string;
    publicId: string;
    thumbnailUrl: string;
    resourceType: string;
    bytes: number;
    mimeType: string;
};
/**
 * Validates magic bytes, uploads to Cloudinary, returns delivery URL + publicId for deletion.
 */
export declare function uploadToCloudinary(input: {
    buffer: Buffer;
    originalName: string;
}): Promise<UploadToCloudinaryResult>;
export declare function destroyFromCloudinary(publicId: string, mediaType: string): Promise<void>;
//# sourceMappingURL=cloudinary.service.d.ts.map