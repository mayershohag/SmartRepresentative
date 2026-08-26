export async function getCategories() {
     try {
          const res = await fetch("/api/category", {
               method: "GET",
               credentials: "include",
          });
          const data = await res.json();
          return { status: res.status, ok: res.ok, data };
     } catch (error) {
          console.error("Error fetching categories:", error);
          throw error;
     }
}
