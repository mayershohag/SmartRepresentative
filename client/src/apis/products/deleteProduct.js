export async function deleteProduct(productId) {
     try {
          const encodedId = encodeURIComponent(productId);
          const res = await fetch(`/api/products/${encodedId}`, {
               method: "DELETE",
               credentials: "include",
          });
          const data = await res.json();
          return { status: res.status, ok: res.ok, data };
     } catch (error) {
          console.error(`Error deleting product ${productId}:`, error);
          throw error;
     }
}
