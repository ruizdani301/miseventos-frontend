import type { UserCreate } from "../types";

const url = "http://127.0.0.1:8000/api/v1/user/register"

export async function sendUser(user: UserCreate): Promise<any> {
    console.log("Sending User Data:", JSON.stringify(user, null, 2));

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error_message || `HTTP error ${response.status}`);
    }

    return response.json();
}