import type { SessionRegister, SessionRegisterResponse } from "../types";

const url = 'http://127.0.0.1:8000/api/v1/register-session/';
export function registerSession(
    session: SessionRegister
): Promise<SessionRegisterResponse> {
    console.log(JSON.stringify(session, null, 2));
    return fetch(url, {
        method: "POST",
        credentials: "include",
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

export function deleteRegisterSession(
    id: string
): Promise<SessionRegisterResponse> {
    console.log(JSON.stringify(id, null, 2));
    alert(`${url}${id}/`);
    return fetch(`${url}${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error ${res.status}`);
            }
            return res.json();
        });
}
