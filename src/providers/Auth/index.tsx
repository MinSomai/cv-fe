"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { User } from "../../payload-types";
import { gql, USER } from "../../lib/gql";
import { rest } from "../../lib/rest";
import {
  AuthContext,
  Create,
  ForgotPassword,
  Login,
  Logout,
  ResetPassword,
} from "./types";
import { useRouter, usePathname } from "@/lib/navigation";

const Context = createContext({} as AuthContext);

const SUCCESS_OWNER_REDIRECT_PATH = "/dashboard";
const SUCCESS_STAFF_REDIRECT_PATH = "/onboarding";
const FAIL_REDIRECT_PATH = "/login";

export const AuthProvider: React.FC<{
  children: React.ReactNode;
  api?: "rest" | "gql";
}> = ({ children, api = "rest" }) => {
  const [user, setUser] = useState<User | null>();
  const router = useRouter();
  const currentPath = usePathname();

  const autoRedirect = useCallback(
    (me: User | null | undefined) => {
      // usePathname from next-intl returns paths without locale prefix (e.g., "/login" not "/en/login")
      const authPaths = [
        "/login",
        "/signup",
        "/invite",
        "/forgotpassword",
        "/resetpassword",
        "/join",
        "/verify",
      ];
      const exactPaths = ["/"];
      // currentPath from next-intl usePathname() already has no locale prefix
      // Safety check: if pathname is not available yet, use empty string
      const safePath = currentPath || "/";
      const isAuthPath = authPaths.some((path) => safePath.startsWith(path));
      const isExactPath = exactPaths.includes(safePath);

      if (me && isAuthPath) {
        router.push(
          me.entity?.role === "owner"
            ? SUCCESS_OWNER_REDIRECT_PATH
            : SUCCESS_STAFF_REDIRECT_PATH
        );
      }
      if (!me && !isAuthPath && !isExactPath) {
        router.push(`${FAIL_REDIRECT_PATH}?redirect=${safePath}`);
      }
    },
    [currentPath, router]
  );

  const fetchMe = useCallback(async () => {
    if (api === "rest") {
      const req = await rest(
        `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/me`,
        {},
        {
          method: "GET",
        }
      );
      autoRedirect(req.user);
      setUser(req.user);
      return req.user;
    }

    if (api === "gql") {
      const { meUser } = await gql(`query {
        meUser {
          user {
            ${USER}
          }
          exp
        }
      }`);

      autoRedirect(meUser.user);
      setUser(meUser.user);
    }
  }, [api, autoRedirect]);

  const create = useCallback<Create>(
    async (args, token) => {
      if (api === "rest") {
        const req = await rest(
          currentPath === "/signup"
            ? `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/create-indiv`
            : `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/join/${token}`,
          args
        );
        // setUser(req.user);
        return req.user;
      }

      if (api === "gql") {
        const { createUser: user } = await gql(`mutation {
        createUser(data: { email: "${args.email}", password: "${args.password}", name: "${args.name}" }) {
          ${USER}
        }
      }`);

        setUser(user);
        return user;
      }
    },
    [api, currentPath]
  );

  const login = useCallback<Login>(
    async (args) => {
      if (api === "rest") {
        const req = await rest(
          `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/login`,
          args
        );

        setUser(req.user);
        return req.user;
      }

      if (api === "gql") {
        const { loginUser } = await gql(`mutation {
        loginUser(email: "${args.email}", password: "${args.password}") {
          user {
            ${USER}
          }
          exp
        }
      }`);

        setUser(loginUser?.user);
        return loginUser?.user;
      }
    },
    [api]
  );

  const logout = useCallback<Logout>(async () => {
    if (api === "rest") {
      await rest(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/logout`);
      fetchMe();
      setUser(null);
      return;
    }

    if (api === "gql") {
      await gql(`mutation {
        logoutUser
      }`);

      setUser(null);
    }
  }, [api, fetchMe]);

  // On mount, get user and set
  useEffect(() => {
    if (!user) {
      fetchMe();
    }
  }, [user, fetchMe]);

  const forgotPassword = useCallback<ForgotPassword>(
    async (args) => {
      if (api === "rest") {
        const req = await rest(
          `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/forgot-password`,
          args
        );
        setUser(req.user);
        return req.user;
      }

      if (api === "gql") {
        const { forgotPasswordUser } = await gql(`mutation {
        forgotPasswordUser(email: "${args.email}")
      }`);

        return forgotPasswordUser;
      }
    },
    [api]
  );

  const resetPassword = useCallback<ResetPassword>(
    async (args) => {
      if (api === "rest") {
        const req = await rest(
          `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/reset-password`,
          args
        );
        setUser(req.user);
        return req.user;
      }

      if (api === "gql") {
        const { resetPasswordUser } = await gql(`mutation {
        resetPasswordUser(password: "${args.password}", token: "${args.token}") {
          user {
            ${USER}
          }
        }
      }`);

        setUser(resetPasswordUser.user);
        return resetPasswordUser.user;
      }
    },
    [api]
  );

  return (
    <Context.Provider
      value={{
        user,
        fetchMe,
        setUser,
        login,
        logout,
        create,
        resetPassword,
        forgotPassword,
      }}
    >
      {children}
    </Context.Provider>
  );
};
type UseAuth<T = User> = () => AuthContext; // eslint-disable-line no-unused-vars

export const useAuth: UseAuth = () => useContext(Context);
