const productDataService = {
    // In a real app, you would replace this with actual API calls
    fetchProductData: async function(barcode) {
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Use last digit of barcode to determine product type for demo
            const lastDigit = parseInt(barcode.slice(-1));
            
            const products = [
                {
                    name: "Organic Tomatoes",
                    brand: "Green Farms",
                    category: "Fresh Produce",
                    weight: "500g",
                    co2Impact: 0.6,
                    comparison: "Lower than 80% of similar products"
                },
                {
                    name: "Grass-fed Beef",
                    brand: "Happy Ranch",
                    category: "Meat",
                    weight: "300g",
                    co2Impact: 7.2,
                    comparison: "Higher than 70% of similar products"
                },
                {
                    name: "Plant-based Burger",
                    brand: "Vegan Delight",
                    category: "Meat Alternative",
                    weight: "200g",
                    co2Impact: 1.8,
                    comparison: "Lower than 60% of similar meat products"
                },
                {
                    name: "Whole Milk",
                    brand: "Dairy Fresh",
                    category: "Dairy",
                    weight: "1L",
                    co2Impact: 1.9,
                    comparison: "Average impact for dairy products"
                },
                {
                    name: "Oat Milk",
                    brand: "Plant Basics",
                    category: "Plant Milk",
                    weight: "1L",
                    co2Impact: 0.9,
                    comparison: "55% lower impact than cow's milk"
                },
                {
                    name: "Chocolate Bar",
                    brand: "Sweet Delights",
                    category: "Confectionery",
                    weight: "100g",
                    co2Impact: 2.1,
                    comparison: "Higher than average due to cocoa production"
                },
                {
                    name: "White Rice",
                    brand: "Global Grains",
                    category: "Grains",
                    weight: "1kg",
                    co2Impact: 2.7,
                    comparison: "Medium impact due to methane from cultivation"
                },
                {
                    name: "Canned Tuna",
                    brand: "Ocean Harvest",
                    category: "Canned Fish",
                    weight: "150g",
                    co2Impact: 1.1,
                    comparison: "Lower impact than many animal proteins"
                },
                {
                    name: "Local Apples",
                    brand: "Orchard Fresh",
                    category: "Fresh Produce",
                    weight: "750g",
                    co2Impact: 0.4,
                    comparison: "Very low impact due to local production"
                },
                {
                    name: "Imported Avocado",
                    brand: "Tropical Imports",
                    category: "Fresh Produce",
                    weight: "400g",
                    co2Impact: 2.5,
                    comparison: "Higher impact due to transportation emissions"
                }
            ];
            
            return products[lastDigit] || products[0];
        } catch (error) {
            console.error("Error fetching product data:", error);
            throw error;
        }
    }
};
