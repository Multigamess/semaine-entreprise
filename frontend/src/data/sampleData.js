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
  "2026-03-15": { recipeName: "Buddha Bowl Maison", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop" },
  "2026-03-12": { recipeName: "Saumon Miso Express", image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=200&fit=crop" },
  "2026-03-08": { recipeName: "Wrap Poulet du Midi", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=200&h=200&fit=crop" },
  "2026-03-03": { recipeName: "Poke Bowl Saumon", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop" },
  "2026-02-25": { recipeName: "Salade Cesar Revisitee", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=200&h=200&fit=crop" },
  "2026-02-20": { recipeName: "Curry de Legumes", image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=200&h=200&fit=crop" },
  "2026-02-14": { recipeName: "Buddha Bowl Special", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop" },
};
