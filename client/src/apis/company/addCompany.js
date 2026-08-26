export async function addCompany(companyData) {
      try {
            const res = await fetch(`/api/company`, {
                  method: "POST",
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
            console.error("Error adding company:", error);
            throw error;
      }
}
