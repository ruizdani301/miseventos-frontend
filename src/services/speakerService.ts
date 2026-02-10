import type {
  SpeakerCreate,
  updateRequest,
  responseSpeaker,
  DeleteSpeakerResponse,
  speakerListResponse,
  speakerResponse
} from "../types/index"


export async function sendSpeaker(
  speaker: SpeakerCreate
): Promise<speakerResponse> {
  console.log(JSON.stringify(speaker, null, 2));

  const response = await fetch(`${import.meta.env.VITE_API_URL}/speaker/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(speaker),
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error ${response.status}`);
  }
  return response.json();
}

export async function getSpeakersAll(): Promise<speakerListResponse> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/speaker/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error ${response.status}`);
  }
  return response.json();
}

export async function deleteSpeakerService(speaker_id: string): Promise<DeleteSpeakerResponse> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/speaker/${speaker_id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error ${response.status}`);
  }
  return response.json();
}

export async function updatepeakerService(speaker: updateRequest): Promise<responseSpeaker> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/speaker/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(speaker),
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error ${response.status}`);
  }
  return response.json();
}