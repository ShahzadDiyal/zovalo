// src/app/admin/colors/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Palette,
  AlertCircle,
  Upload,
  Copy,
  FileSpreadsheet,
  RefreshCw,
  Filter,
  AlertTriangle,
} from "lucide-react";
import { colorApi } from "../../../services/colorApi";
import { Color } from "../../../types";
import { Skeleton } from "../../../components/ui/Loading";
import { storage } from "../../../lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function AdminColors() {
  const [colors, setColors] = useState<Color[]>([]);
  const [fabrics, setFabrics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState<Partial<Color> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFabric, setSelectedFabric] = useState<string>("all");
  const [bulkInput, setBulkInput] = useState("");
  const [bulkFabric, setBulkFabric] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [bulkResults, setBulkResults] = useState<{
    created: string[];
    skipped: Array<{ name: string; fabric: string; reason: string }>;
  } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [colorsData, fabricsData] = await Promise.all([
        colorApi.getAll(),
        colorApi.getFabrics(),
      ]);

      setColors(colorsData);
      setFabrics(fabricsData);

      if (fabricsData.length > 0 && !bulkFabric) {
        setBulkFabric(fabricsData[0]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be less than 2MB");
      return;
    }

    setUploadingImage(true);
    setUploadProgress(0);
    setError(null);

    try {
      const timestamp = Date.now();
      const fileName = `colors/${timestamp}-${file.name}`;
      const storageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Upload error:", error);
          setError("Failed to upload image. Please try again.");
          setUploadingImage(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setCurrentColor((prev) => ({ ...prev, image: downloadURL }));
          setUploadingImage(false);
          setUploadProgress(0);
          setSuccessMessage("Image uploaded successfully!");
          setTimeout(() => setSuccessMessage(null), 3000);
        },
      );
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image. Please try again.");
      setUploadingImage(false);
    }
  };

  const handleBulkImport = async () => {
    if (!bulkInput.trim()) {
      setError("Please paste your color data");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    setBulkResults(null);

    try {
      const lines = bulkInput
        .split("\n")
        .filter((line) => line.trim() && !line.startsWith("#"));
      const colorsToCreate: Omit<Color, "id" | "createdAt" | "updatedAt">[] =
        [];

      for (const line of lines) {
        const parts = line.split(",").map((p) => p.trim());
        if (parts.length >= 2) {
          const name = parts[0];
          const hex = parts[1];
          const fabric = parts[2] || bulkFabric;
          const sortOrder = parseInt(parts[3]) || colorsToCreate.length + 1;

          if (name && hex && fabric) {
            colorsToCreate.push({
              name,
              hex,
              fabric,
              sortOrder,
              isActive: true,
            });
          }
        }
      }

      if (colorsToCreate.length === 0) {
        setError("No valid colors found. Please check the format.");
        setIsSubmitting(false);
        return;
      }

      const result = await colorApi.bulkCreate(colorsToCreate);
      setBulkResults(result);

      if (result.created.length > 0) {
        setSuccessMessage(
          `${result.created.length} colors imported successfully!`,
        );
      }

      if (result.skipped.length > 0) {
        setError(
          `${result.skipped.length} colors were skipped (duplicates found)`,
        );
      }

      if (result.created.length === 0 && result.skipped.length > 0) {
        setError("No new colors were created. All were duplicates.");
      }

      setIsBulkModalOpen(false);
      setBulkInput("");
      await fetchData();

      setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
        setBulkResults(null);
      }, 5000);
    } catch (error: any) {
      console.error("Error importing colors:", error);
      setError(error.message || "Failed to import colors. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentColor?.name) {
      setError("Color name is required");
      return;
    }

    if (!currentColor?.fabric) {
      setError("Fabric type is required");
      return;
    }

    if (!currentColor?.hex && !currentColor?.image) {
      setError("Please provide either a hex code or an image");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Check if color already exists (only for new colors)
      if (!currentColor.id) {
        const exists = await colorApi.colorExists(
          currentColor.name,
          currentColor.fabric,
        );
        if (exists) {
          setError(
            `Color "${currentColor.name}" already exists in fabric "${currentColor.fabric}"`,
          );
          setIsSubmitting(false);
          return;
        }

        if (currentColor.hex) {
          const existsByHex = await colorApi.colorExistsByHex(
            currentColor.hex,
            currentColor.fabric,
          );
          if (existsByHex) {
            setError(
              `Color with hex "${currentColor.hex}" already exists in fabric "${currentColor.fabric}"`,
            );
            setIsSubmitting(false);
            return;
          }
        }
      }

      if (currentColor.id) {
        await colorApi.update(currentColor.id, currentColor);
        setSuccessMessage("Color updated successfully!");
      } else {
        await colorApi.create(
          currentColor as Omit<Color, "id" | "createdAt" | "updatedAt">,
        );
        setSuccessMessage("Color created successfully!");
      }

      setIsModalOpen(false);
      setCurrentColor(null);
      await fetchData();

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      console.error("Error saving color:", error);
      setError(error.message || "Failed to save color. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this color?")) return;

    try {
      await colorApi.delete(id);
      setSuccessMessage("Color deleted successfully!");
      await fetchData();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error deleting color:", error);
      setError("Failed to delete color. Please try again.");
    }
  };

  const copyTemplate = () => {
    const template = `# Format: Name, Hex Code, Fabric (optional), Sort Order (optional)
# Example:
Steel Grey,#8A8D91,Plush Velvet,1
Silver,#C0C0C0,Plush Velvet,2
Charcoal Grey,#36454F,Crushed Velvet,1
Black,#1A1A1A,Jumbo Cord,1
Cream,#FFFDD0,Chenille,1`;
    navigator.clipboard.writeText(template);
    setSuccessMessage("Template copied to clipboard!");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const getColorsByFabric = (fabric: string) => {
    return colors.filter((c) => c.fabric === fabric);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    if (value.length > 0) {
      const suggestions = colors
        .filter(
          (color) =>
            color.name.toLowerCase().includes(value.toLowerCase()) ||
            color.hex.toLowerCase().includes(value.toLowerCase()) ||
            color.fabric.toLowerCase().includes(value.toLowerCase()),
        )
        .map((color) => color.name)
        .slice(0, 5);

      setSearchSuggestions([...new Set(suggestions)]);
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  const filteredColors = useMemo(() => {
    return colors.filter((color) => {
      const matchesSearch =
        color.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        color.hex.toLowerCase().includes(searchQuery.toLowerCase()) ||
        color.fabric.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFabric =
        selectedFabric === "all" || color.fabric === selectedFabric;

      const matchesActive =
        activeFilter === "all" ||
        (activeFilter === "active" && color.isActive) ||
        (activeFilter === "inactive" && !color.isActive);

      return matchesSearch && matchesFabric && matchesActive;
    });
  }, [colors, searchQuery, selectedFabric, activeFilter]);

  const uniqueFabrics = useMemo(() => {
    return [...new Set(colors.map((c) => c.fabric))].sort();
  }, [colors]);

  const stats = useMemo(() => {
    const total = colors.length;
    const active = colors.filter((c) => c.isActive).length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [colors]);

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Bulk Import Results */}
      {bulkResults && bulkResults.skipped.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium">Skipped Colors (Duplicates)</span>
          </div>
          <div className="max-h-32 overflow-y-auto">
            {bulkResults.skipped.map((item, index) => (
              <div
                key={index}
                className="text-xs py-1 border-b border-amber-100 last:border-0"
              >
                <span className="font-medium">{item.name}</span> - {item.fabric}
                : {item.reason}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display text-near-black uppercase tracking-tight">
            Color Management
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your color palette and fabric swatches
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setIsBulkModalOpen(true);
              setError(null);
              setBulkResults(null);
            }}
            className="bg-amber-50 text-amber-700 border border-amber-200 px-4 sm:px-6 py-2.5 sm:py-3 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-amber-100 transition-all duration-300 rounded"
          >
            <FileSpreadsheet className="w-4 h-4" /> Bulk Import
          </button>
          <button
            onClick={() => {
              setCurrentColor({ isActive: true, sortOrder: 0 });
              setIsModalOpen(true);
              setError(null);
            }}
            className="bg-near-black text-white px-4 sm:px-6 py-2.5 sm:py-3 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gold transition-all duration-300 rounded"
          >
            <Plus className="w-4 h-4" /> Add Color
          </button>
          <button
            onClick={() => {
              setLoading(true);
              fetchData();
            }}
            className="bg-cream text-near-black border border-warm-beige px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gold/20 rounded flex items-center gap-2"
          >
            <RefreshCw className="w-3 h-3" />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-warm-beige p-4 rounded-lg">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Total Colors
          </p>
          <p className="text-2xl font-display text-near-black">{stats.total}</p>
        </div>
        <div className="bg-white border border-warm-beige p-4 rounded-lg">
          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
            Active
          </p>
          <p className="text-2xl font-display text-emerald-600">
            {stats.active}
          </p>
        </div>
        <div className="bg-white border border-warm-beige p-4 rounded-lg">
          <p className="text-[10px] font-bold uppercase tracking-widest text-red-400">
            Inactive
          </p>
          <p className="text-2xl font-display text-red-400">{stats.inactive}</p>
        </div>
      </div>

      <div className="bg-white border border-warm-beige p-4 rounded-lg">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search colors by name, hex, or fabric..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full bg-cream border border-warm-beige py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-gold outline-none rounded"
            />

            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-warm-beige rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-cream/50 transition-colors flex items-center gap-2"
                  >
                    <Search className="w-3 h-3 text-gray-400" />
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <select
              value={selectedFabric}
              onChange={(e) => setSelectedFabric(e.target.value)}
              className="bg-cream border border-warm-beige py-2.5 px-4 text-sm focus:ring-1 focus:ring-gold outline-none rounded min-w-[150px]"
            >
              <option value="all">All Fabrics ({uniqueFabrics.length})</option>
              {uniqueFabrics.map((fabric) => (
                <option key={fabric} value={fabric}>
                  {fabric}
                </option>
              ))}
            </select>

            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`bg-cream border border-warm-beige py-2.5 px-4 text-sm focus:ring-1 focus:ring-gold outline-none rounded flex items-center gap-2 ${
                  activeFilter !== "all" ? "bg-gold/10 border-gold" : ""
                }`}
              >
                <Filter className="w-4 h-4" />
                {activeFilter === "all"
                  ? "All"
                  : activeFilter === "active"
                    ? "Active"
                    : "Inactive"}
              </button>

              {isFilterOpen && (
                <div className="absolute z-50 right-0 mt-1 bg-white border border-warm-beige rounded-lg shadow-lg min-w-[150px]">
                  <button
                    onClick={() => {
                      setActiveFilter("all");
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-cream/50 transition-colors ${
                      activeFilter === "all" ? "bg-gold/10 text-gold" : ""
                    }`}
                  >
                    All Colors
                  </button>
                  <button
                    onClick={() => {
                      setActiveFilter("active");
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-cream/50 transition-colors ${
                      activeFilter === "active" ? "bg-gold/10 text-gold" : ""
                    }`}
                  >
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                    Active Only
                  </button>
                  <button
                    onClick={() => {
                      setActiveFilter("inactive");
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-cream/50 transition-colors ${
                      activeFilter === "inactive" ? "bg-gold/10 text-gold" : ""
                    }`}
                  >
                    <span className="inline-block w-2 h-2 rounded-full bg-red-400 mr-2"></span>
                    Inactive Only
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {selectedFabric !== "all" && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gold/10 text-gold text-xs rounded-full">
              Fabric: {selectedFabric}
              <button
                onClick={() => setSelectedFabric("all")}
                className="hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {activeFilter !== "all" && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gold/10 text-gold text-xs rounded-full">
              Status: {activeFilter}
              <button
                onClick={() => setActiveFilter("all")}
                className="hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gold/10 text-gold text-xs rounded-full">
              Search: {searchQuery}
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSearchSuggestions([]);
                }}
                className="hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-400">
        Showing {filteredColors.length} of {colors.length} colors
        {selectedFabric !== "all" && ` in "${selectedFabric}"`}
        {activeFilter !== "all" && ` (${activeFilter})`}
        {searchQuery && ` matching "${searchQuery}"`}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border border-warm-beige rounded-lg overflow-hidden"
            >
              <Skeleton className="h-12 w-full" />
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((j) => (
                  <Skeleton key={j} className="h-20 w-full rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : filteredColors.length === 0 ? (
        <div className="text-center py-12 bg-white border border-warm-beige rounded-lg">
          <Palette className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">
            {searchQuery || selectedFabric !== "all" || activeFilter !== "all"
              ? "No colors match your filters"
              : "No colors added yet"}
          </p>
          {(searchQuery ||
            selectedFabric !== "all" ||
            activeFilter !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedFabric("all");
                setActiveFilter("all");
                setSearchSuggestions([]);
              }}
              className="mt-2 text-gold hover:underline text-sm font-medium"
            >
              Clear all filters
            </button>
          )}
          {!searchQuery &&
            selectedFabric === "all" &&
            activeFilter === "all" && (
              <div className="mt-4 space-x-3">
                <button
                  onClick={() => {
                    setCurrentColor({ isActive: true, sortOrder: 0 });
                    setIsModalOpen(true);
                    setError(null);
                  }}
                  className="text-gold hover:underline text-sm font-medium"
                >
                  Add your first color
                </button>
                <span className="text-gray-300">or</span>
                <button
                  onClick={() => {
                    setIsBulkModalOpen(true);
                    setError(null);
                  }}
                  className="text-gold hover:underline text-sm font-medium"
                >
                  Bulk import colors
                </button>
              </div>
            )}
        </div>
      ) : (
        <div className="space-y-4">
          {uniqueFabrics.map((fabric) => {
            const fabricColors = filteredColors.filter(
              (c) => c.fabric === fabric,
            );
            if (fabricColors.length === 0) return null;

            return (
              <div
                key={fabric}
                className="bg-white border border-warm-beige rounded-lg overflow-hidden"
              >
                <div className="flex items-center justify-between p-3 bg-cream/30">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-near-black">
                      {fabric}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({fabricColors.length} colors)
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentColor({
                        fabric,
                        isActive: true,
                        sortOrder: fabricColors.length,
                      });
                      setIsModalOpen(true);
                      setError(null);
                    }}
                    className="text-[9px] font-bold uppercase tracking-widest text-amber-600 hover:text-amber-700"
                  >
                    <Plus className="w-3 h-3 inline" /> Add Color
                  </button>
                </div>

                <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {fabricColors.map((color) => (
                    <div
                      key={color.id}
                      className={`bg-cream/30 border rounded-lg p-2 hover:shadow-md transition-shadow group ${
                        color.isActive
                          ? "border-warm-beige"
                          : "border-red-200 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="w-6 h-6 rounded-full border border-gray-300 flex-shrink-0"
                          style={{ backgroundColor: color.hex || "#FFFFFF" }}
                        />
                        <span className="text-xs font-medium text-near-black truncate flex-1">
                          {color.name}
                        </span>
                      </div>
                      <p className="text-[12px] font-mono text-walnut font-bold tracking-widest">
                        {color.hex || "No hex"}
                      </p>
                      {!color.isActive && (
                        <span className="text-[8px] text-red-400 font-medium">
                          Inactive
                        </span>
                      )}
                      <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setCurrentColor(color);
                            setIsModalOpen(true);
                            setError(null);
                          }}
                          className="text-[8px] font-bold uppercase tracking-widest text-walnut hover:text-gold"
                        >
                          <Edit2 className="w-4 h-4 inline" />
                        </button>
                        <button
                          onClick={() => handleDelete(color.id)}
                          className="text-[8px] font-bold uppercase tracking-widest text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Single Color Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-near-black/80 backdrop-blur-sm"
            onClick={() => {
              setIsModalOpen(false);
              setCurrentColor(null);
              setError(null);
            }}
          />
          <div className="bg-white max-w-md w-full relative z-10 shadow-2xl border border-warm-beige rounded-lg p-6 max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-near-black"
              onClick={() => {
                setIsModalOpen(false);
                setCurrentColor(null);
                setError(null);
              }}
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-display text-near-black mb-6">
              {currentColor?.id ? "Edit Color" : "New Color"}
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block mb-1">
                  Color Name *
                </label>
                <input
                  required
                  value={currentColor?.name || ""}
                  onChange={(e) =>
                    setCurrentColor((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full bg-cream border border-warm-beige py-2.5 px-4 text-sm focus:border-gold outline-none rounded"
                  placeholder="e.g., Steel Grey"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block mb-1">
                  Hex Code
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={currentColor?.hex || ""}
                    onChange={(e) =>
                      setCurrentColor((prev) => ({
                        ...prev,
                        hex: e.target.value,
                      }))
                    }
                    className="flex-1 bg-cream border border-warm-beige py-2.5 px-4 text-sm font-mono focus:border-gold outline-none rounded"
                    placeholder="#8A8D91"
                  />
                  <div
                    className="w-12 h-12 rounded border border-warm-beige flex-shrink-0"
                    style={{ backgroundColor: currentColor?.hex || "#FFFFFF" }}
                  />
                </div>
                <p className="text-[8px] text-gray-400 mt-1">
                  Optional if you have an image
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block mb-1">
                  Swatch Image (Optional)
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("swatch-upload")?.click()
                      }
                      disabled={uploadingImage}
                      className="flex items-center gap-2 px-4 py-2 bg-cream border border-warm-beige text-sm hover:bg-gold/20 transition-colors rounded"
                    >
                      <Upload className="w-4 h-4" />
                      {uploadingImage ? "Uploading..." : "Upload Swatch"}
                    </button>
                    <input
                      id="swatch-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                      className="hidden"
                    />
                    <input
                      type="text"
                      value={currentColor?.image || ""}
                      onChange={(e) =>
                        setCurrentColor((prev) => ({
                          ...prev,
                          image: e.target.value,
                        }))
                      }
                      placeholder="Or paste image URL"
                      className="flex-1 bg-cream border border-warm-beige py-2 px-3 text-sm focus:border-gold outline-none rounded"
                    />
                  </div>

                  {uploadingImage && (
                    <div className="space-y-1">
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gold transition-all duration-300 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-[8px] text-gray-400">
                        Uploading... {Math.round(uploadProgress)}%
                      </p>
                    </div>
                  )}

                  {currentColor?.image && (
                    <div className="relative inline-block">
                      <div className="w-20 h-20 bg-cream border border-warm-beige rounded-lg overflow-hidden">
                        <img
                          src={currentColor.image}
                          alt="Swatch preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentColor((prev) => ({ ...prev, image: "" }))
                        }
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-[8px] text-gray-400 mt-1">
                  Optional if you have a hex code
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block mb-1">
                  Fabric Type *
                </label>
                <select
                  required
                  value={currentColor?.fabric || ""}
                  onChange={(e) =>
                    setCurrentColor((prev) => ({
                      ...prev,
                      fabric: e.target.value,
                    }))
                  }
                  className="w-full bg-cream border border-warm-beige py-2.5 px-4 text-sm focus:border-gold outline-none rounded"
                >
                  <option value="">Select Fabric</option>
                  {fabrics.map((fabric) => (
                    <option key={fabric} value={fabric}>
                      {fabric}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={currentColor?.sortOrder || 0}
                  onChange={(e) =>
                    setCurrentColor((prev) => ({
                      ...prev,
                      sortOrder: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full bg-cream border border-warm-beige py-2.5 px-4 text-sm focus:border-gold outline-none rounded"
                  min="0"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut">
                  Active
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentColor((prev) => ({
                      ...prev,
                      isActive: !prev?.isActive,
                    }))
                  }
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 ${
                    currentColor?.isActive ? "bg-gold" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                      currentColor?.isActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setCurrentColor(null);
                    setError(null);
                  }}
                  className="flex-1 border-2 border-near-black py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-near-black hover:text-white transition rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || uploadingImage}
                  className="flex-1 bg-near-black text-white py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-gold hover:text-near-black transition disabled:opacity-50 rounded"
                >
                  {isSubmitting
                    ? "Saving..."
                    : currentColor?.id
                      ? "Update"
                      : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-near-black/80 backdrop-blur-sm"
            onClick={() => {
              setIsBulkModalOpen(false);
              setBulkInput("");
              setError(null);
              setBulkResults(null);
            }}
          />
          <div className="bg-white max-w-2xl w-full relative z-10 shadow-2xl border border-warm-beige rounded-lg p-6 max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-near-black"
              onClick={() => {
                setIsBulkModalOpen(false);
                setBulkInput("");
                setError(null);
                setBulkResults(null);
              }}
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-display text-near-black mb-2">
              Bulk Import Colors
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Add multiple colors at once. Each color on a new line. Duplicates
              will be skipped.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-walnut">
                    Fabric Type for All Colors *
                  </label>
                  <button
                    type="button"
                    onClick={copyTemplate}
                    className="text-[9px] font-bold uppercase tracking-widest text-amber-600 hover:text-amber-700"
                  >
                    <Copy className="w-3 h-3 inline mr-1" /> Copy Template
                  </button>
                </div>
                <select
                  value={bulkFabric}
                  onChange={(e) => setBulkFabric(e.target.value)}
                  className="w-full bg-cream border border-warm-beige py-2.5 px-4 text-sm focus:border-gold outline-none rounded mb-3"
                >
                  {fabrics.map((fabric) => (
                    <option key={fabric} value={fabric}>
                      {fabric}
                    </option>
                  ))}
                </select>
                <p className="text-[8px] text-gray-400 mb-2">
                  You can override fabric per color by adding it as a third
                  field (Name, Hex, Fabric)
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block mb-1">
                  Color Data *
                </label>
                <textarea
                  rows={10}
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  className="w-full bg-cream border border-warm-beige py-2.5 px-4 text-sm font-mono focus:border-gold outline-none rounded resize-none"
                  placeholder={`# Format: Name, Hex Code\nSteel Grey,#8A8D91\nSilver,#C0C0C0\nCharcoal Grey,#36454F,Crushed Velvet\nBlack,#1A1A1A,Jumbo Cord`}
                />
                <p className="text-[8px] text-gray-400 mt-1">
                  Format: <strong>Name, Hex</strong> or{" "}
                  <strong>Name, Hex, Fabric</strong> (one per line)
                </p>
                <p className="text-[8px] text-amber-600 mt-1">
                  ⚠️ Colors with the same name and fabric will be skipped
                  automatically
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsBulkModalOpen(false);
                    setBulkInput("");
                    setError(null);
                    setBulkResults(null);
                  }}
                  className="flex-1 border-2 border-near-black py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-near-black hover:text-white transition rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkImport}
                  disabled={isSubmitting}
                  className="flex-1 bg-near-black text-white py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-gold hover:text-near-black transition disabled:opacity-50 rounded"
                >
                  {isSubmitting ? "Importing..." : "Import Colors"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
