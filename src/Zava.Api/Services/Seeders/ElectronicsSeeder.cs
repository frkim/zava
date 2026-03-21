namespace Zava.Api.Services;

using Zava.Api.Models;

public static class ElectronicsSeeder
{
    public static List<Category> GenerateCategories()
    {
        return new List<Category>
        {
            new() { Id = 1, Name = "Téléviseurs", NameEn = "TVs", Description = "Téléviseurs LED, OLED et QLED", DescriptionEn = "LED, OLED and QLED TVs", ProductCount = 10, SiteType = SiteType.Electronics, Icon = "Tv" },
            new() { Id = 2, Name = "Ordinateurs portables", NameEn = "Laptops", Description = "PC portables et ultrabooks", DescriptionEn = "Laptops and ultrabooks", ProductCount = 10, SiteType = SiteType.Electronics, Icon = "Laptop" },
            new() { Id = 3, Name = "Smartphones", NameEn = "Smartphones", Description = "Téléphones mobiles et accessoires", DescriptionEn = "Mobile phones and accessories", ProductCount = 10, SiteType = SiteType.Electronics, Icon = "Smartphone" },
            new() { Id = 4, Name = "Casques & Écouteurs", NameEn = "Headphones", Description = "Casques audio et écouteurs sans fil", DescriptionEn = "Headphones and wireless earbuds", ProductCount = 10, SiteType = SiteType.Electronics, Icon = "Headphones" },
            new() { Id = 5, Name = "Appareils photo", NameEn = "Cameras", Description = "Appareils photo reflex et hybrides", DescriptionEn = "DSLR and mirrorless cameras", ProductCount = 10, SiteType = SiteType.Electronics, Icon = "CameraAlt" },
            new() { Id = 6, Name = "Gaming", NameEn = "Gaming", Description = "Consoles, jeux et accessoires gaming", DescriptionEn = "Consoles, games and gaming accessories", ProductCount = 10, SiteType = SiteType.Electronics, Icon = "SportsEsports" },
            new() { Id = 7, Name = "Tablettes", NameEn = "Tablets", Description = "Tablettes tactiles et accessoires", DescriptionEn = "Tablets and accessories", ProductCount = 10, SiteType = SiteType.Electronics, Icon = "Tablet" },
            new() { Id = 8, Name = "Enceintes & Son", NameEn = "Speakers", Description = "Enceintes Bluetooth et systèmes audio", DescriptionEn = "Bluetooth speakers and audio systems", ProductCount = 10, SiteType = SiteType.Electronics, Icon = "Speaker" },
            new() { Id = 9, Name = "Montres connectées", NameEn = "Smartwatches", Description = "Montres et bracelets connectés", DescriptionEn = "Smartwatches and fitness trackers", ProductCount = 10, SiteType = SiteType.Electronics, Icon = "Watch" },
            new() { Id = 10, Name = "Livres", NameEn = "Books", Description = "Romans, BD, mangas et livres pratiques", DescriptionEn = "Novels, comics, manga and practical books", ProductCount = 10, SiteType = SiteType.Electronics, Icon = "MenuBook" }
        };
    }

