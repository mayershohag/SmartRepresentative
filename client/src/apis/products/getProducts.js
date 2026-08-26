export async function getProducts() {
     try {
          const res = await fetch("/api/products", {
               method: "GET",
               credentials: "include",
          });
          const data = await res.json();
          return { status: res.status, ok: res.ok, data };
     } catch (error) {
          console.error("Error fetching products:", error);
          throw error;
     }
}
