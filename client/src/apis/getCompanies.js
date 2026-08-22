export async function getCompanies() {
      try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_BASE_URL}/api/company`, {
                  method: "GET",
                  credentials: "include",
            });
            const data = await res.json();
            return {
                  status: res.status,
                  ok: res.ok,
                  data,
            };
      } catch (error) {
            console.error("Error fetching companies:", error);
            throw error;
      }
}
