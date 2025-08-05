'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { HexColorPicker } from 'react-colorful';
import { XCircleIcon, Squares2X2Icon } from '@heroicons/react/24/solid';
import { generatePaletteColors, generateDistinctColors, ensureContrast } from '../../../../../../../../helpers/colorGenerator';

interface ColorPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (colors: string[]) => void;
  currentColors: string[];
  departmentNames: string[];
}

// Predefined palette names (colors are generated dynamically)
const PREDEFINED_PALETTES = [
  { name: 'Professional' },
  { name: 'Pastel' },
  { name: 'Vibrant' },
  { name: 'Monochrome' },
  { name: 'Warm' },
  { name: 'Cool' }
];

const ColorPaletteModal: React.FC<ColorPaletteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentColors,
  departmentNames
}) => {
  const [selectedPalette, setSelectedPalette] = useState<string>('');
  const [customColors, setCustomColors] = useState<string[]>(currentColors);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string>(currentColors[0] || '#3B82F6');

  useEffect(() => {
    setCustomColors(currentColors);
  }, [currentColors]);

  const handlePaletteSelect = (paletteName: string) => {
    setSelectedPalette(paletteName);
    
    // Generate colors for the selected palette with unlimited capacity
    const colorsNeeded = departmentNames.length;
    const generatedColors = generatePaletteColors(paletteName, colorsNeeded);
    
    // Ensure good contrast between colors
    const colorsWithContrast = ensureContrast(generatedColors);
    
    setCustomColors(colorsWithContrast);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const newColors = [...customColors];
    newColors[selectedColorIndex] = color;
    setCustomColors(newColors);
  };

  const handleColorClick = (index: number) => {
    setSelectedColorIndex(index);
    setSelectedColor(customColors[index] || '#3B82F6');
  };

  const handleSave = () => {
    onSave(customColors);
    onClose();
  };

  const handleReset = () => {
    setCustomColors(currentColors);
    setSelectedPalette('');
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-4xl">
                <div className="flex bg-savoy-blue p-4 items-center gap-4">
                  <Squares2X2Icon className="w-6 h-6 text-white" />
                  <h3 className="flex-1 text-white font-semibold">
                    Customize Department Colors
                  </h3>
                  <XCircleIcon
                    className="w-6 h-6 text-white cursor-pointer"
                    onClick={onClose}
                  />
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left side - Predefined palettes and color picker */}
                    <div className="space-y-6">
                      {/* Predefined Palettes */}
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-3">Choose a Palette</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {PREDEFINED_PALETTES.map((palette) => (
                            <button
                              key={palette.name}
                              onClick={() => handlePaletteSelect(palette.name)}
                              className={`p-3 border rounded-lg text-left transition-colors ${
                                selectedPalette === palette.name
                                  ? 'border-savoy-blue bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="text-sm font-medium text-gray-900 mb-2">
                                {palette.name}
                              </div>
                              <div className="flex gap-1">
                                {generatePaletteColors(palette.name, 5).map((color, index) => (
                                  <div
                                    key={index}
                                    className="w-4 h-4 rounded border border-gray-200"
                                    style={{ backgroundColor: color }}
                                  />
                                ))}
                                <div className="text-xs text-gray-500 flex items-center">
                                  +∞
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Color Picker */}
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-3">Customize Individual Colors</h4>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded border border-gray-200"
                              style={{ backgroundColor: selectedColor }}
                            />
                            <span className="text-sm text-gray-600">
                              {departmentNames[selectedColorIndex] || `Department ${selectedColorIndex + 1}`}
                            </span>
                          </div>
                          <HexColorPicker
                            color={selectedColor}
                            onChange={handleColorChange}
                            className="w-full"
                          />
                          <input
                            type="text"
                            value={selectedColor}
                            onChange={(e) => handleColorChange(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm font-mono"
                            placeholder="#000000"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right side - Department color preview */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-3">Preview</h4>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {departmentNames.map((deptName, index) => (
                          <div
                            key={index}
                            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                              selectedColorIndex === index
                                ? 'border-savoy-blue bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => handleColorClick(index)}
                          >
                            <div
                              className="w-6 h-6 rounded border border-gray-200"
                              style={{ backgroundColor: customColors[index] || '#3B82F6' }}
                            />
                            <span className="text-sm text-gray-900 flex-1">
                              {deptName}
                            </span>
                            <span className="text-xs text-gray-500 font-mono">
                              {customColors[index] || '#3B82F6'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Reset
                    </button>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 text-sm font-medium text-white bg-savoy-blue rounded-md hover:bg-opacity-90 transition-colors"
                    >
                      Save Colors
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ColorPaletteModal;