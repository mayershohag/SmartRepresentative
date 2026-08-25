export async function addUser(userData) {
      try {
            const res = await fetch(`/api/auth/register`, {
                  method: "POST",
                  headers: {
                        "Content-Type": "application/json",
                  },
                  body: JSON.stringify(userData)
            });

            const data = await res.json();
            return {
                  status: res.status,
                  ok: res.ok,
                  data,
            };
      } catch (error) {
            console.error("Error adding user:", error);
            throw error;
      }
}
