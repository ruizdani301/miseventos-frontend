import type { UserCreate, UserUpdate, UserListResponse, DeleteUserResponse } from "../types";

const url = "http://127.0.0.1:8000/api/v1/user/"

export async function sendUser(user: UserCreate): Promise<any> {
    console.log("Sending User Data:", JSON.stringify(user, null, 2));

    const response = await fetch(`${url}register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error_message || `HTTP error ${response.status}`);
    }

    return response.json();
}

export async function updateUser(user: UserUpdate): Promise<any> {
    console.log("Updating User Data:", JSON.stringify(user, null, 2));

    const response = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error_message || `HTTP error ${response.status}`);
    }

    return response.json();
}

export async function getUsers(): Promise<UserListResponse> {
    const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error_message || `HTTP error ${response.status}`);
    }

    return response.json();
}

export async function deleteUser(id: string): Promise<DeleteUserResponse> {
    const response = await fetch(`${url}${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error_message || `HTTP error ${response.status}`);
    }

    return response.json();
}