    public static List<Product> GenerateProducts()
    {
        var products = new List<Product>
        {
            // Cat 1: Téléviseurs (10 products)
            P(1, 1, "Samsung QE65S95D OLED 4K 65\"", "Samsung QE65S95D OLED 4K 65 inch", "Téléviseur OLED 4K 65 pouces avec processeur Neural Quantum 4K, Dolby Atmos et design ultra-fin.", "65-inch OLED 4K TV with Neural Quantum 4K processor, Dolby Atmos and ultra-thin design.", 1899.99m, 1699.99m, "Samsung", "SAM-QE65S95D", 15, true, true, true, true,
                V(1, "55 pouces", "55 inch", "55\"", -400m, 20), V(2, "65 pouces", "65 inch", "65\"", 0m, 15), V(3, "77 pouces", "77 inch", "77\"", 800m, 8)),
            P(2, 1, "LG OLED65C4 4K 65\"", "LG OLED65C4 4K 65 inch", "Téléviseur OLED evo 4K avec processeur α9 Gen7, webOS 24 et Dolby Vision IQ.", "OLED evo 4K TV with α9 Gen7 processor, webOS 24 and Dolby Vision IQ.", 1599.99m, null, "LG", "LG-OLED65C4", 22, false, true, false, false,
                V(4, "48 pouces", "48 inch", "48\"", -500m, 18), V(5, "55 pouces", "55 inch", "55\"", -200m, 25), V(6, "65 pouces", "65 inch", "65\"", 0m, 22)),
            P(3, 1, "Sony Bravia XR-65A95L OLED", "Sony Bravia XR-65A95L OLED", "Téléviseur QD-OLED 4K avec Cognitive Processor XR et Acoustic Surface Audio+.", "QD-OLED 4K TV with Cognitive Processor XR and Acoustic Surface Audio+.", 2499.99m, 2199.99m, "Sony", "SONY-XR65A95L", 8, false, false, false, true,
                V(7, "55 pouces", "55 inch", "55\"", -500m, 12), V(8, "65 pouces", "65 inch", "65\"", 0m, 8)),
            P(4, 1, "TCL 65C845 Mini LED 4K", "TCL 65C845 Mini LED 4K", "Téléviseur Mini LED 4K QLED avec Google TV et barre de son Onkyo intégrée.", "Mini LED 4K QLED TV with Google TV and built-in Onkyo soundbar.", 899.99m, 749.99m, "TCL", "TCL-65C845", 30, false, false, true, true,
                V(9, "55 pouces", "55 inch", "55\"", -150m, 35), V(10, "65 pouces", "65 inch", "65\"", 0m, 30), V(11, "75 pouces", "75 inch", "75\"", 400m, 15)),
            P(5, 1, "Philips 65OLED808 Ambilight", "Philips 65OLED808 Ambilight", "Téléviseur OLED 4K avec Ambilight 3 côtés, P5 AI Intelligent et son Bowers & Wilkins.", "OLED 4K TV with 3-sided Ambilight, P5 AI Intelligent and Bowers & Wilkins sound.", 1799.99m, null, "Philips", "PHI-65OLED808", 12, true, false, false, false,
                V(12, "55 pouces", "55 inch", "55\"", -300m, 18), V(13, "65 pouces", "65 inch", "65\"", 0m, 12)),
            P(6, 1, "Samsung QE55Q80D QLED 4K", "Samsung QE55Q80D QLED 4K", "TV QLED 4K avec Direct Full Array et Object Tracking Sound.", "QLED 4K TV with Direct Full Array and Object Tracking Sound.", 999.99m, 849.99m, "Samsung", "SAM-QE55Q80D", 40, false, false, false, true,
                V(14, "50 pouces", "50 inch", "50\"", -100m, 45), V(15, "55 pouces", "55 inch", "55\"", 0m, 40), V(16, "65 pouces", "65 inch", "65\"", 300m, 25)),
            P(7, 1, "LG 55NANO81 NanoCell 4K", "LG 55NANO81 NanoCell 4K", "Téléviseur NanoCell 4K avec Active HDR et AI ThinQ.", "NanoCell 4K TV with Active HDR and AI ThinQ.", 549.99m, null, "LG", "LG-55NANO81", 50, false, false, false, false,
                V(17, "43 pouces", "43 inch", "43\"", -100m, 60), V(18, "50 pouces", "50 inch", "50\"", -50m, 55), V(19, "55 pouces", "55 inch", "55\"", 0m, 50)),
            P(8, 1, "Hisense 65U8KQ Mini LED", "Hisense 65U8KQ Mini LED", "TV Mini LED 4K avec Hi-View Engine X et Dolby Vision IQ.", "Mini LED 4K TV with Hi-View Engine X and Dolby Vision IQ.", 799.99m, 699.99m, "Hisense", "HIS-65U8KQ", 25, true, false, false, true,
                V(20, "55 pouces", "55 inch", "55\"", -100m, 30), V(21, "65 pouces", "65 inch", "65\"", 0m, 25)),
            P(9, 1, "Panasonic TX-65MZ2000 OLED", "Panasonic TX-65MZ2000 OLED", "Téléviseur OLED Master 4K avec HCX Pro AI Processor MK II et son Technics.", "OLED Master 4K TV with HCX Pro AI Processor MK II and Technics sound.", 2799.99m, null, "Panasonic", "PAN-TX65MZ2000", 5, false, false, false, false,
                V(22, "55 pouces", "55 inch", "55\"", -500m, 8), V(23, "65 pouces", "65 inch", "65\"", 0m, 5)),
            P(10, 1, "Samsung The Frame QE55LS03B", "Samsung The Frame QE55LS03B", "TV QLED 4K au design tableau avec Art Mode et cadre personnalisable.", "QLED 4K TV with Art Mode and customizable frame.", 1299.99m, 1099.99m, "Samsung", "SAM-LS03B55", 20, true, true, false, true,
                V(24, "43 pouces", "43 inch", "43\"", -300m, 30), V(25, "55 pouces", "55 inch", "55\"", 0m, 20), V(26, "65 pouces", "65 inch", "65\"", 400m, 12)),

            // Cat 2: Ordinateurs portables (10 products)
            P(11, 2, "Apple MacBook Pro 16\" M3 Pro", "Apple MacBook Pro 16 inch M3 Pro", "MacBook Pro 16 pouces avec puce M3 Pro, 18 Go RAM, 512 Go SSD et écran Liquid Retina XDR.", "MacBook Pro 16 inch with M3 Pro chip, 18GB RAM, 512GB SSD and Liquid Retina XDR display.", 2799.99m, null, "Apple", "APL-MBP16M3P", 18, true, true, false, false,
                V(27, "512 Go SSD", "512GB SSD", "512Go", 0m, 18), V(28, "1 To SSD", "1TB SSD", "1To", 230m, 12), V(29, "2 To SSD", "2TB SSD", "2To", 690m, 6)),
            P(12, 2, "ASUS ROG Strix G16 2024", "ASUS ROG Strix G16 2024", "PC portable gaming avec Intel Core i9-14900HX, RTX 4070, 16 Go RAM et écran 240Hz.", "Gaming laptop with Intel Core i9-14900HX, RTX 4070, 16GB RAM and 240Hz display.", 1999.99m, 1799.99m, "ASUS", "ASUS-G614JV", 15, true, false, true, true,
                V(30, "RTX 4060", "RTX 4060", "RTX4060", -300m, 20), V(31, "RTX 4070", "RTX 4070", "RTX4070", 0m, 15), V(32, "RTX 4080", "RTX 4080", "RTX4080", 500m, 8)),
            P(13, 2, "Dell XPS 15 9530", "Dell XPS 15 9530", "Ultrabook 15.6\" avec Intel Core i7-13700H, 16 Go RAM, 512 Go SSD et écran OLED 3.5K.", "15.6\" ultrabook with Intel Core i7-13700H, 16GB RAM, 512GB SSD and 3.5K OLED display.", 1699.99m, null, "Dell", "DELL-XPS159530", 20, false, true, false, false,
                V(33, "16 Go RAM", "16GB RAM", "16Go", 0m, 20), V(34, "32 Go RAM", "32GB RAM", "32Go", 200m, 12)),
            P(14, 2, "Lenovo ThinkPad X1 Carbon Gen 11", "Lenovo ThinkPad X1 Carbon Gen 11", "Ultrabook professionnel 14\" avec Intel Core i7 vPro, 16 Go RAM et clavier rétroéclairé.", "14\" professional ultrabook with Intel Core i7 vPro, 16GB RAM and backlit keyboard.", 1599.99m, 1399.99m, "Lenovo", "LEN-X1C11", 25, false, false, false, true,
                V(35, "256 Go SSD", "256GB SSD", "256Go", -200m, 30), V(36, "512 Go SSD", "512GB SSD", "512Go", 0m, 25), V(37, "1 To SSD", "1TB SSD", "1To", 150m, 15)),
            P(15, 2, "HP Spectre x360 16", "HP Spectre x360 16", "PC portable convertible 16\" avec Intel Core i7-13700H, écran OLED tactile et stylet inclus.", "16\" convertible laptop with Intel Core i7-13700H, OLED touchscreen and included stylus.", 1899.99m, null, "HP", "HP-SPECTRE360-16", 10, true, false, false, false,
                V(38, "16 Go RAM", "16GB RAM", "16Go", 0m, 10), V(39, "32 Go RAM", "32GB RAM", "32Go", 250m, 6)),
            P(16, 2, "Acer Swift Go 14", "Acer Swift Go 14", "Ultrabook léger 14\" avec Intel Core i5-1340P, 8 Go RAM et écran 2.8K OLED.", "Lightweight 14\" ultrabook with Intel Core i5-1340P, 8GB RAM and 2.8K OLED display.", 799.99m, 699.99m, "Acer", "ACER-SFG14", 35, false, false, true, true,
                V(40, "8 Go RAM", "8GB RAM", "8Go", 0m, 35), V(41, "16 Go RAM", "16GB RAM", "16Go", 100m, 20)),
            P(17, 2, "MSI Creator Z16 HX Studio", "MSI Creator Z16 HX Studio", "PC portable créatif 16\" avec Intel Core i9-13950HX, RTX 4070 et écran Mini LED.", "16\" creative laptop with Intel Core i9-13950HX, RTX 4070 and Mini LED display.", 2999.99m, null, "MSI", "MSI-Z16HXS", 8, false, false, false, false,
                V(42, "32 Go RAM", "32GB RAM", "32Go", 0m, 8), V(43, "64 Go RAM", "64GB RAM", "64Go", 400m, 4)),
            P(18, 2, "Apple MacBook Air 15\" M3", "Apple MacBook Air 15 inch M3", "MacBook Air 15 pouces avec puce M3, 8 Go RAM, 256 Go SSD et autonomie 18h.", "MacBook Air 15 inch with M3 chip, 8GB RAM, 256GB SSD and 18h battery life.", 1499.99m, 1399.99m, "Apple", "APL-MBA15M3", 30, true, true, false, true,
                V(44, "256 Go SSD", "256GB SSD", "256Go", 0m, 30), V(45, "512 Go SSD", "512GB SSD", "512Go", 115m, 20)),
            P(19, 2, "Lenovo IdeaPad Slim 5 16", "Lenovo IdeaPad Slim 5 16", "PC portable 16\" avec AMD Ryzen 7 7730U, 16 Go RAM et écran 2.5K.", "16\" laptop with AMD Ryzen 7 7730U, 16GB RAM and 2.5K display.", 699.99m, 599.99m, "Lenovo", "LEN-IP516", 40, false, false, false, true,
                V(46, "8 Go RAM", "8GB RAM", "8Go", -100m, 50), V(47, "16 Go RAM", "16GB RAM", "16Go", 0m, 40)),
            P(20, 2, "ASUS ZenBook 14 OLED", "ASUS ZenBook 14 OLED", "Ultrabook compact 14\" avec Intel Core i5-1340P, 16 Go RAM et écran OLED 2.8K.", "Compact 14\" ultrabook with Intel Core i5-1340P, 16GB RAM and 2.8K OLED display.", 899.99m, null, "ASUS", "ASUS-ZB14OLED", 22, false, false, false, false,
                V(48, "512 Go SSD", "512GB SSD", "512Go", 0m, 22), V(49, "1 To SSD", "1TB SSD", "1To", 100m, 14)),

            // Cat 3: Smartphones (10 products)
            P(21, 3, "Apple iPhone 15 Pro Max", "Apple iPhone 15 Pro Max", "iPhone 15 Pro Max avec puce A17 Pro, système photo 48 Mpx et titane.", "iPhone 15 Pro Max with A17 Pro chip, 48MP camera system and titanium.", 1479.99m, null, "Apple", "APL-IP15PM", 25, true, true, false, false,
                V(50, "256 Go", "256GB", "256Go", 0m, 25), V(51, "512 Go", "512GB", "512Go", 120m, 15), V(52, "1 To", "1TB", "1To", 350m, 8)),
            P(22, 3, "Samsung Galaxy S24 Ultra", "Samsung Galaxy S24 Ultra", "Galaxy S24 Ultra avec Galaxy AI, S Pen intégré, appareil photo 200 Mpx et cadre en titane.", "Galaxy S24 Ultra with Galaxy AI, built-in S Pen, 200MP camera and titanium frame.", 1419.99m, 1299.99m, "Samsung", "SAM-S24U", 20, true, true, true, true,
                V(53, "256 Go", "256GB", "256Go", 0m, 20), V(54, "512 Go", "512GB", "512Go", 120m, 12), V(55, "1 To", "1TB", "1To", 360m, 5)),
            P(23, 3, "Google Pixel 8 Pro", "Google Pixel 8 Pro", "Pixel 8 Pro avec Tensor G3, Magic Eraser et 7 ans de mises à jour.", "Pixel 8 Pro with Tensor G3, Magic Eraser and 7 years of updates.", 1099.99m, 999.99m, "Google", "GOO-PX8P", 30, true, false, false, true,
                V(56, "128 Go", "128GB", "128Go", 0m, 30), V(57, "256 Go", "256GB", "256Go", 60m, 20)),
            P(24, 3, "Xiaomi 14 Ultra", "Xiaomi 14 Ultra", "Xiaomi 14 Ultra avec capteur Leica Summilux, Snapdragon 8 Gen 3 et charge 90W.", "Xiaomi 14 Ultra with Leica Summilux sensor, Snapdragon 8 Gen 3 and 90W charging.", 1299.99m, null, "Xiaomi", "XIA-14U", 18, false, false, false, false,
                V(58, "256 Go", "256GB", "256Go", 0m, 18), V(59, "512 Go", "512GB", "512Go", 100m, 10)),
            P(25, 3, "Samsung Galaxy A55 5G", "Samsung Galaxy A55 5G", "Galaxy A55 5G avec écran Super AMOLED 120Hz et batterie 5000 mAh.", "Galaxy A55 5G with Super AMOLED 120Hz display and 5000mAh battery.", 449.99m, 379.99m, "Samsung", "SAM-A55", 50, false, false, true, true,
                V(60, "128 Go", "128GB", "128Go", 0m, 50), V(61, "256 Go", "256GB", "256Go", 30m, 35)),
            P(26, 3, "Apple iPhone 15", "Apple iPhone 15", "iPhone 15 avec Dynamic Island, puce A16 Bionic et USB-C.", "iPhone 15 with Dynamic Island, A16 Bionic chip and USB-C.", 969.99m, 899.99m, "Apple", "APL-IP15", 35, false, true, false, true,
                V(62, "128 Go", "128GB", "128Go", 0m, 35), V(63, "256 Go", "256GB", "256Go", 100m, 25), V(64, "512 Go", "512GB", "512Go", 230m, 15)),
            P(27, 3, "OnePlus 12", "OnePlus 12", "OnePlus 12 avec Snapdragon 8 Gen 3, écran 2K LTPO et charge 100W SUPERVOOC.", "OnePlus 12 with Snapdragon 8 Gen 3, 2K LTPO display and 100W SUPERVOOC charging.", 899.99m, null, "OnePlus", "OP-12", 22, true, false, false, false,
                V(65, "256 Go", "256GB", "256Go", 0m, 22), V(66, "512 Go", "512GB", "512Go", 100m, 12)),
            P(28, 3, "Nothing Phone (2)", "Nothing Phone (2)", "Nothing Phone (2) avec interface Glyph, Snapdragon 8+ Gen 1 et design transparent.", "Nothing Phone (2) with Glyph Interface, Snapdragon 8+ Gen 1 and transparent design.", 599.99m, 549.99m, "Nothing", "NTH-P2", 28, true, false, false, true,
                V(67, "128 Go", "128GB", "128Go", -50m, 35), V(68, "256 Go", "256GB", "256Go", 0m, 28)),
            P(29, 3, "Google Pixel 8a", "Google Pixel 8a", "Pixel 8a avec Tensor G3, écran OLED 120Hz et photo mode nuit.", "Pixel 8a with Tensor G3, 120Hz OLED display and night mode camera.", 499.99m, null, "Google", "GOO-PX8A", 40, false, false, false, false,
                V(69, "128 Go", "128GB", "128Go", 0m, 40), V(70, "256 Go", "256GB", "256Go", 60m, 25)),
            P(30, 3, "Xiaomi Redmi Note 13 Pro+", "Xiaomi Redmi Note 13 Pro+", "Redmi Note 13 Pro+ avec écran AMOLED 120Hz, charge 120W et capteur 200 Mpx.", "Redmi Note 13 Pro+ with 120Hz AMOLED display, 120W charging and 200MP sensor.", 349.99m, 299.99m, "Xiaomi", "XIA-RN13PP", 60, false, false, true, true,
                V(71, "128 Go", "128GB", "128Go", -50m, 70), V(72, "256 Go", "256GB", "256Go", 0m, 60)),

            // Cat 4: Casques & Écouteurs (10 products)
            P(31, 4, "Sony WH-1000XM5", "Sony WH-1000XM5", "Casque sans fil à réduction de bruit avec 30h d'autonomie et audio Hi-Res.", "Wireless noise-cancelling headphones with 30h battery and Hi-Res audio.", 379.99m, 329.99m, "Sony", "SONY-WH1000XM5", 35, true, true, true, true,
                V(73, "Noir", "Black", "Noir", 0m, 35), V(74, "Argent", "Silver", "Argent", 0m, 30), V(75, "Bleu nuit", "Midnight Blue", "Bleu", 0m, 20)),
            P(32, 4, "Apple AirPods Pro 2", "Apple AirPods Pro 2", "AirPods Pro 2ème génération avec puce H2, réduction active du bruit et USB-C.", "AirPods Pro 2nd gen with H2 chip, active noise cancellation and USB-C.", 279.99m, null, "Apple", "APL-APP2", 45, true, true, false, false,
                V(76, "USB-C", "USB-C", "USB-C", 0m, 45)),
            P(33, 4, "Bose QuietComfort Ultra", "Bose QuietComfort Ultra", "Casque circum-aural sans fil avec Immersive Audio et CustomTune.", "Over-ear wireless headphones with Immersive Audio and CustomTune.", 449.99m, 399.99m, "Bose", "BOSE-QCUL", 20, false, false, false, true,
                V(77, "Noir", "Black", "Noir", 0m, 20), V(78, "Blanc fumé", "White Smoke", "Blanc", 0m, 15)),
            P(34, 4, "Sennheiser Momentum 4 Wireless", "Sennheiser Momentum 4 Wireless", "Casque audiophile sans fil avec 60h d'autonomie et ANC adaptatif.", "Audiophile wireless headphones with 60h battery and adaptive ANC.", 349.99m, null, "Sennheiser", "SENN-M4W", 18, false, false, false, false,
                V(79, "Noir", "Black", "Noir", 0m, 18), V(80, "Blanc", "White", "Blanc", 0m, 12)),
            P(35, 4, "JBL Tune 770NC", "JBL Tune 770NC", "Casque sans fil avec réduction de bruit adaptative et JBL Pure Bass.", "Wireless headphones with adaptive noise cancellation and JBL Pure Bass.", 99.99m, 79.99m, "JBL", "JBL-T770NC", 60, false, false, true, true,
                V(81, "Noir", "Black", "Noir", 0m, 60), V(82, "Bleu", "Blue", "Bleu", 0m, 50), V(83, "Violet", "Purple", "Violet", 0m, 40)),
            P(36, 4, "Samsung Galaxy Buds3 Pro", "Samsung Galaxy Buds3 Pro", "Écouteurs intra-auriculaires avec ANC intelligent et son Hi-Fi 24-bit.", "In-ear earbuds with intelligent ANC and 24-bit Hi-Fi sound.", 249.99m, null, "Samsung", "SAM-GB3P", 30, true, false, false, false,
                V(84, "Blanc", "White", "Blanc", 0m, 30), V(85, "Gris", "Gray", "Gris", 0m, 25)),
            P(37, 4, "Sony WF-1000XM5", "Sony WF-1000XM5", "Écouteurs sans fil premium avec réduction de bruit et puce V2.", "Premium wireless earbuds with noise cancellation and V2 chip.", 299.99m, 269.99m, "Sony", "SONY-WF1000XM5", 25, false, true, false, true,
                V(86, "Noir", "Black", "Noir", 0m, 25), V(87, "Argent", "Silver", "Argent", 0m, 20)),
            P(38, 4, "Jabra Elite 85t", "Jabra Elite 85t", "Écouteurs avec ANC avancé, 6 microphones et compatibilité multipoint.", "Earbuds with advanced ANC, 6 microphones and multipoint connectivity.", 199.99m, 149.99m, "Jabra", "JAB-E85T", 35, false, false, false, true,
                V(88, "Titanium Noir", "Titanium Black", "Noir", 0m, 35), V(89, "Or Beige", "Gold Beige", "Beige", 0m, 25)),
            P(39, 4, "Bose QuietComfort Earbuds II", "Bose QuietComfort Earbuds II", "Écouteurs avec la meilleure réduction de bruit, CustomTune et Son immersif.", "Earbuds with best-in-class noise cancellation, CustomTune and Immersive Sound.", 299.99m, null, "Bose", "BOSE-QCEB2", 22, false, false, false, false,
                V(90, "Noir", "Black", "Noir", 0m, 22), V(91, "Blanc", "White", "Blanc", 0m, 18)),
            P(40, 4, "AKG N400NC TWS", "AKG N400NC TWS", "Écouteurs sans fil avec son studio AKG et réduction active du bruit.", "True wireless earbuds with AKG studio sound and active noise cancellation.", 129.99m, 99.99m, "AKG", "AKG-N400NC", 40, false, false, false, true,
                V(92, "Noir", "Black", "Noir", 0m, 40)),

            // Cat 5: Appareils photo (10 products)
            P(41, 5, "Sony Alpha 7 IV", "Sony Alpha 7 IV", "Appareil photo hybride plein format 33 Mpx avec autofocus IA et vidéo 4K 60p.", "Full-frame 33MP mirrorless camera with AI autofocus and 4K 60p video.", 2499.99m, 2299.99m, "Sony", "SONY-A7IV", 10, true, true, false, true,
                V(93, "Boîtier nu", "Body only", "Nu", 0m, 10), V(94, "Kit 28-70mm", "28-70mm kit", "Kit", 300m, 8)),
            P(42, 5, "Canon EOS R6 Mark II", "Canon EOS R6 Mark II", "Hybride plein format 24.2 Mpx avec stabilisation 8 stops et vidéo 4K 60p oversampled.", "24.2MP full-frame mirrorless with 8-stop stabilization and oversampled 4K 60p video.", 2699.99m, null, "Canon", "CAN-R6MK2", 12, true, false, false, false,
                V(95, "Boîtier nu", "Body only", "Nu", 0m, 12), V(96, "Kit 24-105mm", "24-105mm kit", "Kit", 500m, 6)),
            P(43, 5, "Nikon Z8", "Nikon Z8", "Hybride plein format 45.7 Mpx avec processeur EXPEED 7 et vidéo 8K.", "45.7MP full-frame mirrorless with EXPEED 7 processor and 8K video.", 3999.99m, null, "Nikon", "NIK-Z8", 6, false, false, false, false,
                V(97, "Boîtier nu", "Body only", "Nu", 0m, 6)),
            P(44, 5, "Fujifilm X-T5", "Fujifilm X-T5", "Hybride APS-C rétro 40 Mpx avec simulation de film et viseur OLED.", "Retro-style 40MP APS-C mirrorless with film simulation and OLED viewfinder.", 1699.99m, 1499.99m, "Fujifilm", "FUJ-XT5", 15, false, true, false, true,
                V(98, "Boîtier nu", "Body only", "Nu", 0m, 15), V(99, "Kit 18-55mm", "18-55mm kit", "Kit", 250m, 10)),
            P(45, 5, "Sony Alpha 7C II", "Sony Alpha 7C II", "Hybride plein format compact 33 Mpx avec autofocus IA avancé.", "Compact 33MP full-frame mirrorless with advanced AI autofocus.", 2199.99m, null, "Sony", "SONY-A7C2", 14, true, false, false, false,
                V(100, "Boîtier nu", "Body only", "Nu", 0m, 14), V(101, "Kit 28-60mm", "28-60mm kit", "Kit", 200m, 10)),
            P(46, 5, "Canon EOS R50", "Canon EOS R50", "Hybride APS-C compact idéal pour débuter avec vidéo 4K et autofocus Dual Pixel.", "Compact APS-C mirrorless ideal for beginners with 4K video and Dual Pixel autofocus.", 799.99m, 699.99m, "Canon", "CAN-R50", 30, false, false, true, true,
                V(102, "Boîtier nu", "Body only", "Nu", 0m, 30), V(103, "Kit 18-45mm", "18-45mm kit", "Kit", 100m, 25)),
            P(47, 5, "Nikon Zf", "Nikon Zf", "Hybride plein format rétro 24.5 Mpx avec boîtier en magnésium et design vintage.", "Retro-style 24.5MP full-frame mirrorless with magnesium body and vintage design.", 2499.99m, null, "Nikon", "NIK-ZF", 10, true, false, false, false,
                V(104, "Boîtier nu", "Body only", "Nu", 0m, 10)),
            P(48, 5, "GoPro HERO12 Black", "GoPro HERO12 Black", "Caméra d'action avec HyperSmooth 6.0, vidéo 5.3K et HDR photos.", "Action camera with HyperSmooth 6.0, 5.3K video and HDR photos.", 399.99m, 349.99m, "GoPro", "GP-H12B", 40, false, false, false, true,
                V(105, "Standard", "Standard", "Standard", 0m, 40), V(106, "Bundle créateur", "Creator Bundle", "Bundle", 100m, 20)),
            P(49, 5, "DJI Osmo Pocket 3", "DJI Osmo Pocket 3", "Caméra stabilisée de poche avec capteur 1\" CMOS et écran rotatif 2\".", "Pocket stabilized camera with 1\" CMOS sensor and 2\" rotating screen.", 519.99m, null, "DJI", "DJI-OP3", 18, false, false, false, false,
                V(107, "Standard", "Standard", "Standard", 0m, 18), V(108, "Combo créateur", "Creator Combo", "Combo", 80m, 12)),
            P(50, 5, "Panasonic Lumix S5 IIX", "Panasonic Lumix S5 IIX", "Hybride plein format vidéaste avec phase AF et sorties vidéo pro.", "Full-frame video-focused mirrorless with phase AF and pro video outputs.", 1999.99m, 1799.99m, "Panasonic", "PAN-S5IIX", 8, false, false, false, true,
                V(109, "Boîtier nu", "Body only", "Nu", 0m, 8), V(110, "Kit 20-60mm", "20-60mm kit", "Kit", 300m, 5)),

            // Cat 6: Gaming (10 products)
            P(51, 6, "Sony PlayStation 5 Slim", "Sony PlayStation 5 Slim", "Console de salon nouvelle génération avec SSD ultra-rapide et manette DualSense.", "Next-gen home console with ultra-fast SSD and DualSense controller.", 549.99m, 499.99m, "Sony", "SONY-PS5S", 25, true, true, true, true,
                V(111, "Édition Standard", "Standard Edition", "Standard", 0m, 25), V(112, "Édition Digitale", "Digital Edition", "Digital", -100m, 30)),
            P(52, 6, "Microsoft Xbox Series X", "Microsoft Xbox Series X", "Console la plus puissante avec 12 TFLOPS, SSD 1 To et Game Pass.", "Most powerful console with 12 TFLOPS, 1TB SSD and Game Pass.", 499.99m, null, "Microsoft", "MS-XBSX", 20, false, true, false, false,
                V(113, "Standard", "Standard", "Standard", 0m, 20)),
            P(53, 6, "Nintendo Switch OLED", "Nintendo Switch OLED", "Console hybride avec écran OLED 7\", dock avec port Ethernet et 64 Go de stockage.", "Hybrid console with 7\" OLED screen, dock with Ethernet port and 64GB storage.", 349.99m, 319.99m, "Nintendo", "NIN-SWOLED", 35, true, true, false, true,
                V(114, "Blanc", "White", "Blanc", 0m, 35), V(115, "Bleu/Rouge néon", "Neon Blue/Red", "Néon", 0m, 30)),
            P(54, 6, "Razer Wolverine V3 Pro", "Razer Wolverine V3 Pro", "Manette gaming pro Xbox/PC avec boutons mécaniques et stick Hall Effect.", "Pro Xbox/PC controller with mechanical buttons and Hall Effect sticks.", 199.99m, null, "Razer", "RAZ-WV3P", 15, false, false, false, false,
                V(116, "Noir", "Black", "Noir", 0m, 15), V(117, "Blanc", "White", "Blanc", 0m, 10)),
            P(55, 6, "SteelSeries Arctis Nova Pro", "SteelSeries Arctis Nova Pro", "Casque gaming premium avec ANC, double batterie et DAC externe.", "Premium gaming headset with ANC, dual battery and external DAC.", 349.99m, 299.99m, "SteelSeries", "SS-ANP", 18, false, false, false, true,
                V(118, "Filaire", "Wired", "Filaire", -100m, 25), V(119, "Sans fil", "Wireless", "Wifi", 0m, 18)),
            P(56, 6, "Elgato Stream Deck MK.2", "Elgato Stream Deck MK.2", "Contrôleur de streaming 15 touches LCD personnalisables avec intégration OBS.", "Streaming controller with 15 customizable LCD keys and OBS integration.", 149.99m, null, "Elgato", "ELG-SDMK2", 25, true, false, false, false,
                V(120, "15 touches", "15 keys", "15", 0m, 25), V(121, "32 touches", "32 keys", "32", 100m, 12)),
            P(57, 6, "Hogwarts Legacy PS5", "Hogwarts Legacy PS5", "Jeu d'action RPG en monde ouvert dans l'univers Harry Potter pour PS5.", "Open-world action RPG in the Harry Potter universe for PS5.", 49.99m, 34.99m, "Warner Bros", "WB-HLPS5", 50, false, false, true, true,
                V(122, "PS5", "PS5", "PS5", 0m, 50)),
            P(58, 6, "The Legend of Zelda: TotK", "The Legend of Zelda: TotK", "Suite de Breath of the Wild avec exploration aérienne et pouvoirs inédits.", "Sequel to Breath of the Wild with aerial exploration and new powers.", 59.99m, null, "Nintendo", "NIN-ZELDATOTK", 30, false, true, false, false,
                V(123, "Standard", "Standard", "Standard", 0m, 30)),
            P(59, 6, "Logitech G502 X Plus", "Logitech G502 X Plus", "Souris gaming sans fil avec capteur HERO 25K, switches LIGHTFORCE et LIGHTSYNC RGB.", "Wireless gaming mouse with HERO 25K sensor, LIGHTFORCE switches and LIGHTSYNC RGB.", 159.99m, 129.99m, "Logitech", "LOG-G502XP", 30, false, false, false, true,
                V(124, "Noir", "Black", "Noir", 0m, 30), V(125, "Blanc", "White", "Blanc", 0m, 20)),
            P(60, 6, "Corsair K100 RGB", "Corsair K100 RGB", "Clavier gaming mécanique avec switches OPX optiques et repose-poignet magnétique.", "Mechanical gaming keyboard with OPX optical switches and magnetic wrist rest.", 229.99m, null, "Corsair", "COR-K100", 15, false, false, false, false,
                V(126, "AZERTY", "AZERTY", "AZERTY", 0m, 15), V(127, "QWERTY", "QWERTY", "QWERTY", 0m, 10)),

            // Cat 7: Tablettes (10 products)
            P(61, 7, "Apple iPad Pro 12.9\" M2", "Apple iPad Pro 12.9 inch M2", "iPad Pro 12.9\" avec puce M2, écran Liquid Retina XDR et Apple Pencil hover.", "iPad Pro 12.9 inch with M2 chip, Liquid Retina XDR display and Apple Pencil hover.", 1329.99m, null, "Apple", "APL-IPADP129", 15, true, true, false, false,
                V(128, "128 Go WiFi", "128GB WiFi", "128Go", 0m, 15), V(129, "256 Go WiFi", "256GB WiFi", "256Go", 120m, 12), V(130, "256 Go WiFi+Cell", "256GB WiFi+Cell", "256Go+Cell", 270m, 8)),
            P(62, 7, "Samsung Galaxy Tab S9 Ultra", "Samsung Galaxy Tab S9 Ultra", "Tablette 14.6\" avec Snapdragon 8 Gen 2, S Pen inclus et Dynamic AMOLED 2X.", "14.6\" tablet with Snapdragon 8 Gen 2, included S Pen and Dynamic AMOLED 2X.", 1179.99m, 1049.99m, "Samsung", "SAM-TABS9U", 12, true, false, true, true,
                V(131, "256 Go", "256GB", "256Go", 0m, 12), V(132, "512 Go", "512GB", "512Go", 120m, 8)),
            P(63, 7, "Apple iPad Air 5 M1", "Apple iPad Air 5 M1", "iPad Air 10.9\" avec puce M1, Touch ID et compatibilité Apple Pencil 2.", "iPad Air 10.9 inch with M1 chip, Touch ID and Apple Pencil 2 compatibility.", 699.99m, 649.99m, "Apple", "APL-IPADA5", 30, false, true, false, true,
                V(133, "64 Go WiFi", "64GB WiFi", "64Go", 0m, 30), V(134, "256 Go WiFi", "256GB WiFi", "256Go", 100m, 20)),
            P(64, 7, "Lenovo Tab P12 Pro", "Lenovo Tab P12 Pro", "Tablette 12.6\" AMOLED 120Hz avec Snapdragon 870 et quad speakers JBL.", "12.6\" AMOLED 120Hz tablet with Snapdragon 870 and JBL quad speakers.", 549.99m, null, "Lenovo", "LEN-TABP12P", 20, false, false, false, false,
                V(135, "128 Go", "128GB", "128Go", 0m, 20), V(136, "256 Go", "256GB", "256Go", 50m, 14)),
            P(65, 7, "Apple iPad 10ème génération", "Apple iPad 10th generation", "iPad 10.9\" avec puce A14 Bionic, USB-C et design modernisé.", "iPad 10.9 inch with A14 Bionic chip, USB-C and modernized design.", 409.99m, 379.99m, "Apple", "APL-IPAD10", 45, false, false, true, true,
                V(137, "64 Go WiFi", "64GB WiFi", "64Go", 0m, 45), V(138, "256 Go WiFi", "256GB WiFi", "256Go", 100m, 30)),
            P(66, 7, "Samsung Galaxy Tab S9 FE", "Samsung Galaxy Tab S9 FE", "Tablette 10.9\" avec Exynos 1380, S Pen inclus et certification IP68.", "10.9\" tablet with Exynos 1380, included S Pen and IP68 certification.", 449.99m, 399.99m, "Samsung", "SAM-TABS9FE", 35, false, false, false, true,
                V(139, "128 Go", "128GB", "128Go", 0m, 35), V(140, "256 Go", "256GB", "256Go", 50m, 25)),
            P(67, 7, "Xiaomi Pad 6", "Xiaomi Pad 6", "Tablette 11\" avec Snapdragon 870, écran 144Hz et quad speakers Dolby Atmos.", "11\" tablet with Snapdragon 870, 144Hz display and Dolby Atmos quad speakers.", 349.99m, 299.99m, "Xiaomi", "XIA-PAD6", 40, false, false, false, true,
                V(141, "128 Go", "128GB", "128Go", 0m, 40), V(142, "256 Go", "256GB", "256Go", 50m, 25)),
            P(68, 7, "Huawei MatePad Pro 11", "Huawei MatePad Pro 11", "Tablette 11\" OLED 120Hz avec M-Pencil 2 et clavier magnétique.", "11\" 120Hz OLED tablet with M-Pencil 2 and magnetic keyboard.", 499.99m, null, "Huawei", "HUA-MPP11", 15, false, false, false, false,
                V(143, "128 Go", "128GB", "128Go", 0m, 15), V(144, "256 Go", "256GB", "256Go", 60m, 10)),
            P(69, 7, "Amazon Fire HD 10", "Amazon Fire HD 10", "Tablette 10.1\" avec processeur octa-core et Alexa intégrée.", "10.1\" tablet with octa-core processor and built-in Alexa.", 149.99m, 109.99m, "Amazon", "AMZ-FHD10", 55, false, false, true, true,
                V(145, "32 Go", "32GB", "32Go", 0m, 55), V(146, "64 Go", "64GB", "64Go", 20m, 40)),
            P(70, 7, "Microsoft Surface Pro 9", "Microsoft Surface Pro 9", "Tablette PC 2-en-1 13\" avec Intel Core i5, Windows 11 et kickstand intégré.", "13\" 2-in-1 tablet PC with Intel Core i5, Windows 11 and built-in kickstand.", 1199.99m, null, "Microsoft", "MS-SP9", 18, true, false, false, false,
                V(147, "128 Go / 8 Go RAM", "128GB / 8GB RAM", "128Go", 0m, 18), V(148, "256 Go / 16 Go RAM", "256GB / 16GB RAM", "256Go", 230m, 12)),

            // Cat 8: Enceintes & Son (10 products)
            P(71, 8, "Sonos Era 300", "Sonos Era 300", "Enceinte spatiale avec Dolby Atmos, WiFi 6 et design acoustique enveloppant.", "Spatial speaker with Dolby Atmos, WiFi 6 and immersive acoustic design.", 449.99m, 399.99m, "Sonos", "SON-ERA300", 15, true, true, false, true,
                V(149, "Blanc", "White", "Blanc", 0m, 15), V(150, "Noir", "Black", "Noir", 0m, 12)),
            P(72, 8, "JBL Charge 5", "JBL Charge 5", "Enceinte Bluetooth portable étanche IP67 avec powerbank intégrée et 20h d'autonomie.", "Portable IP67 waterproof Bluetooth speaker with power bank and 20h battery.", 179.99m, 149.99m, "JBL", "JBL-CH5", 40, false, true, true, true,
                V(151, "Noir", "Black", "Noir", 0m, 40), V(152, "Bleu", "Blue", "Bleu", 0m, 35), V(153, "Rouge", "Red", "Rouge", 0m, 25)),
            P(73, 8, "Bose SoundLink Max", "Bose SoundLink Max", "Enceinte portable avec son stéréo puissant et mode outdoor.", "Portable speaker with powerful stereo sound and outdoor mode.", 399.99m, null, "Bose", "BOSE-SLM", 18, true, false, false, false,
                V(154, "Noir", "Black", "Noir", 0m, 18), V(155, "Bleu", "Blue", "Bleu", 0m, 14)),
            P(74, 8, "Marshall Stanmore III", "Marshall Stanmore III", "Enceinte Bluetooth au design rétro Marshall avec son signature et égaliseur dynamique.", "Retro Marshall design Bluetooth speaker with signature sound and dynamic EQ.", 349.99m, 299.99m, "Marshall", "MAR-STAN3", 20, false, false, false, true,
                V(156, "Noir", "Black", "Noir", 0m, 20), V(157, "Crème", "Cream", "Crème", 0m, 15)),
            P(75, 8, "Ultimate Ears BOOM 3", "Ultimate Ears BOOM 3", "Enceinte Bluetooth 360° étanche avec son à 360 degrés et 15h d'autonomie.", "360° waterproof Bluetooth speaker with 360-degree sound and 15h battery.", 129.99m, 99.99m, "Ultimate Ears", "UE-BOOM3", 45, false, false, true, true,
                V(158, "Noir", "Black", "Noir", 0m, 45), V(159, "Bleu lagon", "Lagoon Blue", "Bleu", 0m, 35), V(160, "Rouge coucher", "Sunset Red", "Rouge", 0m, 30)),
            P(76, 8, "Sonos Beam Gen 2", "Sonos Beam Gen 2", "Barre de son compacte avec Dolby Atmos, eARC et commande vocale.", "Compact soundbar with Dolby Atmos, eARC and voice control.", 499.99m, 449.99m, "Sonos", "SON-BEAM2", 20, false, true, false, true,
                V(161, "Blanc", "White", "Blanc", 0m, 20), V(162, "Noir", "Black", "Noir", 0m, 18)),
            P(77, 8, "Samsung HW-Q990D Soundbar", "Samsung HW-Q990D Soundbar", "Barre de son 11.1.4 canaux avec caisson sans fil, Dolby Atmos et Q-Symphony.", "11.1.4 channel soundbar with wireless sub, Dolby Atmos and Q-Symphony.", 1299.99m, null, "Samsung", "SAM-HWQ990D", 10, false, false, false, false,
                V(163, "Noir", "Black", "Noir", 0m, 10)),
            P(78, 8, "Harman Kardon Aura Studio 4", "Harman Kardon Aura Studio 4", "Enceinte design avec éclairage ambient et son omnidirectionnel 360°.", "Design speaker with ambient lighting and 360° omnidirectional sound.", 299.99m, 249.99m, "Harman Kardon", "HK-AS4", 15, true, false, false, true,
                V(164, "Noir/Transparent", "Black/Transparent", "Noir", 0m, 15)),
            P(79, 8, "JBL PartyBox Encore", "JBL PartyBox Encore", "Enceinte de fête portable avec microphone sans fil inclus et effets lumineux.", "Portable party speaker with included wireless mic and light effects.", 299.99m, null, "JBL", "JBL-PBE", 20, false, false, false, false,
                V(165, "Standard", "Standard", "Standard", 0m, 20)),
            P(80, 8, "Devialet Phantom I 108 dB", "Devialet Phantom I 108 dB", "Enceinte Hi-Fi haut de gamme 1100W avec technologie ADH® et SAM®.", "High-end 1100W Hi-Fi speaker with ADH® and SAM® technology.", 2190.00m, null, "Devialet", "DEV-PH1", 6, false, false, false, false,
                V(166, "Blanc", "White", "Blanc", 0m, 6), V(167, "Noir mat", "Matte Black", "Noir", 0m, 4)),

            // Cat 9: Montres connectées (10 products)
            P(81, 9, "Apple Watch Ultra 2", "Apple Watch Ultra 2", "Montre connectée pour sports extrêmes avec puce S9, GPS bi-fréquence et boîtier titane.", "Smartwatch for extreme sports with S9 chip, dual-frequency GPS and titanium case.", 899.99m, null, "Apple", "APL-AWU2", 12, true, true, false, false,
                V(168, "49mm Titane", "49mm Titanium", "49mm", 0m, 12)),
            P(82, 9, "Samsung Galaxy Watch6 Classic", "Samsung Galaxy Watch6 Classic", "Montre connectée avec lunette rotative, BioActive Sensor et Wear OS.", "Smartwatch with rotating bezel, BioActive Sensor and Wear OS.", 429.99m, 369.99m, "Samsung", "SAM-GW6C", 20, false, true, false, true,
                V(169, "43mm Argent", "43mm Silver", "43mm.Argent", 0m, 20), V(170, "47mm Noir", "47mm Black", "47mm.Noir", 20m, 15)),
            P(83, 9, "Apple Watch Series 9", "Apple Watch Series 9", "Montre connectée avec puce S9, Double Tap et écran toujours allumé 2000 nits.", "Smartwatch with S9 chip, Double Tap and 2000 nit always-on display.", 449.99m, 399.99m, "Apple", "APL-AWS9", 30, true, true, true, true,
                V(171, "41mm Aluminium", "41mm Aluminum", "41mm", 0m, 30), V(172, "45mm Aluminium", "45mm Aluminum", "45mm", 30m, 25)),
            P(84, 9, "Garmin Fenix 7 Pro", "Garmin Fenix 7 Pro", "Montre GPS multisports avec lampe LED, écran MIP et autonomie 22 jours.", "Multi-sport GPS watch with LED flashlight, MIP display and 22-day battery.", 799.99m, 699.99m, "Garmin", "GAR-F7P", 10, false, false, false, true,
                V(173, "47mm Noir", "47mm Black", "47mm.Noir", 0m, 10), V(174, "51mm Titane", "51mm Titanium", "51mm.Titane", 200m, 6)),
            P(85, 9, "Fitbit Sense 2", "Fitbit Sense 2", "Montre santé avec EDA/ECG, GPS intégré et suivi du stress en continu.", "Health smartwatch with EDA/ECG, built-in GPS and continuous stress tracking.", 249.99m, 199.99m, "Fitbit", "FIT-S2", 25, false, false, false, true,
                V(175, "Gris", "Gray", "Gris", 0m, 25), V(176, "Noir/Graphite", "Black/Graphite", "Noir", 0m, 20)),
            P(86, 9, "Google Pixel Watch 2", "Google Pixel Watch 2", "Montre connectée Google avec Fitbit intégré, Wear OS 4 et puce Snapdragon W5.", "Google smartwatch with built-in Fitbit, Wear OS 4 and Snapdragon W5 chip.", 399.99m, 349.99m, "Google", "GOO-PW2", 18, true, false, false, true,
                V(177, "Argent/Porcelaine", "Silver/Porcelain", "Argent", 0m, 18), V(178, "Noir/Obsidienne", "Black/Obsidian", "Noir", 0m, 15)),
            P(87, 9, "Huawei Watch GT 4", "Huawei Watch GT 4", "Montre connectée élégante avec suivi santé TruSeen 5.5+ et 14 jours d'autonomie.", "Elegant smartwatch with TruSeen 5.5+ health tracking and 14-day battery.", 249.99m, null, "Huawei", "HUA-WGT4", 30, false, false, false, false,
                V(179, "41mm Blanc", "41mm White", "41mm.Blanc", 0m, 30), V(180, "46mm Noir", "46mm Black", "46mm.Noir", 0m, 25)),
            P(88, 9, "Amazfit T-Rex Ultra", "Amazfit T-Rex Ultra", "Montre outdoor avec certification MIL-STD-810G, plongée libre et GPS double bande.", "Outdoor watch with MIL-STD-810G certification, freediving and dual-band GPS.", 349.99m, 299.99m, "Amazfit", "AMZ-TRU", 15, false, false, false, true,
                V(181, "Noir", "Black", "Noir", 0m, 15)),
            P(89, 9, "Withings ScanWatch 2", "Withings ScanWatch 2", "Montre hybride avec ECG, SpO2 et détection de la fibrillation auriculaire.", "Hybrid watch with ECG, SpO2 and atrial fibrillation detection.", 349.99m, null, "Withings", "WTH-SW2", 20, false, false, false, false,
                V(182, "38mm Noir", "38mm Black", "38mm.Noir", 0m, 20), V(183, "42mm Blanc", "42mm White", "42mm.Blanc", 0m, 15)),
            P(90, 9, "Samsung Galaxy Watch FE", "Samsung Galaxy Watch FE", "Montre connectée accessible avec BioActive Sensor et suivi du sommeil.", "Affordable smartwatch with BioActive Sensor and sleep tracking.", 199.99m, 169.99m, "Samsung", "SAM-GWFE", 40, false, false, true, true,
                V(184, "40mm Noir", "40mm Black", "40mm.Noir", 0m, 40), V(185, "40mm Or Rose", "40mm Rose Gold", "40mm.Or", 0m, 30)),

            // Cat 10: Livres (10 products)
            P(91, 10, "Dune – Tome 1 de Frank Herbert", "Dune - Volume 1 by Frank Herbert", "L'épopée de science-fiction culte sur la planète Arrakis. Édition poche.", "The cult sci-fi epic on the planet Arrakis. Pocket edition.", 9.90m, 7.90m, "Pocket", "LIV-DUNE1", 100, false, true, false, true,
                V(186, "Poche", "Pocket", "Poche", 0m, 100), V(187, "Grand format", "Hardcover", "Grand", 10m, 40)),
            P(92, 10, "Le Petit Prince – Antoine de Saint-Exupéry", "The Little Prince - Antoine de Saint-Exupery", "Le classique intemporel de la littérature française. Édition illustrée.", "The timeless classic of French literature. Illustrated edition.", 7.50m, null, "Gallimard", "LIV-PP", 150, false, true, false, false,
                V(188, "Poche", "Pocket", "Poche", 0m, 150), V(189, "Illustré", "Illustrated", "Illustré", 12m, 60)),
            P(93, 10, "One Piece Tome 107 – Eiichiro Oda", "One Piece Volume 107 - Eiichiro Oda", "Dernier tome de la saga manga culte One Piece par Eiichiro Oda.", "Latest volume of the cult manga saga One Piece by Eiichiro Oda.", 7.20m, null, "Glénat", "LIV-OP107", 80, true, true, false, false,
                V(190, "Standard", "Standard", "Standard", 0m, 80)),
            P(94, 10, "Naruto Intégrale Coffret 1", "Naruto Complete Box Set 1", "Coffret intégrale des tomes 1 à 27 de Naruto en édition collector.", "Complete box set of Naruto volumes 1-27 in collector edition.", 149.99m, 129.99m, "Kana", "LIV-NARUCF1", 20, false, false, false, true,
                V(191, "Standard", "Standard", "Standard", 0m, 20)),
            P(95, 10, "L'Anomalie – Hervé Le Tellier (Goncourt 2020)", "The Anomaly - Herve Le Tellier (Goncourt 2020)", "Roman Prix Goncourt 2020. Un vol Paris-New York confronté à l'impossible.", "Goncourt Prize 2020 novel. A Paris-New York flight confronted with the impossible.", 8.90m, null, "Folio", "LIV-ANOMALIE", 60, false, false, false, false,
                V(192, "Poche", "Pocket", "Poche", 0m, 60)),
            P(96, 10, "Sapiens – Yuval Noah Harari", "Sapiens - Yuval Noah Harari", "L'histoire de l'humanité des origines à nos jours. Best-seller mondial.", "The history of humankind from origins to present day. Worldwide best-seller.", 12.90m, 9.90m, "Albin Michel", "LIV-SAPIENS", 70, false, true, false, true,
                V(193, "Poche", "Pocket", "Poche", 0m, 70), V(194, "Grand format", "Hardcover", "Grand", 12m, 30)),
            P(97, 10, "Astérix Tome 40 – L'Iris blanc", "Asterix Volume 40 - The White Iris", "Dernière aventure d'Astérix et Obélix par Fabcaro.", "Latest adventure of Asterix and Obelix by Fabcaro.", 10.50m, null, "Albert René", "LIV-AST40", 45, true, true, false, false,
                V(195, "Standard", "Standard", "Standard", 0m, 45)),
            P(98, 10, "Devenir – Michelle Obama", "Becoming - Michelle Obama", "L'autobiographie de l'ancienne Première dame des États-Unis.", "The autobiography of the former First Lady of the United States.", 8.90m, 6.90m, "Le Livre de Poche", "LIV-DEVENIR", 55, false, false, false, true,
                V(196, "Poche", "Pocket", "Poche", 0m, 55), V(197, "Grand format", "Hardcover", "Grand", 15m, 20)),
            P(99, 10, "Jujutsu Kaisen Tome 25", "Jujutsu Kaisen Volume 25", "Dernier tome du manga phénomène Jujutsu Kaisen.", "Latest volume of the phenomenon manga Jujutsu Kaisen.", 7.20m, null, "Ki-oon", "LIV-JJK25", 65, true, false, false, false,
                V(198, "Standard", "Standard", "Standard", 0m, 65)),
            P(100, 10, "Le Guide du Routard France 2024", "Lonely Planet France 2024", "Guide de voyage complet avec itinéraires, bonnes adresses et carte détachable.", "Complete travel guide with itineraries, top picks and detachable map.", 16.95m, 14.95m, "Hachette", "LIV-ROUTFR24", 35, false, false, true, true,
                V(199, "Standard", "Standard", "Standard", 0m, 35))
        };

        // Set related product IDs
        foreach (var p in products)
        {
            p.RelatedProductIds = DataSeeder.GetRelatedIds(p.Id, products.Count);
            p.Tags = GenerateTags(p);
        }

        return products;
    }

