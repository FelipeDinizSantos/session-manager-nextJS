"use client";

import { useState } from "react";
import api from "@/utils/api";
import Cookies from "js-cookie";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await api.post("/login", { username, password });

            console.log(response); 

            const expirationDate = new Date();
            expirationDate.setMinutes(expirationDate.getMinutes() + 1); 

            Cookies.set("token", response.data.token, { expires: expirationDate });
        } catch (err: any) {
            console.log(err);
            setError(err.response?.data?.message || "Erro no login.");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto", padding: "1rem" }}>
            <h1>Login</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <div>
                    <label>Usuário:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Senha:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}
