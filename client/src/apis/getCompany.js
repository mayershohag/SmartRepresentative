export async function getCompany(name) {
      try {
            const encodedName = encodeURIComponent(name);
            const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_BASE_URL}/api/company/${encodedName}`, {
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
            console.error(`Error fetching company ${name}:`, error);
            throw error;
      }
}
