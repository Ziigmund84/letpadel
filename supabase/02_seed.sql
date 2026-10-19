-- Let Padel — contenu initial (repris du site letpadel.fr, octobre 2026)
-- Médias : https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/...

-- ============ RÉGLAGES ============
insert into public.letpadel_settings (key, value) values
('general', $${
  "name": "Let Padel Club",
  "tagline": "Entre amis ou en famille, viens jouer ou apprendre à jouer au padel",
  "description": "Club de padel, badminton et pickleball à Saint-Pryvé-Saint-Mesmin et Fleury-les-Aubrais, aux portes d'Orléans. Ouvert tous les jours.",
  "logo": "https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/principal/logo-lp.svg",
  "logo_white": "https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/principal/logo-lp-blanc.svg",
  "booking_url": "https://letpadel.doinsport.club/home",
  "tournaments_url": "https://letpadel.doinsport.club/home",
  "shop_url": "https://www.letpadelshop.fr/",
  "licence_url": "https://www.helloasso.com/associations/st-pryve-tennis-club-sptc/adhesions/licence-2026-2027-sport",
  "instagram": "https://www.instagram.com/letpadel/",
  "facebook": "https://www.facebook.com/Let-Padel-112473637274164",
  "cgv_url": "https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/docs/let-padel_cgv_052023.pdf",
  "brochure_url": "https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/docs/let-padel-academie-2026-2027.pdf",
  "pedago_email": "mathis.d@letpadel.fr"
}$$::jsonb),
('hours', $${
  "items": [
    {"days": "Du lundi au vendredi", "hours": "10h – 00h"},
    {"days": "Samedi & dimanche", "hours": "9h – 21h"}
  ],
  "note": "Ouvert 7 jours sur 7, dans nos deux centres."
}$$::jsonb),
('home_hero', $${
  "kicker": "Padel · Badminton · Pickleball",
  "title": "Entre amis ou en famille,\nviens jouer au padel",
  "highlight": "jouer",
  "subtitle": "Deux clubs aux portes d'Orléans, 8 pistes panoramiques, une académie, un club house… et toujours la même énergie.",
  "image": "https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/accueil/jouer-apprendre.jpg",
  "cta_label": "Je réserve une piste",
  "cta2_label": "Découvrir le club",
  "cta2_url": "club.html"
}$$::jsonb),
('stats', $${
  "items": [
    {"value": "8", "label": "pistes de padel panoramiques"},
    {"value": "2", "label": "centres aux portes d'Orléans"},
    {"value": "4", "label": "coachs diplômés"},
    {"value": "7/7", "label": "ouvert toute la semaine"}
  ]
}$$::jsonb),
('announce', $${
  "active": true,
  "text": "Stage de la Toussaint du 26 au 30 octobre à Saint-Pryvé — inscriptions ouvertes !",
  "url": "academie.html#stages"
}$$::jsonb),
('marquee', $${
  "items": ["Jouer", "Apprendre", "Progresser", "Partager", "Entre amis", "En famille", "Tous niveaux"]
}$$::jsonb),
('tarifs', $${
  "padel_title": "Location padel",
  "padel_columns": ["Heures creuses", "Heures pleines"],
  "padel_rows": [
    {"label": "1 heure", "unit": "par joueur", "values": ["7 €", "9 €"]},
    {"label": "1 heure 30", "unit": "par joueur", "values": ["9,50 €", "12,50 €"]},
    {"label": "2 heures", "unit": "par joueur", "values": ["12 €", "16 €"]}
  ],
  "periods": [
    {"name": "Heures creuses", "lines": ["Lundi → vendredi : 10h – 17h / 22h – 0h", "Samedi & dimanche : 12h – 14h"]},
    {"name": "Heures pleines", "lines": ["Lundi → vendredi : 17h – 22h", "Samedi & dimanche : 9h – 12h / 14h – 21h"]}
  ],
  "other_title": "Pickleball & badminton",
  "other_rows": [
    {"label": "1 heure", "value": "16 € la piste", "note": "soit 8 € par joueur"},
    {"label": "1 heure 30", "value": "24 € la piste", "note": "soit 12 € par joueur"},
    {"label": "2 heures", "value": "32 € la piste", "note": "soit 16 € par joueur"}
  ],
  "extras": [
    {"label": "Location de raquette", "value": "dès 3 €"},
    {"label": "Boîte de balles", "value": "dès 7,50 €"}
  ]
}$$::jsonb),
('legal', $${
  "html": "<h2>Mentions légales</h2><p><strong>Propriétaire :</strong> Let Padel – 10, rue des Moines – 45750 Saint-Pryvé-Saint-Mesmin<br><strong>Éditeur :</strong> Let Padel<br><strong>Responsable de la publication :</strong> Let Padel<br><strong>Hébergement :</strong> GitHub Pages (GitHub, Inc., 88 Colin P. Kelly Jr Street, San Francisco, CA 94107, USA) — données et médias : Supabase (région Paris, eu-west-3).</p><h2>Propriété intellectuelle</h2><p>Les droits de propriété intellectuelle du site sont la propriété exclusive du Let Padel. Toute utilisation, reproduction, diffusion, commercialisation ou modification de tout ou partie du site sans l'autorisation du Let Padel est interdite et pourra être poursuivie conformément aux articles L.335-2 et suivants du Code de la propriété intellectuelle.</p><h2>Crédits</h2><p>Les informations (textes, photos, logos, marques, vidéos, mises en page) diffusées sur ce site sont la propriété du Let Padel ou utilisées avec l'autorisation de leurs propriétaires.</p><h2>Cookies</h2><p>Ce site n'utilise pas de cookie publicitaire ni de traceur de mesure d'audience. Seul l'espace d'administration conserve une session de connexion dans votre navigateur.</p><h2>Données personnelles</h2><p>Les données saisies dans le formulaire de contact (nom, e-mail, téléphone, message) sont collectées par Let Padel uniquement pour répondre à votre demande. Elles ne sont jamais communiquées à des tiers. Vous pouvez demander leur consultation, rectification ou suppression en nous écrivant via le formulaire de contact.</p>"
}$$::jsonb)
on conflict (key) do update set value = excluded.value;

