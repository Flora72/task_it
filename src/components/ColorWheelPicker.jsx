import React, { useRef } from "react";
import { Pipette, Check } from "lucide-react";

export default function ColorWheelPicker({ selectedColor, onChangeColor, presets = [] }) {
  const inputRef = useRef(null);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Color Accent & Spine
        </label>
        <span className="text-[10px] font-mono text-zinc-400 uppercase">{selectedColor}</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Native Color Wheel Activator */}
        <div className="relative">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-8 h-8 rounded-full border-2 border-zinc-300 dark:border-zinc-700 shadow-xs flex items-center justify-center transition-transform hover:scale-105"
            style={{
              background: "conic-gradient(from 0deg, red, yellow, lime, aqua, blue, magenta, red)",
            }}
            title="Open Full Color Wheel"
          >
            <div className="w-3.5 h-3.5 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center">
              <Pipette className="w-2.5 h-2.5 text-zinc-700 dark:text-zinc-300" />
            </div>
          </button>
          <input
            ref={inputRef}
            type="color"
            value={selectedColor}
            onChange={(e) => onChangeColor(e.target.value)}
            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer pointer-events-none"
          />
        </div>

        {/* Preset Palette Swatches */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {presets.map((preset) => {
            const isSelected = selectedColor?.toLowerCase() === preset.hex.toLowerCase();
            return (
              <button
                key={preset.hex}
                type="button"
                onClick={() => onChangeColor(preset.hex)}
                className="w-6 h-6 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center transition-transform active:scale-90"
                style={{ backgroundColor: preset.hex }}
                title={preset.name}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow-xs" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}