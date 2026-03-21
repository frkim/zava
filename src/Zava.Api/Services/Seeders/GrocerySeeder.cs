namespace Zava.Api.Services;

using Zava.Api.Models;

public static class GrocerySeeder
{
    public static List<Category> GenerateCategories()
    {
        return new List<Category>
        {
            new() { Id = 1, Name = "Fruits & Légumes", NameEn = "Fruits & Vegetables", Description = "Fruits frais, légumes de saison et salades", DescriptionEn = "Fresh fruits, seasonal vegetables and salads", ProductCount = 10, SiteType = SiteType.Grocery, Icon = "Apple" },
            new() { Id = 2, Name = "Produits Laitiers", NameEn = "Dairy", Description = "Lait, yaourts, fromages et beurre", DescriptionEn = "Milk, yogurts, cheeses and butter", ProductCount = 10, SiteType = SiteType.Grocery, Icon = "EggAlt" },
            new() { Id = 3, Name = "Boulangerie & Pâtisserie", NameEn = "Bakery & Pastry", Description = "Pains, viennoiseries et pâtisseries", DescriptionEn = "Breads, pastries and cakes", ProductCount = 10, SiteType = SiteType.Grocery, Icon = "BakeryDining" },
            new() { Id = 4, Name = "Viandes & Charcuterie", NameEn = "Meat & Deli", Description = "Bœuf, volaille, porc et charcuterie", DescriptionEn = "Beef, poultry, pork and deli meats", ProductCount = 10, SiteType = SiteType.Grocery, Icon = "LunchDining" },
            new() { Id = 5, Name = "Poissonnerie", NameEn = "Seafood", Description = "Poissons frais, crustacés et sushi", DescriptionEn = "Fresh fish, shellfish and sushi", ProductCount = 10, SiteType = SiteType.Grocery, Icon = "SetMeal" },
            new() { Id = 6, Name = "Épicerie Salée", NameEn = "Savory Grocery", Description = "Pâtes, riz, conserves et sauces", DescriptionEn = "Pasta, rice, canned goods and sauces", ProductCount = 10, SiteType = SiteType.Grocery, Icon = "RiceBowl" },
            new() { Id = 7, Name = "Épicerie Sucrée", NameEn = "Sweet Grocery", Description = "Biscuits, chocolat, céréales et confitures", DescriptionEn = "Cookies, chocolate, cereals and jams", ProductCount = 10, SiteType = SiteType.Grocery, Icon = "Cookie" },
            new() { Id = 8, Name = "Boissons", NameEn = "Beverages", Description = "Eaux, jus, sodas et boissons chaudes", DescriptionEn = "Water, juices, sodas and hot drinks", ProductCount = 10, SiteType = SiteType.Grocery, Icon = "LocalDrink" },
            new() { Id = 9, Name = "Surgelés", NameEn = "Frozen Foods", Description = "Plats cuisinés, glaces et légumes surgelés", DescriptionEn = "Ready meals, ice cream and frozen vegetables", ProductCount = 10, SiteType = SiteType.Grocery, Icon = "AcUnit" },
            new() { Id = 10, Name = "Bio & Bien-être", NameEn = "Organic & Wellness", Description = "Produits bio, sans gluten et compléments alimentaires", DescriptionEn = "Organic, gluten-free products and food supplements", ProductCount = 10, SiteType = SiteType.Grocery, Icon = "Eco" }
        };
    }

