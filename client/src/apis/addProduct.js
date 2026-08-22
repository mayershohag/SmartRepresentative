
export async function addProduct(productData) {
      try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_BASE_URL}/api/products`, {
                  method: "POST",
                  headers: {
                        "Content-Type": "application/json",
                  },
                  body: productData,
            });
            const data = await res.json();
            console.log("Product added successfully!");
            console.log(data);
      } catch (error) {
            console.error("Error adding product:", error);
            throw error;
      }
}