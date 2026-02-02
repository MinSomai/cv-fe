"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, Eye, EyeOff, ChevronDown } from "lucide-react";

import AvatarGroup from "../AvatarGroup";
import Account from "@/components/Account";
import Chip from "@/components/Chip";
import ProgressBar from "@/components/ProgressBar";
import Table from "@/components/Table";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/Dropdown/DropdownMenu";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";
import { getActiveParticipants } from "@/utils/data";
import { rest } from "@/lib/rest";

type TableRow = {
  id: string;
  participant: {
    photo: string;
    name: string;
    email: string;
  };
  group: {
    name: string;
    members: any[];
  };
  position: {
    mainRole: string;
    otherRoles: string[];
  };
  interviews: number;
  lastinterviewed: string;
  avgscore: {
    score: number;
    improvement: number;
  };
  reportaccess: boolean;
};

export default function ActiveParticipantsTable() {
  const [participantTableData, setParticipantTableData] = useState<TableRow[]>(
    []
  );
  const [limit, setLimit] = useState<number>(2);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [sort, setSort] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("asc");

  const TABLE_COLUMNS = [
    {
      title: "Participant",
      sortable: true,
      editable: false,
      key: "participant",
      className: "pl-6 py-[13px] cursor-pointer",
      render: (data: TableRow) => (
        <div className="py-4">
          <Account
            username={data.participant.name}
            email={data.participant.email}
            avatar={data.participant.photo}
          />
        </div>
      ),
    },
    {
      title: "Group",
      sortable: false,
      editable: false,
      key: "group",
      className: "pl-6 py-[13px]",
      render: (data: TableRow) => (
        <div className="flex flex-row gap-3 items-center">
          <span className="text-[#535862] text-sm">{data.group.name}</span>
          <AvatarGroup avatars={data.group.members} />
        </div>
      ),
    },
    {
      title: "Position",
      sortable: false,
      editable: false,
      key: "position",
      className: "pl-6 py-[13px]",
      render: (data: TableRow) => (
        <div className="flex flex-row gap-1">
          <Chip
            icon="👔"
            label={data.position.mainRole}
            className="bg-[#FAFAFA] border border-[#F2F4F7] rounded-full text-[#414651]"
          />
          {data.position.otherRoles.length > 0 && (
            <div title={data.position.otherRoles.join(", ")}>
              <Chip
                label={`+${data.position.otherRoles.length}`}
                className="bg-[#FAFAFA] border border-[#F2F4F7] rounded-full cursor-pointer hover:bg-[#F2F4F7]"
              />
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Interviews",
      sortable: true,
      editable: false,
      key: "interviews",
      className: "pl-6 py-[13px] cursor-pointer",
      render: (data: TableRow) => (
        <span className="text-[#535862] text-sm">{data.interviews}</span>
      ),
    },
    {
      title: "Last interviewed",
      sortable: true,
      editable: false,
      key: "lastinterviewed",
      className: "pl-6 py-[13px] cursor-pointer",
      render: (data: TableRow) => (
        <span className="text-[#535862] text-sm">
          {data.lastinterviewed &&
            new Date(data.lastinterviewed).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
        </span>
      ),
    },
    {
      title: "Avg Score",
      sortable: true,
      editable: false,
      key: "avgscore",
      className: "pl-6 py-[13px] cursor-pointer",
      render: (data: TableRow) => (
        <div className="flex">
          <div className="flex flex-row items-center gap-3 py-[10px] w-full">
            <ProgressBar
              value={data.avgscore.score}
              variant="primary"
              className="bg-[#F2F4F7] w-[84px]"
            />
            <span className="text-sm">{`${data.avgscore.score}%`}</span>
            <Chip
              icon={
                data.avgscore.improvement > 0 ? (
                  <ArrowUp size={16} color="#067647" />
                ) : (
                  <ArrowDown size={16} color="#F04438" />
                )
              }
              label={`${data.avgscore.improvement}%`}
              variant="secondary"
              className={cn(
                "border border-[#ABEFC6] rounded-full text-[#067647]",
                data.avgscore.improvement < 0 &&
                  "bg-[#FEF3F2] text-[#B42318] border-[#FECDCA]"
              )}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Report Access",
      sortable: false,
      editable: false,
      key: "reportaccess",
      className: "pl-6 py-[13px]",
      render: (data: TableRow) => (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Chip
              icon={
                data.reportaccess ? (
                  <Eye size={16} color="#17B26A" />
                ) : (
                  <EyeOff size={16} color="#4E5BA6" />
                )
              }
              label={data.reportaccess ? "Visible" : "Hidden"}
              secondIcon={
                <ChevronDown
                  size={16}
                  color={data.reportaccess ? "#17B26A" : "#4E5BA6"}
                />
              }
              variant="secondary"
              className={cn(
                "flex flex-row border border-[#ABEFC6] rounded-full text-[#067647] justify-between",
                data.reportaccess
                  ? "text-[#067647]"
                  : "bg-[#F8F9FC] text-[#4E5BA6]"
              )}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={(e) => {
                handleReportAccessClick({
                  id: data.id,
                  isAccessible: data.reportaccess,
                });
              }}
            >
              <span className="flex flex-row gap-2 justify-center items-center">
                {data.reportaccess ? `Hidden` : `Visible`}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const handleHeaderClick = (key: string) => {
    if (key === sort) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSort(key);
      setSortOrder("asc");
    }
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPage ? prev + 1 : totalPage));
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleReportAccessClick = async ({
    id,
    isAccessible,
  }: {
    id: string;
    isAccessible: boolean;
  }) => {
    const result = await rest(
      `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/${id}`,
      {
        reportAccess: !isAccessible,
      },
      {
        method: "PATCH",
      }
    );

    setParticipantTableData((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            reportaccess: result.doc.reportAccess,
          };
        }
        return item;
      });
    });
  };

  useEffect(() => {
    getActiveParticipants({
      page: currentPage,
      limit: limit,
      sort: sort,
      sortOrder: sortOrder,
    }).then((res) => {
      setTotalPage(res.totalPages);
      setParticipantTableData(res.participants);
    });
  }, [currentPage, sort, sortOrder, limit]);

  return (
    <div>
      <Table
        data={participantTableData}
        columns={TABLE_COLUMNS}
        showHeader
        hover
        className="border-t border-[#F2F4F7]"
        onHeaderClick={handleHeaderClick}
      />
      <div className="flex flex-row justify-between px-6 py-3 items-center border-t-0 border-[#F2F4F7]">
        <Button
          variant="ghost"
          className="border border-[#F2F4F7] text-[#414651] text-sm font-semibold"
          onClick={handlePrev}
        >
          Previous
        </Button>
        <span className="text-sm text-[#414651]">{`Page ${currentPage} of ${totalPage}`}</span>
        <Button
          variant="ghost"
          className="border border-[#F2F4F7] text-[#414651] text-sm font-semibold"
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
