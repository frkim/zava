namespace Zava.Api.Services;

using Zava.Api.Models;

public static class DiySeeder
{
    public static List<Category> GenerateCategories()
    {
        return new List<Category>
        {
            new() { Id = 1, Name = "Perceuses & Visseuses", NameEn = "Drills & Screwdrivers", Description = "Perceuses, visseuses sans fil et percussion", DescriptionEn = "Drills, cordless screwdrivers and hammer drills", ProductCount = 10, SiteType = SiteType.DIY, Icon = "Hardware" },
            new() { Id = 2, Name = "Peinture & Enduits", NameEn = "Paint & Fillers", Description = "Peintures murales, lasures et enduits de rebouchage", DescriptionEn = "Wall paints, stains and filler compounds", ProductCount = 10, SiteType = SiteType.DIY, Icon = "FormatPaint" },
            new() { Id = 3, Name = "Outillage à Main", NameEn = "Hand Tools", Description = "Marteaux, tournevis, pinces et clés", DescriptionEn = "Hammers, screwdrivers, pliers and wrenches", ProductCount = 10, SiteType = SiteType.DIY, Icon = "Build" },
            new() { Id = 4, Name = "Menuiserie & Bois", NameEn = "Woodwork & Timber", Description = "Scies, planches, tasseaux et panneaux", DescriptionEn = "Saws, boards, battens and panels", ProductCount = 10, SiteType = SiteType.DIY, Icon = "Carpenter" },
            new() { Id = 5, Name = "Plomberie", NameEn = "Plumbing", Description = "Tuyaux, raccords, robinets et WC", DescriptionEn = "Pipes, fittings, taps and toilets", ProductCount = 10, SiteType = SiteType.DIY, Icon = "Plumbing" },
            new() { Id = 6, Name = "Quincaillerie", NameEn = "Hardware", Description = "Vis, chevilles, boulons et fixations", DescriptionEn = "Screws, wall plugs, bolts and fixings", ProductCount = 10, SiteType = SiteType.DIY, Icon = "Settings" },
            new() { Id = 7, Name = "Revêtement Sol & Mur", NameEn = "Floor & Wall Covering", Description = "Carrelage, parquet et papier peint", DescriptionEn = "Tiles, parquet and wallpaper", ProductCount = 10, SiteType = SiteType.DIY, Icon = "GridView" },
            new() { Id = 8, Name = "Jardin & Extérieur", NameEn = "Garden & Outdoor", Description = "Tondeuses, outils de jardin et mobilier extérieur", DescriptionEn = "Mowers, garden tools and outdoor furniture", ProductCount = 10, SiteType = SiteType.DIY, Icon = "Grass" },
            new() { Id = 9, Name = "Rangement & Organisation", NameEn = "Storage & Organization", Description = "Étagères, caissons et systèmes de rangement", DescriptionEn = "Shelves, cabinets and storage systems", ProductCount = 10, SiteType = SiteType.DIY, Icon = "Inventory" },
            new() { Id = 10, Name = "Sécurité & Protection", NameEn = "Safety & Protection", Description = "Serrures, alarmes et EPI", DescriptionEn = "Locks, alarms and PPE", ProductCount = 10, SiteType = SiteType.DIY, Icon = "Security" }
        };
    }

