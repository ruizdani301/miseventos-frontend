import type { SpeakerCreate, updateRequest, responseSpeaker, DeleteSpeakerResponse ,speakerListResponse ,speakerResponse} from "../types/index" 

const url = "http://127.0.0.1:8000/api/v1/speaker/"

export function sendSpeaker(
  speaker: SpeakerCreate
): Promise<speakerResponse> {
  console.log(JSON.stringify(speaker, null, 2));

  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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

export function deleteSpeakerService(speaker_id:string): Promise<DeleteSpeakerResponse> {
    return fetch(`http://127.0.0.1:8000/api/v1/speaker/${speaker_id}`, {
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

export function updatepeakerService(speaker: updateRequest): Promise<responseSpeaker> {
    return fetch(`http://127.0.0.1:8000/api/v1/speaker/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(speaker),
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      return res.json();
    });
}