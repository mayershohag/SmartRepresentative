
export async function addProduct(productData) {
      try {
            const res = await fetch(`/api/products`, {
                  method: "POST",
                  headers: {
                        "Content-Type": "application/json",
                  },
                  credentials: "include",
                  body: JSON.stringify(productData),
            });
            const data = await res.json();
            return { status: res.status, ok: res.ok, data };
      } catch (error) {
            console.error("Error adding product:", error);
            throw error;
      }
}