-- ============ CENTRES ============
insert into public.letpadel_centers (slug, name, short_name, address, postcode, city, phone, hours, transport, description, features, image, gallery, map_url, booking_url, sort) values
('saint-pryve', 'Let Padel Saint-Pryvé', 'Saint-Pryvé', '10, rue des Moines', '45750', 'Saint-Pryvé-Saint-Mesmin', '02 18 69 31 69',
 $$[{"days":"Du lundi au vendredi","hours":"10h – 00h"},{"days":"Samedi & dimanche","hours":"9h – 21h"}]$$::jsonb,
 'Bus ligne 7 — arrêt Quatre Tourelles',
 'Le club historique, au sud de la Loire : 4 pistes de padel, un terrain de badminton / pickleball et un club house pour prolonger la partie.',
 $$["4 pistes de padel","Badminton & pickleball","Location de matériel","Vestiaires & sanitaires","Restauration"]$$::jsonb,
 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/accueil/centre-saintpryve.png',
 $$["https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/centres/saint-pryve/spr-reserver.png","https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/centres/saint-pryve/spr-ban-04_slider_h300px.jpg"]$$::jsonb,
 'https://maps.app.goo.gl/qUJDdMSyEvzEaAeS7', 'https://letpadel.doinsport.club/home', 1),
('fleury', 'Let Padel Fleury', 'Fleury', '20, rue André Dessaux', '45400', 'Fleury-les-Aubrais', '02 18 69 32 22',
 $$[{"days":"Du lundi au vendredi","hours":"10h – 00h"},{"days":"Samedi & dimanche","hours":"9h – 21h"}]$$::jsonb,
 'Bus ligne 1 — arrêt Hoche · Tram A — arrêt Gare des Aubrais',
 'Au nord d''Orléans, à deux pas de la gare des Aubrais : 4 pistes de padel, un terrain de badminton / pickleball, un espace détente et la cuisine du Let.',
 $$["4 pistes de padel","Badminton & pickleball","Location de matériel","Vestiaires & sanitaires","Restauration"]$$::jsonb,
 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/accueil/centre-fleury.png',
 $$["https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/centres/fleury/fla-reserver.png","https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/centres/fleury/fla-ban-02_slider_h300px.png"]$$::jsonb,
 'https://maps.app.goo.gl/vdcaJ2AEbCFfeaQK7', 'https://letpadel.doinsport.club/home', 2);

