export const GIFT_CATEGORIES = ["regular", "guarantor"] as const;
export type GiftCategory = typeof GIFT_CATEGORIES[number];

export const GIFT_MODELS = [
  "Delicious Cake",
  "Green Star",
  "Blue Star",
  "Red Star",
  "Tropical Paradise",
  "Pink Heart",
  "Winter Magic",
  "Golden Crown",
  "Ruby Heart",
  "Emerald Tree",
] as const;

export const GIFT_BACKGROUNDS = [
  "Pattern 1",
  "Pattern 2",
  "Pattern 3",
  "Pattern 4",
  "Pattern 5",
  "Pattern 6",
  "Pattern 7",
  "Pattern 8",
  "Pattern 9",
  "Pattern 10",
] as const;

export type GiftModel = typeof GIFT_MODELS[number];
export type GiftBackground = typeof GIFT_BACKGROUNDS[number];

export const AVAILABLE_GIFTS = [
  { id: "jason-mask", name: "Jason Mask", image: "@assets/Jason mask_1762595339717.jpg", model: "Ruby Heart" as GiftModel, background: "Pattern 1" as GiftBackground, category: "guarantor" as GiftCategory },
  { id: "tombstone", name: "Tombstone", image: "@assets/Tombstone_1762595341176.jpg", model: "Winter Magic" as GiftModel, background: "Pattern 2" as GiftBackground, category: "guarantor" as GiftCategory },
  { id: "coffin", name: "Coffin", image: "@assets/Coffin_1762595343665.jpg", model: "Blue Star" as GiftModel, background: "Pattern 3" as GiftBackground, category: "guarantor" as GiftCategory },
  { id: "durovs-sneakers", name: "Durov's Sneakers", image: "@assets/Durov's Sneakers_1762595346479.jpg", model: "Golden Crown" as GiftModel, background: "Pattern 4" as GiftBackground, category: "guarantor" as GiftCategory },
  { id: "durovs-longsleeve", name: "Durov's Longsleeve", image: "@assets/Durov's Longsleeve_1762595349212.jpg", model: "Blue Star" as GiftModel, background: "Pattern 5" as GiftBackground, category: "guarantor" as GiftCategory },
  { id: "backpack", name: "Backpack", image: "@assets/Backpack_1762595351980.jpg", model: "Blue Star" as GiftModel, background: "Pattern 6" as GiftBackground, category: "guarantor" as GiftCategory },
  { id: "book", name: "Book", image: "@assets/Book_1762595354495.jpg", model: "Golden Crown" as GiftModel, background: "Pattern 7" as GiftBackground, category: "guarantor" as GiftCategory },
  { id: "durov-figure", name: "Durov", image: "@assets/Durov_1762595356480.jpg", model: "Golden Crown" as GiftModel, background: "Pattern 8" as GiftBackground, category: "guarantor" as GiftCategory },
  { id: "golden-lock-case", name: "Golden Lock Case", image: "@assets/Golden Lock Case_1762595359226.jpg", model: "Golden Crown" as GiftModel, background: "Pattern 9" as GiftBackground, category: "guarantor" as GiftCategory },
  { id: "golden-fountain-pen", name: "Golden Fountain Pen", image: "@assets/Golden Fountain Pen_1762595361330.jpg", model: "Golden Crown" as GiftModel, background: "Pattern 10" as GiftBackground, category: "guarantor" as GiftCategory },
  
  { id: "1-may", name: "1 May", image: "/gifts/1 May.jpg", model: "Red Star" as GiftModel, background: "Pattern 1" as GiftBackground, category: "regular" as GiftCategory },
  { id: "8-march-cake", name: "8 March Cake", image: "/gifts/8 March Cake.jpg", model: "Delicious Cake" as GiftModel, background: "Pattern 2" as GiftBackground, category: "regular" as GiftCategory },
  { id: "8-march-rose", name: "8 march rose", image: "/gifts/8 march rose.jpg", model: "Pink Heart" as GiftModel, background: "Pattern 3" as GiftBackground, category: "regular" as GiftCategory },
  { id: "box-of-chocolates", name: "Box of chocolates", image: "/gifts/Box of chocolates.jpg", model: "Delicious Cake" as GiftModel, background: "Pattern 1" as GiftBackground, category: "regular" as GiftCategory },
  { id: "candle-lamp", name: "Candle lamp", image: "/gifts/Candle lamp.jpg", model: "Winter Magic" as GiftModel, background: "Pattern 4" as GiftBackground, category: "regular" as GiftCategory },
  { id: "cherry-cake", name: "Cherry cake", image: "/gifts/Cherry cake.jpg", model: "Delicious Cake" as GiftModel, background: "Pattern 2" as GiftBackground, category: "regular" as GiftCategory },
  { id: "coconut", name: "Coconut", image: "/gifts/Coconut.jpg", model: "Tropical Paradise" as GiftModel, background: "Pattern 5" as GiftBackground, category: "regular" as GiftCategory },
  { id: "crescent-moon", name: "Crescent Moon", image: "/gifts/Crescent Moon.jpg", model: "Winter Magic" as GiftModel, background: "Pattern 6" as GiftBackground, category: "regular" as GiftCategory },
  { id: "crystal-eagle", name: "Crystal eagle", image: "/gifts/Crystal eagle.jpg", model: "Golden Crown" as GiftModel, background: "Pattern 7" as GiftBackground, category: "regular" as GiftCategory },
  { id: "easter-basket", name: "Easter basket", image: "/gifts/Easter basket.jpg", model: "Tropical Paradise" as GiftModel, background: "Pattern 3" as GiftBackground, category: "regular" as GiftCategory },
  { id: "easter-cake", name: "Easter cake", image: "/gifts/Easter cake.jpg", model: "Delicious Cake" as GiftModel, background: "Pattern 8" as GiftBackground, category: "regular" as GiftCategory },
  { id: "gift-bag", name: "Gift Bag", image: "/gifts/Gift Bag.jpg", model: "Pink Heart" as GiftModel, background: "Pattern 1" as GiftBackground, category: "regular" as GiftCategory },
  { id: "gold-nipples", name: "Gold Nipples", image: "/gifts/Gold Nipples.jpg", model: "Golden Crown" as GiftModel, background: "Pattern 9" as GiftBackground, category: "regular" as GiftCategory },
  { id: "heels", name: "Heels", image: "/gifts/Heels.jpg", model: "Ruby Heart" as GiftModel, background: "Pattern 2" as GiftBackground, category: "regular" as GiftCategory },
  { id: "ice-cream-bar", name: "Ice cream bar", image: "/gifts/Ice cream bar.jpg", model: "Tropical Paradise" as GiftModel, background: "Pattern 5" as GiftBackground, category: "regular" as GiftCategory },
  { id: "ice-cream-cone", name: "Ice cream cone", image: "/gifts/Ice cream cone.jpg", model: "Tropical Paradise" as GiftModel, background: "Pattern 6" as GiftBackground, category: "regular" as GiftCategory },
  { id: "ice-cream-scoops", name: "Ice cream scoops", image: "/gifts/Ice cream scoops.jpg", model: "Tropical Paradise" as GiftModel, background: "Pattern 4" as GiftBackground, category: "regular" as GiftCategory },
  { id: "instant-noodles", name: "Instant noodles", image: "/gifts/Instant noodles.jpg", model: "Delicious Cake" as GiftModel, background: "Pattern 3" as GiftBackground, category: "regular" as GiftCategory },
  { id: "leperchaun-pot", name: "Leperchaun pot", image: "/gifts/Leperchaun pot.jpg", model: "Emerald Tree" as GiftModel, background: "Pattern 7" as GiftBackground, category: "regular" as GiftCategory },
  { id: "medal", name: "Medal", image: "/gifts/Medal.jpg", model: "Golden Crown" as GiftModel, background: "Pattern 10" as GiftBackground, category: "regular" as GiftCategory },
  { id: "money-bouquet", name: "Money bouquet", image: "/gifts/Money bouquet.jpg", model: "Emerald Tree" as GiftModel, background: "Pattern 8" as GiftBackground, category: "regular" as GiftCategory },
  { id: "mosque", name: "Mosque", image: "/gifts/Mosque.jpg", model: "Golden Crown" as GiftModel, background: "Pattern 9" as GiftBackground, category: "regular" as GiftCategory },
  { id: "peace-dove", name: "Peace dove", image: "/gifts/Peace dove.jpg", model: "Winter Magic" as GiftModel, background: "Pattern 1" as GiftBackground, category: "regular" as GiftCategory },
  { id: "pink-flamingo", name: "Pink Flamingo", image: "/gifts/Pink Flamingo.jpg", model: "Pink Heart" as GiftModel, background: "Pattern 5" as GiftBackground, category: "regular" as GiftCategory },
  { id: "poop", name: "Poop", image: "/gifts/Poop.jpg", model: "Delicious Cake" as GiftModel, background: "Pattern 2" as GiftBackground, category: "regular" as GiftCategory },
  { id: "red-star", name: "Red star", image: "/gifts/Red star.jpg", model: "Red Star" as GiftModel, background: "Pattern 3" as GiftBackground, category: "regular" as GiftCategory },
  { id: "sandcastle", name: "Sandcastle", image: "/gifts/Sandcastle.jpg", model: "Tropical Paradise" as GiftModel, background: "Pattern 4" as GiftBackground, category: "regular" as GiftCategory },
  { id: "statue-of-liberty", name: "Statue of liberty", image: "/gifts/Statue of liberty.jpg", model: "Blue Star" as GiftModel, background: "Pattern 6" as GiftBackground, category: "regular" as GiftCategory },
  { id: "surfboard", name: "Surfboard", image: "/gifts/Surfboard.jpg", model: "Tropical Paradise" as GiftModel, background: "Pattern 7" as GiftBackground, category: "regular" as GiftCategory },
  { id: "torch-of-freedom", name: "Torch of freedom", image: "/gifts/Torch of freedom.jpg", model: "Golden Crown" as GiftModel, background: "Pattern 8" as GiftBackground, category: "regular" as GiftCategory },
  { id: "durovs-sunglasses", name: "Durov's Sunglasses", image: "/gifts/Durovs Sunglasses.jpg", model: "Golden Crown" as GiftModel, background: "Pattern 9" as GiftBackground, category: "regular" as GiftCategory },
  { id: "redo", name: "REDO", image: "/gifts/REDO.jpg", model: "Winter Magic" as GiftModel, background: "Pattern 10" as GiftBackground, category: "regular" as GiftCategory },
];

export const GUARANTOR_GIFTS = AVAILABLE_GIFTS.filter(g => g.category === "guarantor");
export const REGULAR_GIFTS = AVAILABLE_GIFTS.filter(g => g.category === "regular");
