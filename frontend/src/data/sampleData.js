export const weeklyRecipes = [
  {
    id: "r1",
    name: "Buddha Bowl Avocat & Quinoa",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=700&fit=crop",
    time: "25 min",
    difficulty: "Facile",
    tags: ["Proteines", "Fibres", "Vegan"],
    ingredients: ["Quinoa", "Avocat", "Pois chiches", "Concombre", "Tomates cerises", "Sauce tahini"],
  },
  {
    id: "r2",
    name: "Saumon Glace Miso & Riz",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=700&fit=crop",
    time: "30 min",
    difficulty: "Moyen",
    tags: ["Omega-3", "Proteines", "Fer"],
    ingredients: ["Saumon", "Miso blanc", "Riz basmati", "Brocoli", "Graines de sesame", "Sauce soja"],
  },
  {
    id: "r3",
    name: "Wrap Poulet Avocat Frais",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&h=700&fit=crop",
    time: "15 min",
    difficulty: "Facile",
    tags: ["Proteines", "Rapide", "Equilibre"],
    ingredients: ["Tortilla complete", "Poulet grille", "Avocat", "Tomate", "Roquette", "Yaourt grec"],
  },
];

// Creator recipes — shared by creators for users to try
export const creatorRecipes = [
  {
    id: "cr1",
    creatorId: "c2",
    name: "Protein Pancakes Express",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=700&fit=crop",
    time: "15 min",
    difficulty: "Facile",
    tags: ["Proteines", "Petit-dej", "Rapide"],
    ingredients: ["Flocons d'avoine", "Banane", "Oeufs", "Whey vanille", "Myrtilles", "Sirop d'erable"],
  },
  {
    id: "cr2",
    creatorId: "c1",
    name: "Tajine Veggie aux Epices",
    image: "https://images.unsplash.com/photo-1511690743698-d9d18f7e20f1?w=600&h=700&fit=crop",
    time: "45 min",
    difficulty: "Moyen",
    tags: ["Vegan", "Epice", "Comfort food"],
    ingredients: ["Pois chiches", "Patate douce", "Courgette", "Ras el hanout", "Citron confit", "Coriandre"],
  },
  {
    id: "cr3",
    creatorId: "c3",
    name: "Risotto Truffe Noire",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&h=700&fit=crop",
    time: "35 min",
    difficulty: "Difficile",
    tags: ["Gastronomique", "Italien", "Truffe"],
    ingredients: ["Riz arborio", "Truffe noire", "Parmesan", "Echalote", "Vin blanc", "Bouillon de volaille"],
  },
  {
    id: "cr4",
    creatorId: "c2",
    name: "Smoothie Bowl Tropical",
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&h=700&fit=crop",
    time: "5 min",
    difficulty: "Facile",
    tags: ["Proteines", "Petit-dej", "Vitamines"],
    ingredients: ["Acai", "Banane congelee", "Lait d'amande", "Granola", "Fruits frais", "Beurre de cacahuete"],
  },
  {
    id: "cr5",
    creatorId: "c1",
    name: "Soupe Miso Authentique",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=700&fit=crop",
    time: "30 min",
    difficulty: "Moyen",
    tags: ["Japonais", "Reconfort", "Leger"],
    ingredients: ["Dashi", "Miso blanc", "Tofu soyeux", "Wakame", "Oignon vert", "Champignons shiitake"],
  },
  {
    id: "cr6",
    creatorId: "c3",
    name: "Fondant Chocolat Intense",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=700&fit=crop",
    time: "25 min",
    difficulty: "Moyen",
    tags: ["Dessert", "Chocolat", "Gourmand"],
    ingredients: ["Chocolat noir 70%", "Beurre", "Oeufs", "Sucre", "Farine", "Fleur de sel"],
  },
];

