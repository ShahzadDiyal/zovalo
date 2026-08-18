// src/components/products/ColorSelection.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Palette, X, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { colorApi } from "../../services/colorApi";
import { Color } from "../../types";

interface ColorSelectionProps {
  productId: string;
  onColorSelect?: (
    colorName: string,
    fabricName: string,
    colorHex: string,
    combinedName: string,
  ) => void;
}

export function ColorSelection({
  productId,
  onColorSelect,
}: ColorSelectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedColorName, setSelectedColorName] = useState<string | null>(
    null,
  );
  const [selectedColorHex, setSelectedColorHex] = useState<string | null>(null);
  const [selectedFabric, setSelectedFabric] = useState<string>("");
  const [selectedFabricName, setSelectedFabricName] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [colors, setColors] = useState<Color[]>([]);
  const [fabrics, setFabrics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFabricsDropdown, setShowFabricsDropdown] = useState(false);

  useEffect(() => {
    fetchColorsAndFabrics();
  }, []);

  const fetchColorsAndFabrics = async () => {
    setLoading(true);
    try {
      const [colorsData, fabricsData] = await Promise.all([
        colorApi.getActiveColors(),
        colorApi.getFabrics(),
      ]);

      console.log("🎨 Frontend - Colors loaded:", colorsData.length);
      console.log("🎨 Frontend - Fabrics loaded:", fabricsData);

      setColors(colorsData);
      setFabrics(fabricsData);

      if (fabricsData.length > 0) {
        setSelectedFabric(fabricsData[0]);
        setSelectedFabricName(fabricsData[0]);
      }
    } catch (error) {
      console.error("❌ Error fetching colors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleColorSelect = (color: Color) => {
    const fabricName = selectedFabric || selectedFabricName;
    const combinedName = `${fabricName} - ${color.name}`;

    setSelectedColor(color.hex);
    setSelectedColorName(color.name);
    setSelectedColorHex(color.hex);

    if (onColorSelect) {
      onColorSelect(color.name, fabricName, color.hex, combinedName);
    }

    setIsOpen(false);
  };

  const handleFabricSelect = (fabric: string) => {
    setSelectedFabric(fabric);
    setSelectedFabricName(fabric);
    setShowFabricsDropdown(false);

    if (selectedColorName && onColorSelect) {
      const combinedName = `${fabric} - ${selectedColorName}`;
      onColorSelect(
        selectedColorName,
        fabric,
        selectedColorHex || "#FFFFFF",
        combinedName,
      );
    }
  };

  const getFilteredColors = () => {
    let filtered = colors.filter((c) => c.fabric === selectedFabric);
    if (searchTerm) {
      filtered = filtered.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    return filtered;
  };

  const getColorCount = (fabric: string) => {
    return colors.filter((c) => c.fabric === fabric).length;
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-50 border-2 border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-300 transition-all rounded-xl font-semibold text-sm"
        >
          <Palette className="w-5 h-5" />
          Choose Your Color & Fabric
        </button>
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-50 border-2 border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-300 transition-all rounded-xl font-semibold text-sm"
      >
        <Palette className="w-5 h-5" />
        Choose Your Color & Fabric
      </button>

      {selectedColor && selectedFabric && (
        <div className="flex items-center gap-2 p-2 bg-cream rounded-lg border border-warm-beige">
          <div
            className="w-6 h-6 rounded-full border-2 border-white shadow-sm flex-shrink-0"
            style={{ backgroundColor: selectedColor }}
          />
          <div className="flex flex-col">
            <span className="text-xs font-medium text-near-black">
              {selectedColorName}
            </span>
            <span className="text-[10px] text-gray-400">
              Fabric: {selectedFabric}
            </span>
          </div>
          <button
            onClick={() => {
              setSelectedColor(null);
              setSelectedColorName(null);
              setSelectedColorHex(null);
              if (onColorSelect) {
                onColorSelect("", selectedFabric, "", "");
              }
            }}
            className="ml-auto text-red-400 hover:text-red-600"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <p className="text-[12px] text-gray-600 text-center">
        📷 Shown in Grey. Available in{" "}
        <span className="font-bold"> {colors.length}+ </span> colors & fabrics!
      </p>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed inset-x-0 bottom-0 z-[9999] flex justify-center pointer-events-none">
            <div className="w-full max-w-5xl mx-4 pointer-events-auto transform transition-transform duration-300 ease-out">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] min-h-[400px] md:min-h-[500px]">
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-12 h-1 bg-gray-300 rounded-full" />
                </div>

                <div className="px-4 py-3 border-b border-warm-beige flex justify-between items-center">
                  <div>
                    <h3 className="text-base  text-near-black">
                      Choose Your Color
                    </h3>
                    <p className="text-[10px] text-gray-400">
                      Select from our premium collection
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 hover:bg-cream rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="px-4 py-2.5 border-b border-warm-beige">
                  <input
                    type="text"
                    placeholder="Search colors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-cream border border-warm-beige py-1.5 px-3 text-xs focus:border-gold outline-none rounded-lg"
                  />
                </div>

                <div className="px-4 pt-3 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Fabric:
                    </span>
                    <button
                      onClick={() =>
                        setShowFabricsDropdown(!showFabricsDropdown)
                      }
                      className="flex-1 flex items-center justify-between px-3 py-2 bg-cream border border-warm-beige rounded-lg hover:bg-gold/10 transition-colors"
                    >
                      <span className="text-sm font-medium text-near-black">
                        {selectedFabric}
                        <span className="ml-2 text-xs text-gray-400">
                          ({getColorCount(selectedFabric)} colors)
                        </span>
                      </span>
                      {showFabricsDropdown ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>

                  {showFabricsDropdown && (
                    <div className="mt-1 bg-white border border-warm-beige rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {fabrics.map((fabric) => (
                        <button
                          key={fabric}
                          onClick={() => handleFabricSelect(fabric)}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-cream/50 transition-colors flex items-center justify-between ${
                            selectedFabric === fabric
                              ? "bg-gold/10 text-gold"
                              : ""
                          }`}
                        >
                          <span>{fabric}</span>
                          <span className="text-xs text-gray-400">
                            {getColorCount(fabric)} colors
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4 overflow-y-auto max-h-[calc(80vh-320px)] min-h-[200px] md:min-h-[280px]">
                  {getFilteredColors().length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-1">
                      {getFilteredColors().map((color) => (
                        <button
                          key={color.id}
                          onClick={() => handleColorSelect(color)}
                          className="group flex flex-col items-center gap-1 hover:bg-cream p-2 rounded-lg transition-all"
                        >
                          {color.image ? (
                            <div className="w-12 h-12 rounded-[full] border-2 border-neutral-200 group-hover:border-amber-400 transition-all shadow-sm group-hover:shadow-md overflow-hidden flex-shrink-0">
                              <img
                                src={color.image}
                                alt={color.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div
                              className="w-12 h-12 rounded-[12px] border-2 border-neutral-200 group-hover:border-amber-400 transition-all shadow-sm group-hover:shadow-md flex-shrink-0"
                              style={{ backgroundColor: color.hex }}
                            />
                          )}
                          <span className="text-[13px] text-neutral-700 text-center leading-tight line-clamp-2 max-w-[60px]">
                            {color.name}
                          </span>
                          {/* <span className="text-[12px] font-mono text-gray-400">
                            {color.hex}
                          </span> */}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 text-sm py-6">
                      {searchTerm
                        ? `No colors found for "${searchTerm}" in ${selectedFabric}`
                        : `No colors available for ${selectedFabric} yet.`}
                    </div>
                  )}
                </div>

                <div className="px-4 py-1.5 border-t border-warm-beige bg-white">
                  <p className="text-[11px] text-gray-400 text-center">
                    Can't find your shade?{" "}
                    <span className="text-amber-600 font-medium">
                      Contact us
                    </span>{" "}
                    for custom requests.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