-- ============ COACHS ============
insert into public.letpadel_coaches (name, role, highlight, bio, photo, sort) values
('Mathis Dupont-Brimbeuf', 'Responsable pédagogique', 'Ex-31e joueur français',
 '<p>Mathis fait partie de l''aventure Let Padel depuis 4 ans. Véritable pilier de l''équipe sportive, il supervise toute l''académie : organisation des cours, suivi pédagogique, coordination des coachs et accompagnement des joueurs.</p><p>Ancien 31<sup>e</sup> joueur français, il met son expérience au service de votre progression. <strong>Exigence, pédagogie et bonne humeur</strong> : tout est réuni pour progresser et prendre du plaisir sur la piste !</p>',
 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/centres/coach-mathis-dupont.png', 1),
('Victor Bedu', 'Responsable section enfants / jeunes', '300e joueur français*',
 '<p>Victor a rejoint l''aventure Let Padel en septembre 2025. Passionné et dynamique, il supervise l''<strong>Académie Jeunes</strong> tout en accompagnant nos joueurs adultes.</p><p>Joueur talentueux en pleine ascension, sa bonne humeur, son énergie et son humour font de chaque séance un vrai moment de plaisir, débutant ou confirmé !</p><p><small>* Classement septembre 2026.</small></p>',
 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/centres/coach-victor-bedu.png', 2),
('Théo Grondin', 'Coach', 'Coach diplômé TFP',
 '<p>Tout droit venu de La Réunion pour vivre sa passion, Théo a rejoint Let Padel pour se former au sein de nos structures… et découvrir des hivers un peu plus frais ! 😄</p><p>Accompagné par Mathis, il a obtenu son TFP Padel. Motivé et souriant, il vous transmet techniques et fondamentaux, quel que soit votre niveau.</p>',
 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/centres/coach-theo-grondin.png', 3),
('Bruno Gomes', 'De joueur à enseignant', 'Coach diplômé TFP',
 '<p>Bruno a rejoint l''aventure en 2025. D''abord joueur passionné, il est tombé amoureux du padel au point de vouloir <strong>transmettre sa passion</strong>.</p><p>Formé par Mathis, il a obtenu son TFP Padel. Toujours à l''écoute, il partage ses conseils avec un objectif : vous faire progresser en prenant du plaisir !</p>',
 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/centres/coach-bruno-gomes.png', 4);

-- ============ FAQ ============
insert into public.letpadel_faq (question, answer, sort) values
('Comment réserver un créneau ?', '<p>Réservez en quelques secondes depuis l''application Let Padel ou notre plateforme de réservation en ligne. Pour valider la réservation, le paiement d''au moins un des participants est demandé.</p>', 1),
('Louez-vous des raquettes ? À quel tarif ?', '<p>Oui ! La location de raquette de padel démarre à 3 €. Les balles sont disponibles à l''achat à partir de 7,50 € la boîte.</p>', 2),
('Jusqu''à quand puis-je annuler ma partie ?', '<p>Vous pouvez annuler jusqu''à 24 h avant le début de la partie. Passé ce délai, le terrain est facturé en totalité.</p>', 3),
('Proposez-vous des offres pour les entreprises ?', '<p>Bien sûr ! Initiations, sessions régulières avec nos coachs, séminaires, team buildings, incentives : nous organisons tout, clés en main, et vous profitez du moment avec vos équipes.</p>', 4),
('Comment prendre des cours de padel ?', '<p>Contactez Mathis, notre responsable pédagogique : il vous orientera vers la formule adaptée à votre niveau et à vos objectifs — <a href="mailto:mathis.d@letpadel.fr">mathis.d@letpadel.fr</a>.</p>', 5),
('Je n''ai jamais joué, est-ce pour moi ?', '<p>Absolument ! Le padel est le sport de raquette le plus facile à prendre en main. On vous offre même <strong>30 minutes d''initiation</strong> avec un coach (sur rendez-vous) pour vos premiers pas.</p>', 6);

-- ============ ACTUALITÉS ============
insert into public.letpadel_posts (slug, kind, title, excerpt, body, image, link_url, published_at) values
('nouvelle-saison-academie', 'actu', 'La nouvelle saison de l''Académie est lancée !',
 'Jeunes comme adultes, il est encore temps de rejoindre l''aventure : l''académie fonctionne en cycles de 6 semaines tout au long de l''année.',
 '<p>La rentrée est là et l''Académie Let Padel reprend du service ! Jeunes comme adultes, il est encore temps de rejoindre l''aventure et de réserver votre place.</p><p>Plus de place sur votre créneau ? Pas de panique : l''académie fonctionne en <strong>cycles de 6 semaines</strong> :</p><ul><li>Cycle 1 : du 07/09 au 17/10</li><li>Cycle 2 : du 09/11 au 19/12</li><li>Cycle 3 : du 11/01 au 20/02</li><li>Cycle 4 : du 08/03 au 17/04</li><li>Cycle 5 : du 17/05 au 26/06</li></ul><p>Encadrés par nos coachs diplômés, les cours sont pensés pour vous faire progresser, performer et prendre du plaisir, quel que soit votre niveau.</p>',
 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/actualites/alaune-1.png',
 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/docs/let-padel-academie-2026-2027.pdf', '2026-09-01'),
('licence-en-ligne', 'actu', 'Votre licence Let Padel, désormais 100 % en ligne',
 'Inscription et règlement via HelloAsso, licence délivrée sous 2 jours maximum — avec plein d''avantages à la clé.',
 '<p>Cette saison, on vous simplifie la vie : prenez votre licence Let Padel directement en ligne. Complétez votre inscription, réglez via HelloAsso, et votre licence est délivrée sous 2 jours maximum.</p><p>Être licencié chez Let Padel, c''est aussi :</p><ul><li>-10 % sur le shop toute l''année</li><li>Des tests gratuits de nos nouvelles raquettes</li><li>Un t-shirt Let Padel offert</li><li>L''accès à des événements exclusifs</li><li>-10 % sur les stages enfants & adultes</li></ul>',
 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/actualites/alaune-2.png',
 'https://www.helloasso.com/associations/st-pryve-tennis-club-sptc/adhesions/licence-2026-2027-sport', '2026-08-28'),
('nouvelle-carte', 'actu', 'Une nouvelle carte pleine de fraîcheur et de gourmandise',
 'Imaginée par le chef privé Jean-Édouard Ghesquière : produits frais, de saison et recettes gourmandes, dans nos deux clubs.',
 '<p>Au Let Padel, le plaisir ne s''arrête pas aux terrains ! Découvrez notre nouvelle carte imaginée par le chef privé <strong>Jean-Édouard Ghesquière</strong>, qui met à l''honneur des produits frais, de saison et des recettes gourmandes.</p><p>Nos deux établissements sont de vrais lieux de vie : on y vient jouer, déjeuner, boire un verre, profiter d''un afterwork ou simplement passer un bon moment entre amis — joueur ou non !</p>',
 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/restaurant_slider/image_1-1.jpg',
 null, '2026-08-20');

insert into public.letpadel_posts (slug, kind, title, excerpt, body, image, event_date, location, link_url, published_at) values
('stage-toussaint-2026', 'event', 'Stage vacances de la Toussaint',
 'Du 26 au 30 octobre, de 9h à 17h : padel, badminton, pickleball et jeux de société. 30 € la journée / 150 € la semaine.',
 '<p>Du <strong>26 au 30 octobre 2026</strong>, de 9h à 17h (accueil dès 8h30, départ jusqu''à 18h).</p><p><strong>Tarifs :</strong> 30 € la journée / 150 € la semaine.<br><strong>Programme :</strong> padel, badminton, pickleball, jeux de société.<br>Déjeuner possible sur place.</p><p>Inscriptions auprès de Victor Bedu ou via le formulaire en ligne.</p>',
 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/academie/coach-victor.png',
 '2026-10-26', 'Let Padel Saint-Pryvé', 'https://forms.gle/DgFmQscxebeasiHe9', '2026-10-01');

-- ============ BLOCS DE TEXTE ============
insert into public.letpadel_blocks (page, section, kicker, title, body, image, cta_label, cta_url, sort) values
('home', 'intro', 'Le Let Padel', 'Plus qu''un club : un lieu de vie autour du sport',
 '<p>Moderne, accessible et convivial : au Let Padel, chacun vient jouer, progresser et surtout partager un bon moment. Débutant curieux, famille du dimanche ou compétiteur affûté, il y a une piste pour vous.</p>',
 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/histoire/his-pho-01.png', 'Notre histoire', 'club.html', 1),
('home', 'restaurant', 'La cuisine du Let', 'Après l''effort, le réconfort',
 '<p>Bar, snacking et une carte signée par le chef privé Jean-Édouard Ghesquière : produits frais, de saison et gourmands. Joueurs ou non, tout le monde est le bienvenu.</p>',
 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/accueil_letseat/image_1-1.jpg', 'Découvrir nos offres', 'restaurant.html', 1),
('home', 'first', 'Premier match ?', 'Ton premier match en 3 étapes', null, null, 'Je réserve', null, 1),

('club', 'hero', 'Notre histoire', 'Plus qu''un club, un lieu de partage autour du sport', null,
 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/accueil_slider/image_1-1.jpg', null, null, 1),
('club', 'story', 'Depuis le début', 'Né de 20 ans de passion pour le sport',
 '<p>Let Padel est né d''une envie simple : créer un lieu <strong>moderne, accessible et convivial</strong>, où chacun peut venir jouer, progresser et surtout partager un bon moment.</p><p>Inspiré par l''essor du padel à travers l''Europe, le club a été imaginé comme un véritable espace de vie : le sport s''y vit entre amis, en famille, entre collègues ou entre passionnés.</p><p>À deux pas du centre d''Orléans, Let Padel propose un environnement pensé pour tous les profils et tous les niveaux, dans une ambiance dynamique et chaleureuse.</p>',
 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/histoire/his-pho-01.png', null, null, 1),
('club', 'infra', 'Nos infrastructures', 'Pensées pour le confort et la performance',
 '<p>8 pistes de padel panoramiques et 2 terrains de badminton / pickleball répartis sur nos deux centres.</p>', null, null, null, 1),
('club', 'clubhouse', 'Le club house', 'Un lieu pensé pour se retrouver',
 '<p>Espace bar et restauration, terrasse, snacking : notre club house est là pour prolonger le moment après le jeu.</p>', null, 'La cuisine du Let', 'restaurant.html', 1),

('academie', 'hero', 'L''Académie', 'Progressez avec la méthode Let Padel', null,
 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/academie/aca-ban-02_banniere_h450px.jpg', null, null, 1),
('academie', 'discover', 'Découvrir le padel', 'Premiers pas sur le terrain ? On s''occupe de tout !',
 '<ul><li>30 minutes d''initiation offertes</li><li>Un coach dédié pour vous accompagner (sur rendez-vous)</li><li>Une expérience ludique et accessible à tous</li></ul><p>Et si vous jouez déjà : <strong>testez votre niveau avec nos coachs !</strong></p>',
 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/accueil_slider/image_1-1.jpg', 'Réserver mon initiation', 'contact.html?sujet=academie', 1),
('academie', 'training', 'Centre d''entraînement', 'Hommes · Femmes · Jeunes',
 '<p>Des groupes d''entraînement pour les joueurs qui veulent passer un cap et préparer la compétition. Le calendrier de la saison arrive très bientôt : contactez Mathis pour être prévenu en premier.</p>',
 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/accueil_slider/image_3-1.jpg', 'Être tenu informé', 'contact.html?sujet=academie', 1),

('entreprise', 'hero', 'Entreprise', 'Sur le terrain naît le véritable esprit d''équipe', null,
 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/entreprise/ent-ban-02_banniere_h450px.jpg', null, null, 1),
('entreprise', 'contact', 'Votre interlocuteur', 'Quentin de La Selle',
 '<p>Quentin vous accompagne pour construire l''offre B2B adaptée à votre entreprise : initiations, sessions régulières avec nos coachs, séminaires, team buildings, incentives… Tout est clés en main, vous profitez simplement du moment avec vos équipes.</p>',
 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/entreprise/ent-interlocuteur-quentin.png', 'Une question ? Un projet ?', 'contact.html?sujet=entreprise', 1),

('restaurant', 'hero', 'La cuisine du Let', 'Le plaisir ne s''arrête pas aux terrains', null,
 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/restaurant_slider/image_2-1.jpg', null, null, 1),
('restaurant', 'intro', 'Nouvelle carte', 'Fraîcheur et gourmandise',
 '<p>Découvrez notre carte imaginée par le chef privé <strong>Jean-Édouard Ghesquière</strong> : des produits frais, de saison et des recettes gourmandes.</p><p>Nos deux établissements sont de vrais lieux de vie : on y vient jouer, déjeuner, boire un verre, profiter d''un afterwork ou simplement passer un bon moment entre amis. Que vous soyez joueur ou non !</p>',
 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/restaurant/carte.png', null, null, 1),

('contact', 'hero', 'Contact', 'Une question ? On vous répond', null, null, null, null, 1);

-- ============ OFFRES / CARTES ============
insert into public.letpadel_offers (category, title, subtitle, body, price, badge, image, cta_label, cta_url, sort) values
-- Accueil : 3 piliers
('home-pillars', 'Jouer', 'Réservez, venez, jouez', 'Une piste en quelques clics, 7 jours sur 7, entre amis ou en famille.', null, '01', 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/accueil_slider/image_1-1.jpg', 'Je réserve', '@booking', 1),
('home-pillars', 'Apprendre', 'L''Académie Let Padel', 'Cours jeunes et adultes, stages, cours particuliers : progressez avec nos coachs diplômés.', null, '02', 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/accueil_slider/image_5-1.jpg', 'L''Académie', 'academie.html', 2),
('home-pillars', 'Entreprise', 'Fédérez vos équipes', 'Team building, afterworks, tournois inter-équipes, lunch social club : tout est clés en main.', null, '03', 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/accueil_slider/image_4-1.jpg', 'Offres entreprise', 'entreprise.html', 3),

-- Accueil : premier match
('first-steps', 'Réserve ta piste', null, 'Sur l''app Let Padel ou en ligne, choisis ton centre et ton créneau. Le paiement d''un participant suffit.', null, '1', null, null, null, 1),
('first-steps', 'Viens les mains vides', null, 'Raquette en location dès 3 €, balles sur place. Prévois juste une tenue de sport et le sourire.', null, '2', null, null, null, 2),
('first-steps', 'Joue… et reste !', null, 'Après la partie, on se retrouve au club house pour un verre ou un bon plat.', null, '3', null, null, null, 3),

-- Équipements (centres)
('equipements', '4 pistes de padel', 'par centre', null, null, null, 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/centres/ctr-exp-4-pistes-padel-1.svg', null, null, 1),
('equipements', 'Badminton & pickleball', null, null, null, null, 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/centres/ctr-exp-badminton-pickleball-1.svg', null, null, 2),
('equipements', 'Location de matériel', null, null, null, null, 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/centres/ctr-exp-location-materiel-1.svg', null, null, 3),
('equipements', 'Vestiaires & sanitaires', null, null, null, null, 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/centres/ctr-exp-vestiaires-sanitaires-1.svg', null, null, 4),
('equipements', 'Restauration', null, null, null, null, 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/centres/ctr-exp-restauration-1.svg', null, null, 5),

-- Avantages club
('avantages', 'Abonnements', 'Jouez plus, payez moins', 'Des formules pour les joueurs réguliers. Renseignez-vous à l''accueil de votre centre ou sur l''application.', null, null, null, 'Nous contacter', 'contact.html?sujet=club', 1),
('avantages', 'Wallets', 'Sessions de jeu et animations', 'Rechargez votre porte-monnaie Let Padel et profitez de bonus sur vos sessions de jeu et animations (hors restaurant).', null, null, null, 'Nous contacter', 'contact.html?sujet=club', 2),
('avantages', 'Licence Let Padel', '100 % en ligne', '-10 % au shop toute l''année, tests de raquettes gratuits, t-shirt offert, événements exclusifs, -10 % sur les stages.', null, 'Saison 2026-27', null, 'Je prends ma licence', '@licence', 3),

-- Club : infrastructures
('infrastructures', 'Nos pistes', null, 'Terrains modernes, éclairage LED, structure panoramique vitrée.', null, null, 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/accueil/centre-fleury.png', null, null, 1),
('infrastructures', 'Vestiaires', null, 'Vestiaires hommes / femmes séparés, cabines de douche individuelles.', null, null, 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/centres/saint-pryve/spr-ban-04_slider_h300px.jpg', null, null, 2),
('infrastructures', 'Le sol', null, 'Revêtement moderne type gazon synthétique, sans sable.', null, null, 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/centres/saint-pryve/spr-reserver.png', null, null, 3),

-- Club : club house
('clubhouse', 'La terrasse', null, null, null, null, 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/histoire/his-clubhouse-terrasse.png', null, null, 1),
('clubhouse', 'Le snacking', null, null, null, null, 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/histoire/his-clubhouse-snacking.png', null, null, 2),
('clubhouse', 'Le bar', null, null, null, null, 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/histoire/his-clubhouse-bar.png', null, null, 3),

-- Académie : programmes
('programmes', 'Jeunes', 'De 5 à 17 ans · Référent : Victor Bedu',
 '<p class="quote">« La même exigence qu''un club formateur, avec la souplesse d''un cours enfant »</p><ul><li>30 séances du 09/09/2026 au 26/05/2027 (hors vacances scolaires)</li><li>Cours collectifs par tranche d''âge le mercredi matin et le samedi matin, à Saint-Pryvé et Fleury</li><li>Animations avant les vacances (Halloween, Noël, Pâques)</li><li>Animations de juin (dès le 26 mai 2027, tous les mercredis)</li><li>Compétition loisirs chaque trimestre</li></ul>',
 null, '5-17 ans', 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/academie/coach-victor.png', 'Inscrire mon enfant', 'contact.html?sujet=academie', 1),
('programmes', 'Adultes', 'Tous niveaux · Référent : Mathis Dupont-Brimbeuf',
 '<p class="quote">« 5 cycles indépendants pour progresser à votre rythme, sans engagement à l''année »</p><ul><li>Cycles de 6 semaines, indépendants les uns des autres</li><li>Cours en journée (heures creuses) ou en soirée (heures pleines), à Saint-Pryvé et Fleury</li><li>Jours fériés inclus : tous les cours ont lieu aux dates prévues</li></ul>',
 null, 'Tous niveaux', 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/centres/coach-mathis-dupont.png', 'M''inscrire', 'contact.html?sujet=academie', 2),

-- Académie : cycles adultes
('cycles', 'Cycle 1', 'Du 07/09 au 17/10', null, null, '2026', null, null, null, 1),
('cycles', 'Cycle 2', 'Du 09/11 au 19/12', null, null, '2026', null, null, null, 2),
('cycles', 'Cycle 3', 'Du 11/01 au 20/02', null, null, '2027', null, null, null, 3),
('cycles', 'Cycle 4', 'Du 08/03 au 17/04', null, null, '2027', null, null, null, 4),
('cycles', 'Cycle 5', 'Du 17/05 au 26/06', null, null, '2027', null, null, null, 5),

-- Académie : cours ponctuels (prix par personne)
('cours', 'Individuel', '1 joueur', null, '50 €', null, null, null, null, 1),
('cours', 'Duo', '2 personnes', null, '35 €', 'par pers.', null, null, null, 2),
('cours', 'Trio', '3 personnes', null, '28 €', 'par pers.', null, null, null, 3),
('cours', 'Quatuor', '4 personnes', null, '25 €', 'par pers.', null, null, null, 4),

-- Académie : stages
('stages', 'Stage vacances de la Toussaint', 'Du 26 au 30 octobre 2026 · Let Padel Saint-Pryvé',
 '<ul><li>De 9h à 17h (accueil dès 8h30, départ jusqu''à 18h)</li><li>Programme : padel, badminton, pickleball, jeux de société</li><li>Déjeuner possible sur place</li><li>Inscriptions auprès de Victor Bedu ou via le formulaire</li></ul>',
 '30 € / jour', '150 € la semaine', 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/accueil_slider/image_2-1.jpg', 'Je m''inscris', 'https://forms.gle/DgFmQscxebeasiHe9', 1),

-- Entreprise : offres
('entreprise', 'Comité d''entreprise & section', null, 'Offres dédiées aux CE et aux sections sportives d''entreprise.', null, 'CE', null, null, null, 1),
('entreprise', 'Team building · Incentive', null, 'Événements de cohésion et challenges sportifs, clés en main.', null, 'TEAM', null, null, null, 2),
('entreprise', 'Afterwork · Tournoi', null, 'Rendez-vous conviviaux après le travail, tournois inter-équipes.', null, 'AFTER', null, null, null, 3),
('entreprise', 'Social Club', null, 'Un espace de networking sportif régulier.', null, 'CLUB', null, null, null, 4),

-- Entreprise : formats
('entreprise-formats', 'Lunch Social Club', 'Networking & padel à l''heure du déjeuner', '<p>Conférence, échanges entre entrepreneurs et session de jeu : un rendez-vous régulier pour développer son réseau… raquette en main.</p>', null, null, 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/entreprise/ent-club-2.png', 'Je participe', 'contact.html?sujet=entreprise', 1),
('entreprise-formats', 'Afterwork – Tournoi', 'Le padel en mode équipe', '<p>Un tournoi inter-entreprises dans une ambiance festive, suivi d''un moment convivial au club house.</p>', null, null, 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/entreprise/ent-tournoi-11.png', 'Organiser le mien', 'contact.html?sujet=entreprise', 2),

-- Restaurant : moments
('restaurant-moments', 'Déjeuner', null, 'Une pause gourmande entre deux réunions… ou deux matchs.', null, null, 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/restaurant_slider/image_3-1.jpg', null, null, 1),
('restaurant-moments', 'Afterwork', null, 'Planches à partager et boissons fraîches après le jeu.', null, null, 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/accueil_letseat/image_2-1.jpg', null, null, 2),
('restaurant-moments', 'Entre amis', null, 'Un verre en terrasse, que vous ayez joué ou non.', null, null, 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/accueil_letseat/image_3-1.jpg', null, null, 3);

-- ============ GALERIE ============
insert into public.letpadel_gallery (image, caption, album, sort) values
('https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/accueil/jouer-apprendre.jpg', 'Sur la piste', 'general', 1),
('https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/accueil_letseat/image_3-1.jpg', 'Au club house', 'general', 2),
('https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/entreprise/ent-tournoi-12.png', 'Afterwork tournoi', 'general', 3),
('https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/accueil/centre-fleury.png', 'Let Padel Fleury', 'general', 4),
('https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/restaurant_slider/image_4-1.jpg', 'La cuisine du Let', 'general', 5),
('https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/entreprise/ent-club-3.png', 'Lunch Social Club', 'general', 6),
('https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/accueil/centre-saintpryve.png', 'Let Padel Saint-Pryvé', 'general', 7),
('https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/entreprise/ent-tournoi-13.png', 'Ambiance tournoi', 'general', 8),
('https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/histoire/his-clubhouse-bar.png', 'Le bar', 'general', 9);
