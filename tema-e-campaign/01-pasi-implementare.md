# Pasi de implementare

Acest plan presupune ca pastrezi arhitectura proiectului existent: React in `frontend`, Express in `backend`, MongoDB pentru date.

## Pasul 1 - Alege scenariul campaniei

Varianta recomandata:

**Vocea pentru Copii** - campanie sociala pentru sprijinirea copiilor vulnerabili prin voluntariat, petitii si donatii.

Pagini publice:

- Acasa;
- Campanii;
- Petitie;
- Doneaza;
- Voluntariat;
- Forum;
- Login/Register;
- Admin.

## Pasul 2 - Definitivează conceptul aplicației

Lucrează incremental și păstrează structura tehnică deja funcțională:

1. Pastreaza `Login`, `Register`, `PrivateRoute`, `AdminRoute`, `auth.js`.
2. Folosește texte despre campanii ONG, petiții, donații și voluntariat.
3. Adaptează componentele publice:
   - `Attractions.js` -> `Campaigns.js`;
   - `Gallery.js` -> `ImpactStories.js`;
   - `Map.js` poate fi eliminat sau transformat in `Branches.js`, daca vrei filiale/locatii.
4. Creeaza componente noi pentru petitie, donatii, voluntariat si forum.

## Pasul 3 - Modele MongoDB

Adauga in `backend/models`:

- `Campaign.js`;
- `PetitionSignature.js`;
- `Donation.js`;
- `VolunteerApplication.js`;
- `ForumTopic.js`;
- `ForumReply.js`.

Structura recomandata este in [02-modelare-baza-date.md](02-modelare-baza-date.md).

## Pasul 4 - Rute API Express

Adauga in `backend/routes`:

- `campaignRoutes.js`;
- `petitionRoutes.js`;
- `donationRoutes.js`;
- `volunteerRoutes.js`;
- `forumRoutes.js`.

In `backend/index.js`, conecteaza rutele:

```js
app.use("/api/campaigns", campaignRoutes);
app.use("/api/petition", petitionRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/forum", forumRoutes);
```

## Pasul 5 - Functionalitatea 1: Petitie online

Backend:

- `POST /api/petition/sign` - adauga semnatura;
- `GET /api/petition/count` - intoarce numarul total;
- `GET /api/petition/signatures` - doar admin.

Frontend:

- pagina `Petition.js`;
- formular cu nume, email, oras, mesaj optional;
- contor vizibil: "X persoane au semnat".

Validari:

- email obligatoriu;
- nu permite aceeasi adresa de email de doua ori pentru aceeasi petitie.

## Pasul 6 - Functionalitatea 2: Adeziuni / voluntariat

Backend:

- `POST /api/volunteers/apply` - inscriere voluntar;
- `GET /api/volunteers` - admin;
- `PATCH /api/volunteers/:id/status` - admin aproba/respinge.

Frontend:

- pagina `Volunteer.js`;
- formular cu nume, email, telefon, oras, varsta, motivatie;
- mesaj dupa trimitere: "Cererea a fost trimisa si va fi analizata".

Statusuri:

- `pending`;
- `approved`;
- `rejected`.

## Pasul 7 - Functionalitatea 3: Donatii online simulate

Pentru proiect universitar, recomand simularea platii. Este suficient sa demonstrezi fluxul.

Backend:

- `POST /api/donations` - salveaza donatia;
- `GET /api/donations/my` - donatiile utilizatorului autentificat;
- `GET /api/donations` - admin.

Frontend:

- pagina `Donate.js`;
- campuri: suma, cauza, nume donator, email;
- buton "Confirma donatia";
- dupa trimitere se afiseaza statusul `confirmed`.

Important:

- nu salva date reale de card;
- daca vrei sa arati plata, foloseste doar campuri fictive sau un status simulat.

## Pasul 8 - Functionalitatea 4: Forum comunitar

Backend:

- `GET /api/forum/topics`;
- `POST /api/forum/topics` - utilizator autentificat;
- `GET /api/forum/topics/:id`;
- `POST /api/forum/topics/:id/replies` - utilizator autentificat;
- `DELETE /api/forum/topics/:id` - admin.

Frontend:

- pagina `Forum.js`;
- lista subiecte;
- formular pentru subiect nou;
- pagina de detaliu cu raspunsuri.

Reguli:

- doar utilizatorii logati pot posta;
- vizitatorii pot citi;
- adminul poate modera.

## Pasul 9 - Panou administrator

Extinde `AdminPanel.js` cu taburi sau sectiuni:

- Campanii;
- Semnaturi petitie;
- Donatii;
- Voluntari;
- Forum.

Adminul trebuie sa poata:

- crea/edita/sterge campanii;
- vedea semnaturi;
- vedea total donatii;
- aproba sau respinge voluntari;
- sterge topicuri sau raspunsuri nepotrivite.

## Pasul 10 - Design si continut

Porneste de la Bootstrap, deja folosit in proiect.

Recomandari:

- navigatie simpla sus;
- buton vizibil "Doneaza";
- pagina acasa cu 3-4 carduri de impact;
- culori clare, nu prea multe;
- texte fictive, dar realiste;
- imagini proprii sau placeholder-uri libere.

Structura inspirata de ONG:

- "Ce facem";
- "Campanii active";
- "Implica-te";
- "Doneaza";
- "Comunitate".

## Pasul 11 - Date de test

Creeaza un script `seedCampaigns.js` in backend:

- 2 campanii active;
- 5 semnaturi fictive;
- 3 donatii fictive;
- 2 cereri de voluntariat;
- 2 topicuri de forum.

Astfel ai ce arata la demo fara sa introduci totul manual.

## Pasul 12 - Demo pentru profesor

Flux recomandat:

1. Intri pe pagina publica.
2. Arati campania si obiectivul.
3. Creezi un cont.
4. Semnezi petitia.
5. Completezi o cerere de voluntariat.
6. Simulezi o donatie.
7. Postezi in forum.
8. Intri ca admin si arati gestionarea datelor.

## Pasul 13 - Ce trebuie mentionat in documentatie

Pentru faza de proiectare:

- scopul aplicatiei;
- actorii sistemului;
- cerinte functionale;
- cerinte nefunctionale;
- diagrama cazurilor de utilizare;
- modelul bazei de date;
- fluxurile principale.

Pentru faza de implementare:

- tehnologiile folosite;
- structura aplicatiei;
- descrierea colectiilor MongoDB;
- descrierea rutelor API;
- capturi de ecran;
- instructiuni de rulare.
