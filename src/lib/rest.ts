import { toast } from "sonner";

export const rest = async (
  url: string,
  args?: any,
  options?: RequestInit
): Promise<any> => {
  const method = options?.method || "POST";

  try {
    const res = await fetch(url, {
      method,
      ...(method === "POST" || method === "PATCH"
        ? { body: JSON.stringify(args) }
        : {}),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    const response = await res.json();
    const { errors } = response;

    if (errors) {
      toast.error(errors[0].message);
      throw new Error(errors[0].message);
    }

    if (res.ok) {
      return response;
    }
  } catch (e) {
    toast.error((e as Error).message);
  }
};
