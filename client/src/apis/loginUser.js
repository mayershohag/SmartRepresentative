export async function loginUser(credentials) {
      try {
            const res = await fetch(`https://smartrepresentative.onrender.com/api/auth/login`, {
                  method: "POST",
                  headers: {
                        "Content-Type": "application/json",
                  },
                  credentials: "include",
                  body: JSON.stringify(credentials)
            });

            const data = await res.json();
            return {
                  status: res.status,
                  ok: res.ok,
                  data,
            };
      } catch (error) {
            console.error("Error logging in:", error);
            throw error;
      }
}
