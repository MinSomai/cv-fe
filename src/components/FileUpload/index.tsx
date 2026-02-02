import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { CloudUpload } from "lucide-react";

import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  uploadedFile: File | null;
  existedFile: Object | null;
  fileName: string | null | undefined;
  acceptFileTypes?: string;
  className?: string;
  description?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  uploadedFile,
  existedFile,
  fileName,
  acceptFileTypes,
  className,
  description,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0]);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 25 * 1024 * 1024,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex flex-col justify-center cursor-pointer max-w-full rounded-lg bg-[#D4D4DF] bg-opacity-20",
        className
      )}
    >
      <input {...getInputProps()} accept={acceptFileTypes} />
      <div className="flex flex-col items-center w-full md:max-w-full">
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10",
            acceptFileTypes === "application/pdf"
              ? "bg-white rounded-full"
              : "border rounded-lg bg-white shadow-sm"
          )}
        >
          <CloudUpload
            className={cn(
              "text-[#535862]",
              acceptFileTypes === "application/pdf" && "text-[#465FF1]"
            )}
          />
        </div>
        <div className="flex flex-col mt-3 w-full md:max-w-full">
          {uploadedFile || existedFile ? (
            <p className="text-sm text-center">{fileName}</p>
          ) : (
            <>
              <p className="flex justify-center gap-1 w-full text-sm text-[#0E131D] leading-none inter">
                <span
                  className={cn(
                    "font-semibold",
                    acceptFileTypes !== "application/pdf" && "text-primary"
                  )}
                >
                  Click to upload
                </span>
                <span className="">or drag and drop</span>
              </p>
              <p className="mt-1 text-xs text-center max-md:max-w-full">
                {description}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default FileUpload;