    public static List<Product> GenerateProducts()
    {
        var products = new List<Product>
        {
            // Cat 1: Perceuses & Visseuses
            P(1, 1, "Perceuse-visseuse Bosch GSR 18V-60", "Bosch GSR 18V-60 Drill/Driver", "Perceuse-visseuse sans fil 18V avec 2 batteries 4.0Ah et coffret.", "18V cordless drill/driver with 2x 4.0Ah batteries and case.", 189.00m, 159.00m, "Bosch Pro", "BOS-GSR18V60", 25, true, true, true, true, V(1, "2x 4.0Ah", "2x 4.0Ah", "4Ah", 0m, 25)),
            P(2, 1, "Visseuse à chocs Makita DTD153", "Makita DTD153 Impact Driver", "Visseuse à chocs 18V 170Nm avec variateur électronique.", "18V 170Nm impact driver with electronic speed control.", 149.00m, null, "Makita", "MAK-DTD153", 20, false, true, false, false, V(2, "Nue (sans batterie)", "Bare tool", "Nue", 0m, 20), V(3, "Avec 2 bat. 5.0Ah", "With 2x 5.0Ah", "5Ah", 100m, 12)),
            P(3, 1, "Perforateur SDS+ Bosch GBH 2-26", "Bosch GBH 2-26 SDS+ Rotary Hammer", "Perforateur 830W 3 modes : perçage, percussion, burinage.", "830W rotary hammer 3 modes: drilling, hammering, chiseling.", 199.00m, 175.00m, "Bosch Pro", "BOS-GBH226", 15, false, false, false, true, V(4, "Standard", "Standard", "Standard", 0m, 15)),
            P(4, 1, "Perceuse colonne Scheppach DP16VLS", "Scheppach DP16VLS Pillar Drill", "Perceuse à colonne 500W avec vitesse variable et laser.", "500W pillar drill with variable speed and laser.", 139.00m, null, "Scheppach", "SCH-DP16VLS", 12, false, false, false, false, V(5, "Standard", "Standard", "Standard", 0m, 12)),
            P(5, 1, "Visseuse plaquiste Makita DFS452Z", "Makita DFS452Z Drywall Screwdriver", "Visseuse à plaque de plâtre 18V avec réglage profondeur.", "18V drywall screwdriver with depth adjustment.", 129.00m, 109.00m, "Makita", "MAK-DFS452", 18, false, false, false, true, V(6, "Nue", "Bare tool", "Nue", 0m, 18)),
            P(6, 1, "Perceuse à percussion Bosch PSB 750", "Bosch PSB 750 Hammer Drill", "Perceuse à percussion filaire 750W polyvalente.", "Versatile 750W corded hammer drill.", 69.00m, 55.00m, "Bosch", "BOS-PSB750", 30, false, true, true, true, V(7, "Standard", "Standard", "Standard", 0m, 30)),
            P(7, 1, "Meuleuse angulaire Bosch GWS 7-125", "Bosch GWS 7-125 Angle Grinder", "Meuleuse 720W disque 125mm avec protection anti-redémarrage.", "720W 125mm grinder with restart protection.", 59.00m, null, "Bosch Pro", "BOS-GWS7125", 25, false, false, false, false, V(8, "Standard", "Standard", "Standard", 0m, 25)),
            P(8, 1, "Ponceuse excentrique Makita BO5031", "Makita BO5031 Random Orbit Sander", "Ponceuse excentrique 300W avec aspiration intégrée.", "300W random orbit sander with built-in dust extraction.", 89.00m, 75.00m, "Makita", "MAK-BO5031", 20, true, false, false, true, V(9, "Standard", "Standard", "Standard", 0m, 20)),
            P(9, 1, "Scie sauteuse Bosch PST 700 E", "Bosch PST 700 E Jigsaw", "Scie sauteuse 500W avec système SDS pour changement rapide de lame.", "500W jigsaw with SDS system for quick blade change.", 65.00m, null, "Bosch", "BOS-PST700", 22, false, false, false, false, V(10, "Standard", "Standard", "Standard", 0m, 22)),
            P(10, 1, "Défonceuse Makita RT0702C", "Makita RT0702C Compact Router", "Défonceuse compacte 710W avec variateur de vitesse.", "Compact 710W router with speed control.", 119.00m, 99.00m, "Makita", "MAK-RT0702", 14, false, true, false, true, V(11, "Standard", "Standard", "Standard", 0m, 14)),

            // Cat 2: Peinture & Enduits
            P(11, 2, "Peinture murale blanche V33 10L", "V33 White Wall Paint 10L", "Peinture acrylique monocouche blanc mat lessivable.", "Washable matt white single-coat acrylic paint.", 49.90m, 39.90m, "V33", "V33-BLANC10", 50, false, true, true, true, V(12, "10L", "10L", "10L", 0m, 50), V(13, "2.5L", "2.5L", "2.5L", -35m, 80)),
            P(12, 2, "Peinture Dulux Valentine Crème de Couleur", "Dulux Valentine Cream of Color", "Peinture satin intérieure avec +700 coloris disponibles.", "Satin interior paint with 700+ available colors.", 35.90m, null, "Dulux Valentine", "DUL-CDC", 40, false, true, false, false, V(14, "2.5L - Blanc Cassé", "2.5L - Off White", "2.5L-BC", 0m, 40), V(15, "2.5L - Gris Perle", "2.5L - Pearl Grey", "2.5L-GP", 0m, 35)),
            P(13, 2, "Lasure bois extérieur V33 2.5L", "V33 Exterior Wood Stain 2.5L", "Lasure haute protection UV et pluie pour bois extérieur.", "High UV and rain protection stain for exterior wood.", 39.90m, 33.90m, "V33", "V33-LASE25", 30, false, false, false, true, V(16, "Chêne doré", "Golden Oak", "Chêne", 0m, 30), V(17, "Teck", "Teak", "Teck", 0m, 25)),
            P(14, 2, "Enduit de rebouchage Toupret 1.5kg", "Toupret Filler 1.5kg", "Enduit en poudre pour reboucher trous et fissures.", "Powder filler for filling holes and cracks.", 9.90m, null, "Toupret", "TOU-REB15", 60, false, false, false, false, V(18, "1.5kg", "1.5kg", "1.5kg", 0m, 60), V(19, "4kg", "4kg", "4kg", 10m, 35)),
            P(15, 2, "Sous-couche universelle Zolpan 10L", "Zolpan Universal Primer 10L", "Sous-couche blanche multi-supports pour bonne accroche.", "White multi-surface primer for good adhesion.", 45.00m, 38.00m, "Zolpan", "ZOL-SC10", 25, true, false, false, true, V(20, "10L", "10L", "10L", 0m, 25)),
            P(16, 2, "Peinture sol garage V33 2.5L", "V33 Garage Floor Paint 2.5L", "Peinture epoxy bi-composant résistante au passage des roues.", "Two-component epoxy paint resistant to tire marks.", 55.00m, null, "V33", "V33-SOLG", 18, false, false, false, false, V(21, "Gris clair", "Light Grey", "Gris", 0m, 18)),
            P(17, 2, "Rouleau peinture professionnel 180mm", "Professional Paint Roller 180mm", "Rouleau anti-goutte polyamide 12mm pour murs et plafonds.", "12mm polyamid anti-drip roller for walls and ceilings.", 8.90m, 6.90m, "Nespoli", "NES-ROUL180", 80, false, false, false, true, V(22, "Standard", "Standard", "Standard", 0m, 80)),
            P(18, 2, "Bâche de protection 4x5m", "Protection Sheet 4x5m", "Bâche plastique épaisse pour protection lors des travaux.", "Thick plastic sheet for protection during work.", 5.90m, null, "GEB", "GEB-BACHE", 100, false, false, false, false, V(23, "4x5m", "4x5m", "4x5m", 0m, 100)),
            P(19, 2, "Ruban de masquage 50m", "Masking Tape 50m", "Ruban de masquage 36mm haute précision pour lignes nettes.", "36mm high precision masking tape for clean lines.", 4.90m, 3.90m, "Scotch", "SCO-MASK50", 120, false, false, false, true, V(24, "36mm", "36mm", "36mm", 0m, 120)),
            P(20, 2, "Pistolet à peinture HVLP 500W", "HVLP Paint Spray Gun 500W", "Pistolet pulvérisateur basse pression pour finitions parfaites.", "Low pressure spray gun for perfect finishes.", 79.00m, 65.00m, "Wagner", "WAG-HVLP500", 15, true, false, false, true, V(25, "Standard", "Standard", "Standard", 0m, 15)),

            // Cat 3: Outillage à Main
            P(21, 3, "Coffret tournevis Stanley 42 pièces", "Stanley 42-Piece Screwdriver Set", "Assortiment complet tournevis plats, cruciformes et Torx.", "Complete assortment of flat, Phillips and Torx screwdrivers.", 29.90m, 24.90m, "Stanley", "STA-TV42", 40, false, true, true, true, V(26, "Standard", "Standard", "Standard", 0m, 40)),
            P(22, 3, "Marteau arrache-clou 20oz Stanley", "Stanley 20oz Claw Hammer", "Marteau menuisier manche fibre de verre anti-vibration.", "Carpenter hammer fiberglass handle anti-vibration.", 19.90m, null, "Stanley", "STA-MAR20", 50, false, true, false, false, V(27, "Standard", "Standard", "Standard", 0m, 50)),
            P(23, 3, "Jeu de clés mixtes 8-19mm Facom", "Facom 8-19mm Combination Wrench Set", "12 clés mixtes forgées avec finition OGV.", "12 forged combination wrenches with OGV profile.", 89.00m, 75.00m, "Facom", "FAC-CM12", 20, false, false, false, true, V(28, "Standard", "Standard", "Standard", 0m, 20)),
            P(24, 3, "Niveau à bulle 80cm Stanley", "Stanley 80cm Spirit Level", "Niveau aluminium 3 fioles avec précision 0.5mm/m.", "3-vial aluminum spirit level with 0.5mm/m accuracy.", 22.90m, null, "Stanley", "STA-NIV80", 35, false, false, false, false, V(29, "80cm", "80cm", "80cm", 0m, 35), V(30, "120cm", "120cm", "120cm", 8m, 20)),
            P(25, 3, "Mètre ruban 5m Stanley", "Stanley 5m Tape Measure", "Mètre ruban bi-matière avec crochet magnétique.", "Bi-material tape measure with magnetic hook.", 9.90m, 7.90m, "Stanley", "STA-MET5", 80, false, false, true, true, V(31, "5m", "5m", "5m", 0m, 80), V(32, "8m", "8m", "8m", 4m, 50)),
            P(26, 3, "Pince multiprise Knipex Cobra 250mm", "Knipex Cobra 250mm Water Pump Pliers", "Pince multiprise auto-bloquante avec 25 positions.", "Self-locking water pump pliers with 25 positions.", 35.00m, null, "Knipex", "KNP-COBRA250", 30, true, true, false, false, V(33, "250mm", "250mm", "250mm", 0m, 30)),
            P(27, 3, "Cutter professionnel 18mm", "Professional 18mm Utility Knife", "Cutter à lame rétractable avec magasin de lames.", "Retractable blade utility knife with blade magazine.", 12.90m, 9.90m, "Stanley", "STA-CUT18", 60, false, false, false, true, V(34, "Standard", "Standard", "Standard", 0m, 60)),
            P(28, 3, "Coffret douilles 1/2\" 32 pièces", "32-Piece 1/2\" Socket Set", "Coffret complet clé à cliquet + douilles 10-32mm.", "Complete ratchet wrench + 10-32mm socket set.", 59.00m, null, "Facom", "FAC-DOUL32", 22, false, false, false, false, V(35, "Standard", "Standard", "Standard", 0m, 22)),
            P(29, 3, "Serre-joints 300mm lot de 4", "300mm Clamp Set of 4", "Serre-joints rapides une main 300mm.", "Quick-release one-hand 300mm clamps.", 22.90m, 18.90m, "Wolfcraft", "WOL-SJ300", 35, false, false, false, true, V(36, "Lot de 4", "Pack of 4", "x4", 0m, 35)),
            P(30, 3, "Établi pliant multifonction", "Folding Multifunction Workbench", "Établi portable avec étau intégré et plateau bambou.", "Portable workbench with built-in vise and bamboo top.", 79.00m, 65.00m, "Wolfcraft", "WOL-ETAB", 15, true, false, false, true, V(37, "Standard", "Standard", "Standard", 0m, 15)),

            // Cat 4: Menuiserie & Bois
            P(31, 4, "Scie circulaire Bosch PKS 55", "Bosch PKS 55 Circular Saw", "Scie circulaire 1200W lame 160mm avec guide parallèle.", "1200W circular saw 160mm blade with parallel guide.", 89.00m, 75.00m, "Bosch", "BOS-PKS55", 18, true, false, false, true, V(38, "Standard", "Standard", "Standard", 0m, 18)),
            P(32, 4, "Panneau contreplaqué peuplier 244x122cm", "Poplar Plywood Panel 244x122cm", "Panneau contreplaqué 15mm pour aménagement intérieur.", "15mm plywood panel for interior fitting.", 32.00m, null, "Joubert", "JOU-CP15", 40, false, true, false, false, V(39, "15mm", "15mm", "15mm", 0m, 40), V(40, "18mm", "18mm", "18mm", 5m, 30)),
            P(33, 4, "Tasseau raboté sapin 27x27mm 2.40m", "Planed Spruce Batten 27x27mm 2.40m", "Tasseau bois raboté pour ossature et finition.", "Planed wood batten for framework and finishing.", 2.90m, 2.20m, "Silverwood", "SIL-TAS27", 200, false, false, true, true, V(41, "27x27mm", "27x27mm", "27x27", 0m, 200)),
            P(34, 4, "Lame de scie circulaire 160mm 24 dents", "Circular Saw Blade 160mm 24T", "Lame carbure pour coupe rapide du bois.", "Carbide blade for fast wood cutting.", 12.90m, null, "Bosch", "BOS-LAME160", 50, false, false, false, false, V(42, "Standard", "Standard", "Standard", 0m, 50)),
            P(35, 4, "Colle à bois PU D4 750ml", "PU D4 Wood Glue 750ml", "Colle polyuréthane résistante à l'eau pour extérieur.", "Waterproof polyurethane glue for outdoor use.", 14.90m, 11.90m, "Sader", "SAD-COLP", 40, false, false, false, true, V(43, "750ml", "750ml", "750ml", 0m, 40)),
            P(36, 4, "Défonceuse table de fraisage Bosch", "Bosch Router Table", "Table de fraisage compatible défonceuse POF 1400.", "Router table compatible with POF 1400 router.", 79.00m, null, "Bosch", "BOS-TDF", 10, false, false, false, false, V(44, "Standard", "Standard", "Standard", 0m, 10)),
            P(37, 4, "Panneau OSB3 244x122cm 18mm", "OSB3 Panel 244x122cm 18mm", "Panneau structural OSB pour cloisons et planchers.", "Structural OSB panel for partitions and floors.", 22.90m, 18.90m, "Kronospan", "KRO-OSB318", 35, false, true, false, true, V(45, "18mm", "18mm", "18mm", 0m, 35)),
            P(38, 4, "Rabot électrique Makita KP0800", "Makita KP0800 Electric Planer", "Rabot 620W avec largeur de coupe 82mm.", "620W planer with 82mm cutting width.", 119.00m, null, "Makita", "MAK-KP0800", 14, true, false, false, false, V(46, "Standard", "Standard", "Standard", 0m, 14)),
            P(39, 4, "Papier abrasif grain 120 lot de 25", "Sandpaper Grit 120 Pack of 25", "Feuilles abrasives 230x280mm pour ponçage fin.", "230x280mm sanding sheets for fine sanding.", 8.90m, 6.90m, "Norton", "NOR-P120", 80, false, false, false, true, V(47, "Grain 120", "Grit 120", "120", 0m, 80)),
            P(40, 4, "Moulure MDF blanc 70mm 2.40m", "White MDF Moulding 70mm 2.40m", "Plinthe MDF pré-peinte blanche prête à poser.", "Pre-painted white MDF skirting board ready to install.", 4.90m, null, "Cheminées", "CHE-PLINT70", 100, false, false, false, false, V(48, "70mm", "70mm", "70mm", 0m, 100)),

            // Cat 5: Plomberie
            P(41, 5, "Mitigeur évier Grohe Eurosmart", "Grohe Eurosmart Sink Mixer", "Mitigeur monocommande chromé avec technologie SilkMove.", "Chrome single-lever mixer with SilkMove technology.", 89.00m, 75.00m, "Grohe", "GRO-EUROS", 25, true, true, false, true, V(49, "Standard", "Standard", "Standard", 0m, 25)),
            P(42, 5, "WC suspendu Grohe Pack Bau Ceramic", "Grohe Bau Ceramic Wall-Hung Toilet Pack", "Pack complet WC suspendu avec bâti-support et plaque.", "Complete wall-hung toilet pack with frame and flush plate.", 299.00m, 249.00m, "Grohe", "GRO-BAUPACK", 12, false, true, true, true, V(50, "Blanc", "White", "Blanc", 0m, 12)),
            P(43, 5, "Tube PER 16x1.5mm 100m", "PEX Pipe 16x1.5mm 100m", "Tube PER gainé pour alimentation eau chaude et froide.", "Sheathed PEX pipe for hot and cold water supply.", 55.00m, null, "Comap", "COM-PER16", 30, false, false, false, false, V(51, "Bleu (froid)", "Blue (cold)", "Bleu", 0m, 30), V(52, "Rouge (chaud)", "Red (hot)", "Rouge", 0m, 25)),
            P(44, 5, "Siphon évier 1 cuve", "Single Bowl Sink Trap", "Siphon à culot démontable avec sortie Ø40mm.", "Bottle trap with removable base, Ø40mm outlet.", 8.90m, 6.90m, "Wirquin", "WIR-SIPEV", 60, false, false, false, true, V(53, "Standard", "Standard", "Standard", 0m, 60)),
            P(45, 5, "Chauffe-eau électrique 200L", "Electric Water Heater 200L", "Chauffe-eau vertical mural avec résistance stéatite.", "Vertical wall-mounted water heater with steatite element.", 349.00m, 299.00m, "Atlantic", "ATL-CE200", 10, false, false, true, true, V(54, "200L", "200L", "200L", 0m, 10)),
            P(46, 5, "Robinet de chasse WC", "Toilet Flush Valve", "Mécanisme de chasse universelle 3/6L double touche.", "Universal 3/6L dual flush mechanism.", 15.90m, null, "Wirquin", "WIR-CHASSE", 50, false, true, false, false, V(55, "Standard", "Standard", "Standard", 0m, 50)),
            P(47, 5, "Flexible inox 80cm lot de 2", "Stainless Steel Hose 80cm Pack of 2", "Flexible d'alimentation eau pour robinetterie.", "Water supply hose for taps.", 9.90m, 7.90m, "Comap", "COM-FLEX80", 70, false, false, false, true, V(56, "Lot de 2", "Pack of 2", "x2", 0m, 70)),
            P(48, 5, "Tube cuivre 14/16mm 5m", "Copper Pipe 14/16mm 5m", "Tube cuivre recuit pour alimentation eau et gaz.", "Annealed copper pipe for water and gas supply.", 35.00m, null, "KME", "KME-CU1416", 25, false, false, false, false, V(57, "5m", "5m", "5m", 0m, 25)),
            P(49, 5, "Colonne de douche thermostatique", "Thermostatic Shower Column", "Colonne de douche avec douchette, pomme 25cm et mitigeur thermostatique.", "Shower column with handset, 25cm head and thermostatic mixer.", 149.00m, 125.00m, "Grohe", "GRO-COLTHERME", 15, true, true, false, true, V(58, "Chromé", "Chrome", "Chrome", 0m, 15)),
            P(50, 5, "Mastic silicone sanitaire blanc 300ml", "White Sanitary Silicone Sealant 300ml", "Silicone anti-moisissures pour joints salle de bain.", "Anti-mould silicone for bathroom joints.", 6.90m, null, "Rubson", "RUB-SILSAN", 90, false, false, false, false, V(59, "Blanc", "White", "Blanc", 0m, 90)),

            // Cat 6: Quincaillerie
            P(51, 6, "Coffret vis à bois 1000 pièces", "1000-Piece Wood Screw Kit", "Assortiment vis à bois acier zingué de 3x20 à 5x70mm.", "Zinc-plated steel wood screw assortment from 3x20 to 5x70mm.", 29.90m, 24.90m, "Fischer", "FIS-VB1000", 40, false, true, true, true, V(60, "Standard", "Standard", "Standard", 0m, 40)),
            P(52, 6, "Chevilles à expansion Fischer SX 8x40 lot de 100", "Fischer SX 8x40 Expansion Plugs 100-Pack", "Chevilles nylon universelles tous matériaux.", "Universal nylon plugs for all materials.", 12.90m, null, "Fischer", "FIS-SX8", 80, false, true, false, false, V(61, "8x40mm", "8x40mm", "8x40", 0m, 80)),
            P(53, 6, "Charnière de porte inox 100mm lot de 2", "Stainless Steel Door Hinge 100mm 2-Pack", "Charnières à billes inox pour portes intérieures.", "Stainless steel ball bearing hinges for interior doors.", 9.90m, 7.90m, "Vachette", "VAC-CHAR100", 50, false, false, false, true, V(62, "Lot de 2", "Pack of 2", "x2", 0m, 50)),
            P(54, 6, "Colle néoprène universelle 250ml", "Universal Neoprene Glue 250ml", "Colle contact pour multiples matériaux, prise rapide.", "Contact adhesive for multiple materials, quick bond.", 8.90m, null, "Pattex", "PAT-NEO250", 60, false, false, false, false, V(63, "250ml", "250ml", "250ml", 0m, 60)),
            P(55, 6, "Équerre de fixation 50x50mm lot de 10", "50x50mm Fixing Bracket 10-Pack", "Équerres renforcées acier galvanisé.", "Reinforced galvanized steel brackets.", 7.90m, 5.90m, "Simpson", "SIM-EQ50", 70, false, false, false, true, V(64, "Lot de 10", "Pack of 10", "x10", 0m, 70)),
            P(56, 6, "Serrure à encastrer Vachette", "Vachette Mortise Lock", "Serrure axe 40mm pour porte d'intérieur à condamnation.", "40mm axis mortise lock for interior door with thumbturn.", 25.00m, null, "Vachette", "VAC-SER40", 30, false, false, false, false, V(65, "Standard", "Standard", "Standard", 0m, 30)),
            P(57, 6, "Poignée de porte rosace inox", "Stainless Steel Door Handle on Rose", "Poignée béquille design inox brossé sur rosace.", "Brushed stainless steel lever handle on rose.", 19.90m, 16.90m, "Hoppe", "HOP-POIG", 35, true, false, false, true, V(66, "Inox brossé", "Brushed SS", "Inox", 0m, 35)),
            P(58, 6, "Boulons M8x50 lot de 20", "M8x50 Bolts 20-Pack", "Boulons hexagonaux acier zingué avec écrous.", "Zinc-plated hexagonal bolts with nuts.", 6.90m, null, "GFD", "GFD-M8X50", 80, false, false, false, false, V(67, "Lot de 20", "Pack of 20", "x20", 0m, 80)),
            P(59, 6, "Mousse expansive PU 750ml", "PU Expanding Foam 750ml", "Mousse polyuréthane pour calfeutrage et isolation.", "Polyurethane foam for sealing and insulation.", 8.90m, 6.90m, "Sika", "SIK-MOUSS", 55, false, false, false, true, V(68, "750ml", "750ml", "750ml", 0m, 55)),
            P(60, 6, "Ruban adhésif américain 50m", "Duct Tape 50m", "Ruban toile ultra-résistant étanche multi-usage.", "Ultra-strong waterproof multi-purpose cloth tape.", 7.90m, null, "Scotch", "SCO-DUCT50", 70, false, true, false, false, V(69, "Gris", "Grey", "Gris", 0m, 70)),

            // Cat 7: Revêtement Sol & Mur
            P(61, 7, "Parquet stratifié chêne naturel 2.49m²", "Natural Oak Laminate Flooring 2.49m²", "Parquet 8mm AC4 avec système clic facile à poser.", "8mm AC4 click-system laminate easy to install.", 12.90m, 10.90m, "Artens", "ART-PARQ", 50, true, true, true, true, V(70, "Chêne naturel", "Natural Oak", "Chêne", 0m, 50), V(71, "Gris cérusé", "Grey Limed", "Gris", 0m, 35)),
            P(62, 7, "Carrelage grès cérame 60x60cm effet béton", "Concrete-Effect Porcelain Tile 60x60cm", "Carrelage intérieur/extérieur R10 épaisseur 9mm.", "R10 indoor/outdoor tile 9mm thickness.", 19.90m, null, "Artens", "ART-BETON60", 40, false, true, false, false, V(72, "Gris clair", "Light Grey", "GrisClair", 0m, 40), V(73, "Anthracite", "Anthracite", "Anthracite", 0m, 30)),
            P(63, 7, "Papier peint intissé uni blanc", "Plain White Non-Woven Wallpaper", "Papier peint à peindre intissé 10.05m x 0.53m.", "Paintable non-woven wallpaper 10.05m x 0.53m.", 9.90m, 7.90m, "Leroy Merlin", "LM-PPUNI", 60, false, false, true, true, V(74, "Blanc", "White", "Blanc", 0m, 60)),
            P(64, 7, "Colle carrelage C2 25kg", "C2 Tile Adhesive 25kg", "Mortier-colle déformable pour grand format intérieur/extérieur.", "Deformable adhesive mortar for large format indoor/outdoor.", 15.90m, null, "Weber", "WEB-COLC2", 35, false, false, false, false, V(75, "25kg", "25kg", "25kg", 0m, 35)),
            P(65, 7, "Joint carrelage gris 5kg", "Grey Tile Grout 5kg", "Joint fin ciment pour carrelage intérieur largeur 2-5mm.", "Fine cement grout for indoor tiles, 2-5mm width.", 9.90m, 7.90m, "Weber", "WEB-JGRIS5", 45, false, false, false, true, V(76, "Gris", "Grey", "Gris", 0m, 45)),
            P(66, 7, "Sous-couche parquet 3mm 15m²", "Parquet Underlay 3mm 15m²", "Sous-couche isolation acoustique en mousse PE.", "PE foam acoustic insulation underlay.", 15.90m, null, "Axton", "AXN-SCPAR3", 50, false, true, false, false, V(77, "3mm", "3mm", "3mm", 0m, 50)),
            P(67, 7, "Lame PVC clipsable imitation bois 1.49m²", "Click Vinyl Plank Wood-Look 1.49m²", "Sol vinyle LVT épaisseur 4mm ultra-résistant.", "4mm ultra-resistant LVT vinyl flooring.", 16.90m, 13.90m, "Gerflor", "GER-LVT4", 40, true, false, false, true, V(78, "Chêne blond", "Blond Oak", "Chêne", 0m, 40)),
            P(68, 7, "Croisillons carrelage 3mm lot de 200", "Tile Spacers 3mm 200-Pack", "Croisillons en croix pour joints réguliers.", "Cross spacers for regular joints.", 3.90m, null, "Axton", "AXN-CROIS3", 100, false, false, false, false, V(79, "3mm", "3mm", "3mm", 0m, 100)),
            P(69, 7, "Mosaïque verre blanc 30x30cm", "White Glass Mosaic 30x30cm", "Mosaïque en plaque pour crédence et salle de bain.", "Sheet mosaic for splashback and bathroom.", 9.90m, 7.90m, "Artens", "ART-MOS30", 35, false, false, false, true, V(80, "Blanc", "White", "Blanc", 0m, 35)),
            P(70, 7, "Ragréage autolissant 25kg", "Self-Leveling Screed 25kg", "Enduit de sol autolissant pour rattraper les irrégularités.", "Self-leveling floor compound to correct unevenness.", 18.90m, null, "Weber", "WEB-RAG25", 30, false, false, false, false, V(81, "25kg", "25kg", "25kg", 0m, 30)),

            // Cat 8: Jardin & Extérieur
            P(71, 8, "Tondeuse électrique Bosch Rotak 37", "Bosch Rotak 37 Electric Mower", "Tondeuse filaire 1400W largeur de coupe 37cm.", "1400W corded mower with 37cm cutting width.", 149.00m, 125.00m, "Bosch", "BOS-ROT37", 15, true, true, false, true, V(82, "Standard", "Standard", "Standard", 0m, 15)),
            P(72, 8, "Taille-haies sans fil Stihl HSA 56", "Stihl HSA 56 Cordless Hedge Trimmer", "Taille-haies 36V légère avec lame 45cm double coupe.", "Lightweight 36V hedge trimmer with 45cm double-sided blade.", 199.00m, null, "Stihl", "STI-HSA56", 12, false, false, false, false, V(83, "Avec batterie", "With battery", "Kit", 0m, 12)),
            P(73, 8, "Salon de jardin résine tressée 4 places", "4-Seat Woven Resin Garden Set", "Ensemble canapé + 2 fauteuils + table basse en résine tressée.", "Sofa + 2 armchairs + coffee table set in woven resin.", 399.00m, 329.00m, "Allibert", "ALB-SALON4", 8, false, false, true, true, V(84, "Gris", "Grey", "Gris", 0m, 8)),
            P(74, 8, "Brouette 100L roue gonflable", "100L Wheelbarrow with Pneumatic Wheel", "Brouette de chantier caisse galvanisée capacité 100L.", "Galvanized tray construction wheelbarrow 100L capacity.", 49.00m, null, "Haemmerlin", "HAE-BROU100", 20, false, false, false, false, V(85, "Standard", "Standard", "Standard", 0m, 20)),
            P(75, 8, "Tuyau d'arrosage 25m extensible", "25m Expandable Garden Hose", "Tuyau extensible 3x avec pistolet 8 jets.", "3x expandable hose with 8-pattern spray gun.", 29.90m, 24.90m, "Gardena", "GAR-TUY25", 30, false, true, false, true, V(86, "25m", "25m", "25m", 0m, 30)),
            P(76, 8, "Barbecue charbon Weber Compact 57cm", "Weber Compact Charcoal BBQ 57cm", "Barbecue à charbon avec couvercle et thermomètre intégré.", "Charcoal BBQ with lid and built-in thermometer.", 149.00m, null, "Weber", "WEB-COMP57", 14, false, true, false, false, V(87, "Standard", "Standard", "Standard", 0m, 14)),
            P(77, 8, "Sécateur Felco 2", "Felco 2 Pruning Shears", "Sécateur professionnel à lame franche pour taille d'entretien.", "Professional bypass pruning shears for maintenance cutting.", 49.00m, 42.00m, "Felco", "FEL-2", 25, false, false, false, true, V(88, "Standard", "Standard", "Standard", 0m, 25)),
            P(78, 8, "Abri de jardin bois 5m²", "5m² Wooden Garden Shed", "Abri en bois traité autoclave avec plancher intégré.", "Autoclave-treated wooden shed with integrated floor.", 699.00m, null, "Forest Style", "FOR-ABR5", 5, false, false, false, false, V(89, "Standard", "Standard", "Standard", 0m, 5)),
            P(79, 8, "Terreau universel 50L", "Universal Potting Soil 50L", "Terreau enrichi pour plantes d'intérieur et d'extérieur.", "Enriched potting soil for indoor and outdoor plants.", 7.90m, 5.90m, "Fertiligène", "FER-TERR50", 80, false, false, true, true, V(90, "50L", "50L", "50L", 0m, 80)),
            P(80, 8, "Désherbeur thermique à gaz", "Gas Thermal Weeder", "Désherbeur écologique sans produit chimique, flamme 1300°C.", "Eco-friendly chemical-free weeder, 1300°C flame.", 35.00m, null, "Gloria", "GLO-DETH", 18, true, false, false, false, V(91, "Standard", "Standard", "Standard", 0m, 18)),

            // Cat 9: Rangement & Organisation
            P(81, 9, "Étagère métallique 5 niveaux 180x90x40cm", "5-Tier Metal Shelf 180x90x40cm", "Étagère charge lourde 175kg/niveau en acier galvanisé.", "Heavy-duty 175kg/tier galvanized steel shelf.", 49.90m, 39.90m, "Spaceo", "SPC-ETAG5", 25, true, true, true, true, V(92, "Standard", "Standard", "Standard", 0m, 25)),
            P(82, 9, "Boîte de rangement 62L avec couvercle", "62L Storage Box with Lid", "Bac empilable transparent résistant aux chocs.", "Stackable transparent impact-resistant container.", 12.90m, null, "Really Useful Box", "RUB-62L", 50, false, true, false, false, V(93, "62L", "62L", "62L", 0m, 50), V(94, "35L", "35L", "35L", -5m, 60)),
            P(83, 9, "Panneau perforé atelier 120x60cm", "Workshop Pegboard 120x60cm", "Panneau acier avec lot de 30 crochets et accessoires.", "Steel panel with 30 hooks and accessories set.", 29.90m, 24.90m, "Facom", "FAC-PANPERF", 20, false, false, false, true, V(95, "Standard", "Standard", "Standard", 0m, 20)),
            P(84, 9, "Armoire haute résine 2 portes", "2-Door Tall Resin Cabinet", "Armoire rangement balai/jardin 68x38x163cm.", "Broom/garden storage cabinet 68x38x163cm.", 69.00m, null, "Keter", "KET-ARM2P", 15, false, false, false, false, V(96, "Standard", "Standard", "Standard", 0m, 15)),
            P(85, 9, "Caisse à outils Stanley 19\"", "Stanley 19\" Toolbox", "Caisse à outils avec bac amovible et fermeture métal.", "Toolbox with removable tray and metal closures.", 22.90m, 18.90m, "Stanley", "STA-CAISSE19", 35, false, true, false, true, V(97, "Standard", "Standard", "Standard", 0m, 35)),
            P(86, 9, "Servante d'atelier 7 tiroirs", "7-Drawer Workshop Trolley", "Servante roulante verrouillable charge 250kg.", "Lockable rolling trolley 250kg load.", 249.00m, null, "Facom", "FAC-SERV7", 8, false, false, false, false, V(98, "Standard", "Standard", "Standard", 0m, 8)),
            P(87, 9, "Crochets de rangement muraux lot de 12", "Wall Storage Hooks 12-Pack", "Crochets acier pour garage et atelier.", "Steel hooks for garage and workshop.", 9.90m, 7.90m, "Spaceo", "SPC-CROCHET", 50, false, false, false, true, V(99, "Lot de 12", "Pack of 12", "x12", 0m, 50)),
            P(88, 9, "Coffre de rangement extérieur 350L", "350L Outdoor Storage Chest", "Coffre résine étanche pour coussins et outils de jardin.", "Waterproof resin chest for cushions and garden tools.", 79.00m, null, "Keter", "KET-COF350", 12, true, false, false, false, V(100, "Standard", "Standard", "Standard", 0m, 12)),
            P(89, 9, "Organiseur mural modulaire", "Modular Wall Organizer", "Système rails + bacs + crochets pour garage.", "Rail + bin + hook system for garage.", 35.00m, 29.00m, "Raaco", "RAA-ORGMOD", 20, false, false, false, true, V(101, "Standard", "Standard", "Standard", 0m, 20)),
            P(90, 9, "Casier vestiaire métal 3 cases", "3-Compartment Metal Locker", "Casier vestiaire acier avec serrure pour atelier ou buanderie.", "Steel locker with lock for workshop or laundry room.", 119.00m, null, "Pierre Henry", "PH-CAS3", 10, false, false, false, false, V(102, "Gris", "Grey", "Gris", 0m, 10)),

            // Cat 10: Sécurité & Protection
            P(91, 10, "Serrure 3 points A2P* certifiée", "A2P* Certified 3-Point Lock", "Serrure de porte d'entrée anti-effraction avec cylindre haute sécurité.", "Anti-break-in front door lock with high-security cylinder.", 149.00m, 125.00m, "Vachette", "VAC-3PTS", 15, true, true, true, true, V(103, "Standard", "Standard", "Standard", 0m, 15)),
            P(92, 10, "Alarme maison sans fil 5 zones", "5-Zone Wireless Home Alarm", "Système d'alarme avec sirène, détecteurs et télécommandes.", "Alarm system with siren, sensors and remote controls.", 199.00m, null, "Somfy", "SOM-ALR5Z", 18, false, true, false, false, V(104, "Standard", "Standard", "Standard", 0m, 18)),
            P(93, 10, "Détecteur de fumée NF 10 ans", "NF Certified 10-Year Smoke Detector", "Détecteur autonome pile lithium 10 ans certifié NF.", "Autonomous smoke detector with 10-year lithium battery, NF certified.", 15.90m, 12.90m, "Kidde", "KID-DFNF10", 60, false, false, true, true, V(105, "Standard", "Standard", "Standard", 0m, 60)),
            P(94, 10, "Cadenas haute sécurité 50mm", "50mm High Security Padlock", "Cadenas acier trempé avec anse protégée anti-coupe.", "Hardened steel padlock with anti-cut protected shackle.", 25.00m, null, "Abus", "ABU-CAD50", 35, false, false, false, false, V(106, "Standard", "Standard", "Standard", 0m, 35)),
            P(95, 10, "Caméra de surveillance WiFi extérieure", "Outdoor WiFi Security Camera", "Caméra IP65 vision nocturne 30m avec stockage cloud.", "IP65 camera 30m night vision with cloud storage.", 79.00m, 65.00m, "Ezviz", "EZV-CAMEXT", 22, false, false, false, true, V(107, "Standard", "Standard", "Standard", 0m, 22)),
            P(96, 10, "Extincteur poudre ABC 6kg", "ABC Powder Fire Extinguisher 6kg", "Extincteur certifié NF avec support mural.", "NF certified fire extinguisher with wall bracket.", 35.00m, null, "Sicli", "SIC-EXT6", 25, false, true, false, false, V(108, "6kg", "6kg", "6kg", 0m, 25)),
            P(97, 10, "Coffre-fort électronique 16L", "16L Electronic Safe", "Coffre-fort à code digital avec fixation murale.", "Digital code safe with wall mounting.", 59.00m, 49.00m, "Burg-Wächter", "BW-COF16", 18, true, false, false, true, V(109, "Standard", "Standard", "Standard", 0m, 18)),
            P(98, 10, "Casque de chantier blanc", "White Construction Helmet", "Casque de protection EN397 avec jugulaire réglable.", "EN397 safety helmet with adjustable chin strap.", 9.90m, null, "3M", "3M-CASQUE", 50, false, false, false, false, V(110, "Blanc", "White", "Blanc", 0m, 50)),
            P(99, 10, "Lunettes de protection anti-projections", "Anti-Splash Safety Glasses", "Lunettes panoramiques avec traitement anti-buée.", "Panoramic glasses with anti-fog coating.", 7.90m, 5.90m, "Bollé", "BOL-LUN", 60, false, false, false, true, V(111, "Standard", "Standard", "Standard", 0m, 60)),
            P(100, 10, "Gants de travail cuir taille L", "Leather Work Gloves Size L", "Gants de manutention cuir et croûte de cuir.", "Leather and split leather handling gloves.", 12.90m, null, "Mapa", "MAP-GANTL", 70, false, true, false, false, V(112, "Taille L", "Size L", "L", 0m, 70), V(113, "Taille XL", "Size XL", "XL", 0m, 50)),
        };

        foreach (var p in products)
        {
            p.SiteType = SiteType.DIY;
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
            SiteType = SiteType.DIY
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
