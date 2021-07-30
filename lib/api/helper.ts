import type { VercelResponse } from "@vercel/node";

export const APIResponder = (
  status: "SUCCESS" | "ERROR",
  res: VercelResponse,
  data: object | [] = []
) => {
  if (status === "ERROR") {
    return res.status(500).json({
      status,
      data,
    });
  }

  return res.json({
    status,
    data,
  });
};
