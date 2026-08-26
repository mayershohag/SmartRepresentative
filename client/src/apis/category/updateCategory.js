export async function updateCategory(originalName, categoryData) {
      try {
            const encodedName = encodeURIComponent(originalName);
            const res = await fetch(`/api/category/${encodedName}`, {
                  method: "PUT",
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
            console.error(`Error updating category ${originalName}:`, error);
            throw error;
      }
}
