# Drawing App - Éditeur de Dessin

Ce projet a été réalisé dans le cadre de l'**UE Ingénierie des Systèmes Interactifs (ISI)** à l'IMT Atlantique. L'objectif principal est de développer une application de dessin 2D complète en React, en partant d'une interface graphique (GUI) maquettée. L'accent est mis sur la gestion des événements souris, la gestion de l'état (via les hooks React) et l'implémentation d'un design pattern (State) pour les modes d'interaction.

L'application de dessin développée permet de créer, sélectionner, modifier et supprimer des formes géométriques 2D simples. Elle utilise un *unidirectional pattern flow* offert par Redux.

---

## 🚀 Fonctionnalités

L'application de dessin implémente les fonctionnalités suivantes :

* **Sélection d'outils :** Une barre d'outils permet de choisir le mode d'interaction actif :
    * Sélectionner & Déplacer (Select&Move)
    * Rectangle
    * Ellipse
    * Ligne
    * Crayon (Pencil / Path)
* **Gestion des Modes :** Implémentation d'un *state design pattern* pour gérer le comportement de l'interaction utilisateur (clic, glisser-déposer) en fonction de l'outil sélectionné. Un objet `useMode` a été développé afin de pouvoir palier aux problèmes rencontrés avec un *useState* classique.
* **Gestion des Styles :** L'utilisateur peut définir la couleur de remplissage, la couleur de contour et l'épaisseur du contour. Afin d'améliorer le système de feedback, la couleur de remplissage est désactivée lors de l'utilisation des modes *Ligne* ou *Crayon*, ou lorsque qu'un objet de ce type est sélectionné.
* **Synchronisation des Styles :** Les styles s'appliquent aux nouvelles formes dessinées. De plus, lors de la sélection d'une forme, les champs de style se mettent à jour pour refléter les propriétés de cette forme.
* **Interaction Canvas :** Gestion complète des événements souris (`onMouseDown`, `onMouseMove`, `onMouseUp`) pour permettre le dessin dynamique.
* **Sélection et Déplacement :** En mode *Select/Move*, un clic sur une forme la sélectionne. La forme sélectionnée peut ensuite être déplacée sur le canevas.
* **Actions d'Édition :**
    * **Delete :** Supprime l'objet actuellement sélectionné. Bouton désactivé lorsqu'aucun objet n'est sélectionné.
    * **Clone :** Duplique l'objet sélectionné avec une légère translation. Bouton désactivé lorsqu'aucun objet n'est sélectionné.
* **Implémentation des Formes :** Création de classes spécifiques pour chaque type de forme (`RectangleItem`, `EllipseItem`, `LineItem`, `PathItem`), toutes héritant d'une interface `CanvasItem` commune.

---

## ▶️ Fonctionnement des slices

Le store Redux ne pouvant contenir que des objets sérialisables, l'interface sérialisable `SerializedCanvasItem` a été réalisée pour représenter tous les éléments relatifs au visuel des objets `CanvasItem`. L'état du canvas dans la slice `canvasSlice` est donc composé d'une liste de `SerializedCanvasItem` ainsi que l'identifiant de l'objet sélectionné courant.

La liste des objets ainsi que l'objet sélectionné sont par ailleurs stocké dans `PersistentElements`. Ce sont leurs équivalents non sérialisables, qui permettent de les dessiner sur le canvas.

La slice `toolbarSlice` contient les différents éléments intervenant dans la barre d'outils, à savoir le mode courant, les couleurs de remplissage et de contour, ainsi que la taille du contour. Elle est synchronisée avec les attributs correspondants de l'objet `PersistentElements`.

---

## 📁 Structure du dépôt

```sh
└── Drawing-app/
    ├── src/
    │   ├── components/         # Composants React (App, Canvas, Toolbar)
    │   │   ├── App.tsx
    │   │   ├── Canvas.tsx
    │   │   └── Toolbar.tsx
    │   ├── core/               # Logique métier principale
    │   │   ├── mode/           # Design Pattern State pour les modes
    │   │   │   ├── EllipseMode.ts
    │   │   │   ├── LineMode.ts
    │   │   │   ├── Mode.ts
    │   │   │   ├── modeTypes.ts
    │   │   │   ├── PathMode.ts
    │   │   │   ├── RectangleMode.ts
    │   │   │   └── SelectMoveMode.ts
    │   │   ├── shapes/         # Classes pour les formes dessinables
    │   │   │   ├── CanvasItem.ts
    │   │   │   ├── EllipseItem.ts
    │   │   │   ├── LineItem.ts
    │   │   │   ├── PathItem.ts
    │   │   │   └── RectangleItem.ts
    │   │   └── PersistentElements.ts # Classe de gestion du canvas
    │   ├── hooks/              # Hooks React personnalisés
    │   │   ├── storeHooks.ts   # Hooks typés pour Redux
    │   │   └── useMode.ts      # Hook de gestion des modes
    │   ├── store/              # Configuration Redux
    │   │   ├── slices/         # Slices Redux
    │   │   │   ├── canvasSlice.ts
    │   │   │   └── toolbarSlice.ts
    │   │   └── store.ts        # Configuration du store
    │   ├── styles/             # Fichiers CSS
    │   │   ├── App.css
    │   │   ├── Canvas.css
    │   │   └── Toolbar.css
    │   ├── index.css           # CSS Global
    │   └── index.tsx           # Point d'entrée de l'application
    ├── .gitignore
    ├── eslint.config.js      # Configuration ESLint
    ├── index.html            # Fichier HTML principal
    ├── package.json          # Dépendances et scripts
    ├── README.md             # Documentation du projet
    ├── tsconfig.app.json     # Configuration TypeScript pour l'app
    ├── tsconfig.json         # Configuration TypeScript racine
    ├── tsconfig.node.json    # Configuration TypeScript pour Node
    └── vite.config.ts        # Configuration Vite
```

---

## 🛠️ Installation et Utilisation

Ce projet utilise [Vite](https://vitejs.dev/) et [npm](https://www.npmjs.com/).

### 1. Installation

1.  **Clonez le dépôt :**
    ```sh
    git clone https://github.com/Antoplt/Drawing-app
    ```
2.  **Accédez au répertoire du projet :**
    ```sh
    cd Drawing-app
    ```
3.  **Installez les dépendances :**
    ```sh
    npm install
    ```

### 2. Lancement

1.  **Démarrer le serveur de développement :**
    ```sh
    npm run dev
    ```


## 🧑‍💻 Auteur

* **Étudiant :** Polette Antonin
* **Cours :** UE Ingénierie des Systèmes Interactifs
* **Professeur :** Cédric Fleury (cedric.fleury@imt-atlantique.fr)