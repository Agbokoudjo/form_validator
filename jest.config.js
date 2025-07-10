/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // Utilisez 'jsdom' si vous testez le DOM/navigateur, ou 'node' pour la logique pure
  
  // 1. Spécifie que Jest doit chercher les fichiers dans le dossier 'src'
  roots: [
    "<rootDir>/src"
  ],

  // 2. Définit le pattern de recherche des fichiers de test
  testMatch: [
    // Cela cherche tous les fichiers se terminant par .test.ts ou .spec.ts
    // dans le sous-dossier 'test/jest' (par rapport à la racine spécifiée)
    "<rootDir>/src/test/jest/**/*.+(ts|tsx|js)",
    // Garder le pattern générique si vous avez d'autres tests ailleurs
    "**/?(*.)+(spec|test).+(ts|tsx|js)" 
  ],
  
  // Exclut les dossiers comme node_modules et le dossier de build
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/" 
  ]
};

export default config;