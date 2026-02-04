const url_login = "http://127.0.0.1:8000/api/v1/login/"

export async function loginUser(email: string, password?: string): Promise<any> {
    console.log("Attempting Login for:", email, "Password provided:", !!password);

    // En un entorno real, aquí se llamaría al backend:

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
