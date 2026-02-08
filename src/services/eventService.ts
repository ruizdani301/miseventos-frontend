import type {
  SendEventData,
  UpdateEventData,
  OnlyEventsResponse,
  DeleteEventsResponse,
  EventSlotListResponse,
  EventDiscoveryResponse
} from "../types";


export function sendEvents(event: SendEventData) {
  console.log(JSON.stringify(event, null, 2));

  fetch(`${import.meta.env.VITE_API_URL}/event/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  })
    .then(res => res.json())
    .then(response => console.log("Success:", response))
    .catch(error => console.error("Error:", error));
}

export function updateEvents(event: UpdateEventData) {
  console.log(JSON.stringify(event, null, 2));
  fetch(`${import.meta.env.VITE_API_URL}/event/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  })
    .then(res => res.json())
    .then(response => console.log("Success:", response))
    .catch(error => console.error("Error:", error));
}

export function getEventsAll(): Promise<OnlyEventsResponse> {
  return fetch(`${import.meta.env.VITE_API_URL}/event/all/?page=1&limit=10`, {
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

export function deleteEvents(event_id: string): Promise<DeleteEventsResponse> {
  return fetch(`${import.meta.env.VITE_API_URL}/event/${event_id}`, {
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

export function getEventsNameSlot(): Promise<EventSlotListResponse> {
  return fetch(`${import.meta.env.VITE_API_URL}/event/slot/`, {
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

export function getEvents(page: number = 1, limit: number = 10, search?: string): Promise<EventDiscoveryResponse> {
  const newSearch = search?.trim() || "";

  return fetch(`${import.meta.env.VITE_API_URL}/event/?page=${page}&limit=${limit}&title=${newSearch}`, {
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