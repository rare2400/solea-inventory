# Solea jewelry - lagersystem

Detta är en Single Page Application (SPA) byggd med vue.js som används för att hantera produkter och användare i ett lagersystem för det fiktiva smyckesföretaget Solea. Applikationen kommunicerar med ett externt REST API och erbjuder funktioner för autentisering, produktadministration och användarhantering. 


## Verktyg
- Vue.js (CLI med Vite)
- Vue Router
- JavaScript
- Fetch API
- HTML & CSS (inkl. komponentbaserad CSS)
- Bootstrap

## Funktionalitet
### Autentisering
- Inloggning med JWT
- Token lagras i `localStorage`
- Skyddade routes (redirects användare inte är auktoriserad)

### Produkthantering
- Visa alla produkter
- Filtrera produkter (sök & kategori)
- Visa produktdetaljer
- Skapa ny produkt
- Redigera produkt
- Ta bort produkt (admin)
- Uppdatera lagersaldo (direkt i UI)

### Användarhantering (Admin)
- Visa alla användare
- Skapa ny användare
- Redigera användare
- Ta bort användare

### Navigation och UX
- Dynamisk routing med Vue Router
- Villkorsstyrd rendering
- Responsiv design

## Projektstruktur
```
src/
├── components/       - Återanvändbara komponenter (ex. ProductDetail, UserManager)
├── views/            - Sidor (Login, Dashboard, Product, ProductForm)
├── router/           - Router-konfiguration
├── services/         - API-anrop
└── assets/           - Bilder och styling
```

## API
[API repo](https://github.com/rare2400/solea-api.git)
Länk till API: [https://solea-api.onrender.com](https://solea-api.onrender.com)

## API struktur
Alla anrop hanteras via en central funktion i `api.js`
```js
async function request(endpoint, options = {}) {}
```

Det:
- Återanvänder fetch-logik
- Lägger till headers automatiskt
- Hanterar fel konsekvent

Exempel
```js
// Register new user
register: (data) => request("/auth/register", {
  method: "POST",
  body: JSON.stringify(data)
})
```

## Installation
1. Klona repo:

```sh
git clone https://github.com/rare2400/solea-inventory.git
```

2. Installera dependencies

```sh
npm install
```

3. Starta utvecklingsserver

```sh
npm run dev
```

4. Kompilera och minifiera för produktion

```sh
npm run build
```

## Skapad av
Skapad som en del av en skoluppgift   
Mittuniversitetet, Webbutvecklingsprogrammet    
Ramona Reinholdz   
[rare2400@student.miun.se](rare2400@student.miun.se)      
2026-05-26
