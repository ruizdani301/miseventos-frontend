import type { LogoutResponse, UserAuthResponse } from "../types";

export type MeResponse = {
    success: boolean;
    user: UserAuthResponse | null;
    error_message?: string;
};

const url_login = "http://127.0.0.1:8000/api/v1/login/"
const url_logout = "http://127.0.0.1:8000/api/v1/logout/"
const url_verify = "http://127.0.0.1:8000/api/v1/auth/me/"

export async function loginUser(email: string, password?: string): Promise<any> {
    console.log("Attempting Login for:", email, "Password provided:", !!password);

    const response = await fetch(url_login, {
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
    const response = await fetch(url_logout, {
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
    const response = await fetch(url_verify, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        return { success: false, user: null };
    }

    return response.json();
}
