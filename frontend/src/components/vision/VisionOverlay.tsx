import React from 'react';
import { Eye, Layers, Crosshair, CheckCircle } from 'lucide-react';
import { TableObjectState } from '../../types/simulation';

interface VisionOverlayProps {
  objects: TableObjectState[];
  selectedObjectId: string | null;
  onSelectObject: (id: string) => void;
  showBoundingBoxes: boolean;
  onToggleBoundingBoxes: () => void;
}

export const VisionOverlay: React.FC<VisionOverlayProps> = ({
  objects,
  selectedObjectId,
  onSelectObject,
  showBoundingBoxes,
  onToggleBoundingBoxes
}) => {
  return (
    <div className="bg-graphite-900 border border-white/10 rounded-xl p-5 shadow-xl flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-cyber-cyan" />
          <h3 className="font-display font-bold text-sm tracking-wider text-white">
            RGB-D PERCEPTION & REACHABILITY
          </h3>
        </div>

        <button
          onClick={onToggleBoundingBoxes}
          className={`px-2.5 py-1 rounded text-xs font-mono border transition-colors cursor-pointer ${
            showBoundingBoxes
              ? 'bg-cyber-cyan/10 border-cyber-cyan/50 text-cyber-cyan'
              : 'bg-graphite-800 border-white/10 text-slate-400'
          }`}
        >
          {showBoundingBoxes ? 'BOUNDING BOXES: ON' : 'BOUNDING BOXES: OFF'}
        </button>
      </div>

      {/* Model Spec Badge */}
      <div className="flex items-center justify-between px-3 py-1.5 rounded bg-graphite-950 border border-white/5 font-mono text-[11px] text-slate-400 mb-3">
        <span>MODEL: YOLO-World-Tabletop (OpenVINO INT8)</span>
        <span className="text-cyber-green flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          CALIBRATED
        </span>
      </div>

      {/* Detected Objects Grid */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {objects.map((obj) => {
          const isSelected = selectedObjectId === obj.id;

          return (
            <div
              key={obj.id}
              onClick={() => onSelectObject(obj.id)}
              className={`p-3 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                isSelected
                  ? 'bg-cyber-cyan/10 border-cyber-cyan text-white shadow-md'
                  : 'bg-graphite-950 border-white/5 hover:border-white/20 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold flex items-center gap-1.5 text-slate-100">
                  <Crosshair className={`w-3.5 h-3.5 ${isSelected ? 'text-cyber-cyan' : 'text-slate-500'}`} />
                  {obj.name}
                </span>
                <span className="text-cyber-cyan">
                  {(obj.confidence * 100).toFixed(1)}% conf
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                <div>
                  <span className="text-slate-500">Pose: </span>
                  [{obj.position.map((p) => p.toFixed(2)).join(', ')}]
                </div>
                <div className="text-right">
                  <span className="text-slate-500">Reach: </span>
                  {obj.reachableLeft && obj.reachableRight ? (
                    <span className="text-cyber-green font-semibold">BOTH ARMS</span>
                  ) : obj.reachableLeft ? (
                    <span className="text-cyber-cyan font-semibold">LEFT ARM</span>
                  ) : (
                    <span className="text-cyber-amber font-semibold">RIGHT ARM</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
