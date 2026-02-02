"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "@/lib/navigation";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";
import Navbar from "@/components/Navbar";
import NavbarHead from "@/components/Navbar/NavbarHead";
import NavbarBody from "@/components/Navbar/NavbarBody";
import NavbarFoot from "@/components/Navbar/NavbarFoot";
import NavItem from "@/components/Navbar/NavItem";
import Account from "@/components/Account";
import AccountList from "@/components/Account/AccountList";

import { useAuth } from "@/providers/Auth";
import { useNavbar } from "@/providers/NavbarProvider";
import {
  Settings,
  Users,
  Mic,
  ArrowLeftToLine,
  ArrowRightToLine,
  ChevronsUpDown,
} from "lucide-react";
import {
  BarChartSquareLeftIcon,
  MessageChatCircle,
} from "@/components/Icons/Icons";
import { LightBulb } from "@/components/Icons/Icons";

export default function NavbarComponent() {
  const { user } = useAuth();
  const { isNavbarClose, setIsNavbarClose } = useNavbar();
  const t = useTranslations("navbar");
  const [activeItem, setActiveItem] = useState("");
  const [isMouseIn, setIsMouseIn] = useState(false);
  const [showAccountList, setShowAccountList] = useState(false);
  const [showSubscriptionNotification, setShowSubscriptionNotification] =
    useState(true);
  const popupRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Check if subscription is expired
  const isSubscriptionExpired =
    Array.isArray(user?.planUsage) &&
    user?.planUsage?.some(
      (plan: any) => plan.expiredAt && new Date(plan.expiredAt) < new Date()
    );

  const handleNavItemClick = (item: string) => {
    setActiveItem(item);
  };

  const handleAccountClick = () => {
    setShowAccountList(!showAccountList);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setShowAccountList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {user ? (
        <div
          className={cn(
            "relative flex flex-col h-screen transition-width duration-300 items-center p-1",
            isNavbarClose ? "w-20" : "w-80"
          )}
          onMouseEnter={() => setIsMouseIn(true)}
          onMouseLeave={() => setIsMouseIn(false)}
        >
          <button
            className={cn(
              "absolute top-1/2 -right-3 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full shadow-md p-1 hover:bg-gray-100 transition-transform duration-200 ease-in-out",
              isMouseIn
                ? "opacity-100 scale-100"
                : "opacity-0 scale-75 pointer-events-none"
            )}
            style={{ display: "block" }}
          >
            {isNavbarClose ? (
              <ArrowRightToLine
                size={20}
                onClick={() => setIsNavbarClose(false)}
                color="#717680"
              />
            ) : (
              <ArrowLeftToLine
                size={20}
                onClick={() => setIsNavbarClose(true)}
                color="#717680"
              />
            )}
          </button>

          <Navbar className="flex flex-col h-screen border border-[#E9EAEB] rounded-xl py-4 w-full">
            <NavbarHead>
              <Logo isNavbarClose={isNavbarClose} />
            </NavbarHead>
            <NavbarBody className="flex-grow min-h-20 overflow-auto custom-scrollbar pt-4">
              <NavItem
                title={t("dashboard")}
                selected={activeItem === "Dashboard"}
                icon={<BarChartSquareLeftIcon />}
                isNavbarClose={isNavbarClose}
                onClick={() => {
                  handleNavItemClick("Dashboard");
                  router.push("/dashboard");
                }}
              />
              {user?.entity?.role === "owner" && (
                <NavItem
                  title={t("participants")}
                  selected={activeItem === "Participants"}
                  icon={<Users size={20} className="text-[#717680]" />}
                  isNavbarClose={isNavbarClose}
                  onClick={() => {
                    handleNavItemClick("Participants");
                    router.push("/participants");
                  }}
                />
              )}
              {user?.entity?.role === "staff" && (
                <NavItem
                  title={t("interviews")}
                  selected={activeItem === "Interviews"}
                  icon={<Mic size={20} className="text-[#717680]" />}
                  isNavbarClose={isNavbarClose}
                  onClick={() => {
                    handleNavItemClick("Interviews");
                    router.push("/interviewsetup");
                  }}
                />
              )}
              {user?.entity?.role === "staff" && (
                <NavItem
                  title={t("careerPathfinder")}
                  selected={activeItem === "Career Pathfinder"}
                  icon={<LightBulb />}
                  isNavbarClose={isNavbarClose}
                  onClick={() => {
                    handleNavItemClick("Career Pathfinder");
                    router.push("/careercounselling");
                  }}
                />
              )}
            </NavbarBody>
            <NavbarFoot>
              {isSubscriptionExpired && showSubscriptionNotification && (
                <div
                  className={`flex items-center gap-2 p-3 mb-2 bg-red-50 border border-red-200 rounded-lg ${
                    isNavbarClose ? "px-2" : "px-3"
                  }`}
                >
                  <div className="text-red-600">⚠️</div>
                  {!isNavbarClose && (
                    <p className="text-sm text-red-800 font-medium flex-1">
                      Your subscription has expired. Please renew your
                      subscription to continue using our services.
                    </p>
                  )}
                  <button
                    onClick={() => setShowSubscriptionNotification(false)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              )}
              <NavItem
                title={t("settings")}
                selected={activeItem === t("settings")}
                icon={<Settings size={20} className="text-[#717680]" />}
                isNavbarClose={isNavbarClose}
                onClick={() => {
                  handleNavItemClick(t("settings"));
                  router.push("/settings");
                }}
              />
              <div ref={popupRef}>
                <div
                  className={cn(
                    "absolute bg-white w-[300px] transition-transform duration-200 ease-in-out",
                    !isNavbarClose
                      ? "left-2 bottom-24"
                      : "left-20 bottom-4 z-10",
                    showAccountList
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-75 pointer-events-none"
                  )}
                >
                  <AccountList />
                </div>
                <div
                  className={cn(
                    "flex justify-between rounded-xl cursor-pointer items-center",
                    !isNavbarClose && "border border-[#E9EAEB] p-3"
                  )}
                  onClick={handleAccountClick}
                >
                  <Account
                    username={user?.name}
                    email={user?.email}
                    avatar={user?.picture || ""}
                    isNavbarClose={isNavbarClose}
                  />
                  {!isNavbarClose && (
                    <ChevronsUpDown size={20} className="text-[#717680]" />
                  )}
                </div>
              </div>
            </NavbarFoot>
          </Navbar>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
