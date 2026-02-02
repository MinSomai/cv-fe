"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import {
  CircleCheck,
  RotateCw,
  ArrowUp,
  ArrowDown,
  CircleAlert,
  AudioLines,
  Play,
} from "lucide-react";

import Chip from "@/components/Chip";
import ProgressBar from "@/components/ProgressBar";
import Table from "@/components/Table";
import { cn } from "@/lib/utils";
import { Button } from "@/components/Button";
import { getInterviews } from "@/utils/data";
import {
  LeafIcon,
  StarIcon,
  CrownIcon,
  NiAward,
  NiCheckHand,
  NiComment,
  NiLaptopFill,
  NiRanking,
  NiScaleStars,
} from "@/components/Icons/Icons";

type TableRow = {
  id: string;
  position: {
    role: string;
    level: string;
    industry: string;
  };
  interviewer: {
    photo: string;
    name: string;
  };
  level: string;
  categories: string[];
  date: string;
  status: string;
  reportReady: string;
  avgscore: {
    score: number;
    improvement: number;
  };
};

export default function UserInterviewTable() {
  const router = useRouter();
  const t = useTranslations("tables");
  const tCommon = useTranslations("common");
  const [interviewData, setInterviewData] = useState<TableRow[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);

  const TABLE_COLUMNS = [
    {
      title: t("position"),
      sortable: false,
      editable: false,
      key: "position",
      className: "pl-6 py-[13px]",
      render: (data: TableRow) => (
        <div
          className="flex flex-row gap-3 items-center py-4"
          title={
            data.position.role +
            " (" +
            data.position.level +
            ")" +
            "\n" +
            data.position.industry
          }
        >
          <div className="flex flex-col items-center justify-center w-10 h-10 rounded-full bg-[#F0F3FF]">
            <span className="text-[20px]" role="emoji">
              👔
            </span>
          </div>
          <div className="flex flex-1 flex-col text-sm">
            <span className="text-[#181D27]">
              {data.position.role}&nbsp;
              <i>{`(${data.position.level})`}</i>
            </span>
            <span className="text-[#535862]">
              {`${data.position.industry} ${t("industry")}`}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: t("interviewer"),
      sortable: false,
      editable: false,
      key: "interviewer",
      className: "pl-6 py-[13px]",
      // width: "100%",
      render: (data: TableRow) => (
        <div className="flex flex-row gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full ">
            <Image
              src={process.env.NEXT_PUBLIC_PAYLOAD_URL + data.interviewer.photo}
              alt={t("interviewer")}
              className="w-full h-full rounded-full"
              width={40}
              height={40}
              unoptimized
            />
          </div>
          <span className="flex items-center text-sm text-[#181D27]">
            {data.interviewer.name}
          </span>
        </div>
      ),
    },
    {
      title: t("level"),
      sortable: false,
      editable: false,
      key: "level",
      className: "pl-6 py-[13px]",
      // width: "100%",
      render: (data: TableRow) => (
        <span className="flex items-center text-sm text-[#535862]">
          {data.level === t("levels.newcomer") ? (
            <div className="flex flex-row gap-1 items-center">
              <div className="w-5 h-5">
                <LeafIcon />
              </div>
              <span>{data.level}</span>
            </div>
          ) : data.level === t("levels.risingStar") ? (
            <div className="flex flex-row gap-1 items-center">
              <div className="w-5 h-5">
                <StarIcon />
              </div>
              <span>{data.level}</span>
            </div>
          ) : (
            <div className="flex flex-row gap-1 items-center">
              <div className="w-5 h-5">
                <CrownIcon />
              </div>
              <span>{data.level}</span>
            </div>
          )}
        </span>
      ),
    },
    {
      title: t("categories"),
      sortable: false,
      editable: false,
      key: "categories",
      className: "pl-6 py-[13px]",
      // width: "100%",
      render: (data: TableRow) => (
        <div className="flex flex-row gap-1">
          <Chip
            icon={
              data.categories[0] === t("categories.standard") ? (
                <div className="w-4 h-4">
                  <NiRanking />
                </div>
              ) : data.categories[0] === t("categories.behavioral") ? (
                <div className="w-4 h-4">
                  <NiComment />
                </div>
              ) : data.categories[0] === t("categories.leadership") ? (
                <div className="w-4 h-4">
                  <NiAward />
                </div>
              ) : data.categories[0] === t("categories.situational") ? (
                <div className="w-4 h-4">
                  <NiCheckHand />
                </div>
              ) : data.categories[0] === t("categories.salaryNegotiation") ? (
                <div className="w-4 h-4">
                  <NiScaleStars />
                </div>
              ) : (
                <div className="w-4 h-4">
                  <NiLaptopFill />
                </div>
              )
            }
            label={data.categories[0]}
            className="bg-[#FAFAFA] border border-[#F2F4F7] rounded-full"
          />
          {data.categories.length > 1 && (
            <div title={data.categories.slice(1).join(", ")}>
              <Chip
                label={`+` + (data.categories.length - 1)}
                className="bg-[#FAFAFA] border border-[#F2F4F7] rounded-full cursor-pointer hover:bg-[#F2F4F7]"
              />
            </div>
          )}
        </div>
      ),
    },
    {
      title: t("date"),
      sortable: false,
      editable: false,
      key: "date",
      className: "pl-6 py-[13px]",
      // width: "100%",
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
      title: t("status"),
      sortable: false,
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
                <AudioLines className="text-[#B42318]" size={14} />
              ) : (
                <Play className="text-[#B14608]" size={14} />
              )
            }
            label={data.status}
            variant={
              data.status === t("statuses.completed")
                ? "secondary"
                : data.status === t("statuses.notStarted")
                ? "destructive"
                : "accent"
            }
            className="rounded-full"
          />
        </div>
      ),
    },
    {
      title: t("score"),
      sortable: false,
      editable: false,
      key: "score",
      className: "pl-6 py-[13px]",
      // width: "100%",
      render: (data: TableRow) => (
        <div className="flex">
          <div className="flex flex-row items-center gap-3 py-[10px] w-full">
            <ProgressBar
              value={data.avgscore.score || 0}
              variant="primary"
              className="bg-[#F2F4F7] w-[84px]"
            />
            <span className="text-[#414651] text-sm">{`${
              data.avgscore.score || "..."
            }%`}</span>
            <Chip
              icon={
                data.avgscore.improvement ? (
                  data.avgscore.improvement > 0 ? (
                    <ArrowUp size={14} color="#067647" />
                  ) : (
                    <ArrowDown size={14} color="#F04438" />
                  )
                ) : (
                  ""
                )
              }
              label={`${data.avgscore.improvement || "..."}%`}
              variant="secondary"
              className={cn({
                "bg-[#FEF3F2] border border-[#FECDCA] rounded-full text-[#B42318]":
                  data.avgscore.improvement < 0,
                "border border-[#ABEFC6] rounded-full text-[#067647]":
                  data.avgscore.improvement > 0,
                "bg-transparent text-[#414651] text-sm":
                  !data.avgscore.improvement,
              })}
            />
          </div>
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
          className="flex flex-row gap-1 items-center hover:opacity-60"
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
                ? () => router.push(`/interviewreport?id=${data.id}`)
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
    {
      title: "",
      sortable: false,
      editable: false,
      key: "retry",
      className: "pl-6 py-[13px]",
      // width: "100%",
      render: (data: TableRow) => (
        <div className="pr-4 cursor-pointer" title={t("retryInterview")}>
          <RotateCw
            size={20}
            className="text-[#8B8E93] hover:text-[#181D27]"
            onClick={() => router.push(`/interview/${data.id}?type=interview`)}
          />
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
    getInterviews({
      limit: 10,
      page: currentPage,
      where: "userinterviewtable",
    }).then((res) => {
      setTotalPage(res.totalPages);
      setInterviewData(res.interviews);
    });
  }, [currentPage]);

  return (
    <div>
      <Table
        data={interviewData}
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
