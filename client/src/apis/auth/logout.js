const Logout = async (router) => {
      try {
            const res = await fetch("/api/auth/logout", {
                  method: "POST",
                  credentials: "include",
            });

            if (!res.ok) {
                  console.log(`logout Failed`)
                  return { ok: false, error: `Logout failed with status ${res.status}` };
            }
            setTimeout(() => {
                  router.push("/auth/login")
            }, 1200);
            return { ok: true };
      } catch (err) {
            console.log(`logout Failed`)
            return { ok: false, error: err.message };
      }
};

export default Logout;
