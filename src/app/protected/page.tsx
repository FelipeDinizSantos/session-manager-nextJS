"use client";

import { useEffect, useState } from "react";

interface User {
  username: string;
  id: string;
}

export default function ProtectedPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Recupera os dados do usuário do cabeçalho da resposta
    const fetchUserData = async () => {
      const res = await fetch(window.location.href, { method: "GET" });
      const payload = res.headers.get("X-User-Payload");

      if (payload) {
        setUser(JSON.parse(payload));
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <h1>Página Protegida</h1>
      {user ? (
        <p>Bem-vindo, {user.username.toUpperCase()}!</p>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
}
