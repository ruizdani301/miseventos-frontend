import type { LogoutResponse, UserAuthResponse } from "../types";

export type MeResponse = {
    success: boolean;
    user: UserAuthResponse | null;
    error_message?: string;
};


export async function loginUser(email: string, password?: string): Promise<any> {
    console.log("Attempting Login for:", email, "Password provided:", !!password);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error_message || 'Fallo en la autenticación');
    }
    return response.json();

}


export async function logout(): Promise<LogoutResponse> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
        method: "POST",
        credentials: "include",
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error_message || 'Fallo en la autenticación');
    }
    return response.json();
}

export async function validateSession(): Promise<MeResponse> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me/`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        return { success: false, user: null };
    }

    return response.json();
}
