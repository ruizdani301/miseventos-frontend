import type { ScheduleResponse, slotRequest, SlotResponse } from "../types/index"

export function sendSchedule(
  schedule: slotRequest
): Promise<ScheduleResponse> {
  console.log(JSON.stringify(schedule, null, 2));

  return fetch(`${import.meta.env.VITE_API_URL}/slot/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(schedule),
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      return res.json();
    });
}
export function updateSchedule(
  schedule: slotRequest
): Promise<SlotResponse> {
  console.log("Updating schedule:", JSON.stringify(schedule, null, 2));

  return fetch(`${import.meta.env.VITE_API_URL}/slot/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(schedule),
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      return res.json();
    });
}

export function deleteSchedule(schedule_id: string): Promise<SlotResponse> {
  console.log("Deleting schedule:", schedule_id);

  return fetch(`${import.meta.env.VITE_API_URL}/slot/${schedule_id}`, {
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

