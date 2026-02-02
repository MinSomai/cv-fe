"use client";

import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";

import Participant from "./Participant";
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
import { getGroupOptions } from "@/utils/data";
import { rest } from "@/lib/rest";
import { toast } from "sonner";
import { UsersPlus } from "@/components/Icons/Icons";

export type ParticipantType = {
  id: number;
  name: string;
  email: string;
  group: string;
};

const InviteParticipantModal: React.FC<{
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tableRenderOperation: () => void;
}> = ({ isModalOpen, setIsModalOpen, tableRenderOperation }) => {
  const [groupOptions, setGroupOptions] = useState<string[]>([]);
  const [participants, setParticipants] = useState<ParticipantType[]>([
    { id: 1, name: "", email: "", group: "" },
  ]);

  // Function to add a new participant
  const addParticipant = () => {
    setParticipants([
      ...participants,
      { id: Date.now(), name: "", email: "", group: "" },
    ]);
  };

  // Function to remove a participant
  const removeParticipant = (id: number) => {
    setParticipants(
      participants.filter((participant) => participant.id !== id)
    );
  };

  const isValidName = (name: string): boolean => {
    return name !== "";
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidGroup = (group: string): boolean => {
    return groupOptions.includes(group) && group !== "";
  };

  const sendInvites = async ({
    participants,
  }: {
    participants: ParticipantType[];
  }) => {
    await Promise.all(
      participants.map(async (participant) => {
        await rest(
          `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/invites/create`,
          {
            name: participant.name,
            email: participant.email,
            group: participant.group,
          },
          {
            method: "POST",
          }
        );
      })
    );
  };

  const handleSubmit = async () => {
    const validParticipants = participants.filter(
      (participant) =>
        isValidName(participant.name) &&
        isValidEmail(participant.email) &&
        isValidGroup(participant.group)
    );
    const notValidParticipants = participants.filter(
      (participant) =>
        !isValidEmail(participant.email) ||
        !isValidGroup(participant.group) ||
        !isValidName(participant.name)
    );

    if (notValidParticipants.length > 0) {
      toast.error(
        `Invalid name, email or group for participant(s): ${notValidParticipants
          .map(
            (participant) =>
              `(${
                participant.name +
                ", " +
                participant.email +
                ", " +
                participant.group
              })`
          )
          .join(", ")}`
      );
    } else {
      await sendInvites({ participants: validParticipants });
      tableRenderOperation();
      setIsModalOpen(false);
    }
  };

  // Function to update participant data
  const updateParticipant = (
    id: number,
    field: keyof ParticipantType,
    value: string
  ) => {
    setParticipants((prevParticipants) => {
      const updated = prevParticipants.map((participant) =>
        participant.id === id ? { ...participant, [field]: value } : participant
      );
      return updated;
    });
  };

  useEffect(() => {
    getGroupOptions().then((options) => {
      setGroupOptions(options.map((option) => option.name));
    });
  }, []);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-w-4xl inter">
        <DialogHeader>
          <span className="flex flex-row rounded-full bg-[#DFE4FF] bg-opacity-40 w-14 h-14 items-center justify-center">
            <span className="flex flex-row rounded-full bg-[#DFE4FF] w-10 h-10 items-center justify-center">
              <UsersPlus />
            </span>
          </span>
          <DialogTitle className="text-[#0E131D] text-lg">
            Invite participants
          </DialogTitle>
          <DialogDescription className="text-[#475467]">
            To invite participants to register - enter their email below. Assign
            them to an existing group or create a new one.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-row gap-3 items-center pr-8">
              <span className="text-[#414651] text-sm w-full">Full Name *</span>
              <span className="text-[#414651] text-sm w-full">
                Email address *
              </span>
              <span className="text-[#414651] text-sm w-full">Group *</span>
            </div>
            {participants.map((participant) => (
              <Participant
                key={participant.id}
                id={participant.id}
                name={participant.name}
                email={participant.email}
                group={participant.group}
                groupData={groupOptions}
                onRemove={removeParticipant}
                onChange={updateParticipant}
                setGroupOptions={setGroupOptions}
              />
            ))}
          </div>
          <div className="flex flex-row gap-1.5 items-center cursor-pointer">
            <Plus size={20} color="#465FF1" />
            <span
              className="font-semibold text-primary"
              onClick={addParticipant}
            >
              Add another
            </span>
          </div>
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
            onClick={handleSubmit}
          >
            <span className="font-semibold">Send invites</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteParticipantModal;
