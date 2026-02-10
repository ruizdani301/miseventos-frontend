import type { UserCreate, UserUpdate, UserListResponse, DeleteUserResponse } from "../types";

export async function sendUser(user: UserCreate): Promise<any> {
    console.log("Sending User Data:", JSON.stringify(user, null, 2));

    const response = await fetch(`${import.meta.env.VITE_API_URL}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error ${response.status}`);
    }

    return response.json();
}

export async function updateUser(user: UserUpdate): Promise<any> {
    console.log("Updating User Data:", JSON.stringify(user, null, 2));

    const response = await fetch(`${import.meta.env.VITE_API_URL}/user/`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error ${response.status}`);
    }

    return response.json();
}

export async function getUsers(): Promise<UserListResponse> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/user/`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error ${response.status}`);
    }

    return response.json();
}

export async function deleteUser(id: string): Promise<DeleteUserResponse> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/user/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error ${response.status}`);
    }

    return response.json();
}