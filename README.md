# COMAL

Site vitrine + annuaire pour la communauté des anciens étudiants formés au
Maroc, aujourd'hui actifs à Abidjan.

Application Next.js (App Router, TypeScript), pensée pour un déploiement
direct sur Vercel.

## Structure

```
app/
  layout.tsx            polices (Inter), métadonnées, structure HTML
  page.tsx               assemble les sections de la page
  globals.css            styles (thème sombre, accent orange)
  icon.svg                favicon / icône de l'app
components/
  Nav.tsx, Hero.tsx, Mission.tsx, Footer.tsx
  Carousel.tsx            carrousel photo (drag, flèches, points, autoplay) — client component
  RegistrationForm.tsx     formulaire d'inscription vers Supabase — client component
lib/
  supabaseClient.ts        client Supabase (variables d'environnement)
public/images/             photos du carrousel (SVG placeholders à remplacer)
```

## 1. Installation

```bash
npm install
```

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
     email text not null,
     whatsapp text
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

   Si la table `inscriptions` existe déjà avec une colonne `contact`
   (ancienne version du formulaire), migrez-la plutôt avec :

   ```sql
   alter table public.inscriptions rename column contact to email;
   alter table public.inscriptions add column whatsapp text;
   ```

3. Dans **Project Settings > API**, récupérez `Project URL` et la clé
   `anon public`.
4. Copiez `.env.example` en `.env.local` et renseignez-les :

   ```bash
   cp .env.example .env.local
   ```

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```

`.env.local` n'est jamais commité (voir `.gitignore`). Tant que ces
variables ne sont pas renseignées, le formulaire affiche un message
indiquant qu'il n'est pas encore connecté, sans planter.

Pour consulter les inscriptions, utilisez le Table Editor de Supabase (ou
créez un accès admin séparé) — la clé `anon` utilisée côté site ne permet
que l'insertion, pas la lecture, conformément à la policy ci-dessus.

## 3. Développement local

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## 4. Déploiement sur Vercel

1. Importez le dépôt dans [Vercel](https://vercel.com/new) (le framework
   Next.js est détecté automatiquement, aucune configuration nécessaire).
2. Dans **Project Settings > Environment Variables**, ajoutez les deux
   mêmes variables que dans `.env.local` :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Déployez. Chaque push sur la branche liée redéploie automatiquement.

## 5. Remplacer les photos du carrousel

Les fichiers `public/images/carousel-1.svg` à `carousel-6.svg` sont des
visuels de remplacement (abstraits). Pour les remplacer par de vraies
photos :

1. Préparez des photos au format paysage (idéalement ratio 16:9,
   ~1600×900px), par exemple `carousel-1.jpg`.
2. Placez-les dans `public/images/`.
3. Mettez à jour le tableau `SLIDES` dans `components/Carousel.tsx`
   (chemin `src`, texte alternatif `alt`, et légende `title`/`meta` —
   nom du moment + lieu/date).

## 6. Accessibilité

- Focus clavier visible sur tous les éléments interactifs.
- `prefers-reduced-motion` respecté : désactive le défilement automatique
  du carrousel et les transitions animées.
- Carrousel utilisable au clavier (boutons flèches) et au tactile
  (glisser).
