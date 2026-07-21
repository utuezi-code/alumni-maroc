# Alumni Maroc CI

Site vitrine + annuaire pour la communauté des anciens étudiants formés au
Maroc, aujourd'hui actifs à Abidjan.

Site statique en HTML/CSS/JS (aucun framework, aucun build). Déployable tel
quel sur Vercel, Netlify, GitHub Pages ou tout hébergement statique.

## Structure

```
index.html
css/styles.css        styles (thème sombre, accent orange)
js/carousel.js         carrousel photo (drag, flèches, points, autoplay)
js/supabase-config.js  identifiants Supabase à renseigner
js/form.js             soumission du formulaire d'inscription vers Supabase
images/                photos du carrousel (SVG placeholders à remplacer) + favicon
```

## 1. Remplacer les photos du carrousel

Les fichiers `images/carousel-1.svg` à `carousel-6.svg` sont des visuels
de remplacement (abstraits). Pour les remplacer par de vraies photos :

1. Préparez des photos au format paysage (idéalement ratio 16:9, ~1600×900px).
2. Remplacez chaque fichier `images/carousel-N.jpg` (ou gardez le `.svg` si
   vous préférez des visuels vectoriels) et mettez à jour le `src` de
   l'`<img>` correspondant dans `index.html` (section `<!-- CARROUSEL -->`).
3. Mettez à jour les légendes (nom du moment + lieu/date) dans les balises
   `.carousel__caption-title` / `.carousel__caption-meta`.

## 2. Configurer Supabase (annuaire des inscriptions)

1. Créez un projet gratuit sur [supabase.com](https://supabase.com).
2. Dans l'éditeur SQL du projet, exécutez :

   ```sql
   create table public.inscriptions (
     id uuid primary key default gen_random_uuid(),
     created_at timestamptz not null default now(),
     full_name text not null,
     school text not null,
     graduation_year int not null,
     nationality text not null,
     sector text not null,
     contact text not null
   );

   alter table public.inscriptions enable row level security;

   -- Autorise uniquement l'insertion depuis le site (rôle anon),
   -- aucune lecture publique des données des membres.
   create policy "Insertion publique"
     on public.inscriptions
     for insert
     to anon
     with check (true);
   ```

3. Dans **Project Settings > API**, récupérez `Project URL` et la clé
   `anon public`.
4. Renseignez-les dans `js/supabase-config.js` :

   ```js
   export const SUPABASE_URL = 'https://xxxx.supabase.co';
   export const SUPABASE_ANON_KEY = 'eyJ...';
   ```

Tant que ces valeurs ne sont pas renseignées, le formulaire affiche un
message indiquant qu'il n'est pas encore connecté, sans planter.

Pour consulter les inscriptions, utilisez le Table Editor de Supabase (ou
créez un accès admin séparé) — la clé `anon` utilisée côté site ne permet
que l'insertion, pas la lecture, conformément à la policy ci-dessus.

## 3. Déploiement

Aucune étape de build. Sur Vercel/Netlify : déployez le dossier tel quel
(framework "Other"/"Static"), avec `index.html` à la racine.

## 4. Accessibilité

- Focus clavier visible sur tous les éléments interactifs.
- `prefers-reduced-motion` respecté : désactive le défilement automatique
  du carrousel et les transitions animées.
- Carrousel utilisable au clavier (flèches boutons) et au tactile (glisser).
