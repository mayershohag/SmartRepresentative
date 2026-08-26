export async function updateProduct(productId, productData) {
     try {
          const encodedId = encodeURIComponent(productId);
          const res = await fetch(`/api/products/${encodedId}`, {
               method: "PUT",
               headers: {
                    "Content-Type": "application/json",
               },
               body: JSON.stringify(productData),
               credentials: "include",
          });
          const data = await res.json();
          return { status: res.status, ok: res.ok, data };
     } catch (error) {
          console.error(`Error updating product ${productId}:`, error);
          throw error;
     }
}
