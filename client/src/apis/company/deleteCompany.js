export async function deleteCompany(name) {
      try {
            const encodedName = encodeURIComponent(name);
            const res = await fetch(`/api/company/${encodedName}`, {
                  method: "DELETE",
                  credentials: "include",
            });
            const data = await res.json();
            return { status: res.status, ok: res.ok, data };
      } catch (error) {
            console.error(`Error deleting company ${name}:`, error);
            throw error;
      }
}
