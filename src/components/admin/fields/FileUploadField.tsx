import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, AlertCircle } from "lucide-react";
import { getPresignedUploadUrl, deleteUploadedFile } from "@/server/upload";

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "complete" | "error";
  error?: string;
  publicUrl?: string;
}

interface FileUploadFieldProps {
  onUploadComplete: (url: string) => void;
  onUploadRemove?: (url: string) => void;
  existingUrls?: string[];
  maxFiles?: number;
  accept?: string;
  deleteFromStorage?: boolean;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

// Extract object name from MinIO URL
function extractObjectName(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    // Get the last part (filename) - handles both presigned and regular URLs
    return pathParts[pathParts.length - 1].split("?")[0];
  } catch {
    return null;
  }
}

// Check if URL is from MinIO
function isMinioUrl(url: string): boolean {
  return url.includes("minio.burdych.net");
}

export function FileUploadField({
  onUploadComplete,
  onUploadRemove,
  existingUrls = [],
  maxFiles = 10,
  accept = "image/jpeg,image/png,image/gif,image/webp",
  deleteFromStorage = true,
}: FileUploadFieldProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        setUploadingFiles((prev) => [
          ...prev,
          {
            id,
            file,
            progress: 0,
            status: "error",
            error: "Nepodporovaný typ souboru. Povolené: JPG, PNG, GIF, WebP",
          },
        ]);
        return;
      }

      // Validate file size
      if (file.size > MAX_SIZE) {
        setUploadingFiles((prev) => [
          ...prev,
          {
            id,
            file,
            progress: 0,
            status: "error",
            error: "Soubor je příliš velký. Maximum je 10MB",
          },
        ]);
        return;
      }

      // Add to uploading state
      setUploadingFiles((prev) => [
        ...prev,
        { id, file, progress: 0, status: "uploading" },
      ]);

      try {
        // Get presigned URL from server
        const { presignedUrl, publicUrl } = await getPresignedUploadUrl({
          data: {
            filename: file.name,
            contentType: file.type,
            fileSize: file.size,
          },
        });

        // Upload using XHR for progress tracking
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100);
              setUploadingFiles((prev) =>
                prev.map((f) => (f.id === id ? { ...f, progress } : f)),
              );
            }
          });

          xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              setUploadingFiles((prev) =>
                prev.map((f) =>
                  f.id === id
                    ? { ...f, progress: 100, status: "complete", publicUrl }
                    : f,
                ),
              );
              onUploadComplete(publicUrl);
              resolve();
            } else {
              reject(new Error(`Upload failed: ${xhr.statusText}`));
            }
          });

          xhr.addEventListener("error", () => {
            reject(new Error("Network error during upload"));
          });

          xhr.open("PUT", presignedUrl);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.send(file);
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Nahrávání selhalo";
        setUploadingFiles((prev) =>
          prev.map((f) =>
            f.id === id ? { ...f, status: "error", error: message } : f,
          ),
        );
      }
    },
    [onUploadComplete],
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const totalCount =
        existingUrls.length + uploadingFiles.length + files.length;
      if (totalCount > maxFiles) {
        alert(`Maximální počet souborů je ${maxFiles}`);
        return;
      }

      Array.from(files).forEach(uploadFile);
    },
    [existingUrls.length, uploadingFiles.length, maxFiles, uploadFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeUploadingFile = async (id: string, publicUrl?: string) => {
    // Delete from MinIO if enabled and URL exists
    if (deleteFromStorage && publicUrl && isMinioUrl(publicUrl)) {
      const objectName = extractObjectName(publicUrl);
      if (objectName) {
        try {
          await deleteUploadedFile({ data: objectName });
        } catch (error) {
          console.error("Failed to delete file from storage:", error);
        }
      }
    }
    setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDeleteExisting = async (url: string) => {
    // Delete from MinIO if enabled
    if (deleteFromStorage && isMinioUrl(url)) {
      const objectName = extractObjectName(url);
      if (objectName) {
        try {
          await deleteUploadedFile({ data: objectName });
        } catch (error) {
          console.error("Failed to delete file from storage:", error);
        }
      }
    }
    // Notify parent to remove from form state
    if (onUploadRemove) {
      onUploadRemove(url);
    }
  };

  const completedUploads = uploadingFiles.filter(
    (f) => f.status === "complete",
  );
  const activeUploads = uploadingFiles.filter((f) => f.status === "uploading");
  const failedUploads = uploadingFiles.filter((f) => f.status === "error");

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${
            isDragging
              ? "border-cyan-500 bg-cyan-500/10"
              : "border-white/20 hover:border-white/40 hover:bg-white/5"
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          <div
            className={`p-3 rounded-full ${
              isDragging ? "bg-cyan-500/20" : "bg-white/10"
            }`}
          >
            <Upload
              className={`w-6 h-6 ${
                isDragging ? "text-cyan-400" : "text-gray-400"
              }`}
            />
          </div>
          <div>
            <p className="text-white font-medium">
              {isDragging
                ? "Pusťte pro nahrání"
                : "Přetáhněte soubory nebo klikněte"}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              JPG, PNG, GIF, WebP do 10MB
            </p>
          </div>
        </div>
      </div>

      {/* Active Uploads */}
      {activeUploads.length > 0 && (
        <div className="space-y-2">
          {activeUploads.map((upload) => (
            <div
              key={upload.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-[#12121a] border border-white/10"
            >
              <Loader2 className="w-5 h-5 text-cyan-400 animate-spin shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">
                  {upload.file.name}
                </p>
                <div className="mt-1.5 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 transition-all duration-200"
                    style={{ width: `${upload.progress}%` }}
                  />
                </div>
              </div>
              <span className="text-gray-400 text-sm shrink-0">
                {upload.progress}%
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Failed Uploads */}
      {failedUploads.length > 0 && (
        <div className="space-y-2">
          {failedUploads.map((upload) => (
            <div
              key={upload.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30"
            >
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">
                  {upload.file.name}
                </p>
                <p className="text-red-400 text-xs mt-0.5">{upload.error}</p>
              </div>
              <button
                onClick={() => removeUploadingFile(upload.id, upload.publicUrl)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Completed Uploads Preview */}
      {completedUploads.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {completedUploads.map((upload) => (
            <div key={upload.id} className="relative group aspect-video">
              <img
                src={upload.publicUrl}
                alt={upload.file.name}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <button
                  onClick={async () => {
                    await removeUploadingFile(upload.id, upload.publicUrl);
                    if (upload.publicUrl && onUploadRemove) {
                      onUploadRemove(upload.publicUrl);
                    }
                  }}
                  className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Existing Images */}
      {existingUrls.length > 0 && (
        <div className="space-y-2">
          <p className="text-gray-400 text-sm">Nahrané obrázky</p>
          <div className="grid grid-cols-3 gap-2">
            {existingUrls.map((url, index) => (
              <div key={url} className="relative group aspect-video">
                <img
                  src={url}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%231a1a2e' width='100' height='100'/%3E%3Ctext fill='%23666' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3E?%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="absolute top-1 left-1 px-2 py-0.5 bg-black/70 rounded text-xs text-gray-300">
                  {index + 1}
                </div>
                {onUploadRemove && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <button
                      onClick={() => handleDeleteExisting(url)}
                      className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
