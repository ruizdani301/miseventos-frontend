import type { SessionRegister, SessionRegisterResponse } from "../types";

export function registerSession(
    session: SessionRegister
): Promise<SessionRegisterResponse> {
    console.log(JSON.stringify(session, null, 2));
    return fetch(`${import.meta.env.VITE_API_URL}/register-session/`, {
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
    return fetch(`${import.meta.env.VITE_API_URL}/register-session/${id}`, {
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
