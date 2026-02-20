"use client";

import { useState } from "react";
import * as XLSX from "xlsx";

type UploadStats = {
  total: number;
  success: number;
  failed: number;
  skipped: number;
};

type LogEntry = {
  index: number;
  name: string;
  status: "success" | "error" | "skipped";
  message: string;
};

const SCHEMA_FIELDS: Record<string, string[]> = {
  "/api/states": [
    "state_id",
    "state",
    "state_slug",
    "country",
    "census_year",
    "total_districts",
    "total_tehsils",
    "total_blocks",
    "total_villages",
    "total_population",
    "male_population",
    "female_population",
    "sc_population",
    "st_population",
    "total_households",
    "avg_literacy_rate",
    "avg_male_literacy",
    "avg_female_literacy",
    "nearest_city",
    "nearest_airport",
    "major_crops",
    "main_occupation",
  ],
  "/api/districts": [
    "district_id",
    "district",
    "district_slug",
    "state",
    "state_slug",
    "country",
    "census_year",
    "total_tehsils",
    "total_blocks",
    "total_villages",
    "total_population",
    "male_population",
    "female_population",
    "sc_population",
    "st_population",
    "total_households",
    "avg_literacy_rate",
    "avg_male_literacy",
    "avg_female_literacy",
    "nearest_city",
    "nearest_railway_station",
    "nearest_airport",
    "roads",
    "major_crops",
    "primary_health_center",
    "post_title",
    "post_name",
    "state_1",
  ],
  "/api/tehsil": [
    "block_id",
    "block_tehsil",
    "block_slug",
    "district",
    "district_slug",
    "state",
    "state_slug",
    "country",
    "census_year",
    "total_villages",
    "total_population",
    "male_population",
    "female_population",
    "sc_population",
    "st_population",
    "total_households",
    "avg_literacy_rate",
    "avg_male_literacy",
    "avg_female_literacy",
    "headquarter_town",
    "nearest_city",
    "pin_code",
    "nearest_railway_station",
    "nearest_airport",
    "latitude",
    "longitude",
    "roads",
    "internet",
    "mobile_networks",
    "drinking_water",
    "major_crops",
    "main_occupation",
    "primary_health_center",
    "district_hospital",
  ],
  "/api/village": [
    "village_id",
    "village_name",
    "block_tehsil",
    "district",
    "state",
    "pin_code",
    "police_station",
    "total_population",
    "male_population",
    "female_population",
    "sex_ratio",
    "child_population_0_6",
    "avg_literacy_rate",
    "male_literacy_rate",
    "female_literacy_rate",
    "sc_population",
    "st_population",
    "total_households",
    "primary_school",
    "secondary_school",
    "primary_health_center",
    "nearest_town",
    "distance_to_town_km",
    "nearest_railway_station",
    "railway_distance_km",
    "nearest_airport",
    "airport_distance_km",
    "major_crops",
    "major_religions",
    "festivals",
    "electricity",
    "roads",
    "drinking_water",
    "internet",
    "mobile_networks",
    "gram_panchayat",
    "ward_count",
    "terrain_geography",
    "climate_weather",
    "main_occupation",
    "village_rating_1_5",
    "nearest_city",
    "country",
    "census_year",
    "latitude",
    "longitude",
    "block_slug",
    "district_slug",
    "state_slug",
    "village_slug",
    "post_title",
    "post_name",
    "tehsil",
    "farms",
  ],
};

const ENDPOINTS = [
  { label: "States", value: "/api/states", downloadParam: "all=true" },
  { label: "Districts", value: "/api/districts", downloadParam: "all=true" },
  { label: "Tehsils", value: "/api/tehsil", downloadParam: "all=true" },
  { label: "Villages", value: "/api/village", downloadParam: "all=true" },
];

const DOWNLOAD_ENDPOINTS = [
  { label: "States", value: "/api/download/states", downloadParam: "all=true" },
  {
    label: "Districts",
    value: "/api/download/districts",
    downloadParam: "all=true",
  },
  {
    label: "Tehsils",
    value: "/api/download/tehsil",
    downloadParam: "all=true",
  },
  {
    label: "Villages",
    value: "/api/download/village",
    downloadParam: "all=true",
  },
];

