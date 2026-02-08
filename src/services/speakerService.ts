import type {
  SpeakerCreate,
  updateRequest,
  responseSpeaker,
  DeleteSpeakerResponse,
  speakerListResponse,
  speakerResponse
} from "../types/index"


export function sendSpeaker(
  speaker: SpeakerCreate
): Promise<speakerResponse> {
  console.log(JSON.stringify(speaker, null, 2));

  return fetch(`${import.meta.env.VITE_API_URL}/speaker/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(speaker),
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      return res.json();
    });
}

export function getSpeakersAll(): Promise<speakerListResponse> {
  return fetch(`${import.meta.env.VITE_API_URL}/speaker/`, {
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

export function deleteSpeakerService(speaker_id: string): Promise<DeleteSpeakerResponse> {
  return fetch(`${import.meta.env.VITE_API_URL}/speaker/${speaker_id}`, {
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

export function updatepeakerService(speaker: updateRequest): Promise<responseSpeaker> {
  return fetch(`${import.meta.env.VITE_API_URL}/speaker/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(speaker),
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      return res.json();
    });
}