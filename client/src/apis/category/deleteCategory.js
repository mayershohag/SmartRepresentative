export async function deleteCategory(categoryId) {
     try {
          const encodedId = encodeURIComponent(categoryId);
          const res = await fetch(`/api/category/${encodedId}`, {
               method: "DELETE",
               credentials: "include",
          });
          const data = await res.json();
          return { status: res.status, ok: res.ok, data };
     } catch (error) {
          console.error(`Error deleting category ${categoryId}:`, error);
          throw error;
     }
}