const ENDPOINT_LABELS: Record<string, string> = {
  "/api/states": "States",
  "/api/districts": "Districts",
  "/api/tehsil": "Tehsils",
  "/api/village": "Villages",
};

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [stats, setStats] = useState<UploadStats | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [apiEndpoint, setApiEndpoint] = useState("/api/village");
  const [activeTab, setActiveTab] = useState<"upload" | "download">("upload");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStats(null);
      setLogs([]);
    }
  };

  const handleDownload = async (endpoint: string, label: string) => {
    setDownloading(endpoint);
    try {
      const res = await fetch(`${endpoint}?all=true`);
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      const data = await res.json();

      // Try to extract array from common response shapes
      let records: Record<string, unknown>[] = [];
      if (Array.isArray(data)) records = data;
      else if (data?.allVillages) records = data.allVillages;
      else if (data?.allDistricts) records = data.allDistricts;
      else if (data?.allStates) records = data.allStates;
      else if (data?.allTehsils) records = data.allTehsils;
      else if (data?.data) records = data.data;
      else {
        // Try first array value in response
        const arrayVal = Object.values(data).find((v) => Array.isArray(v));
        if (arrayVal) records = arrayVal as Record<string, unknown>[];
      }

      if (!records.length) throw new Error("No records found in response");

      // Remove MongoDB internal fields
      const cleaned = records.map((r) => {
        const { _id, __v, createdAt, updatedAt, ...rest } = r as Record<
          string,
          unknown
        >;
        void _id;
        void __v;
        void createdAt;
        void updatedAt;
        return rest;
      });

      const worksheet = XLSX.utils.json_to_sheet(cleaned);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, label);

      const date = new Date().toISOString().split("T")[0];
      XLSX.writeFile(workbook, `${label.toLowerCase()}_${date}.xlsx`);
    } catch (error) {
      alert(
        `Download failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setDownloading(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setStats({ total: 0, success: 0, failed: 0, skipped: 0 });
    setLogs([]);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        alert("Excel file is empty!");
        setUploading(false);
        return;
      }

      const firstRow = jsonData[0] as Record<string, unknown>;
      const excelColumns = Object.keys(firstRow);
      const schemaColumns = SCHEMA_FIELDS[apiEndpoint] || [];
      const unknownColumns = excelColumns.filter(
        (col) => !schemaColumns.includes(col),
      );

      if (unknownColumns.length > 0) {
        const proceed = window.confirm(
          `⚠️ Unknown columns detected:\n\n${unknownColumns.join(", ")}\n\nThese will be filtered out. Continue?`,
        );
        if (!proceed) {
          setUploading(false);
          return;
        }
      }

      const total = jsonData.length;
      let success = 0,
        failed = 0,
        skipped = 0;
      const newLogs: LogEntry[] = [];

      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i] as Record<string, unknown>;
        const filteredRow = Object.keys(row)
          .filter((key) => schemaColumns.includes(key))
          .reduce(
            (obj, key) => {
              obj[key] = row[key];
              return obj;
            },
            {} as Record<string, unknown>,
          );

        const rowName = (row.village_name ||
          row.district ||
          row.state ||
          row.block_tehsil ||
          `Row ${i + 2}`) as string;

        try {
          const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(filteredRow),
          });

          if (response.ok) {
            success++;
            newLogs.push({
              index: i + 2,
              name: rowName,
              status: "success",
              message: "Inserted successfully",
            });
          } else {
            const errorData = await response.json();
            if (response.status === 409) {
              skipped++;
              newLogs.push({
                index: i + 2,
                name: rowName,
                status: "skipped",
                message: "Already exists (duplicate)",
              });
            } else {
              failed++;
              const errorMsg = errorData.details
                ? Array.isArray(errorData.details)
                  ? errorData.details.join(", ")
                  : JSON.stringify(errorData.details)
                : errorData.error || "Unknown error";
              newLogs.push({
                index: i + 2,
                name: rowName,
                status: "error",
                message: `${response.status}: ${errorMsg}`,
              });
            }
          }
        } catch (error) {
          failed++;
          newLogs.push({
            index: i + 2,
            name: rowName,
            status: "error",
            message: error instanceof Error ? error.message : "Network error",
          });
        }

        setStats({ total, success, failed, skipped });
        setLogs([...newLogs]);
      }
    } catch (error) {
      alert(
        `Failed to read Excel file: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h1 className="text-2xl font-bold text-white">
              MongoDB Data Manager
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              Upload & download Excel data from your database
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("upload")}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                activeTab === "upload"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              ⬆️ Upload Excel
            </button>
            <button
              onClick={() => setActiveTab("download")}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                activeTab === "download"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              ⬇️ Download Excel
            </button>
          </div>

          <div className="p-8">
            {/* UPLOAD TAB */}
            {activeTab === "upload" && (
              <div>
                {/* API Endpoint Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Collection
                  </label>
                  <select
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    disabled={uploading}
                  >
                    {ENDPOINTS.map((ep) => (
                      <option key={ep.value} value={ep.value}>
                        {ep.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Input */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Excel File (.xlsx)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                      disabled={uploading}
                      className="hidden"
                      id="file-input"
                    />
                    <label htmlFor="file-input" className="cursor-pointer">
                      <div className="text-4xl mb-2">📂</div>
                      {file ? (
                        <div>
                          <p className="font-semibold text-gray-800">
                            {file.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-600 font-medium">
                            Click to select file
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            Supports .xlsx and .xls
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Upload Button */}
                <button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all ${
                    !file || uploading
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                  }`}
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span> Uploading to{" "}
                      {ENDPOINT_LABELS[apiEndpoint]}...
                    </span>
                  ) : (
                    `Upload to ${ENDPOINT_LABELS[apiEndpoint]}`
                  )}
                </button>

                {/* Stats */}
                {stats && (
                  <div className="mt-6 grid grid-cols-4 gap-3">
                    {[
                      { label: "Total", value: stats.total, color: "gray" },
                      {
                        label: "Success",
                        value: stats.success,
                        color: "green",
                      },
                      {
                        label: "Skipped",
                        value: stats.skipped,
                        color: "yellow",
                      },
                      { label: "Failed", value: stats.failed, color: "red" },
                    ].map(({ label, value, color }) => (
                      <div
                        key={label}
                        className={`bg-${color}-50 border border-${color}-100 p-4 rounded-xl text-center`}
                      >
                        <div className={`text-2xl font-bold text-${color}-700`}>
                          {value}
                        </div>
                        <div
                          className={`text-xs font-medium text-${color}-500 mt-0.5`}
                        >
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Logs */}
                {logs.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-sm font-semibold text-gray-700">
                        Upload Log
                      </h2>
                      <span className="text-xs text-gray-400">
                        {logs.length} entries
                      </span>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 max-h-80 overflow-y-auto space-y-1.5">
                      {logs.map((log, idx) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-lg text-xs ${
                            log.status === "success"
                              ? "bg-green-50 text-green-800 border border-green-100"
                              : log.status === "skipped"
                                ? "bg-yellow-50 text-yellow-800 border border-yellow-100"
                                : "bg-red-50 text-red-800 border border-red-100"
                          }`}
                        >
                          <span className="font-semibold">
                            Row {log.index}:
                          </span>{" "}
                          {log.name} —{" "}
                          <span className="italic">{log.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* DOWNLOAD TAB */}
            {activeTab === "download" && (
              <div>
                <p className="text-sm text-gray-500 mb-6">
                  Download all records from a collection as an Excel file.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {DOWNLOAD_ENDPOINTS.map((ep) => (
                    <button
                      key={ep.value}
                      onClick={() => handleDownload(ep.value, ep.label)}
                      disabled={downloading !== null}
                      className={`flex items-center justify-between p-5 rounded-xl border-2 transition-all text-left ${
                        downloading === ep.value
                          ? "border-blue-300 bg-blue-50 cursor-wait"
                          : downloading !== null
                            ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                            : "border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md cursor-pointer"
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-gray-800">
                          {ep.label}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {ep.value}
                        </div>
                      </div>
                      <div className="text-2xl">
                        {downloading === ep.value ? (
                          <span className="animate-spin inline-block">⏳</span>
                        ) : (
                          "⬇️"
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
                  <strong>Note:</strong> Downloads fetch all records from the
                  database. Large collections (e.g. villages) may take a moment.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
