import { apiFetch } from "@/shared/api/client";
import { authFetch } from "@/shared/lib/authFetch";

import type { Comment } from "./types";

//////////////////////////////////////////////////
// GET COMMENTS
//////////////////////////////////////////////////

export function getComments(
  modId: number
) {
  return apiFetch<Comment[]>(
    `/comments/mod/${modId}`
  );
}

//////////////////////////////////////////////////
// CREATE COMMENT
//////////////////////////////////////////////////

export async function createComment(
  modId: number,
  content: string
) {
  const res = await authFetch(
    `${import.meta.env.VITE_API_URL}/comments/mod/${modId}`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        content,
      }),
    }
  );

  return res.json();
}

//////////////////////////////////////////////////
// UPDATE COMMENT
//////////////////////////////////////////////////

export async function updateComment(
  commentId: number,
  content: string
) {
  const res = await authFetch(
    `${import.meta.env.VITE_API_URL}/comments/${commentId}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        content,
      }),
    }
  );

  return res.json();
}

//////////////////////////////////////////////////
// DELETE COMMENT
//////////////////////////////////////////////////

export async function deleteComment(
  commentId: number
) {
  const res = await authFetch(
    `${import.meta.env.VITE_API_URL}/comments/${commentId}`,
    {
      method: "DELETE",
    }
  );
  
  return res.json();
}

//////////////////////////////////////////////////
// CREATE REPLY
//////////////////////////////////////////////////

export async function createReply(
  commentId: number,
  content: string
) {
  const res = await authFetch(
    `${import.meta.env.VITE_API_URL}/comments/${commentId}/replies`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        content,
      }),
    }
  );

  return res.json();
}