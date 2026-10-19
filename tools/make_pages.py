#!/usr/bin/env python3
"""Génère les pages HTML statiques (gabarit commun + corps propre à chaque page).
Usage : python3 tools/make_pages.py   (depuis la racine du dépôt)
Les pages index.html, centres.html et academie.html sont écrites à la main."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

HEAD = """<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <meta name="theme-color" content="#1D3FA0">{extra_head}
  <script>document.documentElement.classList.add('js')</script>
  <link rel="icon" href="{base}assets/img/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://kdcflcvufukagdjycwww.supabase.co" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Saira:ital,wdth,wght@0,50..125,100..900;1,50..125,100..900&display=swap">
  <link rel="stylesheet" href="{base}assets/css/site.css">
  <script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script defer src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>
  <script type="module" src="{base}assets/js/pages/{script}.js"></script>
</head>
<body data-page="{page}"{body_attr}>
  <div id="top"></div>
  <main id="main">
{body}
  </main>
  <div id="bottom"></div>
</body>
</html>
"""

def hero(crumb, kicker, title, lead='', img='', extra=''):
    bg = f'\n      <div class="bg"><img src="{img}" alt="" data-parallax="16"></div>' if img else ''
    cls = 'page-hero' if img else 'page-hero plain'
    return f"""    <section class="{cls}">{bg}
      <div class="wrap">
        <nav class="crumbs" aria-label="Fil d'Ariane"><a href="index.html">Accueil</a><span aria-hidden="true">/</span><span>{crumb}</span></nav>
        <p class="kicker light">{kicker}</p>
        <h1 class="display" data-reveal="words">{title}</h1>
        <div class="lead">{lead}</div>{extra}
      </div>
    </section>"""

M = 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/'

PAGES = {
  'entreprise': dict(
    title="Entreprise — Let Padel Club",
    desc="Team building, afterwork tournoi, Lunch Social Club, offres CE : le Let Padel organise vos événements d'entreprise clés en main à Orléans.",
    body=hero('Entreprise', 'Entreprise', "Sur le terrain naît le véritable esprit d'équipe",
              "Initiations, séminaires, team buildings, afterworks : nous organisons tout, vous profitez du moment avec vos équipes.",
              M + 'entreprise/ent-ban-02_banniere_h450px.jpg') + """

    <section class="section" id="offres">
      <div class="wrap">
        <div class="sec-head">
          <p class="kicker">Nos formules</p>
          <h2 class="display h-l" data-reveal="words">Le padel au service de vos équipes</h2>
        </div>
        <div class="grid grid-4" id="bizOffers" data-stagger></div>
      </div>
    </section>

    <div id="bizFormats"></div>

    <section class="section on-blue" id="interlocuteur">
      <div class="wrap split" id="bizContact"></div>
    </section>

    <section class="section" id="galerie-entreprise">
      <div class="wrap">
        <div class="sec-head">
          <p class="kicker">En images</p>
          <h2 class="display h-l" data-reveal="words">Ils ont joué le jeu</h2>
        </div>
        <div class="gallery" id="bizGallery"></div>
      </div>
    </section>

    <div id="cta"></div>"""),

  'restaurant': dict(
    title="La cuisine du Let — Let Padel Club",
    desc="Bar, snacking et restauration au Let Padel : une carte fraîche et gourmande imaginée par le chef Jean-Édouard Ghesquière, à Saint-Pryvé et Fleury-les-Aubrais.",
    body_attr=' class="restaurant-page"',
    body=hero('La cuisine du Let', 'La cuisine du Let', "Le plaisir ne s'arrête pas aux terrains",
              "Déjeuner, afterwork, un verre entre amis : nos club houses vous accueillent, joueurs ou non.",
              M + 'restaurant_slider/image_2-1.jpg') + """

    <section class="section" id="carte">
      <div class="wrap split" id="restoIntro"><div class="skeleton"></div></div>
    </section>

    <div id="restoMarquee"></div>

    <section class="section" id="moments">
      <div class="wrap">
        <div class="sec-head">
          <p class="kicker">À chaque moment</p>
          <h2 class="display h-l" data-reveal="words">On se retrouve au Let</h2>
        </div>
        <div class="grid grid-3" id="moments-list" data-stagger></div>
      </div>
    </section>

    <section class="section on-dark" id="ou">
      <div class="wrap">
        <div class="sec-head">
          <p class="kicker">Dans nos deux clubs</p>
          <h2 class="display h-l" data-reveal="words">Où nous trouver</h2>
        </div>
        <div class="grid grid-2" id="restoCenters"></div>
      </div>
    </section>

    <div id="cta"></div>"""),

  'club': dict(
    title="Notre histoire — Let Padel Club",
    desc="Né de plus de 20 ans d'expérience dans le sport, Let Padel est un lieu moderne, accessible et convivial : 8 pistes panoramiques, 2 terrains de badminton / pickleball et un club house.",
    body=hero('Le club', 'Notre histoire', "Plus qu'un club, un lieu de partage autour du sport", '', M + 'accueil_slider/image_1-1.jpg') + """

    <section class="section" id="histoire">
      <div class="wrap split" id="story"><div class="skeleton"></div></div>
    </section>

    <div id="clubMarquee"></div>

    <section class="section on-dark" id="infrastructures">
      <div class="wrap">
        <div class="sec-head split" id="infraHead"></div>
        <div class="grid grid-3" id="infra" data-stagger></div>
      </div>
    </section>

    <section class="section" id="chiffres">
      <div class="wrap">
        <div class="scoreboard" data-reveal="up" aria-label="Le Let Padel en chiffres">
          <div class="scoreboard-head"><span>Let Padel Club</span><span class="live">En direct des pistes</span></div>
          <div class="score-grid" id="scoreGrid"></div>
        </div>
      </div>
    </section>

    <section class="section on-white" id="club-house">
      <div class="wrap">
        <div class="sec-head split" id="chHead"></div>
        <div class="grid grid-3" id="clubhouse" data-stagger></div>
      </div>
    </section>

    <section class="section" id="galerie">
      <div class="wrap">
        <div class="sec-head">
          <p class="kicker">Galerie</p>
          <h2 class="display h-l" data-reveal="words">La vie du club</h2>
        </div>
        <div class="gallery" id="gallery"></div>
      </div>
    </section>

    <div id="cta"></div>"""),

  'actualites': dict(
    title="Actualités & événements — Let Padel Club",
    desc="Toutes les actualités du Let Padel : académie, stages, tournois, licence, nouvelle carte et événements dans nos clubs de Saint-Pryvé et Fleury-les-Aubrais.",
    body=hero('Actualités', 'Actualités & événements', "Ça bouge au Let",
              "Stages, tournois, nouveautés du club : retrouvez ici tout ce qui se passe sur et autour des pistes.") + """

    <section class="section">
      <div class="wrap">
        <div class="filters" role="group" aria-label="Filtrer les actualités" id="filters">
          <button type="button" aria-pressed="true" data-kind="all">Tout</button>
          <button type="button" aria-pressed="false" data-kind="event">Événements</button>
          <button type="button" aria-pressed="false" data-kind="actu">Actualités</button>
          <button type="button" aria-pressed="false" data-kind="blog">Blog</button>
        </div>
        <div class="news-grid" id="news"><div class="skeleton"></div><div class="skeleton"></div></div>
      </div>
    </section>

    <section class="section-tight on-dark">
      <div class="wrap split">
        <div>
          <p class="kicker">Ne ratez rien</p>
          <h2 class="display h-m" data-reveal="words">Suivez le Let sur les réseaux</h2>
        </div>
        <div class="btn-row" id="socialBtns"></div>
      </div>
    </section>

    <div id="cta"></div>"""),

  'contact': dict(
    title="Contact & accès — Let Padel Club",
    desc="Contactez le Let Padel : formulaire, téléphone, adresses et plans d'accès de nos centres de Saint-Pryvé-Saint-Mesmin et Fleury-les-Aubrais. Questions fréquentes.",
    body=hero('Contact', 'Contact', "Une question ? On vous répond",
              "Académie, stages, entreprise, vie du club : écrivez-nous, l'équipe vous répond rapidement.") + """

    <section class="section" id="formulaire">
      <div class="wrap split" style="align-items:start">
        <div>
          <p class="kicker">Nous écrire</p>
          <h2 class="display h-l" data-reveal="words">Envoyez-nous un message</h2>
          <form class="form" id="contactForm" novalidate style="margin-top:28px">
            <div class="row">
              <div class="field"><label for="f-name">Nom et prénom</label><input id="f-name" name="name" autocomplete="name" required maxlength="120"></div>
              <div class="field"><label for="f-email">E-mail</label><input id="f-email" name="email" type="email" autocomplete="email" required maxlength="200"></div>
            </div>
            <div class="row">
              <div class="field"><label for="f-phone">Téléphone <span class="muted">(facultatif)</span></label><input id="f-phone" name="phone" type="tel" autocomplete="tel" maxlength="40"></div>
              <div class="field"><label for="f-center">Centre</label><select id="f-center" name="center"><option value="">Peu importe</option></select></div>
            </div>
            <div class="field"><label for="f-subject">Sujet</label>
              <select id="f-subject" name="subject" required>
                <option value="">Choisissez votre sujet</option>
                <option value="academie">M'inscrire à l'Académie (saison 2026-2027)</option>
                <option value="stages">Recevoir des informations sur les stages</option>
                <option value="entreprise">Me renseigner sur l'offre Entreprise</option>
                <option value="club">Recevoir des informations sur la vie du club</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div class="field"><label for="f-msg">Message</label><textarea id="f-msg" name="message" required maxlength="5000"></textarea></div>
            <div class="hp" aria-hidden="true"><label for="f-web">Ne pas remplir</label><input id="f-web" name="website" tabindex="-1" autocomplete="off"></div>
            <p class="muted" style="font-size:.88rem;margin:0">Vos données servent uniquement à vous répondre. <a href="mentions-legales.html">Mentions légales</a></p>
            <div id="formMsg" role="status" aria-live="polite"></div>
            <div><button class="btn" type="submit">Envoyer le message</button></div>
          </form>
        </div>
        <div id="contactCenters" style="display:grid;gap:22px"></div>
      </div>
    </section>

    <section class="section on-dark" id="faq">
      <div class="wrap split" style="align-items:start">
        <div>
          <p class="kicker">Questions fréquentes</p>
          <h2 class="display h-l" data-reveal="words">Nous avons sûrement la réponse</h2>
          <p class="lead" style="margin-top:20px;color:rgba(255,255,255,.8)">Réservations, activités, événements et vie du club : les réponses aux questions qu'on nous pose le plus.</p>
        </div>
        <div class="faq" id="faqList"></div>
      </div>
    </section>"""),

  'mentions-legales': dict(
    title="Mentions légales — Let Padel Club",
    desc="Mentions légales, crédits et politique de données personnelles du site Let Padel Club.",
    script='legal', body_attr=' class="legal-page"',
    body=hero('Mentions légales', 'Informations légales', 'Mentions légales') + """

    <section class="section">
      <div class="wrap-narrow prose" id="legal"><div class="skeleton"></div></div>
    </section>"""),

  '404': dict(
    title="Balle perdue — Let Padel Club",
    desc="Cette page n'existe pas.",
    script='legal', extra_head='\n  <base href="/letpadel/">',
    body=hero('Page introuvable', 'Erreur 404', 'Balle perdue !',
              "Cette page est sortie du court. Revenez à l'accueil ou réservez directement une piste.",
              extra='\n        <div class="btn-row" style="margin-top:28px"><a class="btn" href="index.html">Retour à l\'accueil</a><a class="btn btn-ghost" href="contact.html">Nous contacter</a></div>')),
}

for page, cfg in PAGES.items():
    html = HEAD.format(
        title=cfg['title'], desc=cfg['desc'], page=page, script=cfg.get('script', page),
        body=cfg['body'], body_attr=cfg.get('body_attr', ''), extra_head=cfg.get('extra_head', ''), base='')
    (ROOT / f'{page}.html').write_text(html, encoding='utf-8')
    print('écrit', page + '.html')
