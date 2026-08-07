import React from 'react';
import { ScreenshotUploader } from './screenshot-uploader';
import { Trade } from '../../types';

interface TradeScreenshotsSectionProps {
  trade: Trade;
  onUpdateTradeScreenshots: (updatedScreenshots: {
    beforeScreenshot?: string;
    afterScreenshot?: string;
    chartScreenshot?: string;
  }) => void;
}

export const TradeScreenshotsSection: React.FC<TradeScreenshotsSectionProps> = ({
  trade,
  onUpdateTradeScreenshots,
}) => {
  const handleImageChange = (type: 'before' | 'after' | 'chart', url?: string) => {
    const updated = {
      beforeScreenshot: trade.beforeScreenshot,
      afterScreenshot: trade.afterScreenshot,
      chartScreenshot: trade.chartScreenshot,
    };

    if (type === 'before') updated.beforeScreenshot = url;
    if (type === 'after') updated.afterScreenshot = url;
    if (type === 'chart') updated.chartScreenshot = url;

    onUpdateTradeScreenshots(updated);
  };

  return (
    <div className="space-y-3 mt-4 border-t border-slate-800/80 pt-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-200">Trade Screenshots</h4>
        <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
          Offline Storage
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <ScreenshotUploader
          tradeId={trade.id}
          type="before"
          label="Before Entry"
          currentImage={trade.beforeScreenshot}
          onImageChange={handleImageChange}
        />
        <ScreenshotUploader
          tradeId={trade.id}
          type="after"
          label="After Exit"
          currentImage={trade.afterScreenshot}
          onImageChange={handleImageChange}
        />
        <ScreenshotUploader
          tradeId={trade.id}
          type="chart"
          label="Chart Analysis"
          currentImage={trade.chartScreenshot}
          onImageChange={handleImageChange}
        />
      </div>
    </div>
  );
};
