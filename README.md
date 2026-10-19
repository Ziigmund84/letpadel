# Let Padel Club — site internet

Site multipage du Let Padel (Saint-Pryvé-Saint-Mesmin & Fleury-les-Aubrais), hébergé sur **GitHub Pages**
et alimenté par **Supabase** (projet `harmonie-olivet`, tables préfixées `letpadel_`).

- Site : https://ziigmund84.github.io/letpadel/
- Administration : https://ziigmund84.github.io/letpadel/admin/

## Pages

| Fichier | Contenu |
| --- | --- |
| `index.html` | Accueil : court 3D animé, présentation, Jouer / Apprendre / Entreprise, les deux centres, chiffres, premier match, cuisine, actualités, FAQ |
| `centres.html` | Les deux centres (adresse, horaires, accès, plan), équipements, tarifs, avantages club |
| `academie.html` | Découvrir le padel, jeunes / adultes, cycles, cours ponctuels, stages, centre d'entraînement, coachs |
| `entreprise.html` | Formules entreprise, Lunch Social Club, Afterwork tournoi, interlocuteur, galerie |
| `restaurant.html` | La cuisine du Let |
| `club.html` | Notre histoire, infrastructures, club house, galerie |
| `actualites.html` | Actualités, événements et blog (filtrables) |
| `contact.html` | Formulaire (enregistré dans Supabase), FAQ, plans d'accès |
| `mentions-legales.html`, `404.html` | Pages légales / erreur |
| `admin/` | Espace d'administration |

Les textes, images, tarifs, horaires, actualités, coachs, FAQ… sont **tous modifiables depuis l'admin** :
les pages HTML ne contiennent que la structure et le contenu par défaut.

## Technique

- HTML / CSS / JavaScript (modules ES) sans étape de compilation.
- Animations : GSAP + ScrollTrigger, défilement fluide Lenis (désactivés si l'utilisateur a demandé à réduire les animations).
- Données : API REST Supabase (lecture publique protégée par RLS), cache de 3 minutes par onglet.
- Admin : Supabase Auth (e-mail + mot de passe). Seuls les comptes listés dans `letpadel_admins` peuvent modifier.
- Médias : bucket public `letpadel-media` (`site/` = médias repris de l'ancien site, `uploads/` = ajouts depuis l'admin, compressés automatiquement).

`assets/js/config.js` contient l'URL du projet et la clé **publishable** (publique par conception ;
la sécurité repose sur les règles RLS).

## Base de données

`supabase/01_schema.sql` (tables, RLS, bucket, admin) et `supabase/02_seed.sql` (contenu initial).

Ajouter un administrateur (le compte doit d'abord exister dans Supabase Auth) :

```sql
insert into public.letpadel_admins (user_id)
select id from auth.users where lower(email) = 'adresse@exemple.fr';
```

## Régénérer les pages secondaires

Les pages autres que `index`, `centres` et `academie` sont produites par `tools/make_pages.py` :

```bash
python3 tools/make_pages.py
```
