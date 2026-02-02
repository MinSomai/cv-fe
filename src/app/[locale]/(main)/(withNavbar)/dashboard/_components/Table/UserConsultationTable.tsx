"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import { CircleCheck, AudioLines, Play, CircleAlert } from "lucide-react";

import Chip from "@/components/Chip";
import Table from "@/components/Table";
import { cn } from "@/lib/utils";
import { Button } from "@/components/Button";
import { getConsultations } from "@/utils/data";

type TableRow = {
  id: string;
  date: string;
  careerStage: string;
  expert: {
    photo: string;
    name: string;
  };
  recommendations: string;
  status: string;
  reportReady: string;
};

export default function UserConsultationTable() {
  const router = useRouter();
  const t = useTranslations("tables");
  const tCommon = useTranslations("common");
  const [consultationData, setConsultationData] = useState<TableRow[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);

  const TABLE_COLUMNS = [
    {
      title: t("date"),
      sortable: true,
      editable: false,
      key: "date",
      className: "pl-6 py-[13px]",
      render: (data: TableRow) => (
        <div className="flex">
          <span className="text-sm text-[#535862]">
            {new Date(data.date).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
          </span>
        </div>
      ),
    },
    {
      title: t("careerStage"),
      sortable: true,
      editable: false,
      key: "careerstage",
      className: "pl-6 py-[13px]",
      // width: "100%",
      render: (data: TableRow) => (
        <span className="flex items-center text-sm text-[#535862]">
          {data.careerStage}
        </span>
      ),
    },
    {
      title: t("expert"),
      sortable: true,
      editable: false,
      key: "expert",
      className: "pl-6 py-[13px]",
      // width: "100%",
      render: (data: TableRow) => (
        <div className="flex flex-row gap-3 py-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full">
            {data.expert.photo !== "" && (
              <Image
                src={process.env.NEXT_PUBLIC_PAYLOAD_URL + data.expert.photo}
                alt={t("interviewer")}
                className="w-full h-full rounded-full"
                width={40}
                height={40}
                unoptimized
              />
            )}
          </div>
          <span className="flex items-center text-sm text-[#181D27]">
            {data.expert.name}
          </span>
        </div>
      ),
    },
    {
      title: t("recommendations"),
      sortable: true,
      editable: false,
      key: "recommendations",
      className: "pl-6 py-[13px]",
      // width: "100%",
      render: (data: TableRow) => (
        <span className="flex items-center text-sm text-[#535862]">
          {data.recommendations}
        </span>
      ),
    },
    {
      title: t("status"),
      sortable: true,
      editable: false,
      key: "status",
      className: "pl-6 py-[13px]",
      // width: "100%",
      render: (data: TableRow) => (
        <div className="flex">
          <Chip
            icon={
              data.status === t("statuses.completed") ? (
                <CircleCheck className="text-[#00A37F]" size={14} />
              ) : data.status === t("statuses.inProgress") ? (
                <AudioLines className="text-primary" size={14} />
              ) : data.status === t("statuses.notStarted") ? (
                <Play className="text-[#B14608]" size={14} />
              ) : (
                <CircleAlert className="text-[#B42318]" size={14} />
              )
            }
            label={data.status}
            variant={
              data.status === t("statuses.completed")
                ? "secondary"
                : data.status === t("statuses.notStarted")
                ? "destructive"
                : data.status === t("statuses.inProgress")
                ? "primary"
                : "accent"
            }
            className="rounded-full"
          />
        </div>
      ),
    },
    {
      title: t("report"),
      sortable: false,
      editable: false,
      key: "report",
      className: "pl-6 py-[13px]",
      // width: "100%",
      render: (data: TableRow) => (
        <div
          className="flex flex-row gap-1 items-center"
          title={
            data.reportReady === t("statuses.failed")
              ? t("reportFailedMessage")
              : ""
          }
        >
          {data.reportReady === t("statuses.completed") && (
            <CircleCheck size={14} className="text-[#00A37F]" />
          )}
          {data.reportReady === t("statuses.failed") && (
            <CircleAlert size={14} className="text-[#B42318]" />
          )}
          <span
            className={cn(
              "font-medium text-secondary-foreground text-sm cursor-pointer",
              {
                "text-[#027848]": data.reportReady === t("statuses.completed"),
                "text-[#B42318]": data.reportReady === t("statuses.failed"),
              }
            )}
            onClick={
              data.reportReady === t("statuses.completed")
                ? () => router.push(`/careerreport?id=${data.id}`)
                : undefined
            }
          >
            {data.status === t("statuses.inProgress")
              ? t("na")
              : data.reportReady === t("statuses.completed")
              ? t("viewReport")
              : data.reportReady}
          </span>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPage ? prev + 1 : totalPage));
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : 1));
  };

  useEffect(() => {
    getConsultations({
      limit: 10,
      page: currentPage,
      where: "userconsultationtable",
    }).then((res) => {
      setTotalPage(res.totalPages);
      setConsultationData(res.consultations);
    });
  }, [currentPage]);

  return (
    <div>
      <Table
        data={consultationData}
        columns={TABLE_COLUMNS}
        showHeader
        hover
        className="border-t border-[#F2F4F7]"
      />
      <div className="flex flex-row justify-between px-6 py-3 items-center">
        <Button
          variant="ghost"
          className="border border-[#F2F4F7] text-[#414651] text-sm font-semibold"
          onClick={handlePrev}
        >
          {tCommon("previous")}
        </Button>
        <span className="text-sm text-[#414651]">{`${t("page")} ${currentPage} ${t("of")} ${totalPage}`}</span>
        <Button
          variant="ghost"
          className="border border-[#F2F4F7] text-[#414651] text-sm font-semibold"
          onClick={handleNext}
        >
          {tCommon("next")}
        </Button>
      </div>
    </div>
  );
}