export const samplePosts = [
  {
    id: 1,
    user: {
      name: "Marie",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    },
    recipeId: "r1",
    mainImage: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=800&fit=crop",
    selfieImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    caption: "Mon premier buddha bowl ! Pas mal pour un lundi soir non ? 😄",
    reactions: [
      { emoji: "🔥", count: 12 },
      { emoji: "😍", count: 8 },
    ],
    time: "Il y a 2h",
  },
  {
    id: 2,
    user: {
      name: "Lucas",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
    recipeId: "r2",
    mainImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=800&fit=crop",
    selfieImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    caption: "Le saumon miso c'est une tuerie, merci bonapp' 🐟",
    reactions: [
      { emoji: "😋", count: 15 },
      { emoji: "👨‍🍳", count: 4 },
    ],
    time: "Il y a 4h",
  },
  {
    id: 3,
    user: {
      name: "Camille",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    },
    recipeId: "r1",
    mainImage: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=800&fit=crop",
    selfieImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    caption: "J'ai ajoute des edamames dans mon bowl, trop bon !",
    reactions: [
      { emoji: "💪", count: 22 },
      { emoji: "🥗", count: 9 },
    ],
    time: "Il y a 6h",
  },
  {
    id: 4,
    user: {
      name: "Hugo",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    },
    recipeId: "r3",
    mainImage: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&h=800&fit=crop",
    selfieImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    caption: "Wrap express entre deux cours, parfait 🌯",
    reactions: [
      { emoji: "⚡", count: 7 },
      { emoji: "😍", count: 5 },
    ],
    time: "Il y a 8h",
  },
  {
    id: 5,
    user: {
      name: "Emma",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    },
    recipeId: "r2",
    mainImage: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&h=800&fit=crop",
    selfieImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
    caption: "Ma version du saumon miso, un peu cramee mais delicieuse 😅",
    reactions: [
      { emoji: "😂", count: 18 },
      { emoji: "🥢", count: 6 },
    ],
    time: "Il y a 12h",
  },
];

export const profileUser = {
  name: "Toi",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face",
  bio: "Etudiant foodie en mission healthy",
  stats: { plats: 12, amis: 24, semaines: 6 },
  streakCount: 6,
};

export const friendsCooked = ["Marie", "Lucas", "Camille"];

// User's weekly realization — shown after recipes in Friends feed
export const userWeeklyRealization = {
  id: 200,
  user: { name: "Toi", avatar: profileUser.avatar },
  recipeId: "r1",
  mainImage: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=800&fit=crop",
  selfieImage: profileUser.avatar,
  caption: "Ma meilleure version du bowl, avec du tofu grille en plus !",
  reactions: [
    { emoji: "🔥", count: 8 },
    { emoji: "💪", count: 14 },
  ],
  time: "Il y a 1h",
};

export const profilePosts = [
  {
    id: 101,
    user: { name: "Toi", avatar: profileUser.avatar },
    recipeId: "r1",
    mainImage: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=800&fit=crop",
    selfieImage: profileUser.avatar,
    caption: "Ma meilleure version du bowl, avec du tofu grille en plus !",
    reactions: [
      { emoji: "🔥", count: 8 },
      { emoji: "💪", count: 14 },
    ],
    time: "15 mars",
  },
  {
    id: 102,
    user: { name: "Toi", avatar: profileUser.avatar },
    recipeId: "r2",
    mainImage: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=800&fit=crop",
    selfieImage: profileUser.avatar,
    caption: "Un peu trop de miso mais le resultat etait top 🐟",
    reactions: [
      { emoji: "😋", count: 11 },
      { emoji: "👨‍🍳", count: 6 },
    ],
    time: "12 mars",
  },
  {
    id: 103,
    user: { name: "Toi", avatar: profileUser.avatar },
    recipeId: "r3",
    mainImage: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&h=800&fit=crop",
    selfieImage: profileUser.avatar,
    caption: "Wrap express entre deux cours, pret en 10 minutes 🌯",
    reactions: [
      { emoji: "⚡", count: 9 },
      { emoji: "😍", count: 7 },
    ],
    time: "8 mars",
  },
  {
    id: 104,
    user: { name: "Toi", avatar: profileUser.avatar },
    recipeId: "r1",
    mainImage: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=800&fit=crop",
    selfieImage: profileUser.avatar,
    caption: "Premier essai de poke bowl, je suis fan 🍣",
    reactions: [
      { emoji: "🤩", count: 19 },
      { emoji: "🥢", count: 5 },
    ],
    time: "3 mars",
  },
];

export const calendarData = {
  "2026-03-15": { recipeName: "Buddha Bowl Maison", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop", thumbnail: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=80&h=80&fit=crop" },
  "2026-03-12": { recipeName: "Saumon Miso Express", image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=200&fit=crop", thumbnail: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=80&h=80&fit=crop" },
  "2026-03-08": { recipeName: "Wrap Poulet du Midi", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=200&h=200&fit=crop", thumbnail: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=80&h=80&fit=crop" },
  "2026-03-03": { recipeName: "Poke Bowl Saumon", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop", thumbnail: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80&h=80&fit=crop" },
  "2026-02-25": { recipeName: "Salade Cesar Revisitee", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=200&h=200&fit=crop", thumbnail: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=80&h=80&fit=crop" },
  "2026-02-20": { recipeName: "Curry de Legumes", image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=200&h=200&fit=crop", thumbnail: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=80&h=80&fit=crop" },
  "2026-02-14": { recipeName: "Buddha Bowl Special", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop", thumbnail: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=80&h=80&fit=crop" },
};

export const creators = [
  {
    id: "c1",
    name: "Chef Amira",
    avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&h=200&fit=crop&crop=face",
    bio: "Cheffe passionnee, cuisine du monde healthy. 10 ans d'experience en gastronomie vegetale.",
    type: "chef",
    theme: { primary: "#E11D48", secondary: "#FFF1F2", accent: "#FB7185", bg: "#FFFBFB" },
    followers: 12400,
    recipes: 89,
    verified: true,
    featuredRecipes: [
      { name: "Tajine Veggie", image: "https://images.unsplash.com/photo-1511690743698-d9d18f7e20f1?w=400&h=500&fit=crop", time: "45 min" },
      { name: "Bowl Mediterraneen", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=500&fit=crop", time: "20 min" },
      { name: "Soupe Miso Maison", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=500&fit=crop", time: "30 min" },
    ],
    posts: [
      { id: "cp1", recipeId: "cr2", image: "https://images.unsplash.com/photo-1511690743698-d9d18f7e20f1?w=600&h=600&fit=crop", caption: "Mon tajine veggie revisite avec des epices fraiches du marche", likes: 842, time: "Il y a 3h" },
      { id: "cp2", recipeId: "cr5", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=600&fit=crop", caption: "La base d'une bonne soupe miso : le dashi fait maison", likes: 1203, time: "Il y a 1j" },
    ],
  },
  {
    id: "c2",
    name: "FitFood Leo",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
    bio: "Coach nutrition & food content creator. Je rends le healthy fun et accessible !",
    type: "influenceur",
    theme: { primary: "#7C3AED", secondary: "#EDE9FE", accent: "#A78BFA", bg: "#FAFAFF" },
    followers: 45200,
    recipes: 156,
    verified: true,
    featuredRecipes: [
      { name: "Protein Pancakes", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=500&fit=crop", time: "15 min" },
      { name: "Smoothie Bowl", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=500&fit=crop", time: "5 min" },
      { name: "Meal Prep Poulet", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=500&fit=crop", time: "40 min" },
    ],
    posts: [
      { id: "cp3", recipeId: "cr1", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=600&fit=crop", caption: "Protein pancakes en 15 min chrono ! La recette dans mon profil", likes: 2341, time: "Il y a 5h" },
      { id: "cp4", recipeId: "cr4", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&h=600&fit=crop", caption: "Mon smoothie bowl du matin, 35g de proteines !", likes: 1876, time: "Il y a 2j" },
    ],
  },
  {
    id: "c3",
    name: "Chez Olivier",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face",
    bio: "Restaurant bistronomique Paris 11e. Cuisine de saison, produits locaux, carte renouvelee chaque semaine.",
    type: "restaurateur",
    theme: { primary: "#D97706", secondary: "#FEF3C7", accent: "#FBBF24", bg: "#FFFDF7" },
    followers: 8900,
    recipes: 42,
    verified: true,
    featuredRecipes: [
      { name: "Risotto Truffe", image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=500&fit=crop", time: "35 min" },
      { name: "Tartare Saumon", image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=500&fit=crop", time: "20 min" },
      { name: "Fondant Chocolat", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=500&fit=crop", time: "25 min" },
    ],
    posts: [
      { id: "cp5", recipeId: "cr3", image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&h=600&fit=crop", caption: "Notre risotto a la truffe noire, en carte cette semaine", likes: 567, time: "Il y a 6h" },
      { id: "cp6", recipeId: "cr6", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop", caption: "Le fondant chocolat qui fait revenir nos clients depuis 5 ans", likes: 923, time: "Il y a 1j" },
    ],
  },
];

export const creatorFeedPosts = [
  { id: "cf1", creatorId: "c2", recipeId: "cr1", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=800&fit=crop", caption: "Protein pancakes en 15 min chrono ! La recette dans mon profil", likes: 2341, time: "Il y a 5h" },
  { id: "cf2", creatorId: "c1", recipeId: "cr2", image: "https://images.unsplash.com/photo-1511690743698-d9d18f7e20f1?w=600&h=800&fit=crop", caption: "Mon tajine veggie revisite avec des epices fraiches du marche", likes: 842, time: "Il y a 3h" },
  { id: "cf3", creatorId: "c3", recipeId: "cr3", image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&h=800&fit=crop", caption: "Notre risotto a la truffe noire, en carte cette semaine", likes: 567, time: "Il y a 6h" },
  { id: "cf4", creatorId: "c2", recipeId: "cr4", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&h=800&fit=crop", caption: "Mon smoothie bowl du matin, 35g de proteines !", likes: 1876, time: "Il y a 2j" },
  { id: "cf5", creatorId: "c1", recipeId: "cr5", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=800&fit=crop", caption: "La base d'une bonne soupe miso : le dashi fait maison", likes: 1203, time: "Il y a 1j" },
  { id: "cf6", creatorId: "c3", recipeId: "cr6", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=800&fit=crop", caption: "Le fondant chocolat qui fait revenir nos clients depuis 5 ans", likes: 923, time: "Il y a 1j" },
];
