export const getCompanies = async () => {
      try {
            const response = await fetch(`https://smartrepresentative.onrender.com/api/companies`);
            const data = await response.json();
            const { companies } = data;
            return {
                  status: response.status,
                  ok: response.ok,
                  data: companies,
            };
      }
      catch (err) {
            console.log(err);
            return {
                  status: 400,
                  ok: false,
                  err,
            }
      }
};