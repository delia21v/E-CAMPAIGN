# Tema 12 - Sistem e-campaign ONG

Tema propusa: aplicatie web pentru gestionarea unei campanii de activism social/umanitar/ecologic, inspirata ca structura de platforme ONG precum Salvati Copiii, dar fara copiere de continut, branding sau identitate vizuala.

## Ideea aplicatiei

Aplicatia poate fi prezentata ca o platforma ONG numita, de exemplu, **Vocea pentru Copii**, axata pe promovarea unei campanii sociale de sprijin pentru copii vulnerabili.

Scopul proiectului este sa demonstreze un sistem online de tip e-campaign cu utilizatori, administrare, baza de date si functionalitati de implicare publica.

## Cele 4 functionalitati principale

1. **Petitie online**
   - utilizatorii pot semna o petitie pentru sustinerea campaniei;
   - sistemul afiseaza numarul de semnaturi;
   - adminul poate vedea lista semnaturilor.

2. **Sistem de adeziuni / voluntariat**
   - utilizatorii completeaza un formular de inscriere ca voluntari sau sustinatori;
   - adminul poate aproba, respinge sau vizualiza cererile;
   - model inspirat de formularul de voluntariat ONG.

3. **Donatii online**
   - utilizatorii pot completa un formular de donatie;
   - pentru proiect, plata poate fi simulata, fara integrare reala de card;
   - se salveaza suma, cauza si statusul donatiei.

4. **Forum comunitar**
   - utilizatorii autentificati pot deschide subiecte;
   - ceilalti pot raspunde prin comentarii;
   - adminul poate sterge continut nepotrivit.

Functionalitati optionale pentru extindere: chat live, newsletter, distribuire pe retele sociale, rapoarte PDF, panou statistici.

## Reper folosit

Site-ul Salvati Copiii este util ca reper pentru:

- structura de navigatie: "Cine suntem", "Ce facem", "Implica-te", "Doneaza";
- pagini de campanii si cauze;
- formular de voluntariat;
- zone de donatii si implicare;
- afisarea indicatorilor de impact.

Pentru proiect, trebuie pastrata o identitate proprie si date fictive.

## Cum se potriveste peste proiectul existent

Proiectul curent este un MERN simplu:

- frontend React;
- backend Node.js + Express;
- baza de date MongoDB prin Mongoose;
- autentificare cu JWT;
- rol admin;
- panou de administrare.

Tema noua se poate implementa refolosind aceeasi arhitectura:

- `Attraction` devine `Campaign`;
- `Gallery` devine `ImpactStory` sau `CampaignMedia`;
- `AdminPanel` se extinde pentru campanii, petitii, donatii si voluntari;
- autentificarea si rutele protejate raman baza sistemului.

## Ordinea recomandata

1. Stabileste numele campaniei si domeniul ei social.
2. Creeaza modelele MongoDB.
3. Creeaza rutele API pentru cele 4 functionalitati.
4. Creeaza paginile React.
5. Extinde panoul admin.
6. Populeaza baza de date cu date fictive.
7. Pregateste prezentarea: cerinta, modelare, functionalitati, demo.

Citeste apoi:

- [01-pasi-implementare.md](01-pasi-implementare.md)
- [02-modelare-baza-date.md](02-modelare-baza-date.md)
- [03-intrebari-pentru-tine.md](03-intrebari-pentru-tine.md)
- [04-checklist-prezentare.md](04-checklist-prezentare.md)
