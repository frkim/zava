namespace Zava.Api.Services;

using Zava.Api.Models;

public static class AppliancesSeeder
{
    public static List<Category> GenerateCategories()
    {
        return new List<Category>
        {
            new() { Id = 1, Name = "Réfrigérateurs", NameEn = "Refrigerators", Description = "Réfrigérateurs, congélateurs et combinés", DescriptionEn = "Refrigerators, freezers and combis", ProductCount = 10, SiteType = SiteType.Appliances, Icon = "Kitchen" },
            new() { Id = 2, Name = "Lave-linge", NameEn = "Washing Machines", Description = "Lave-linge et sèche-linge", DescriptionEn = "Washing machines and dryers", ProductCount = 10, SiteType = SiteType.Appliances, Icon = "LocalLaundryService" },
            new() { Id = 3, Name = "Lave-vaisselle", NameEn = "Dishwashers", Description = "Lave-vaisselle encastrables et pose libre", DescriptionEn = "Built-in and freestanding dishwashers", ProductCount = 10, SiteType = SiteType.Appliances, Icon = "Countertops" },
            new() { Id = 4, Name = "Aspirateurs", NameEn = "Vacuum Cleaners", Description = "Aspirateurs traîneaux, balais et robots", DescriptionEn = "Canister, stick and robot vacuums", ProductCount = 10, SiteType = SiteType.Appliances, Icon = "CleaningServices" },
            new() { Id = 5, Name = "Fours & Cuisinières", NameEn = "Ovens & Cookers", Description = "Fours encastrables, cuisinières et plaques", DescriptionEn = "Built-in ovens, cookers and hobs", ProductCount = 10, SiteType = SiteType.Appliances, Icon = "Microwave" },
            new() { Id = 6, Name = "Micro-ondes", NameEn = "Microwaves", Description = "Micro-ondes, combinés et grill", DescriptionEn = "Microwaves, combis and grills", ProductCount = 10, SiteType = SiteType.Appliances, Icon = "Microwave" },
            new() { Id = 7, Name = "Cafetières & Expresso", NameEn = "Coffee Machines", Description = "Machines à café, expresso et capsules", DescriptionEn = "Coffee machines, espresso and capsules", ProductCount = 10, SiteType = SiteType.Appliances, Icon = "CoffeeMaker" },
            new() { Id = 8, Name = "Robots cuiseurs", NameEn = "Food Processors", Description = "Robots cuiseurs multifonctions et mixeurs", DescriptionEn = "Multi-function food processors and blenders", ProductCount = 10, SiteType = SiteType.Appliances, Icon = "Blender" },
            new() { Id = 9, Name = "Climatisation", NameEn = "Air Conditioning", Description = "Climatiseurs, ventilateurs et purificateurs", DescriptionEn = "Air conditioners, fans and purifiers", ProductCount = 10, SiteType = SiteType.Appliances, Icon = "AcUnit" },
            new() { Id = 10, Name = "Soin du linge", NameEn = "Laundry Care", Description = "Centrales vapeur, fers et défroisseurs", DescriptionEn = "Steam generators, irons and steamers", ProductCount = 10, SiteType = SiteType.Appliances, Icon = "Iron" }
        };
    }

