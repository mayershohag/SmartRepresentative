const Logout = async () => {
      try {
            const res = await fetch("https://smartrepresentative.onrender.com/api/auth/logout");
            if (res.ok) {
                  console.log(`logout succesfully!`)
                  return { ok: true };
            }
      } catch (err) {
            console.log(`logout Failed`)
            return { ok: false, error: err.message };
      }
};

export default Logout;