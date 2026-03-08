# Déploiement sur GitHub Pages (hangul-learn)

## Erreur 404 sur main.jsx

Si tu vois `GET https://blandinebalde.github.io/main.jsx 404`, c’est que **GitHub Pages sert le code source** (les fichiers du dépôt) au lieu du **build** (fichiers compilés dans `dist/`).

## À faire sur GitHub

1. Ouvre ton dépôt **hangul-learn** sur GitHub.
2. Va dans **Settings** (Paramètres) → **Pages** (dans le menu de gauche).
3. Dans **Build and deployment** > **Source**, choisis **GitHub Actions** (et non « Deploy from a branch »).
4. Enregistre si besoin.

Ensuite :

5. Va dans l’onglet **Actions** du dépôt.
6. Lance le workflow **« Deploy to GitHub Pages »** (bouton **Run workflow** si tu veux le lancer à la main).
7. Ou fais un **push** sur la branche `main` (ou `master`) : le workflow se lance tout seul.
8. Attends que le job soit **vert** (succès).

Une fois le déploiement terminé, le site utilise le contenu du **build** (`dist/`), avec les bons chemins (plus de 404 sur `main.jsx`).

## Vérifier

- URL du site : **https://blandinebalde.github.io/hangul-learn/**
- Le `vite.config.js` doit contenir : `base: "/hangul-learn/"`.
- Le dépôt doit s’appeler **hangul-learn** pour que cette URL soit correcte.

## Si le projet est dans un sous-dossier

Si ton dépôt a la forme `hangul-learn/app/` (avec `package.json` dans `app/`), il faut que le workflow exécute les commandes dans ce dossier. Dis-le-moi et j’adapterai le fichier `.github/workflows/deploy.yml` en conséquence.