    public static List<Product> GenerateProducts()
    {
        var products = new List<Product>
        {
            // Cat 1: Fruits & Légumes
            P(1, 1, "Pommes Gala Bio 1kg", "Organic Gala Apples 1kg", "Pommes Gala croquantes issues de l'agriculture biologique.", "Crunchy organic Gala apples.", 3.49m, 2.99m, "Vergers de France", "VDF-GALA1K", 100, false, true, true, true, V(1, "1kg", "1kg", "1kg", 0m, 100)),
            P(2, 1, "Bananes 1kg", "Bananas 1kg", "Bananes jaunes mûres à point, origine Côte d'Ivoire.", "Ripe yellow bananas from Ivory Coast.", 1.89m, null, "Cavendish", "CAV-BAN1K", 150, false, true, false, false, V(2, "1kg", "1kg", "1kg", 0m, 150)),
            P(3, 1, "Tomates grappe 1kg", "Vine Tomatoes 1kg", "Tomates rouges sur grappe cultivées sous serre en France.", "Red vine tomatoes greenhouse-grown in France.", 2.99m, 2.49m, "Savéol", "SAV-TGRA1K", 80, false, false, false, true, V(3, "1kg", "1kg", "1kg", 0m, 80)),
            P(4, 1, "Salade laitue iceberg", "Iceberg Lettuce", "Laitue iceberg croquante fraîche du jour.", "Fresh crispy iceberg lettuce, daily harvest.", 1.29m, null, "Florette", "FLO-ICE", 60, false, false, false, false, V(4, "Pièce", "Unit", "Pièce", 0m, 60)),
            P(5, 1, "Avocat Hass mûr lot de 2", "Ripe Hass Avocado 2-Pack", "Avocats Hass mûrs à point, prêts à consommer.", "Ready-to-eat ripe Hass avocados.", 2.99m, 2.49m, "Peru", "PER-AVO2", 70, true, false, false, true, V(5, "Lot de 2", "2-Pack", "x2", 0m, 70)),
            P(6, 1, "Carottes France 1kg", "French Carrots 1kg", "Carottes lavées de catégorie I, origine France.", "Category I washed carrots, French origin.", 1.49m, null, "Primeurs France", "PRI-CAR1K", 90, false, false, false, false, V(6, "1kg", "1kg", "1kg", 0m, 90)),
            P(7, 1, "Fraises Gariguette barquette 250g", "Gariguette Strawberries 250g", "Fraises françaises parfumées de variété Gariguette.", "Fragrant French Gariguette strawberries.", 3.99m, null, "France", "FRA-GARIG", 40, true, true, false, false, V(7, "250g", "250g", "250g", 0m, 40)),
            P(8, 1, "Pommes de terre Agata 2.5kg", "Agata Potatoes 2.5kg", "Pommes de terre chair ferme idéales pour rissolées.", "Firm-flesh potatoes ideal for sautéing.", 2.99m, 2.49m, "La Ferme France", "LFF-PDT25", 60, false, false, true, true, V(8, "2.5kg", "2.5kg", "2.5kg", 0m, 60)),
            P(9, 1, "Citrons jaunes Bio lot de 4", "Organic Yellow Lemons 4-Pack", "Citrons biologiques non traités après récolte.", "Organic lemons untreated after harvest.", 2.49m, null, "Bio Provence", "BIO-CIT4", 55, false, false, false, false, V(9, "Lot de 4", "4-Pack", "x4", 0m, 55)),
            P(10, 1, "Champignons de Paris 500g", "Button Mushrooms 500g", "Champignons blancs frais de culture française.", "Fresh white mushrooms from French cultivation.", 1.99m, 1.59m, "Bonduelle", "BON-CHAMP", 70, false, false, false, true, V(10, "500g", "500g", "500g", 0m, 70)),

            // Cat 2: Produits Laitiers
            P(11, 2, "Lait demi-écrémé Bio 1L", "Organic Semi-Skimmed Milk 1L", "Lait demi-écrémé UHT biologique français.", "French organic UHT semi-skimmed milk.", 1.29m, null, "Lactel Bio", "LAC-BIO1L", 120, false, true, false, false, V(11, "1L", "1L", "1L", 0m, 120), V(12, "Lot de 6", "6-Pack", "x6", 5m, 40)),
            P(12, 2, "Yaourts nature Danone x12", "Danone Plain Yogurt 12-Pack", "Yaourts nature au lait entier, texture onctueuse.", "Whole milk plain yogurts, smooth texture.", 3.29m, 2.79m, "Danone", "DAN-NAT12", 80, false, true, true, true, V(13, "x12", "x12", "x12", 0m, 80)),
            P(13, 2, "Camembert Président", "President Camembert", "Camembert au lait pasteurisé moulé à la louche.", "Pasteurized milk Camembert, ladle-moulded.", 2.59m, null, "Président", "PRE-CAME", 50, false, false, false, false, V(14, "250g", "250g", "250g", 0m, 50)),
            P(14, 2, "Comté AOP 12 mois 200g", "AOP Comte 12 Months 200g", "Comté affiné 12 mois au lait cru du Jura.", "12-month aged Comté from Jura raw milk.", 5.99m, 4.99m, "Juraflore", "JUR-COM12", 35, false, false, false, true, V(15, "200g", "200g", "200g", 0m, 35)),
            P(15, 2, "Beurre doux Président 250g", "President Unsalted Butter 250g", "Beurre extra-fin doux gastronomique.", "Extra-fine unsalted gourmet butter.", 2.29m, null, "Président", "PRE-BEUR", 70, false, true, false, false, V(16, "250g", "250g", "250g", 0m, 70)),
            P(16, 2, "Crème fraîche épaisse 30cl", "Thick Cream 30cl", "Crème fraîche épaisse entière 30% MG.", "Whole thick cream 30% fat.", 1.89m, 1.49m, "Elle & Vire", "EV-CREME30", 60, false, false, false, true, V(17, "30cl", "30cl", "30cl", 0m, 60)),
            P(17, 2, "Mozzarella Di Bufala 125g", "Buffalo Mozzarella 125g", "Mozzarella au lait de bufflonne AOP Campanie.", "AOP Campania buffalo milk mozzarella.", 3.49m, null, "Galbani", "GAL-MDBUF", 40, true, false, false, false, V(18, "125g", "125g", "125g", 0m, 40)),
            P(18, 2, "Fromage râpé emmental 200g", "Grated Emmental 200g", "Emmental français râpé pour gratins et plats chauds.", "French grated emmental for gratins and hot dishes.", 1.99m, 1.59m, "Entremont", "ENT-RAPE200", 80, false, false, true, true, V(19, "200g", "200g", "200g", 0m, 80)),
            P(19, 2, "Skyr nature Siggi's 450g", "Siggi's Plain Skyr 450g", "Skyr islandais riche en protéines, 0% MG.", "Icelandic skyr rich in protein, 0% fat.", 3.99m, null, "Siggi's", "SIG-SKYR", 30, true, false, false, false, V(20, "450g", "450g", "450g", 0m, 30)),
            P(20, 2, "Petit suisse Gervais x6", "Gervais Petit Suisse 6-Pack", "Petits suisses au lait entier nature pour enfants.", "Whole milk plain petit suisse for children.", 1.99m, 1.69m, "Gervais", "GER-PS6", 55, false, false, false, true, V(21, "x6", "x6", "x6", 0m, 55)),

            // Cat 3: Boulangerie & Pâtisserie
            P(21, 3, "Baguette tradition française", "Traditional French Baguette", "Baguette de tradition française sur levain, croûte dorée.", "Traditional French sourdough baguette, golden crust.", 1.29m, null, "Artisan", "ART-BAG", 100, false, true, false, false, V(22, "Pièce", "Unit", "Pièce", 0m, 100)),
            P(22, 3, "Croissants pur beurre x6", "All-Butter Croissants 6-Pack", "Croissants feuilletés au beurre AOP Charentes-Poitou.", "Flaky croissants with AOP Charentes-Poitou butter.", 3.49m, 2.99m, "La Fournée Dorée", "LFD-CROIS6", 50, false, true, true, true, V(23, "x6", "x6", "x6", 0m, 50)),
            P(23, 3, "Pain de mie complet 500g", "Whole Wheat Sliced Bread 500g", "Pain de mie moelleux aux céréales complètes.", "Soft whole grain sliced bread.", 2.29m, null, "Harry's", "HAR-PDM500", 60, false, false, false, false, V(24, "500g", "500g", "500g", 0m, 60)),
            P(24, 3, "Pains au chocolat x8", "Chocolate Croissants 8-Pack", "Pains au chocolat pur beurre avec chocolat noir.", "All-butter chocolate croissants with dark chocolate.", 3.99m, 3.49m, "La Fournée Dorée", "LFD-PAC8", 45, false, false, false, true, V(25, "x8", "x8", "x8", 0m, 45)),
            P(25, 3, "Brioche tranchée 400g", "Sliced Brioche 400g", "Brioche moelleuse tranchée au beurre frais.", "Soft sliced brioche with fresh butter.", 2.99m, null, "Pasquier", "PAS-BRIO", 55, true, false, false, false, V(26, "400g", "400g", "400g", 0m, 55)),
            P(26, 3, "Tarte aux pommes 6 parts", "Apple Tart 6 Portions", "Tarte aux pommes pâte feuilletée avec compote.", "Puff pastry apple tart with compote.", 5.99m, 4.99m, "Marie", "MAR-TAP6", 25, false, false, true, true, V(27, "6 parts", "6 portions", "6P", 0m, 25)),
            P(27, 3, "Wraps nature lot de 6", "Plain Wraps 6-Pack", "Galettes souples de blé pour wraps et fajitas.", "Soft wheat tortillas for wraps and fajitas.", 2.49m, null, "Old El Paso", "OEP-WRAP6", 40, false, false, false, false, V(28, "x6", "x6", "x6", 0m, 40)),
            P(28, 3, "Cookies pépites chocolat x8", "Chocolate Chip Cookies 8-Pack", "Cookies moelleux aux grosses pépites de chocolat.", "Soft cookies with large chocolate chips.", 2.79m, 2.29m, "Michel et Augustin", "MEA-COOK8", 35, false, true, false, true, V(29, "x8", "x8", "x8", 0m, 35)),
            P(29, 3, "Crêpes fraîches x12", "Fresh Crêpes 12-Pack", "Crêpes de froment extra-fines prêtes à garnir.", "Extra-thin wheat crêpes ready to fill.", 2.99m, null, "Whaou!", "WHA-CREP12", 40, false, false, false, false, V(30, "x12", "x12", "x12", 0m, 40)),
            P(30, 3, "Galette des rois frangipane", "Frangipane King Cake", "Galette feuilletée à la crème d'amande avec fève.", "Puff pastry cake with almond cream and charm.", 12.90m, null, "Artisan", "ART-GALDR", 15, true, false, false, false, V(31, "6 parts", "6 portions", "6P", 0m, 15)),

            // Cat 4: Viandes & Charcuterie
            P(31, 4, "Steak haché 5% MG x4", "Lean Ground Beef Patties 5% Fat 4-Pack", "Steaks hachés pur bœuf français 5% matière grasse.", "French pure beef patties 5% fat.", 5.99m, 4.99m, "Charal", "CHA-SH5X4", 40, false, true, true, true, V(32, "x4", "x4", "x4", 0m, 40)),
            P(32, 4, "Filets de poulet fermier x2", "Free-Range Chicken Breast x2", "Filets de poulet fermier Label Rouge élevé en plein air.", "Label Rouge free-range outdoor chicken breasts.", 7.99m, null, "Loué", "LOU-FILET2", 30, false, true, false, false, V(33, "x2 (~400g)", "x2 (~400g)", "x2", 0m, 30)),
            P(33, 4, "Jambon blanc Le Bon Paris x6", "Le Bon Paris Ham 6 Slices", "Jambon cuit supérieur sans couenne ni cartilage.", "Superior cooked ham without rind or cartilage.", 3.99m, 3.29m, "Herta", "HER-JBP6", 55, false, false, true, true, V(34, "x6 tranches", "x6 slices", "x6", 0m, 55)),
            P(34, 4, "Saucisses de Toulouse x4", "Toulouse Sausages 4-Pack", "Saucisses de porc à la recette traditionnelle.", "Pork sausages with traditional recipe.", 4.99m, null, "Bigard", "BIG-STOUL4", 35, false, false, false, false, V(35, "x4", "x4", "x4", 0m, 35)),
            P(35, 4, "Rôti de bœuf 1kg", "Beef Roast 1kg", "Rôti de bœuf français catégorie race à viande.", "French beef roast, meat breed category.", 16.90m, 14.90m, "Charal", "CHA-ROTI1K", 15, false, false, false, true, V(36, "~1kg", "~1kg", "1kg", 0m, 15)),
            P(36, 4, "Lardons fumés 150g x2", "Smoked Bacon Lardons 150g 2-Pack", "Lardons fumés au bois de hêtre, sans antibiotiques.", "Beechwood-smoked bacon lardons, antibiotic-free.", 2.99m, null, "Herta", "HER-LARD2", 60, false, false, false, false, V(37, "2x150g", "2x150g", "2x150g", 0m, 60)),
            P(37, 4, "Merguez x6", "Merguez Sausages 6-Pack", "Merguez bœuf et agneau au piment doux.", "Beef and lamb merguez with mild chili.", 4.49m, 3.79m, "Socopa", "SOC-MERG6", 40, true, false, false, true, V(38, "x6", "x6", "x6", 0m, 40)),
            P(38, 4, "Coppa italienne 100g", "Italian Coppa 100g", "Coppa séchée et affinée à l'italienne.", "Italian-style dried and aged coppa.", 3.49m, null, "Casa Azzurra", "CAZ-COPPA", 30, false, false, false, false, V(39, "100g", "100g", "100g", 0m, 30)),
            P(39, 4, "Escalopes de dinde x2", "Turkey Cutlets 2-Pack", "Escalopes de dinde française maigres.", "Lean French turkey cutlets.", 5.49m, 4.79m, "Le Gaulois", "LGA-ESDX2", 35, false, true, false, true, V(40, "x2 (~300g)", "x2 (~300g)", "x2", 0m, 35)),
            P(40, 4, "Pâté de campagne 200g", "Country Pâté 200g", "Pâté de campagne breton au poivre vert.", "Breton country pâté with green pepper.", 2.99m, null, "Hénaff", "HEN-PATC", 40, false, false, false, false, V(41, "200g", "200g", "200g", 0m, 40)),

            // Cat 5: Poissonnerie
            P(41, 5, "Filets de saumon frais x2", "Fresh Salmon Fillets x2", "Filets de saumon Atlantique frais, élevage Norvège Label Rouge.", "Fresh Atlantic salmon fillets, Label Rouge Norwegian farming.", 9.99m, 8.49m, "Labeyrie", "LAB-SAUM2", 25, true, true, false, true, V(42, "x2 (~300g)", "x2 (~300g)", "x2", 0m, 25)),
            P(42, 5, "Crevettes roses cuites 300g", "Cooked Pink Shrimps 300g", "Crevettes roses décortiquées cuites prêtes à déguster.", "Peeled cooked pink shrimps ready to eat.", 6.99m, null, "Delpierre", "DEL-CREV300", 30, false, true, false, false, V(43, "300g", "300g", "300g", 0m, 30)),
            P(43, 5, "Dos de cabillaud frais x2", "Fresh Cod Loin x2", "Dos de cabillaud pêché en Atlantique Nord-Est.", "Cod loin caught in North-East Atlantic.", 8.99m, 7.49m, "Pêche Océan", "PO-CAB2", 20, false, false, false, true, V(44, "x2 (~350g)", "x2 (~350g)", "x2", 0m, 20)),
            P(44, 5, "Saumon fumé Labeyrie 4 tranches", "Labeyrie Smoked Salmon 4 Slices", "Saumon fumé au bois de hêtre, tranché main.", "Beechwood-smoked salmon, hand-sliced.", 7.49m, null, "Labeyrie", "LAB-SFUME4", 35, false, false, false, false, V(45, "4 tranches", "4 slices", "x4", 0m, 35)),
            P(45, 5, "Moules de bouchot AOP 1kg", "AOP Bouchot Mussels 1kg", "Moules de bouchot de la Baie du Mont-Saint-Michel.", "Bouchot mussels from Mont-Saint-Michel Bay.", 4.99m, 3.99m, "Le Vivier", "LV-MOULE1K", 25, false, false, true, true, V(46, "1kg", "1kg", "1kg", 0m, 25)),
            P(46, 5, "Thon albacore steak x2", "Albacore Tuna Steak x2", "Steaks de thon frais pêche responsable MSC.", "Fresh MSC-certified responsibly fished tuna steaks.", 10.99m, null, "Pêche Océan", "PO-THON2", 15, true, false, false, false, V(47, "x2 (~280g)", "x2 (~280g)", "x2", 0m, 15)),
            P(47, 5, "Huîtres creuses n°3 douzaine", "No.3 Cupped Oysters Dozen", "Huîtres creuses de Marennes-Oléron fine de claire.", "Marennes-Oléron fine de claire cupped oysters.", 12.90m, null, "Gillardeau", "GIL-HUIT12", 18, false, true, false, false, V(48, "Douzaine", "Dozen", "x12", 0m, 18)),
            P(48, 5, "Filets de truite fumée 120g", "Smoked Trout Fillets 120g", "Filets de truite fumée de source française.", "French spring water smoked trout fillets.", 4.99m, 3.99m, "Ovive", "OVI-TRUFU", 28, false, false, false, true, V(49, "120g", "120g", "120g", 0m, 28)),
            P(49, 5, "Plateau sushi 14 pièces", "Sushi Platter 14 Pieces", "Assortiment sushi et maki : saumon, thon, crevette.", "Sushi and maki assortment: salmon, tuna, shrimp.", 10.99m, null, "Sushi Shop", "SS-PLAT14", 20, false, false, false, false, V(50, "14 pièces", "14 pieces", "14P", 0m, 20)),
            P(50, 5, "Tarama artisanal 150g", "Artisanal Taramasalata 150g", "Tarama fait maison aux œufs de cabillaud fumés.", "Homemade tarama with smoked cod roe.", 3.99m, 3.29m, "Blini", "BLI-TARA150", 30, false, false, false, true, V(51, "150g", "150g", "150g", 0m, 30)),

            // Cat 6: Épicerie Salée
            P(51, 6, "Pâtes Barilla Spaghetti 500g", "Barilla Spaghetti 500g", "Spaghetti n°5 de blé dur, cuisson 8 minutes.", "No.5 durum wheat spaghetti, 8-minute cooking.", 1.29m, 0.99m, "Barilla", "BAR-SPAG500", 100, false, true, true, true, V(52, "500g", "500g", "500g", 0m, 100)),
            P(52, 6, "Riz basmati Taureau Ailé 1kg", "Taureau Aile Basmati Rice 1kg", "Riz basmati long grain parfumé.", "Fragrant long grain basmati rice.", 2.69m, null, "Taureau Ailé", "TA-BAS1K", 70, false, true, false, false, V(53, "1kg", "1kg", "1kg", 0m, 70)),
            P(53, 6, "Sauce tomate Mutti Passata 700ml", "Mutti Passata Tomato Sauce 700ml", "Purée de tomates 100% italiennes.", "100% Italian tomato purée.", 2.49m, 1.99m, "Mutti", "MUT-PASS700", 50, false, false, false, true, V(54, "700ml", "700ml", "700ml", 0m, 50)),
            P(54, 6, "Huile d'olive extra vierge Puget 75cl", "Puget Extra Virgin Olive Oil 75cl", "Huile d'olive vierge extra de première pression à froid.", "First cold-pressed extra virgin olive oil.", 6.99m, null, "Puget", "PUG-HVEX75", 40, false, false, false, false, V(55, "75cl", "75cl", "75cl", 0m, 40)),
            P(55, 6, "Lentilles vertes du Puy AOP 500g", "AOP Green Lentils du Puy 500g", "Lentilles vertes AOP à la peau fine et texture fondante.", "AOP green lentils with thin skin and melting texture.", 3.49m, 2.99m, "Sabarot", "SAB-LENT500", 35, true, false, false, true, V(56, "500g", "500g", "500g", 0m, 35)),
            P(56, 6, "Thon en boîte au naturel 3x80g", "Natural Canned Tuna 3x80g", "Thon albacore au naturel pêche responsable.", "Responsibly fished natural albacore tuna.", 3.99m, null, "Petit Navire", "PN-THON380", 60, false, false, false, false, V(57, "3x80g", "3x80g", "3x80g", 0m, 60)),
            P(57, 6, "Moutarde de Dijon 350g", "Dijon Mustard 350g", "Moutarde forte de Dijon à l'ancienne.", "Strong old-fashioned Dijon mustard.", 1.99m, 1.49m, "Maille", "MAI-MOUST", 50, false, true, false, true, V(58, "350g", "350g", "350g", 0m, 50)),
            P(58, 6, "Sel de Guérande gros 1kg", "Guerande Coarse Salt 1kg", "Gros sel marin naturel de Guérande.", "Natural coarse sea salt from Guérande.", 2.29m, null, "Le Guérandais", "LGU-SEL1K", 45, false, false, false, false, V(59, "1kg", "1kg", "1kg", 0m, 45)),
            P(59, 6, "Vinaigre balsamique de Modène 50cl", "Balsamic Vinegar of Modena 50cl", "Vinaigre balsamique IGP de Modène vieilli en fûts.", "IGP balsamic vinegar of Modena aged in barrels.", 3.99m, 3.29m, "Mazzetti", "MAZ-VIN50", 30, false, false, false, true, V(60, "50cl", "50cl", "50cl", 0m, 30)),
            P(60, 6, "Pesto alla Genovese Barilla 190g", "Barilla Genovese Pesto 190g", "Pesto basilic genovese au parmesan et pignons.", "Genovese basil pesto with parmesan and pine nuts.", 2.49m, null, "Barilla", "BAR-PEST190", 40, true, false, false, false, V(61, "190g", "190g", "190g", 0m, 40)),

            // Cat 7: Épicerie Sucrée
            P(61, 7, "Nutella 750g", "Nutella 750g", "Pâte à tartiner aux noisettes et au cacao.", "Hazelnut and cocoa spread.", 4.99m, 3.99m, "Ferrero", "FER-NUT750", 80, false, true, true, true, V(62, "750g", "750g", "750g", 0m, 80)),
            P(62, 7, "Tablette chocolat noir 70% Lindt 100g", "Lindt 70% Dark Chocolate Bar 100g", "Chocolat noir extra-fin 70% cacao Lindt Excellence.", "Extra-fine 70% cocoa dark chocolate Lindt Excellence.", 2.99m, null, "Lindt", "LIN-N70100", 50, false, true, false, false, V(63, "100g", "100g", "100g", 0m, 50)),
            P(63, 7, "Céréales Lion Nestlé 480g", "Nestle Lion Cereals 480g", "Céréales caramel et chocolat croustillantes.", "Crunchy caramel and chocolate cereals.", 3.49m, 2.99m, "Nestlé", "NES-LION480", 45, false, false, false, true, V(64, "480g", "480g", "480g", 0m, 45)),
            P(64, 7, "Confiture fraises Bonne Maman 370g", "Bonne Maman Strawberry Jam 370g", "Confiture extra de fraises avec morceaux de fruits.", "Extra strawberry jam with fruit pieces.", 2.99m, null, "Bonne Maman", "BM-CF370", 55, false, false, false, false, V(65, "370g", "370g", "370g", 0m, 55)),
            P(65, 7, "Biscuits Petit Beurre LU x36", "LU Petit Beurre Biscuits x36", "Biscuits sablés au beurre, recette traditionnelle.", "Traditional recipe butter shortbread biscuits.", 1.99m, 1.49m, "LU", "LU-PB36", 70, false, false, true, true, V(66, "x36", "x36", "x36", 0m, 70)),
            P(66, 7, "Miel de fleurs Bio 375g", "Organic Flower Honey 375g", "Miel multi-fleurs biologique français.", "French organic multi-flower honey.", 5.99m, null, "Lune de Miel", "LDM-BIO375", 30, true, false, false, false, V(67, "375g", "375g", "375g", 0m, 30)),
            P(67, 7, "Galettes de riz complet Bio x15", "Organic Brown Rice Cakes x15", "Galettes de riz soufflé complet légères et croustillantes.", "Light and crispy puffed brown rice cakes.", 1.79m, 1.29m, "Bjorg", "BJO-GALRIZ", 60, false, false, false, true, V(68, "x15", "x15", "x15", 0m, 60)),
            P(68, 7, "Madeleines Saint-Michel x12", "Saint-Michel Madeleines x12", "Madeleines moelleuses au beurre frais, recette originale.", "Soft fresh butter madeleines, original recipe.", 2.49m, null, "Saint-Michel", "SM-MAD12", 45, false, true, false, false, V(69, "x12", "x12", "x12", 0m, 45)),
            P(69, 7, "Pâte à tartiner noisette maison 200g", "Homemade Hazelnut Spread 200g", "Pâte à tartiner artisanale 55% noisettes du Piémont.", "Artisanal spread with 55% Piedmont hazelnuts.", 6.99m, 5.99m, "Nocciolata", "NOC-PAT200", 25, true, false, false, true, V(70, "200g", "200g", "200g", 0m, 25)),
            P(70, 7, "Compote pomme-banane gourde x4", "Apple-Banana Pouch Compote x4", "Compotes sans sucres ajoutés en gourdes pour enfants.", "No added sugar pouch compotes for kids.", 2.49m, null, "Pom'Potes", "POM-GOUR4", 50, false, false, false, false, V(71, "x4", "x4", "x4", 0m, 50)),

            // Cat 8: Boissons
            P(71, 8, "Eau minérale Evian 6x1.5L", "Evian Mineral Water 6x1.5L", "Eau minérale naturelle des Alpes, pack de 6.", "Natural Alpine mineral water, 6-pack.", 3.49m, 2.99m, "Evian", "EVI-6X15", 80, false, true, true, true, V(72, "6x1.5L", "6x1.5L", "6x1.5L", 0m, 80)),
            P(72, 8, "Jus d'orange pressé Tropicana 1L", "Tropicana Fresh Orange Juice 1L", "Pur jus d'orange pressé avec pulpe.", "Pure fresh squeezed orange juice with pulp.", 3.29m, null, "Tropicana", "TRO-JOJ1L", 50, false, true, false, false, V(73, "1L", "1L", "1L", 0m, 50)),
            P(73, 8, "Coca-Cola Original 1.5L", "Coca-Cola Original 1.5L", "Soda cola original, recette inchangée depuis 1886.", "Original cola, unchanged recipe since 1886.", 1.99m, 1.49m, "Coca-Cola", "CC-ORIG15", 100, false, false, true, true, V(74, "1.5L", "1.5L", "1.5L", 0m, 100)),
            P(74, 8, "Café moulu Carte Noire 250g", "Carte Noire Ground Coffee 250g", "Café 100% arabica torréfié en France, mouture fine.", "100% arabica coffee roasted in France, fine grind.", 4.99m, null, "Carte Noire", "CN-MOULU250", 40, false, false, false, false, V(75, "250g", "250g", "250g", 0m, 40)),
            P(75, 8, "Thé vert Lipton Green Intense x25", "Lipton Green Intense Tea x25", "Thé vert intense en sachets pyramides.", "Intense green tea in pyramid sachets.", 2.99m, 2.49m, "Lipton", "LIP-GRINT25", 55, true, false, false, true, V(76, "x25", "x25", "x25", 0m, 55)),
            P(76, 8, "Perrier fines bulles 6x50cl", "Perrier Sparkling Water 6x50cl", "Eau gazeuse finement pétillante, source Vergèze.", "Finely sparkling water from Vergèze spring.", 3.49m, null, "Perrier", "PER-6X50", 45, false, false, false, false, V(77, "6x50cl", "6x50cl", "6x50cl", 0m, 45)),
            P(77, 8, "Oasis Tropical 2L", "Oasis Tropical 2L", "Boisson aux fruits tropicaux : mangue, goyave, passion.", "Tropical fruit drink: mango, guava, passion fruit.", 1.79m, 1.39m, "Oasis", "OAS-TROP2", 60, false, false, false, true, V(78, "2L", "2L", "2L", 0m, 60)),
            P(78, 8, "Capsules Nespresso Lungo x10", "Nespresso Lungo Capsules x10", "Capsules aluminium compatibles Nespresso, intensité 6.", "Nespresso-compatible aluminum capsules, intensity 6.", 4.90m, null, "Nespresso", "NES-LUNG10", 35, false, true, false, false, V(79, "x10", "x10", "x10", 0m, 35)),
            P(79, 8, "Lait d'amande Bio 1L", "Organic Almond Milk 1L", "Boisson végétale amande sans sucres ajoutés.", "Unsweetened organic almond plant-based drink.", 2.49m, 1.99m, "Bjorg", "BJO-LAMB1L", 40, true, false, false, true, V(80, "1L", "1L", "1L", 0m, 40)),
            P(80, 8, "Bière blonde 1664 pack 6x25cl", "1664 Lager Beer 6x25cl", "Bière blonde brassée avec houblon d'Alsace.", "Lager beer brewed with Alsatian hops.", 4.99m, null, "Kronenbourg", "KRO-1664-6", 50, false, false, false, false, V(81, "6x25cl", "6x25cl", "6x25cl", 0m, 50)),

            // Cat 9: Surgelés
            P(81, 9, "Pizza surgelée 4 fromages", "Frozen 4-Cheese Pizza", "Pizza pâte fine aux 4 fromages italiens.", "Thin-crust pizza with 4 Italian cheeses.", 3.49m, 2.99m, "Buitoni", "BUI-P4FR", 45, false, true, true, true, V(82, "Standard", "Standard", "Standard", 0m, 45)),
            P(82, 9, "Poêlée de légumes surgelée 750g", "Frozen Vegetable Stir-Fry 750g", "Mélange courgettes, poivrons, oignons prêt à poêler.", "Zucchini, pepper, onion mix ready to stir-fry.", 3.99m, null, "Picard", "PIC-POEL750", 35, false, false, false, false, V(83, "750g", "750g", "750g", 0m, 35)),
            P(83, 9, "Glace vanille Häagen-Dazs 460ml", "Haagen-Dazs Vanilla Ice Cream 460ml", "Crème glacée vanille de Madagascar premium.", "Premium Madagascar vanilla ice cream.", 5.99m, 4.99m, "Häagen-Dazs", "HD-VAN460", 28, false, true, false, true, V(84, "460ml", "460ml", "460ml", 0m, 28)),
            P(84, 9, "Frites allumettes surgelées 1kg", "Frozen Thin French Fries 1kg", "Frites tradition allumettes croustillantes au four.", "Traditional crispy oven-baked thin fries.", 2.49m, null, "McCain", "MCC-FRIT1K", 55, false, false, false, false, V(85, "1kg", "1kg", "1kg", 0m, 55)),
            P(85, 9, "Colin d'Alaska pané x4", "Breaded Alaska Pollock x4", "Filets de colin panés dorés et croustillants.", "Golden and crispy breaded pollock fillets.", 3.99m, 3.29m, "Findus", "FIN-COL4", 30, false, false, true, true, V(86, "x4", "x4", "x4", 0m, 30)),
            P(86, 9, "Magnum Classic x4", "Magnum Classic 4-Pack", "Bâtonnets glacés vanille enrobés chocolat au lait.", "Vanilla ice cream bars coated in milk chocolate.", 4.49m, null, "Magnum", "MAG-CLASS4", 40, true, true, false, false, V(87, "x4", "x4", "x4", 0m, 40)),
            P(87, 9, "Épinards hachés surgelés 1kg", "Frozen Chopped Spinach 1kg", "Épinards hachés en portions, pratiques et nutritifs.", "Chopped spinach in portions, convenient and nutritious.", 2.29m, 1.79m, "Bonduelle", "BON-EPIN1K", 45, false, false, false, true, V(88, "1kg", "1kg", "1kg", 0m, 45)),
            P(88, 9, "Plat cuisiné lasagnes bolognaise 900g", "Frozen Bolognese Lasagna 900g", "Lasagnes à la bolognaise gratinées prêtes en 10min.", "Gratin bolognese lasagna ready in 10 minutes.", 5.49m, null, "Marie", "MAR-LAS900", 25, false, false, false, false, V(89, "900g", "900g", "900g", 0m, 25)),
            P(89, 9, "Cordon bleu de dinde x4", "Turkey Cordon Bleu 4-Pack", "Cordons bleus de dinde au fromage fondant.", "Turkey cordon bleu with melting cheese.", 3.49m, 2.99m, "Le Gaulois", "LGA-CBD4", 35, false, false, false, true, V(90, "x4", "x4", "x4", 0m, 35)),
            P(90, 9, "Baguette précuite surgelée x2", "Frozen Pre-Baked Baguette x2", "Baguettes à four en 10 minutes, croûte croustillante.", "Oven-ready baguettes in 10 minutes, crispy crust.", 1.99m, null, "Picard", "PIC-BAG2", 40, false, false, false, false, V(91, "x2", "x2", "x2", 0m, 40)),

            // Cat 10: Bio & Bien-être
            P(91, 10, "Granola bio chocolat-noisettes 375g", "Organic Chocolate-Hazelnut Granola 375g", "Granola crunchy bio au chocolat noir et noisettes torréfiées.", "Organic crunchy granola with dark chocolate and roasted hazelnuts.", 4.99m, 3.99m, "Jordans", "JOR-GRANBIO", 35, true, true, true, true, V(92, "375g", "375g", "375g", 0m, 35)),
            P(92, 10, "Lait d'avoine bio 1L", "Organic Oat Milk 1L", "Boisson végétale avoine bio sans sucres ajoutés.", "Organic oat plant-based drink, no added sugars.", 2.29m, null, "Oatly", "OAT-BIO1L", 50, false, true, false, false, V(93, "1L", "1L", "1L", 0m, 50)),
            P(93, 10, "Pâtes complètes bio penne 500g", "Organic Whole Wheat Penne 500g", "Penne rigate blé dur complet biologique.", "Organic whole durum wheat penne rigate.", 1.99m, 1.49m, "Bjorg", "BJO-PENNE", 40, false, false, false, true, V(94, "500g", "500g", "500g", 0m, 40)),
            P(94, 10, "Tofu nature bio 400g", "Organic Natural Tofu 400g", "Tofu ferme au soja français issu de l'agriculture biologique.", "Firm tofu from organic French soybeans.", 2.99m, null, "Soy", "SOY-TOFU400", 30, false, false, false, false, V(95, "400g", "400g", "400g", 0m, 30)),
            P(95, 10, "Quinoa blanc bio 500g", "Organic White Quinoa 500g", "Quinoa royal de Bolivie issu du commerce équitable.", "Royal quinoa from Bolivia, fair trade certified.", 3.99m, 3.29m, "Bjorg", "BJO-QUIN500", 35, true, false, false, true, V(96, "500g", "500g", "500g", 0m, 35)),
            P(96, 10, "Spiruline bio comprimés x200", "Organic Spirulina Tablets x200", "Complément alimentaire spiruline bio riche en protéines.", "Organic spirulina food supplement rich in protein.", 12.90m, null, "Naturactive", "NAT-SPIR200", 25, false, false, false, false, V(97, "x200", "x200", "x200", 0m, 25)),
            P(97, 10, "Galettes de pois chiches bio x2", "Organic Chickpea Patties x2", "Galettes végétales pois chiches et légumes bio.", "Organic chickpea and vegetable plant-based patties.", 3.49m, 2.99m, "Garden Gourmet", "GG-GALPC2", 28, false, true, false, true, V(98, "x2", "x2", "x2", 0m, 28)),
            P(98, 10, "Beurre de cacahuètes bio 350g", "Organic Peanut Butter 350g", "Beurre de cacahuètes 100% arachides sans huile de palme.", "100% peanut butter without palm oil.", 4.49m, null, "Whole Earth", "WE-BC350", 30, false, false, false, false, V(99, "350g", "350g", "350g", 0m, 30)),
            P(99, 10, "Galettes de riz bio sans gluten x12", "Organic Gluten-Free Rice Cakes x12", "Galettes de riz soufflé certifiées sans gluten.", "Certified gluten-free puffed rice cakes.", 1.99m, 1.49m, "Bjorg", "BJO-GALSG12", 45, false, false, true, true, V(100, "x12", "x12", "x12", 0m, 45)),
            P(100, 10, "Chocolat noir 85% bio 100g", "Organic 85% Dark Chocolate 100g", "Tablette chocolat noir intense 85% cacao biologique.", "Organic intense 85% cocoa dark chocolate bar.", 2.99m, null, "Alter Eco", "ALT-N85100", 35, false, true, false, false, V(101, "100g", "100g", "100g", 0m, 35)),
        };

        foreach (var p in products)
        {
            p.SiteType = SiteType.Grocery;
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
            SiteType = SiteType.Grocery
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
