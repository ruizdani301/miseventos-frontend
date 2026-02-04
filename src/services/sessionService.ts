import type {
  EventSlotListResponse,
  SessionCompleteResponse,
  SessionCreate,
  SessionSimpleResponse,
  DeleteSessionResponse,
  SessionUpdate
} from "../types/index"

const url = "http://127.0.0.1:8000/api/v1/event/slot/"
const url_session = "http://127.0.0.1:8000/api/v1/session/"


export function getEventSlot(): Promise<EventSlotListResponse> {
  return fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      return res.json();
    });
}

export function getSessions(): Promise<SessionCompleteResponse> {
  return fetch(url_session, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
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

  return fetch(url_session, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(session),
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      return res.json();
    });
}

export function UpdatedSession(
  session: SessionUpdate
): Promise<SessionSimpleResponse> {
  console.log(JSON.stringify(session, null, 2));

  return fetch(url_session, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
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
  return fetch(`${url_session}${session_id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      return res.json();
    });
}