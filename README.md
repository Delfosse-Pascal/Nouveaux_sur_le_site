# Nouveaux_sur_le_site

Depot du hub local de Pascal pour organiser les pages HTML, galeries, tests visuels et tiroirs de travail.

Le depot garde les pages et les scripts utiles, mais exclut volontairement les images, videos, musiques et archives lourdes.

## Structure

```text
.
|-- index.html                 # Menu central genere automatiquement
|-- index2.html                # Version alternative futuriste / neon
|-- README.md                  # Documentation du depot
|-- .gitignore                 # Exclut images, videos, musiques, archives
`-- Les_Index_Magique/
    |-- *.html                 # Pages HTML sources
    |-- <tiroirs>/             # Sous-dossiers conserves
    |-- update_index.ps1       # Generateur de index.html
    `-- update_index.bat       # Lanceur double-clic du generateur
```

## Pages principales

### `index.html`

Page centrale generee par :

```powershell
Les_Index_Magique\update_index.bat
```

Elle scanne le dossier `Les_Index_Magique/` et fabrique des cartes vers les pages HTML trouvees.

Caracteristiques :

- liens vers les pages de `Les_Index_Magique/`
- mode sombre / clair avec sauvegarde dans `localStorage`
- menu social conserve
- `<header></header>` conserve pour le menu injecte par `menu.js`
- ressources externes Pascal depuis `https://filedn.eu/llN3kr5vmyEBPIWCwFj3O6h/Site_Web/`
- vignettes en degrade, sans image locale necessaire

Important : `index.html` est regenere. Toute modification durable doit etre faite dans `Les_Index_Magique/update_index.ps1`.

### `index2.html`

Page alternative creee a la racine du depot.

Style :

- presentation futuriste neon
- couleurs agressives
- fond anime
- scanlines
- titre glitch
- bandeau defilant
- cartes animees
- canvas lumineux interactif

Les cartes pointent vers :

```text
Les_Index_Magique/<page>.html
```

Les deux menus sont conserves :

- menu social `<nav class="social-menu">`
- menu principal injecte dans `<header></header>`

## Generation de `index.html`

Le generateur est ici :

```text
Les_Index_Magique/update_index.ps1
```

Le lanceur double-clic est ici :

```text
Les_Index_Magique/update_index.bat
```

Regle importante : `update_index.ps1` doit rester en UTF-8 avec BOM pour eviter les accents casses avec PowerShell 5.1.

## Git

Le depot doit rester leger.

On commit :

- fichiers HTML
- fichiers CSS
- fichiers JS
- scripts PowerShell / batch
- documentation
- `.gitkeep` pour garder un tiroir vide

On ne commit pas :

- images
- videos
- musiques
- archives

Le `.gitignore` exclut deja ces formats.

Pour garder un tiroir vide dans Git, placer un fichier vide nomme :

```text
.gitkeep
```

## Commandes utiles

Voir les changements :

```powershell
git status --short
```

Ajouter uniquement les fichiers textes utiles :

```powershell
git add README.md index.html index2.html Les_Index_Magique/*.html Les_Index_Magique/*.ps1 Les_Index_Magique/*.bat
```

Verifier ce qui va etre commite :

```powershell
git diff --cached --name-only
```

Commit et push :

```powershell
git commit -m "Met a jour le site"
git push origin main
```

## Direction

Ce projet est un outil personnel interactif : beaucoup d'essais, beaucoup de tiroirs, mais un depot Git propre et leger.
