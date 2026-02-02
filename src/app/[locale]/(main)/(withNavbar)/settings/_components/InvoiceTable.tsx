import React from "react";
import { CircleCheck } from "lucide-react";
import { Invoice } from "./tabs/BillingTab";
import Chip from "@/components/Chip";

export default function InvoiceTable({
  invoiceData,
}: {
  invoiceData: Invoice[];
}) {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 bg-gray-50 cursor-pointer">
          <tr>
            {[
              "No",
              "Invoice Url",
              "Billing Date",
              "Status",
              "Amount",
              "Plan",
            ].map((column, index) => (
              <th key={index} scope="col" className="px-6 py-3">
                <span className="flex flex-row gap-0.5 items-center">
                  {column}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {invoiceData.map((invoice, index) => (
            <tr key={index}>
              <td className="px-6 py-4">{index + 1}</td>
              {Object.keys(invoice).map((key, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  {key === "invoice_url" ? (
                    <a
                      className="hover:opacity-70 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={invoice[key as keyof Invoice]}
                    >
                      Generate invoice
                    </a>
                  ) : key === "billing_date" ? (
                    new Date(invoice[key as keyof Invoice]).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      }
                    )
                  ) : key === "status" ? (
                    <div className="flex w-full">
                      <Chip
                        icon={
                          <CircleCheck className="text-[#00A37F]" size={14} />
                        }
                        variant="secondary"
                        className="border border-[#ABEFC6] rounded-full text-[#067647]"
                        label={invoice[key as keyof Invoice]}
                      />
                    </div>
                  ) : (
                    invoice[key as keyof Invoice]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
