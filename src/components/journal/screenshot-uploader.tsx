import React, { useState, useRef } from 'react';
import { saveTradeScreenshot, deleteTradeScreenshot, getScreenshotStoragePath } from '../../utils/screenshot-storage';

interface ScreenshotUploaderProps {
  tradeId: string;
  type: 'before' | 'after' | 'chart';
  label: string;
  currentImage?: string;
  onImageChange: (type: 'before' | 'after' | 'chart', url?: string) => void;
}

export const ScreenshotUploader: React.FC<ScreenshotUploaderProps> = ({
  tradeId,
  type,
  label,
  currentImage,
  onImageChange,
}) => {
  const [uploading, setUploading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const storagePath = getScreenshotStoragePath(tradeId, type);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const dataUrl = await saveTradeScreenshot(tradeId, type, file);
      onImageChange(type, dataUrl);
    } catch (err) {
      console.error('Failed to save trade screenshot locally:', err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteTradeScreenshot(tradeId, type);
      onImageChange(type, undefined);
    } catch (err) {
      console.error('Failed to remove screenshot:', err);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-3 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-100">
      <div className="flex justify-between items-center text-xs font-semibold">
        <span>{label}</span>
        <span className="text-[10px] font-mono text-slate-500 truncate max-w-[180px]" title={storagePath}>
          {storagePath}
        </span>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {currentImage ? (
        <div className="relative group rounded-md overflow-hidden bg-black border border-slate-800 aspect-video flex items-center justify-center">
          <img
            src={currentImage}
            alt={label}
            className="object-cover w-full h-full cursor-pointer transition-opacity group-hover:opacity-80"
            onClick={() => setIsPreviewOpen(true)}
          />
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="px-2.5 py-1 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded font-medium shadow"
            >
              Preview
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-white rounded font-medium shadow"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-2.5 py-1 text-xs bg-rose-600 hover:bg-rose-500 text-white rounded font-medium shadow"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="w-full aspect-video border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-md flex flex-col items-center justify-center text-slate-400 hover:text-blue-400 transition-colors bg-slate-950/50 p-4"
        >
          {uploading ? (
            <span className="text-xs">Saving to device...</span>
          ) : (
            <>
              <svg className="w-6 h-6 mb-1 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-xs font-medium">Upload {label}</span>
              <span className="text-[10px] text-slate-500 mt-1">Select from Phone Gallery</span>
            </>
          )}
        </button>
      )}

      {isPreviewOpen && currentImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-800 mb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-200">{label}</h3>
                <p className="text-[11px] font-mono text-slate-400">{storagePath}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="text-slate-400 hover:text-white px-2 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto flex items-center justify-center bg-black rounded-lg p-2">
              <img src={currentImage} alt={label} className="max-w-full max-h-[70vh] object-contain rounded" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