    public static List<Product> GenerateProducts()
    {
        var products = new List<Product>
        {
            // Cat 1: Réfrigérateurs
            P(1, 1, "Samsung RB38C775CS9 Bespoke", "Samsung RB38C775CS9 Bespoke", "Réfrigérateur combiné 390L avec congélateur en bas, No Frost intégral et Wi-Fi.", "390L bottom-freezer combi with Total No Frost and Wi-Fi.", 899.99m, 799.99m, "Samsung", "SAM-RB38C", 15, true, true, false, true),
            P(2, 1, "Bosch KGN39AIAT Série 6", "Bosch KGN39AIAT Series 6", "Combiné réfrigérateur-congélateur 363L, VitaFresh et compresseur inverter.", "363L fridge-freezer combi, VitaFresh and inverter compressor.", 799.99m, null, "Bosch", "BOS-KGN39", 20, false, true, false, false),
            P(3, 1, "LG GBV3200DSW", "LG GBV3200DSW", "Réfrigérateur combiné 387L avec Linear Cooling et DoorCooling+.", "387L combi fridge with Linear Cooling and DoorCooling+.", 699.99m, 599.99m, "LG", "LG-GBV3200", 18, false, false, true, true),
            P(4, 1, "Whirlpool W7 931T MX H", "Whirlpool W7 931T MX H", "Réfrigérateur combiné 368L avec 6ème Sens et Total No Frost.", "368L combi fridge with 6th Sense and Total No Frost.", 649.99m, null, "Whirlpool", "WHP-W7931", 22, false, false, false, false),
            P(5, 1, "Liebherr CNsfd 5743", "Liebherr CNsfd 5743", "Combiné NoFrost 371L avec EasyFresh et SuperCool.", "371L NoFrost combi with EasyFresh and SuperCool.", 1099.99m, 949.99m, "Liebherr", "LIE-CNSFD5743", 10, true, false, false, true),
            P(6, 1, "Samsung RF65A967FS9 Family Hub", "Samsung RF65A967FS9 Family Hub", "Réfrigérateur américain 641L avec écran tactile Family Hub et distributeur d'eau.", "641L American fridge with Family Hub touchscreen and water dispenser.", 2499.99m, null, "Samsung", "SAM-RF65A", 8, true, false, false, false),
            P(7, 1, "Beko RCSE300K40SN", "Beko RCSE300K40SN", "Réfrigérateur combiné 291L économique classe A+.", "291L budget combi fridge A+ rated.", 399.99m, 349.99m, "Beko", "BEK-RCSE300", 35, false, false, true, true),
            P(8, 1, "Electrolux LNT7ME34G1", "Electrolux LNT7ME34G1", "Combiné TwinTech 360L avec CustomFlex et FreshMode.", "360L TwinTech combi with CustomFlex and FreshMode.", 899.99m, null, "Electrolux", "ELX-LNT7ME", 12, false, false, false, false),
            P(9, 1, "Haier HB20FPAAA", "Haier HB20FPAAA", "Réfrigérateur 4 portes 547L avec MyZone et ABT antibactérien.", "4-door 547L fridge with MyZone and ABT antibacterial.", 1199.99m, 999.99m, "Haier", "HAI-HB20F", 10, false, true, false, true),
            P(10, 1, "Miele KFN 4898 AD", "Miele KFN 4898 AD", "Combiné FreshAir 362L avec DailyFresh et NoFrost.", "362L FreshAir combi with DailyFresh and NoFrost.", 1599.99m, null, "Miele", "MIE-KFN4898", 6, false, false, false, false),

            // Cat 2: Lave-linge
            P(11, 2, "Bosch WQB245B0FF Série 8", "Bosch WQB245B0FF Series 8", "Sèche-linge pompe à chaleur 9kg avec SelfCleaning Condenser et AutoDry.", "9kg heat pump dryer with SelfCleaning Condenser and AutoDry.", 899.99m, 799.99m, "Bosch", "BOS-WQB245", 15, true, true, false, true),
            P(12, 2, "Samsung WW11BBA046AW", "Samsung WW11BBA046AW", "Lave-linge 11kg avec EcoBubble, Add Wash et moteur Digital Inverter.", "11kg washing machine with EcoBubble, Add Wash and Digital Inverter motor.", 699.99m, null, "Samsung", "SAM-WW11BBA", 20, false, true, false, false),
            P(13, 2, "Miele WSD 663 WCS", "Miele WSD 663 WCS", "Lave-linge 8kg avec TwinDos et système QuickPowerWash.", "8kg washing machine with TwinDos and QuickPowerWash system.", 1299.99m, 1099.99m, "Miele", "MIE-WSD663", 8, false, false, false, true),
            P(14, 2, "LG F94V35WHS", "LG F94V35WHS", "Lave-linge 9kg avec AI DD, vapeur et Wi-Fi connecté.", "9kg washing machine with AI DD, steam and Wi-Fi connected.", 599.99m, 499.99m, "LG", "LG-F94V35", 25, false, false, true, true),
            P(15, 2, "Electrolux EW7F3921RL PerfectCare", "Electrolux EW7F3921RL PerfectCare", "Lave-linge 9kg avec vapeur SteamCare et programme UltraWash.", "9kg washing machine with SteamCare steam and UltraWash program.", 549.99m, null, "Electrolux", "ELX-EW7F39", 18, false, false, false, false),
            P(16, 2, "Whirlpool FFDB 9469 BSV FR", "Whirlpool FFDB 9469 BSV FR", "Lave-linge 9kg avec FreshCare+ et moteur SenseInverter.", "9kg washing machine with FreshCare+ and SenseInverter motor.", 479.99m, 399.99m, "Whirlpool", "WHP-FFDB9469", 30, false, false, false, true),
            P(17, 2, "Beko WUE8736XST", "Beko WUE8736XST", "Lave-linge 8kg avec SteamCure et moteur ProSmart Inverter.", "8kg washing machine with SteamCure and ProSmart Inverter motor.", 399.99m, null, "Beko", "BEK-WUE8736", 35, false, false, false, false),
            P(18, 2, "Samsung WD90T534DBN Lavante-séchante", "Samsung WD90T534DBN Washer-dryer", "Lavante-séchante 9/6kg avec EcoBubble et AirWash.", "9/6kg washer-dryer with EcoBubble and AirWash.", 799.99m, 699.99m, "Samsung", "SAM-WD90T534", 12, true, false, false, true),
            P(19, 2, "Haier HW80-BP14636N", "Haier HW80-BP14636N", "Lave-linge 8kg avec I-Refresh vapeur et ABT antibactérien.", "8kg washing machine with I-Refresh steam and ABT antibacterial.", 449.99m, null, "Haier", "HAI-HW80", 22, false, false, false, false),
            P(20, 2, "Indesit BWE 91496X WK FR N", "Indesit BWE 91496X WK FR N", "Lave-linge 9kg Push & Wash avec programme rapide 30 min.", "9kg Push & Wash washing machine with 30-min quick program.", 349.99m, 299.99m, "Indesit", "IND-BWE914", 40, false, false, true, true),

            // Cat 3: Lave-vaisselle
            P(21, 3, "Bosch SMV6ZCX49E Série 6", "Bosch SMV6ZCX49E Series 6", "Lave-vaisselle tout intégrable 14 couverts avec PerfectDry Zeolith.", "14-place fully integrated dishwasher with PerfectDry Zeolith.", 799.99m, 699.99m, "Bosch", "BOS-SMV6ZC", 15, true, true, false, true),
            P(22, 3, "Miele G 7110 SC AutoDos", "Miele G 7110 SC AutoDos", "Lave-vaisselle 14 couverts avec dosage automatique AutoDos.", "14-place dishwasher with AutoDos automatic dispensing.", 1299.99m, null, "Miele", "MIE-G7110", 8, false, false, false, false),
            P(23, 3, "Samsung DW60A8060FS", "Samsung DW60A8060FS", "Lave-vaisselle 14 couverts avec Auto Relieve et Zone Flex.", "14-place dishwasher with Auto Relieve and Flex Zone.", 599.99m, 499.99m, "Samsung", "SAM-DW60A", 20, false, false, true, true),
            P(24, 3, "Siemens SN65ZX49CE", "Siemens SN65ZX49CE", "Lave-vaisselle encastrable 14 couverts avec varioSpeed Plus et Zeolith.", "14-place built-in dishwasher with varioSpeed Plus and Zeolith.", 899.99m, null, "Siemens", "SIE-SN65ZX", 12, true, false, false, false),
            P(25, 3, "Beko DEN48420WDOS", "Beko DEN48420WDOS", "Lave-vaisselle 14 couverts avec AutoDose et CornerIntense.", "14-place dishwasher with AutoDose and CornerIntense.", 449.99m, 379.99m, "Beko", "BEK-DEN484", 25, false, false, false, true),
            P(26, 3, "Whirlpool WFC 3C42 P", "Whirlpool WFC 3C42 P", "Lave-vaisselle pose libre 14 couverts avec PowerClean Pro.", "14-place freestanding dishwasher with PowerClean Pro.", 499.99m, null, "Whirlpool", "WHP-WFC3C42", 18, false, true, false, false),
            P(27, 3, "Electrolux EEM48320L GlassCare", "Electrolux EEM48320L GlassCare", "Lave-vaisselle 14 couverts avec GlassCare et SatelliteClean.", "14-place dishwasher with GlassCare and SatelliteClean.", 649.99m, 549.99m, "Electrolux", "ELX-EEM483", 16, false, false, false, true),
            P(28, 3, "LG DF455HMS", "LG DF455HMS", "Lave-vaisselle 14 couverts avec TrueSteam et moteur Inverter Direct Drive.", "14-place dishwasher with TrueSteam and Inverter Direct Drive motor.", 699.99m, null, "LG", "LG-DF455", 14, false, false, false, false),
            P(29, 3, "Hotpoint HFC 3T232 WG X", "Hotpoint HFC 3T232 WG X", "Lave-vaisselle pose libre 14 couverts avec 3ème panier.", "14-place freestanding dishwasher with 3rd basket.", 399.99m, 349.99m, "Hotpoint", "HOT-HFC3T", 28, false, false, true, true),
            P(30, 3, "Candy CF 5C7F0W", "Candy CF 5C7F0W", "Lave-vaisselle 15 couverts connecté Wi-Fi avec programme rapide 39 min.", "15-place Wi-Fi connected dishwasher with 39-min quick program.", 349.99m, null, "Candy", "CND-CF5C7", 30, false, false, false, false),

            // Cat 4: Aspirateurs
            P(31, 4, "Dyson V15 Detect Absolute", "Dyson V15 Detect Absolute", "Aspirateur balai sans fil avec laser de détection de poussière et écran LCD.", "Cordless stick vacuum with dust detection laser and LCD screen.", 699.99m, 599.99m, "Dyson", "DYS-V15DA", 20, true, true, true, true),
            P(32, 4, "iRobot Roomba j9+", "iRobot Roomba j9+", "Robot aspirateur avec vidange automatique, navigation PrecisionVision et lavage.", "Robot vacuum with auto-empty, PrecisionVision navigation and mopping.", 899.99m, 799.99m, "iRobot", "IRO-J9P", 15, true, true, false, true),
            P(33, 4, "Roborock S8 MaxV Ultra", "Roborock S8 MaxV Ultra", "Robot aspirateur laveur avec double brosse, station tout-en-un et IA ReactiveAI 2.0.", "Robot vacuum-mop with dual brush, all-in-one dock and ReactiveAI 2.0.", 1199.99m, null, "Roborock", "ROB-S8MVU", 10, true, false, false, false),
            P(34, 4, "Dyson Gen5detect Absolute", "Dyson Gen5detect Absolute", "Aspirateur balai sans fil nouvelle génération avec filtration HEPA et 70 min d'autonomie.", "Next-gen cordless vacuum with HEPA filtration and 70-min runtime.", 899.99m, null, "Dyson", "DYS-G5DA", 12, false, false, false, false),
            P(35, 4, "Rowenta X-Force Flex 14.60", "Rowenta X-Force Flex 14.60", "Aspirateur balai sans fil flexible avec tube articulé et brosse LED.", "Flexible cordless stick vacuum with articulated tube and LED brush.", 399.99m, 349.99m, "Rowenta", "ROW-XFF1460", 25, false, false, false, true),
            P(36, 4, "Miele Complete C3 Silence", "Miele Complete C3 Silence", "Aspirateur traîneau ultra-silencieux avec brosse Parquet Twister et filtre AirClean Plus.", "Ultra-quiet canister vacuum with Parquet Twister brush and AirClean Plus filter.", 449.99m, null, "Miele", "MIE-C3SIL", 18, false, true, false, false),
            P(37, 4, "Xiaomi Robot Vacuum X10+", "Xiaomi Robot Vacuum X10+", "Robot aspirateur laveur avec station de vidange et serpillière auto-nettoyante.", "Robot vacuum-mop with auto-empty station and self-cleaning mop.", 499.99m, 429.99m, "Xiaomi", "XIA-RVX10P", 22, false, false, true, true),
            P(38, 4, "Bosch Unlimited 7 ProAnimal", "Bosch Unlimited 7 ProAnimal", "Aspirateur balai sans fil avec batterie interchangeable et brosse spéciale animaux.", "Cordless stick vacuum with interchangeable battery and pet hair brush.", 349.99m, null, "Bosch", "BOS-UNL7PA", 28, false, false, false, false),
            P(39, 4, "Samsung Bespoke Jet AI", "Samsung Bespoke Jet AI", "Aspirateur balai sans fil avec station All-in-One et détection IA de poussière.", "Cordless vacuum with All-in-One station and AI dust detection.", 799.99m, 699.99m, "Samsung", "SAM-BJAI", 14, false, false, false, true),
            P(40, 4, "Kärcher WD 6 Premium", "Karcher WD 6 Premium", "Aspirateur eau et poussière professionnel 30L avec décolmatage automatique.", "30L professional wet & dry vacuum with automatic filter cleaning.", 249.99m, 219.99m, "Kärcher", "KAR-WD6P", 35, false, false, false, true),

            // Cat 5: Fours & Cuisinières
            P(41, 5, "Bosch HBA574BR0 Série 4", "Bosch HBA574BR0 Series 4", "Four encastrable pyrolyse 71L avec chaleur tournante 3D et écran TFT.", "71L pyrolytic built-in oven with 3D hot air and TFT display.", 599.99m, 499.99m, "Bosch", "BOS-HBA574", 18, true, true, false, true),
            P(42, 5, "Samsung NV7B5775XAK Dual Cook Flex", "Samsung NV7B5775XAK Dual Cook Flex", "Four encastrable 76L avec séparation Dual Cook et nettoyage vapeur.", "76L built-in oven with Dual Cook separation and steam cleaning.", 699.99m, null, "Samsung", "SAM-NV7B57", 14, false, false, false, false),
            P(43, 5, "De'Longhi GEMMA 96 GVB ED", "De'Longhi GEMMA 96 GVB ED", "Cuisinière mixte 5 feux gaz + four électrique 113L multifonction.", "Mixed range cooker with 5 gas burners + 113L multifunction electric oven.", 899.99m, 799.99m, "De'Longhi", "DEL-GEMMA96", 10, false, false, false, true),
            P(44, 5, "Whirlpool AKZ9 6230 IX", "Whirlpool AKZ9 6230 IX", "Four encastrable pyrolyse 73L avec sonde de cuisson et 6ème Sens.", "73L pyrolytic built-in oven with cooking probe and 6th Sense.", 499.99m, 429.99m, "Whirlpool", "WHP-AKZ9623", 20, false, false, true, true),
            P(45, 5, "Miele H 7264 BP", "Miele H 7264 BP", "Four encastrable pyrolyse 76L avec PerfectClean et programme Pain.", "76L pyrolytic built-in oven with PerfectClean and Bread program.", 1399.99m, null, "Miele", "MIE-H7264", 6, false, false, false, false),
            P(46, 5, "Sauter SOP5564X", "Sauter SOP5564X", "Four encastrable pyrolyse 73L multifonction avec chaleur pulsée.", "73L multifunction pyrolytic built-in oven with pulsed heat.", 449.99m, 399.99m, "Sauter", "SAU-SOP5564", 22, false, true, false, true),
            P(47, 5, "Siemens HB674GBS1 iQ700", "Siemens HB674GBS1 iQ700", "Four encastrable 71L avec activeClean pyrolyse et cookControl Plus.", "71L built-in oven with activeClean pyrolysis and cookControl Plus.", 799.99m, null, "Siemens", "SIE-HB674", 12, true, false, false, false),
            P(48, 5, "Electrolux EOD6P77WZ SteamBake", "Electrolux EOD6P77WZ SteamBake", "Four encastrable vapeur 72L avec programme SteamBake et pyrolyse.", "72L steam built-in oven with SteamBake program and pyrolysis.", 549.99m, 479.99m, "Electrolux", "ELX-EOD6P77", 16, false, false, false, true),
            P(49, 5, "Brandt BXE5532X", "Brandt BXE5532X", "Four encastrable catalyse 73L avec tournebroche et 8 modes de cuisson.", "73L catalytic built-in oven with rotisserie and 8 cooking modes.", 349.99m, null, "Brandt", "BRA-BXE5532", 25, false, false, false, false),
            P(50, 5, "Smeg SF6922XPZE Victoria", "Smeg SF6922XPZE Victoria", "Four encastrable pyrolyse 70L style rétro avec vapeur intégrée.", "70L retro-style pyrolytic built-in oven with integrated steam.", 999.99m, null, "Smeg", "SME-SF6922", 8, true, false, false, false),

            // Cat 6: Micro-ondes
            P(51, 6, "Samsung MC28A5135CK Smart Oven", "Samsung MC28A5135CK Smart Oven", "Micro-ondes combiné 28L avec chaleur tournante et grill.", "28L combination microwave with hot air and grill.", 199.99m, 169.99m, "Samsung", "SAM-MC28A5", 30, true, true, false, true),
            P(52, 6, "Panasonic NN-DS596M", "Panasonic NN-DS596M", "Micro-ondes combiné vapeur 27L avec technologie Inverter.", "27L steam combination microwave with Inverter technology.", 349.99m, null, "Panasonic", "PAN-NNDS596", 15, false, false, false, false),
            P(53, 6, "Whirlpool MWP 3391 SX", "Whirlpool MWP 3391 SX", "Micro-ondes grill 33L avec Crisp et fonction vapeur.", "33L grill microwave with Crisp and steam function.", 249.99m, 219.99m, "Whirlpool", "WHP-MWP3391", 22, false, false, true, true),
            P(54, 6, "Bosch BFL634GS1 Série 8", "Bosch BFL634GS1 Series 8", "Micro-ondes encastrable 21L avec AutoPilot 8 et ouverture à gauche.", "21L built-in microwave with AutoPilot 8 and left-side opening.", 399.99m, null, "Bosch", "BOS-BFL634", 12, false, false, false, false),
            P(55, 6, "Sharp R-860S", "Sharp R-860S", "Micro-ondes combiné 25L avec grill et chaleur tournante.", "25L combination microwave with grill and convection.", 159.99m, 129.99m, "Sharp", "SHA-R860S", 35, false, false, false, true),
            P(56, 6, "LG MJ3965ACS NeoChef", "LG MJ3965ACS NeoChef", "Micro-ondes combiné 39L avec Smart Inverter et EasyClean.", "39L combination microwave with Smart Inverter and EasyClean.", 299.99m, null, "LG", "LG-MJ3965", 18, true, true, false, false),
            P(57, 6, "Severin MW 7763", "Severin MW 7763", "Micro-ondes design 20L avec 8 niveaux de puissance.", "20L design microwave with 8 power levels.", 79.99m, 59.99m, "Severin", "SEV-MW7763", 50, false, false, true, true),
            P(58, 6, "Siemens BE634LGS1 iQ700", "Siemens BE634LGS1 iQ700", "Micro-ondes encastrable 21L avec cookControl Plus.", "21L built-in microwave with cookControl Plus.", 449.99m, null, "Siemens", "SIE-BE634", 10, false, false, false, false),
            P(59, 6, "Candy CMXG25DCS", "Candy CMXG25DCS", "Micro-ondes grill 25L avec fonction Cook-in-App.", "25L grill microwave with Cook-in-App function.", 119.99m, 99.99m, "Candy", "CND-CMXG25", 40, false, false, false, true),
            P(60, 6, "Brandt SE2616B", "Brandt SE2616B", "Micro-ondes solo 26L compact avec plateau 31.5 cm.", "26L compact solo microwave with 31.5cm turntable.", 89.99m, null, "Brandt", "BRA-SE2616", 45, false, false, false, false),

            // Cat 7: Cafetières & Expresso
            P(61, 7, "De'Longhi Magnifica Evo ECAM290.61.SB", "De'Longhi Magnifica Evo ECAM290.61.SB", "Machine à café automatique avec broyeur, LatteCrema et 7 boissons.", "Automatic bean-to-cup coffee machine with LatteCrema and 7 drinks.", 599.99m, 499.99m, "De'Longhi", "DEL-ECAM290", 15, true, true, true, true),
            P(62, 7, "Krups Evidence EA891C10", "Krups Evidence EA891C10", "Expresso broyeur compact avec écran OLED et 15 boissons.", "Compact bean-to-cup espresso with OLED display and 15 drinks.", 499.99m, null, "Krups", "KRU-EA891C", 18, false, true, false, false),
            P(63, 7, "Nespresso Vertuo Next", "Nespresso Vertuo Next", "Machine à café Nespresso Vertuo avec lecture code-barres et 5 tailles de tasses.", "Nespresso Vertuo machine with barcode scanning and 5 cup sizes.", 149.99m, 99.99m, "Nespresso", "NES-VN", 40, false, false, true, true),
            P(64, 7, "Jura E8 (EB) 2024", "Jura E8 (EB) 2024", "Machine automatique haut de gamme avec 17 spécialités et écran couleur TFT.", "Premium automatic machine with 17 specialties and color TFT screen.", 1299.99m, null, "Jura", "JUR-E8-2024", 8, true, false, false, false),
            P(65, 7, "Philips Série 3200 EP3246/70", "Philips Series 3200 EP3246/70", "Expresso broyeur avec LatteGo et réglage arôme sur 12 niveaux.", "Bean-to-cup espresso with LatteGo and 12-level aroma adjustment.", 449.99m, 399.99m, "Philips", "PHI-EP3246", 22, false, false, false, true),
            P(66, 7, "Nespresso CitiZ&Milk", "Nespresso CitiZ and Milk", "Machine Nespresso avec mousseur à lait Aeroccino intégré.", "Nespresso machine with integrated Aeroccino milk frother.", 199.99m, 169.99m, "Nespresso", "NES-CZM", 35, false, true, false, true),
            P(67, 7, "Sage Barista Express Impress", "Sage Barista Express Impress", "Machine expresso manuelle avec broyeur intégré et tassage assisté.", "Manual espresso machine with built-in grinder and assisted tamping.", 699.99m, null, "Sage", "SAG-BEI", 12, true, false, false, false),
            P(68, 7, "Melitta Caffeo Barista TS Smart", "Melitta Caffeo Barista TS Smart", "Machine automatique connectée avec 21 recettes et double bac à grains.", "Connected automatic machine with 21 recipes and dual bean hopper.", 799.99m, 699.99m, "Melitta", "MEL-CBTS", 10, false, false, false, true),
            P(69, 7, "Tassimo Happy TAS1002", "Tassimo Happy TAS1002", "Machine à capsules T-Disc compacte avec INTELLIBREW.", "Compact T-Disc capsule machine with INTELLIBREW.", 49.99m, 34.99m, "Tassimo", "TAS-1002", 60, false, false, true, true),
            P(70, 7, "Bialetti Moka Express 6 Tasses", "Bialetti Moka Express 6 Cups", "Cafetière italienne iconique en aluminium pour 6 tasses.", "Iconic Italian aluminum moka pot for 6 cups.", 34.99m, null, "Bialetti", "BIA-ME6", 80, false, false, false, false),

            // Cat 8: Robots cuiseurs
            P(71, 8, "Thermomix TM6", "Thermomix TM6", "Robot cuiseur multifonction avec écran tactile, Wi-Fi et plus de 92 000 recettes.", "Multifunction food processor with touchscreen, Wi-Fi and 92,000+ recipes.", 1499.00m, null, "Vorwerk", "VOR-TM6", 10, true, true, false, false),
            P(72, 8, "Moulinex Companion XL HF80CB10", "Moulinex Companion XL HF80CB10", "Robot cuiseur 4.5L avec 12 programmes automatiques et cuisson jusqu'à 150°C.", "4.5L food processor with 12 auto programs and cooking up to 150°C.", 699.99m, 599.99m, "Moulinex", "MOU-COMPXL", 15, false, true, false, true),
            P(73, 8, "KitchenAid Artisan 5KSM175", "KitchenAid Artisan 5KSM175", "Robot pâtissier 4.8L avec moteur à transmission directe et 10 vitesses.", "4.8L stand mixer with direct-drive motor and 10 speeds.", 599.99m, null, "KitchenAid", "KA-5KSM175", 18, false, false, false, false),
            P(74, 8, "Magimix Cook Expert Premium XL", "Magimix Cook Expert Premium XL", "Robot cuiseur multifonction 3.5L avec 50 programmes et cuisson sous vide.", "3.5L multifunction food processor with 50 programs and sous vide.", 1199.99m, 999.99m, "Magimix", "MAG-CEPXL", 8, true, false, false, true),
            P(75, 8, "Kenwood Cooking Chef XL KCL95", "Kenwood Cooking Chef XL KCL95", "Robot cuiseur 6.7L avec cuisson par induction jusqu'à 180°C.", "6.7L food processor with induction cooking up to 180°C.", 999.99m, null, "Kenwood", "KNW-KCL95", 12, false, false, false, false),
            P(76, 8, "Moulinex ClickChef HF456810", "Moulinex ClickChef HF456810", "Robot cuiseur compact 3.6L avec 32 fonctions et recettes guidées.", "Compact 3.6L food processor with 32 functions and guided recipes.", 349.99m, 299.99m, "Moulinex", "MOU-HF456", 25, false, false, true, true),
            P(77, 8, "Ninja Foodi MAX 15-in-1", "Ninja Foodi MAX 15-in-1", "Multicuiseur 7.5L avec air fryer, cuisson sous pression et déshydrateur.", "7.5L multi-cooker with air fryer, pressure cooking and dehydrator.", 249.99m, 199.99m, "Ninja", "NIN-FMAX15", 30, false, false, false, true),
            P(78, 8, "Bosch MUM Serie 4 MUM4880", "Bosch MUM Series 4 MUM4880", "Robot pâtissier 3.9L avec hachoir à viande et presse-agrumes.", "3.9L stand mixer with meat grinder and citrus press.", 199.99m, null, "Bosch", "BOS-MUM4880", 35, false, false, false, false),
            P(79, 8, "Philips Airfryer XXL HD9285/90", "Philips Airfryer XXL HD9285/90", "Friteuse sans huile 7.3L avec technologie Smart Sensing.", "7.3L oil-free fryer with Smart Sensing technology.", 299.99m, 249.99m, "Philips", "PHI-HD9285", 20, false, true, false, true),
            P(80, 8, "SEB Clipso Minut Perfect 9L", "SEB Clipso Minut Perfect 9L", "Autocuiseur 9L avec ouverture/fermeture facile et minuteur.", "9L pressure cooker with easy open/close and timer.", 129.99m, null, "SEB", "SEB-CMP9L", 40, false, false, false, false),

            // Cat 9: Climatisation
            P(81, 9, "Dyson Purifier Hot+Cool HP09", "Dyson Purifier Hot+Cool HP09", "Purificateur d'air chauffant/ventilateur avec filtration HEPA H13 et détection de formaldéhyde.", "Heating/cooling air purifier with HEPA H13 filtration and formaldehyde detection.", 649.99m, 549.99m, "Dyson", "DYS-HP09", 15, true, true, false, true),
            P(82, 9, "Daikin FTXM35R Perfera", "Daikin FTXM35R Perfera", "Climatiseur mural inverter 3.5kW avec purificateur d'air intégré.", "3.5kW wall-mounted inverter air conditioner with integrated air purifier.", 1299.99m, null, "Daikin", "DAI-FTXM35R", 8, false, false, false, false),
            P(83, 9, "Dyson Pure Cool TP07", "Dyson Pure Cool TP07", "Purificateur d'air ventilateur tour avec filtration HEPA et connecté Wi-Fi.", "Tower fan air purifier with HEPA filtration and Wi-Fi connected.", 549.99m, 449.99m, "Dyson", "DYS-TP07", 20, false, true, false, true),
            P(84, 9, "De'Longhi Pinguino PAC EX100", "De'Longhi Pinguino PAC EX100", "Climatiseur mobile 10 000 BTU avec mode déshumidificateur et télécommande.", "10,000 BTU portable air conditioner with dehumidifier mode and remote.", 599.99m, null, "De'Longhi", "DEL-PACEX100", 12, false, false, false, false),
            P(85, 9, "Rowenta Turbo Silence VU5640", "Rowenta Turbo Silence VU5640", "Ventilateur colonne ultra-silencieux avec oscillation automatique et timer.", "Ultra-quiet tower fan with automatic oscillation and timer.", 79.99m, 59.99m, "Rowenta", "ROW-VU5640", 45, false, false, true, true),
            P(86, 9, "Xiaomi Smart Air Purifier 4 Pro", "Xiaomi Smart Air Purifier 4 Pro", "Purificateur d'air connecté avec filtre HEPA et affichage OLED.", "Connected air purifier with HEPA filter and OLED display.", 249.99m, 199.99m, "Xiaomi", "XIA-SAP4P", 25, false, false, false, true),
            P(87, 9, "Mitsubishi MSZ-AY35VGKP", "Mitsubishi MSZ-AY35VGKP", "Climatiseur mural 3.5kW avec WiFi et filtre plasma.", "3.5kW wall air conditioner with WiFi and plasma filter.", 1099.99m, null, "Mitsubishi", "MIT-MSZAY35", 10, true, false, false, false),
            P(88, 9, "Philips Series 2000i AC2939/10", "Philips Series 2000i AC2939/10", "Purificateur air connecté pour pièces 98m² avec capteurs VitaShield IPS.", "Connected air purifier for 98m² rooms with VitaShield IPS sensors.", 349.99m, 299.99m, "Philips", "PHI-AC2939", 18, false, false, false, true),
            P(89, 9, "Dimplex Opti-Myst Pro 1500", "Dimplex Opti-Myst Pro 1500", "Cheminée électrique décorative avec effet flamme et brume d'eau.", "Decorative electric fireplace with flame effect and water mist.", 499.99m, null, "Dimplex", "DIM-OMP1500", 14, false, false, false, false),
            P(90, 9, "Atlantic Nirvana Digital 1000W", "Atlantic Nirvana Digital 1000W", "Radiateur électrique à inertie fluide connecté avec détection de fenêtre.", "Connected fluid inertia electric radiator with window detection.", 399.99m, 349.99m, "Atlantic", "ATL-NIRV1000", 20, false, false, false, true),

            // Cat 10: Soin du linge
            P(91, 10, "Philips PerfectCare Elite Plus GC9682", "Philips PerfectCare Elite Plus GC9682", "Centrale vapeur avec technologie OptimalTEMP et réservoir 1.8L.", "Steam generator with OptimalTEMP technology and 1.8L tank.", 349.99m, 299.99m, "Philips", "PHI-GC9682", 15, true, true, false, true),
            P(92, 10, "Calor Pro Express Ultimate GV9620", "Calor Pro Express Ultimate GV9620", "Centrale vapeur haute pression avec débit vapeur 155g/min et semelle Durilium.", "High-pressure steam generator with 155g/min steam flow and Durilium soleplate.", 299.99m, null, "Calor", "CAL-GV9620", 20, false, true, false, false),
            P(93, 10, "SteamOne S-Nomad Plus", "SteamOne S-Nomad Plus", "Défroisseur vapeur portable nomade avec temps de chauffe 25 secondes.", "Portable handheld steamer with 25-second heat-up time.", 69.99m, 59.99m, "SteamOne", "STM-SNP", 40, false, false, true, true),
            P(94, 10, "Rowenta DG8960 Silence Steam", "Rowenta DG8960 Silence Steam", "Centrale vapeur silencieuse avec Eco Intelligence et semelle Microsteam.", "Silent steam generator with Eco Intelligence and Microsteam soleplate.", 249.99m, null, "Rowenta", "ROW-DG8960", 18, false, false, false, false),
            P(95, 10, "Braun CareStyle 7 Pro IS 7286", "Braun CareStyle 7 Pro IS 7286", "Centrale vapeur avec FreeGlide 3D et protection iCare.", "Steam generator with FreeGlide 3D and iCare protection.", 329.99m, 279.99m, "Braun", "BRA-IS7286", 14, false, false, false, true),
            P(96, 10, "Philips GC4541/20 Azur", "Philips GC4541/20 Azur", "Fer vapeur 2400W avec semelle SteamGlide Plus et système anti-calcaire.", "2400W steam iron with SteamGlide Plus soleplate and anti-calc system.", 59.99m, 49.99m, "Philips", "PHI-GC4541", 50, false, false, false, true),
            P(97, 10, "Laurastar Lift Plus", "Laurastar Lift Plus", "Système de repassage professionnel portable avec semelle 3D et vapeur active.", "Portable professional ironing system with 3D soleplate and active steam.", 599.99m, null, "Laurastar", "LAU-LP", 8, true, false, false, false),
            P(98, 10, "Calor Tweeny 2-en-1 NI5010C0", "Calor Tweeny 2-en-1 NI5010C0", "Fer à repasser et défroisseur 2-en-1 compact.", "Compact 2-in-1 iron and steamer.", 39.99m, 29.99m, "Calor", "CAL-NI5010", 60, false, false, true, true),
            P(99, 10, "Bosch TDS6040 Série 6", "Bosch TDS6040 Series 6", "Centrale vapeur avec i-Temp et DripStop système.", "Steam generator with i-Temp and DripStop system.", 199.99m, null, "Bosch", "BOS-TDS6040", 22, false, false, false, false),
            P(100, 10, "Polti Vaporetto SV660", "Polti Vaporetto SV660", "Nettoyeur vapeur balai 2-en-1 avec 18 accessoires et vapeur désinfectante.", "2-in-1 steam mop with 18 accessories and disinfecting steam.", 149.99m, 129.99m, "Polti", "POL-SV660", 25, false, false, false, true),
        };

        foreach (var p in products)
        {
            p.SiteType = SiteType.Appliances;
            p.RelatedProductIds = DataSeeder.GetRelatedIds(p.Id, products.Count);
            p.Tags = GenerateTags(p);
            if (p.Variants.Count == 0)
            {
                p.Variants.Add(new ProductVariant { Id = p.Id * 10, Name = "Standard", NameEn = "Standard", Value = "Standard", PriceAdjustment = 0, Stock = p.Stock });
            }
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
            SiteType = SiteType.Appliances
        };
    }

    private static List<string> GenerateTags(Product p)
    {
        var tags = new List<string> { p.Brand };
        if (p.IsNew) tags.Add("Nouveauté");
        if (p.IsPromo) tags.Add("Promo");
        if (p.IsBestSeller) tags.Add("Best-seller");
        return tags;
    }
}
