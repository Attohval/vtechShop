(function () {
  "use strict";

  const categoryNames = [
    ["Vehicles", "fa-car", ["Cars", "Buses", "Motorcycles", "Trucks", "Spare Parts", "Boats", "Heavy Equipment", "Rentals", "Auto Services", "Tyres"]],
    ["Property", "fa-house-chimney", ["Apartments", "Houses", "Land", "Commercial", "Short Lets", "New Builds", "Hostels", "Warehouses", "Agents", "Valuation"]],
    ["Phones & Tablets", "fa-mobile-screen", ["Smartphones", "Tablets", "Accessories", "Smart Watches", "Repair", "Power Banks", "Chargers", "Cases", "Headsets", "Parts"]],
    ["Electronics", "fa-tv", ["Laptops", "TVs", "Cameras", "Audio", "Gaming", "Printers", "Drones", "Projectors", "Networking", "Appliances"]],
    ["Home & Garden", "fa-couch", ["Furniture", "Kitchen", "Decor", "Garden", "Bedding", "Lighting", "Tools", "Storage", "Cleaning", "Renovation"]],
    ["Fashion", "fa-shirt", ["Men", "Women", "Shoes", "Bags", "Watches", "Jewelry", "Beauty", "Kids", "Native Wear", "Sportswear"]],
    ["Jobs", "fa-briefcase", ["Remote", "Full Time", "Part Time", "Internships", "Sales", "Tech", "Hospitality", "Admin", "Driving", "Teaching"]],
    ["Services", "fa-screwdriver-wrench", ["Cleaning", "Repairs", "Events", "Design", "Legal", "Accounting", "Logistics", "Tutoring", "Photography", "Wellness"]],
    ["Babies & Kids", "fa-baby", ["Toys", "Clothing", "Strollers", "Car Seats", "School Items", "Nursery", "Feeding", "Shoes", "Books", "Safety"]],
    ["Sports", "fa-dumbbell", ["Fitness", "Bicycles", "Football", "Camping", "Water Sports", "Boxing", "Yoga", "Tennis", "Supplements", "Wearables"]],
    ["Agriculture", "fa-seedling", ["Farm Tools", "Livestock", "Feeds", "Seeds", "Tractors", "Poultry", "Fishery", "Fertilizer", "Irrigation", "Storage"]],
    ["Health & Beauty", "fa-spa", ["Skincare", "Haircare", "Fragrance", "Makeup", "Supplements", "Salon", "Fitness Care", "Medical", "Dental", "Spa"]],
    ["Commercial Equipment", "fa-industry", ["Restaurant", "Salon", "Office", "Generators", "POS", "Security", "Industrial", "Retail", "Machines", "Packaging"]],
    ["Repair & Construction", "fa-helmet-safety", ["Plumbing", "Electrical", "Masonry", "Painting", "Carpentry", "AC Repair", "Roofing", "Welding", "Surveying", "Installations"]],
    ["Pets", "fa-paw", ["Dogs", "Cats", "Birds", "Fish", "Pet Food", "Accessories", "Grooming", "Vet", "Training", "Adoption"]]
  ];

  const sellerNames = ["Amina Stores", "Kelvin Autos", "Lagos Gadget Hub", "Prime Homes", "Nora Fashion", "GreenField Farms", "Elite Appliances", "Musa Motors", "Swift Services", "Tola Interiors", "Nova Phones", "Kemi Beauty", "Urban Finds", "Abuja Deals", "BluePeak Tech", "Hassan Tools", "Pearl Kids", "Fresh Mart", "Ivy Luxury", "TrustPoint"];
  const locations = ["Ikeja, Lagos", "Lekki, Lagos", "Wuse, Abuja", "Gwarinpa, Abuja", "Port Harcourt", "Ibadan", "Kano", "Enugu", "Abeokuta", "Benin City", "Asaba", "Uyo"];
  const adjectives = ["Premium", "Clean", "Foreign Used", "Brand New", "Verified", "Affordable", "Executive", "Compact", "Durable", "Limited Edition", "Modern", "Original"];
  const productTypes = ["Toyota Corolla", "iPhone 15 Pro", "Samsung Smart TV", "MacBook Air M3", "3 Bedroom Apartment", "Leather Sofa", "Industrial Generator", "Canon EOS Camera", "Dining Set", "Ladies Handbag", "Mountain Bike", "Office Desk", "Baby Stroller", "HP Laser Printer", "PlayStation 5", "Farm Sprayer", "Air Conditioner", "Gold Wristwatch", "Makeup Kit", "Security Camera"];
  const conditions = ["Brand New", "Used", "Refurbished", "Open Box"];
  const brands = ["Apple", "Samsung", "Toyota", "LG", "Sony", "HP", "Dell", "Nike", "IKEA", "Tecno", "Infinix", "Canon", "Generic"];

  const categories = categoryNames.map((item, index) => ({
    id: index + 1,
    name: item[0],
    icon: item[1],
    subcategories: item[2].map((name, subIndex) => ({ id: `${index + 1}-${subIndex + 1}`, name, count: 70 + ((index + 1) * (subIndex + 3)) % 180 }))
  }));

  const sellers = sellerNames.map((name, index) => ({
    id: index + 1,
    name,
    avatar: `https://i.pravatar.cc/160?img=${(index % 60) + 1}`,
    cover: `https://picsum.photos/seed/seller-cover-${index + 1}/1200/420`,
    verified: index % 3 !== 0,
    rating: (4.1 + (index % 9) / 10).toFixed(1),
    reviews: 28 + index * 11,
    memberSince: 2018 + (index % 7),
    location: locations[index % locations.length],
    response: `${8 + index} min`,
    bio: "Trusted seller with inspected listings, fast replies, and smooth handover support."
  }));

  function productName(i) {
    return `${adjectives[i % adjectives.length]} ${productTypes[i % productTypes.length]}`;
  }

  const products = Array.from({ length: 120 }, (_, index) => {
    const i = index + 1;
    const category = categories[index % categories.length];
    const seller = sellers[index % sellers.length];
    const base = 28000 + ((i * 13750) % 4800000);
    const discount = i % 4 === 0 ? 8 + (i % 22) : 0;
    return {
      id: i,
      title: productName(i),
      category: category.name,
      categoryId: category.id,
      subcategory: category.subcategories[index % category.subcategories.length].name,
      sellerId: seller.id,
      seller: seller.name,
      sellerVerified: seller.verified,
      image: `https://picsum.photos/seed/VtectShop-product-${i}/680/520`,
      gallery: [1, 2, 3, 4, 5].map(n => `https://picsum.photos/seed/VtectShop-product-${i}-${n}/900/700`),
      price: base,
      oldPrice: discount ? Math.round(base * (1 + discount / 100)) : 0,
      discount,
      location: locations[index % locations.length],
      condition: conditions[index % conditions.length],
      brand: brands[index % brands.length],
      posted: `${(index % 28) + 1} days ago`,
      rating: (4 + (index % 10) / 10).toFixed(1),
      views: 120 + i * 13,
      description: "A carefully checked marketplace listing with clear photos, realistic pricing, and seller details ready for backend integration.",
      specs: {
        Brand: brands[index % brands.length],
        Condition: conditions[index % conditions.length],
        Warranty: index % 2 ? "Available" : "No warranty",
        Negotiable: index % 3 ? "Yes" : "Fixed price",
        Delivery: index % 2 ? "Pickup or dispatch" : "Pickup only"
      }
    };
  });

  window.JijiData = { categories, sellers, products, locations, conditions, brands };
})();
