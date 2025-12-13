import type React from "react";

import { useState, useRef } from "react";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

export function CsvUploadModal() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  const handleFile = async (selectedFile: File) => {
    setError(null);
    setSuccess(false);

    if (!validateCsvFile(selectedFile, setError)) {
      return;
    }

    setFile(selectedFile);
    setIsLoading(true);

    try {
      const data = await parseCSV(selectedFile);
      const trades = data.map(mapCsvToTrade);

      const res = await fetch(`/api/insert-trades`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trades }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }

      const result = await res.json();

      console.log("result", result);

      setSuccess(true);
      handleClose();
    } catch (err) {
      console.log("err", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.currentTarget.files?.[0];
    if (selectedFile) handleFile(selectedFile);
  };

  const handleClose = () => {
    setFile(null);
    setError(null);
    setSuccess(false);
    setOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="outline">Upload CSV</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Import Trading Data</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import your trading data into the platform
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle size={48} className="text-emerald-600 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Upload Successful!
              </h3>
              <p className="text-slate-600 text-center text-sm">{file?.name}</p>
            </div>
          ) : (
            <>
              {/* Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-300 bg-slate-50 hover:border-slate-400"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileInput}
                  className="hidden"
                  aria-label="CSV file input"
                />

                <Upload size={32} className="mx-auto mb-3 text-slate-500" />
                <h3 className="font-semibold text-slate-900 mb-1">
                  {file ? file.name : "Drop your CSV here"}
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  {file ? "File selected" : "or click to browse"}
                </p>

                {!file && (
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    variant="default"
                    className="bg-accent hover:bg-accent"
                  >
                    Browse Files
                  </Button>
                )}

                {file && isLoading && (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" />
                    <span className="text-sm text-slate-600">
                      Processing...
                    </span>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 flex items-start gap-3 bg-red-50 p-4 rounded-lg border border-red-200">
                  <AlertCircle
                    size={20}
                    className="text-red-600 flex-shrink-0 mt-0.5"
                  />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Helper Text */}
              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-600 font-medium mb-2">
                  Supported format:
                </p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• CSV format (.csv)</li>
                  <li>• Maximum file size: 10MB</li>
                  <li>• Headers will be used as column names</li>
                </ul>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className={cn(
              "bg-destructive text-white hover:bg-destructive",
              file && "bg-accent"
            )}
            onClick={handleClose}
          >
            {success ? "Done" : "Cancel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const validateCsvFile = (
  file: File,
  setError: (error: string) => void
): boolean => {
  const validTypes = ["text/csv", "application/vnd.ms-excel", ".csv"];
  const isValidType = validTypes.some(
    (type) => file.type.includes(type) || file.name.endsWith(".csv")
  );
  const isValidSize = file.size <= 10 * 1024 * 1024;

  if (!isValidType) {
    setError("Please upload a valid CSV file");
    return false;
  }
  if (!isValidSize) {
    setError("File size must be less than 10MB");
    return false;
  }
  return true;
};

const parseCSV = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.trim().split("\n");
        const headers = lines[0].split(",").map((h) => h.trim());
        const data = lines.slice(1).map((line) => {
          const values = line.split(",").map((v) => v.trim());
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index] || "";
            return obj;
          }, {} as Record<string, string>);
        });
        resolve(data);
      } catch (err) {
        reject(new Error("Failed to parse CSV file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
};

type CsvRow = Record<string, string>;

export function mapCsvToTrade(row: CsvRow) {
  return {
    pair: row.symbol,
    type: row.type,
    lot_size: Number(row.lots),
    entry: Number(row.opening_price),
    exit: row.closing_price ? Number(row.closing_price) : null,
    stop_loss: row.stop_loss ? Number(row.stop_loss) : null,
    take_profit: row.take_profit ? Number(row.take_profit) : null,
    date_open: new Date(row.opening_time_utc),
    date_close: row.closing_time_utc ? new Date(row.closing_time_utc) : null,
    result: row.profit_usd ? Number(row.profit_usd) : null,
  };
}
