import type { ScheduleResponse, slotRequest, SlotResponse } from "../types/index"

const url = "http://127.0.0.1:8000/api/v1/slot/"

export function sendSchedule(
  schedule: slotRequest
): Promise<ScheduleResponse> {
  console.log(JSON.stringify(schedule, null, 2));

  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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

  return fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
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

  return fetch(`${url}${schedule_id}`, {
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