    private static Product P(int id, int catId, string name, string nameEn, string desc, string descEn,
        decimal price, decimal? promo, string brand, string sku, int stock,
        bool isNew, bool isBestSeller, bool isFeatured, bool isPromo,
        params ProductVariant[] variants)
    {
        return new Product
        {
            Id = id, CategoryId = catId, Name = name, NameEn = nameEn,
            Description = desc, DescriptionEn = descEn, Price = price, PromoPrice = promo,
            Brand = brand, Sku = sku, Stock = stock,
            IsNew = isNew, IsBestSeller = isBestSeller, IsFeatured = isFeatured, IsPromo = isPromo,
            Variants = variants.ToList(),
            CreatedAt = DataSeeder.RandomRecentDate(),
            SiteType = SiteType.Electronics
        };
    }

    private static ProductVariant V(int id, string name, string nameEn, string value, decimal adj, int stock)
        => new() { Id = id, Name = name, NameEn = nameEn, Value = value, PriceAdjustment = adj, Stock = stock };

    private static List<string> GenerateTags(Product p)
    {
        var tags = new List<string> { p.Brand };
        if (p.IsNew) tags.Add("Nouveauté");
        if (p.IsPromo) tags.Add("Promo");
        if (p.IsBestSeller) tags.Add("Best-seller");
        return tags;
    }
}
