"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import Image from "next/image";

import AvatarGroup from "../AvatarGroup";
import Chip from "@/components/Chip";
import { cn } from "@/lib/utils";
import {
  EllipsisVertical,
  Eye,
  EyeOff,
  ChevronDown,
  Trash2,
  Send,
} from "lucide-react";

import DeleteParticipantModal from "../Modal/DeleteParticipantModal";
import ResendInviteModal from "../Modal/ResendInviteModal";
import Table from "@/components/Table";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/Dropdown/DropdownMenu";
import { useAuth } from "@/providers/Auth";
import { Button } from "@/components/Button";
import { getInvitedParticipants } from "@/utils/data";
import { toast } from "sonner";
import { rest } from "@/lib/rest";

type TableRow = {
  participant: {
    id: string;
    photo: string;
    name: string;
  };
  email: string;
  group: {
    name: string;
    members: any[];
  };
  invitedon: string;
  status: {
    inviteStatus: string;
    registeredDate: string;
  };
  reportaccess: boolean;
};

export default function InvitedParticipantsTable({
  tableRender,
}: {
  tableRender: boolean;
}) {
  const { user } = useAuth();
  const tError = useTranslations("errors");
  const [invitedParticipants, setInvitedParticipants] = useState<TableRow[]>(
    []
  );
  const [isDeleteParticipantModalOpen, setIsDeleteParticipantModalOpen] =
    useState(false);
  const [isResendInviteModalOpen, setIsResendInviteModalOpen] = useState(false);
  const [limit, setLimit] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [deleteParticipant, setDeleteParticipant] = useState<string>("");
  const [inviteParticipant, setInviteParticipant] = useState<string>("");
  const [sort, setSort] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [isTableRendered, setIsTableRendered] = useState(false);

  const TABLE_COLUMNS = [
    {
      title: "Name",
      sortable: true,
      editable: false,
      key: "name",
      className: "pl-6 py-[13px] cursor-pointer",
      render: (data: TableRow) => (
        <div className="flex flex-row gap-3 py-4">
          <Image
            src={
              data.participant.photo === ""
                ? "/users/user.png"
                : data.participant.photo
            }
            alt="Interviewer Avatar"
            className="rounded-full"
            width={40}
            height={40}
            unoptimized
          />
          <span className="flex items-center text-sm text-[#181D27]">
            {data.participant.name}
          </span>
        </div>
      ),
    },
    {
      title: "Email",
      sortable: true,
      editable: false,
      key: "email",
      className: "pl-6 py-[13px] cursor-pointer",
      render: (data: TableRow) => (
        <span className="text-[#535862] text-sm">{data.email}</span>
      ),
    },
    {
      title: "Group",
      sortable: true,
      editable: false,
      key: "group",
      className: "pl-6 py-[13px] cursor-pointer",
      render: (data: TableRow) => (
        <div className="flex flex-row gap-3 items-center">
          <span className="text-[#535862] text-sm">{data.group.name}</span>
          <AvatarGroup avatars={data.group.members} />
        </div>
      ),
    },
    {
      title: "Invited on",
      sortable: true,
      editable: false,
      key: "invitedon",
      className: "pl-6 py-[13px] cursor-pointer",
      render: (data: TableRow) => (
        <span className="text-[#535862] text-sm">
          {new Date(data.invitedon).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      title: "Status",
      sortable: true,
      editable: false,
      key: "status",
      className: "pl-6 py-[13px] cursor-pointer",
      render: (data: TableRow) => (
        <div
          className="flex flex-row items-center justify-center gap-1 py-0.5 rounded-full border border-[#E6E6E6] cursor-pointer hover:bg-[#F2F4F7]"
          title={
            data.status.registeredDate &&
            `Active since: ` +
              new Date(data.status.registeredDate).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })
          }
        >
          <div
            className={cn(
              "rounded-full w-1.5 h-1.5 bg-[#17B26A]",
              data.status.inviteStatus !== "accepted" && "bg-[#717680]"
            )}
          ></div>
          <span>
            {data.status.inviteStatus === "accepted"
              ? "Registered"
              : "Not registered"}
          </span>
        </div>
      ),
    },
    {
      title: "Report Access",
      sortable: true,
      editable: false,
      key: "reportaccess",
      className: "pl-6 py-[13px] cursor-pointer",
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
                  id: data.participant.id,
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
    {
      title: "",
      sortable: false,
      editable: false,
      key: "other",
      className: "pl-6 py-[13px]",
      render: (data: TableRow) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex flex-row items-center">
            <EllipsisVertical
              color="#A4A7AE"
              className="hover:bg-gray-100 rounded-full"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="inter">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation(); // Prevent DropdownMenu from intercepting the click event
                handleResendInviteModal({ email: data.email }); // Trigger the modal open
              }}
            >
              <span className="flex flex-row gap-2 justify-center items-center">
                <Send size={16} color="#465FF1" />
                Resend invite
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation(); // Prevent DropdownMenu from intercepting the click event
                handleDeleteParticpantModal({ id: data.participant.id }); // Trigger the modal open
              }}
            >
              <span className="flex flex-row gap-2 justify-center items-center text-[#D92D20]">
                <Trash2 size={16} color="#D92D20" />
                Delete
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const handleTableRendered = () => {
    setIsTableRendered((prev) => !prev);
  };

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

    setInvitedParticipants((prev) => {
      return prev.map((item) => {
        if (item.participant.id === id) {
          return {
            ...item,
            reportaccess: result.doc.reportAccess,
          };
        }
        return item;
      });
    });
  };

  const handleDeleteParticpantModal = async ({ id }: { id: string }) => {
    let localData = localStorage.getItem(user?.id || "");
    let parsedData = localData ? JSON.parse(localData) : null;
    let isDeleteModalOpen = parsedData?.deleteModalOpen;

    if (isDeleteModalOpen !== undefined && !isDeleteModalOpen) {
      try {
        await rest(
          `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/${id}`,
          {},
          {
            method: "DELETE",
          }
        );

        handleTableRendered();
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error(tError("unknownError"));
        }
      }
    } else {
      setDeleteParticipant(id);
      setTimeout(() => {
        setIsDeleteParticipantModalOpen(true);
      }, 0);
    }
  };

  const handleResendInviteModal = async ({ email }: { email: string }) => {
    let localData = localStorage.getItem(user?.id || "");
    let parsedData = localData ? JSON.parse(localData) : null;
    let isInviteModalOpen = parsedData?.inviteModalOpen;

    if (isInviteModalOpen !== undefined && !isInviteModalOpen) {
      await rest(
        `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/invites/create`,
        {
          email: email,
        },
        {
          method: "POST",
        }
      );
    } else {
      setInviteParticipant(email);
      setTimeout(() => {
        setIsResendInviteModalOpen(true);
      }, 0);
    }
  };

  useEffect(() => {
    getInvitedParticipants({
      limit: limit,
      page: currentPage,
      sort: sort,
      sortOrder: sortOrder,
    }).then((res) => {
      setTotalPage(res.totalPages);
      setInvitedParticipants(res.participants);
    });
  }, [limit, currentPage, sort, sortOrder, isTableRendered, tableRender]);

  return (
    <>
      <div>
        <Table
          data={invitedParticipants}
          columns={TABLE_COLUMNS}
          showHeader
          hover
          className="border-t border-[#F2F4F7]"
          onHeaderClick={handleHeaderClick}
        />
        <div className="flex flex-row justify-between px-6 py-3 items-center">
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
      <DeleteParticipantModal
        isModalOpen={isDeleteParticipantModalOpen}
        setIsModalOpen={setIsDeleteParticipantModalOpen}
        deleteParticipant={deleteParticipant}
        tableRenderOperation={handleTableRendered}
      />
      <ResendInviteModal
        isModalOpen={isResendInviteModalOpen}
        setIsModalOpen={setIsResendInviteModalOpen}
        inviteParticipant={inviteParticipant}
      />
    </>
  );
}
