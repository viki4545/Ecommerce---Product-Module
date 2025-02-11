import { AppDataSource } from "../config/data-source";
import { Product } from "../entity/Product";

export const seedDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("✅ Database Connected!");

    const productRepository = AppDataSource.getRepository(Product);

    const products = [
      {
        sku: "P1001",
        name: "Apple iPhone 15 Pro",
        price: 999.99,
        images: [
          "https://example.com/images/iphone15pro-1.jpg",
          "https://example.com/images/iphone15pro-2.jpg",
        ],
      },
      {
        sku: "P1002",
        name: "Samsung Galaxy S23 Ultra",
        price: 1199.99,
        images: [
          "https://example.com/images/s23ultra-1.jpg",
          "https://example.com/images/s23ultra-2.jpg",
        ],
      },
      {
        sku: "P1003",
        name: "Sony PlayStation 5",
        price: 499.99,
        images: [
          "https://example.com/images/ps5-1.jpg",
          "https://example.com/images/ps5-2.jpg",
        ],
      },
      {
        sku: "P1004",
        name: "MacBook Pro 16” M2 Max",
        price: 2499.99,
        images: [
          "https://example.com/images/macbook16-1.jpg",
          "https://example.com/images/macbook16-2.jpg",
        ],
      },
      {
        sku: "P1005",
        name: "Dell XPS 13",
        price: 1299.99,
        images: [
          "https://example.com/images/dellxps13-1.jpg",
          "https://example.com/images/dellxps13-2.jpg",
        ],
      },
      {
        sku: "P1006",
        name: "Google Pixel 8 Pro",
        price: 899.99,
        images: [
          "https://example.com/images/pixel8pro-1.jpg",
          "https://example.com/images/pixel8pro-2.jpg",
        ],
      },
      {
        sku: "P1007",
        name: "ASUS ROG Zephyrus G14",
        price: 1599.99,
        images: [
          "https://example.com/images/rogzephyrus-1.jpg",
          "https://example.com/images/rogzephyrus-2.jpg",
        ],
      },
      {
        sku: "P1008",
        name: "Microsoft Surface Laptop 5",
        price: 1399.99,
        images: [
          "https://example.com/images/surfacelaptop5-1.jpg",
          "https://example.com/images/surfacelaptop5-2.jpg",
        ],
      },
      {
        sku: "P1009",
        name: "Nintendo Switch OLED",
        price: 349.99,
        images: [
          "https://example.com/images/switcholed-1.jpg",
          "https://example.com/images/switcholed-2.jpg",
        ],
      },
      {
        sku: "P1010",
        name: "OnePlus 11 5G",
        price: 699.99,
        images: [
          "https://example.com/images/oneplus11-1.jpg",
          "https://example.com/images/oneplus11-2.jpg",
        ],
      },
      {
        sku: "P1011",
        name: "Bose QuietComfort 45",
        price: 329.99,
        images: [
          "https://example.com/images/boseqc45-1.jpg",
          "https://example.com/images/boseqc45-2.jpg",
        ],
      },
      {
        sku: "P1012",
        name: "Sony WH-1000XM5",
        price: 399.99,
        images: [
          "https://example.com/images/sonywh1000xm5-1.jpg",
          "https://example.com/images/sonywh1000xm5-2.jpg",
        ],
      },
      {
        sku: "P1013",
        name: "iPad Pro 12.9-inch (M2)",
        price: 1099.99,
        images: [
          "https://example.com/images/ipadpro-1.jpg",
          "https://example.com/images/ipadpro-2.jpg",
        ],
      },
      {
        sku: "P1014",
        name: "Razer Blade 15 Advanced",
        price: 2299.99,
        images: [
          "https://example.com/images/razerblade-1.jpg",
          "https://example.com/images/razerblade-2.jpg",
        ],
      },
      {
        sku: "P1015",
        name: "AirPods Pro 2",
        price: 249.99,
        images: [
          "https://example.com/images/airpodspro2-1.jpg",
          "https://example.com/images/airpodspro2-2.jpg",
        ],
      },
      {
        sku: "P1016",
        name: "Logitech MX Master 3S",
        price: 99.99,
        images: [
          "https://example.com/images/mxmaster3s-1.jpg",
          "https://example.com/images/mxmaster3s-2.jpg",
        ],
      },
      {
        sku: "P1017",
        name: "Apple Watch Ultra",
        price: 799.99,
        images: [
          "https://example.com/images/watchultra-1.jpg",
          "https://example.com/images/watchultra-2.jpg",
        ],
      },
      {
        sku: "P1018",
        name: "GoPro Hero 11 Black",
        price: 499.99,
        images: [
          "https://example.com/images/gopro11-1.jpg",
          "https://example.com/images/gopro11-2.jpg",
        ],
      },
      {
        sku: "P1019",
        name: "Sony A7 IV Mirrorless Camera",
        price: 2499.99,
        images: [
          "https://example.com/images/sonya7iv-1.jpg",
          "https://example.com/images/sonya7iv-2.jpg",
        ],
      },
      {
        sku: "P1020",
        name: "Samsung Galaxy Tab S9 Ultra",
        price: 1199.99,
        images: [
          "https://example.com/images/galaxytabs9-1.jpg",
          "https://example.com/images/galaxytabs9-2.jpg",
        ],
      },
    ];

    for (const productData of products) {
      const product = productRepository.create(productData);
      await productRepository.save(product);
    }

    console.log("✅ 20 Sample Products Inserted!");
    process.exit();
  } catch (error) {
    console.error("❌ Error Seeding Database:", error);
    process.exit(1);
  }
};
