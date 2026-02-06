import type {
  SendEventData,
  UpdateEventData,
  OnlyEventsResponse,
  DeleteEventsResponse,
  EventSlotListResponse,
  EventDiscoveryResponse
} from "../types";



const url = "http://127.0.0.1:8000/api/v1/event/"
const urlAll = "http://127.0.0.1:8000/api/v1/event/all/?page=1&limit=10"
const urlSlot = "http://127.0.0.1:8000/api/v1/event/slot/"


export function sendEvents(event: SendEventData) {
  console.log(JSON.stringify(event, null, 2));

  fetch(url, {
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
  fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  })
    .then(res => res.json())
    .then(response => console.log("Success:", response))
    .catch(error => console.error("Error:", error));
}

export function getEventsAll(): Promise<OnlyEventsResponse> {
  return fetch(urlAll, {
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
  return fetch(`http://127.0.0.1:8000/api/v1/event/${event_id}`, {
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
  return fetch(urlSlot, {
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

export function getEvents(page: number = 1, limit: number = 10): Promise<EventDiscoveryResponse> {
  return fetch(`${url}?page=${page}&limit=${limit}`, {
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