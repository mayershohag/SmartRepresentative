export async function updateCompany(originalName, companyData) {
      try {
            const encodedName = encodeURIComponent(originalName);
            const res = await fetch(`/api/company/${encodedName}`, {
                  method: "PUT",
                  headers: {
                        "Content-Type": "application/json",
                  },
                  body: JSON.stringify(companyData),
                  credentials: "include",
            });
            const data = await res.json();
            return {
                  status: res.status,
                  ok: res.ok,
                  data,
            };
      } catch (error) {
            console.error(`Error updating company ${originalName}:`, error);
            throw error;
      }
}
