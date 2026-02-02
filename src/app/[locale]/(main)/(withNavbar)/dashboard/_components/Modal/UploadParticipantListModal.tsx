import React, { useState } from "react";
import Image from "next/image";
import { UserRoundPlus, CheckCheck } from "lucide-react";
import * as XLSX from "xlsx";
import { useTranslations } from "next-intl";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogBody,
  DialogHeader,
  DialogTitle,
} from "@/components/Modal/Dialog";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { rest } from "@/lib/rest";
import { toast } from "sonner";
import { motion } from "framer-motion";

import ProgressBar from "@/components/ProgressBar";
import FileUpload from "@/components/FileUpload";

const UploadParticipantListModal: React.FC<{
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tableRenderOperation: () => void;
}> = ({ isModalOpen, setIsModalOpen, tableRenderOperation }) => {
  const tError = useTranslations("errors");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [existedFile, setExistedFile] = useState<Object | null>(null);
  const [fileName, setFileName] = useState<string | undefined | null>("");
  const [isUploaded, setIsUploaded] = useState(true);
  const [fileData, setFileData] = useState<any>(null);
  const [parseProgress, setParseProgress] = useState<number>(0); // Progress tracking
  const [isRemoving, setIsRemoving] = useState(false);
  const [nonValidData, setNonValidData] = useState<number[]>([]);

  const validGroups = ["Middle", "Lead"];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleCheckboxChange = () => {
    setIsUploaded(!isUploaded);

    if (isUploaded) {
      setIsRemoving(true); // Start animation
      setTimeout(() => {
        setUploadedFile(null);
        setFileName(null);
        setFileData(null);
        setParseProgress(0);
        setIsUploaded(false); // Uncheck the checkbox
        setIsRemoving(false); // Reset animation state
      }, 500); // Match duration with animation time
    }
  };

  const handleFileUpload = (file: File) => {
    if (file.size <= 5 * 1024 * 1024) {
      setUploadedFile(file);
      setFileName(file.name);
      setParseProgress(0); // Reset progress

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const binaryStr = e.target.result;
        const workbook = XLSX.read(binaryStr, {
          type: file.type === "text/csv" ? "string" : "binary",
        });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        }) as string[][];

        // Check if the file header is valid
        if (!jsonData || jsonData.length < 2) {
          toast.message(tError("invalidFileStructure"));
          return;
        }
        const headers = jsonData[0].map((header: any) =>
          header.toLowerCase().trim()
        );
        if (
          headers.length < 3 ||
          headers[0] !== "name" ||
          headers[1] !== "email" ||
          headers[2] !== "group"
        ) {
          toast.message(
            "Invalid file format: Headers should be 'Name', 'Email', 'Group'."
          );
          return;
        }

        let parsedData: any[] = [];
        let nonValidRows: number[] = [];
        const totalRows = jsonData.length;

        const parseRows = async () => {
          for (let i = 1; i < totalRows; i++) {
            const row = jsonData[i];

            // Update progress
            setParseProgress(Math.round((i / (totalRows - 1)) * 100));

            // Validate row structure
            if (row.length < 3) {
              nonValidRows.push(i + 1);
              continue;
            }

            const [name, email, group] = row;

            // Validate email format
            if (!emailRegex.test(email)) {
              nonValidRows.push(i + 1);
              continue;
            }

            // Validate group value
            if (!validGroups.includes(group)) {
              nonValidRows.push(i + 1);
              continue;
            }

            parsedData.push(jsonData[i]);

            // Allow state updates
            await new Promise((resolve) => setTimeout(resolve, 50));
          }
          setNonValidData(nonValidRows);
          setFileData(parsedData);
        };

        parseRows();
      };

      if (file.type === "text/csv") {
        reader.readAsText(file);
      } else {
        reader.readAsBinaryString(file);
      }
      setIsUploaded(true);
    } else {
      toast.message(tError("fileSizeExceeded5MB"));
    }
  };

  const sendInvite = async (data: string[]) => {
    await rest(
      `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/invites/create`,
      {
        name: data[0],
        email: data[1],
        group: data[2],
      },
      {
        method: "POST",
      }
    );
  };

  const handleUploadClick = async () => {
    if (fileData) {
      for (const data of fileData) {
        await sendInvite(data);
      }
    }
    setIsModalOpen(false);
    tableRenderOperation();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-w-lg inter">
        <DialogHeader>
          <span className="flex flex-row rounded-full bg-[#DFE4FF] bg-opacity-40 w-14 h-14 items-center justify-center">
            <span className="flex flex-row rounded-full bg-[#DFE4FF] w-10 h-10 items-center justify-center">
              <UserRoundPlus color="#465FF1" size={24} />
            </span>
          </span>
          <DialogTitle className="text-[#0E131D] text-lg">
            Upload participant list
          </DialogTitle>
          <DialogDescription className="text-[#475467]">
            Upload a file with your list below.
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="pt-2">
          <FileUpload
            onFileUpload={handleFileUpload}
            uploadedFile={uploadedFile}
            existedFile={existedFile}
            acceptFileTypes=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            fileName={fileName}
            description="CSV, XLSX (up to 5MB)"
            className="w-full h-[120px] border rounded-xl bg-white hover:border-primary hover:border-2"
          />
          {uploadedFile && (
            <motion.div
              initial={{ opacity: 1, scale: 1 }}
              animate={
                isRemoving
                  ? { opacity: 0, scale: 0.8, height: 0, y: -30 }
                  : { opacity: 1, scale: 1 }
              }
              exit={{ opacity: 0, scale: 0.8, height: 0, y: -30 }}
              transition={{ duration: 0.2, ease: "easeIn" }}
            >
              <div className="flex flex-col p-4 gap-1 border border-[#F2F4F7] rounded-xl">
                <div className="flex flex-row gap-3">
                  <Image
                    src={
                      fileName?.includes("csv")
                        ? "/Icons/csv.png"
                        : fileName?.includes("xlsx")
                        ? "/Icons/xlsx.png"
                        : ""
                    }
                    width={40}
                    height={40}
                    alt="file"
                  />
                  <div className="flex flex-col w-full">
                    <div className="flex flex-row justify-between">
                      <div className="flex flex-row gap-1 items-center">
                        <span className="text-[#414651] text-sm">
                          {uploadedFile.name}
                        </span>
                        {parseProgress === 100 && nonValidData.length === 0 ? (
                          <CheckCheck color="#00A36B" size={16} />
                        ) : (
                          <span
                            className="text-sm font-bold text-rose-600 cursor-pointer hover:text-rose-400"
                            title={
                              "Rows " +
                              nonValidData.map(String).join(", ") +
                              " invalid"
                            }
                          >{`(${nonValidData.length} rows invalid)`}</span>
                        )}
                      </div>
                      {parseProgress === 100 && (
                        <Checkbox
                          size="default"
                          text=""
                          isChecked={isUploaded}
                          handleCheckbox={handleCheckboxChange}
                        />
                      )}
                    </div>
                    <span className="text-[#535862] text-sm">
                      {uploadedFile.size} KB
                    </span>
                  </div>
                </div>
                <div className="flex flex-row gap-3">
                  <div className="w-10"></div>
                  <div className="flex flex-row w-full gap-3 items-center">
                    <ProgressBar
                      value={parseProgress}
                      variant="primary"
                      className="bg-[#F2F4F7]"
                    />
                    <span className="text-[#414651] text-sm">
                      {parseProgress}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </DialogBody>
        <DialogFooter className="flex flex-row pt-4 gap-3 items-center">
          <Button
            variant="ghost"
            className="border border-[#F2F4F7] shadow-none w-full"
            onClick={() => setIsModalOpen(false)}
          >
            <span className="text-[#414651] font-semibold">Cancel</span>
          </Button>
          <Button
            variant="defaultRing"
            className="w-full"
            onClick={handleUploadClick}
          >
            <span className="font-semibold">Upload</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default UploadParticipantListModal;
