export async function addCategory(categoryData) {
      try {
            const res = await fetch(`/api/category`, {
                  method: "POST",
                  headers: {
                        "Content-Type": "application/json",
                  },
                  body: JSON.stringify(categoryData),
                  credentials: "include",
            });

            const data = await res.json();
            return {
                  status: res.status,
                  ok: res.ok,
                  data,
            };
      } catch (error) {
            console.error("Error adding company:", error);
            throw error;
      }
}
