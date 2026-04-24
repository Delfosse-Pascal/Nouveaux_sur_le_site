# Nouveaux_sur_le_site

Idées et prototypes pour faire évoluer le site personnel de Pascal (Lab Pascal) vers un **outil créatif interactif** plutôt qu'un simple site vitrine.

## Contenu

```
.
├── idee de ChatGpt.txt   # Pistes ChatGPT : interactivité, mini-outils, bac à sable, hub local
├── idee de claude.txt    # Pistes Claude : contenus gratuits, outils webmaster, UX, communauté
├── chatgpt/
│   ├── index.html        # Prototype Lab Pascal (gallery + canvas + drag&drop)
│   └── code.txt          # Copie brute du code
└── claude/               # (à remplir)
```

## Axes explorés

### Côté ChatGPT — site comme terrain de jeu
- Interaction immédiate : bouton "Surprise", mélange auto de textures, filtres temps réel
- Mini-outils perso : générateur palettes, textures répétables, mosaïque
- Mode bac à sable : drag & drop images, calques, zoom/rotation
- Dimension sensorielle : ambiance sonore, micro-animations
- Automatisation : "tableau du jour", rotation aléatoire, associations image/son/texture
- Mini-jeux rapides : puzzle, memory, intrus
- Hub local : parcours de disques, lanceur de scripts `.bat`

### Côté Claude — ressources gratuites + outils
- Contenus libres : mockups PSD, templates Canva/Figma, overlays vidéo, LUTs, presets Lightroom, patterns SVG, loops audio, prompts IA, wallpapers, stickers, icônes Lottie
- Outils webmaster navigateur : compresseur image, convertisseurs (HEIC/WebP/SVG), fond IA local, favicon, QR, meta SEO, minifier, palette, dégradé CSS, contraste WCAG
- UX/Navigation : barre recherche globale, tags/filtres, menu hiérarchique, page Nouveautés, mode sombre, PWA, favoris localStorage
- Communauté : soumissions, commentaires, newsletter, tutoriels logiciels libres, challenges mensuels

## Prototype actuel

`chatgpt/index.html` — page HTML autonome :
- Chargement d'un dossier d'images (`webkitdirectory`)
- Galerie cliquable → rendu sur `<canvas>`
- Mode aléatoire (5 copies alpha variable)
- Drag & drop de fichiers
- Fonction `applyTexture()` (pattern repeat)

Ouvrir directement dans le navigateur, aucune dépendance.

## Direction

> Penser **outil personnel interactif**, pas site web classique.
> Priorités : interaction · automatisation · expérimentation.
