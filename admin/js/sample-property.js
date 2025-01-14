function createSampleProperty() {
    const sampleProperty = {
        id: Date.now().toString(),
        title: "123 Property St - Stunning Modern Home",
        address: "123 Property St",
        city: "Des Moines",
        type: "residential",
        price: "450000",
        bedrooms: "4",
        bathrooms: "3",
        squareFootage: "2500",
        description: "Beautiful modern home featuring an open concept layout, updated kitchen, and spacious backyard. Perfect for families looking for comfort and style.",
        features: [
            "Open Concept Layout",
            "Updated Kitchen with Stainless Steel Appliances",
            "Hardwood Floors Throughout",
            "Large Master Suite",
            "Finished Basement",
            "2-Car Garage",
            "Spacious Backyard"
        ],
        sessionDate: "2024-03-21T10:00",
        package: "premium",
        status: "scheduled",
        clientName: "John Smith",
        clientPhone: "(515) 555-0123",
        clientEmail: "john.smith@email.com",
        gallery: [
            {
                url: "../assets/images/sample/house1.jpg",
                caption: "Front Exterior"
            },
            {
                url: "../assets/images/sample/house2.jpg",
                caption: "Living Room"
            },
            {
                url: "../assets/images/sample/house3.jpg",
                caption: "Kitchen"
            }
        ],
        lastModified: Date.now()
    };

    // Generate and save the website
    generatePropertyWebsite(sampleProperty);

    // Save to properties storage
    let properties = JSON.parse(localStorage.getItem('properties') || '[]');
    properties.push(sampleProperty);
    localStorage.setItem('properties', JSON.stringify(properties));

    // Return the slug for viewing
    return generateSlug(sampleProperty.address);
} 