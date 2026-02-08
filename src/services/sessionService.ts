//const response = await fetch(`${import.meta.env.VITE_API_URL}/endpoint`);

import type {
  EventSlotListResponse,
  SessionCompleteResponse,
  SessionCreate,
  SessionSimpleResponse,
  DeleteSessionResponse,
  SessionUpdate
} from "../types/index"



export function getEventSlot(): Promise<EventSlotListResponse> {
  return fetch(`${import.meta.env.VITE_API_URL}/event/slot/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      return res.json();
    });
}

export function getSessions(): Promise<SessionCompleteResponse> {
  return fetch(`${import.meta.env.VITE_API_URL}/session/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      return res.json();
    });
}


export function sendSession(
  session: SessionCreate
): Promise<SessionSimpleResponse> {
  console.log(JSON.stringify(session, null, 2));

  return fetch(`${import.meta.env.VITE_API_URL}/session/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(session),
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      return res.json();
    });
}

export function updateCompleteSession(
  session: SessionUpdate
): Promise<SessionSimpleResponse> {
  console.log(JSON.stringify(session, null, 2));

  return fetch(`${import.meta.env.VITE_API_URL}/session/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(session),
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      return res.json();
    });
}


export function deleteSessionService(session_id: string): Promise<DeleteSessionResponse> {
  return fetch(`${import.meta.env.VITE_API_URL}/session/${session_id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      return res.json();
    });
}