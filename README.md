# Vocea pentru Copii - aplicatie e-campaign

Aceasta este copia adaptata din proiectul `turism-valcea` pentru tema 12:
**Sisteme de tip e-activities: e-campaign, inclusiv solutii mobile**.

Aplicatia este o platforma ONG demonstrativa, inspirata ca structura de platforme precum Salvati Copiii, dar cu date fictive si identitate proprie.

## Functionalitati implementate

1. Petitie online cu semnaturi salvate in MongoDB.
2. Adeziuni/voluntariat cu aprobare din panoul de admin.
3. Donatii online simulate, fara date reale de card.
4. Forum comunitar cu topicuri si raspunsuri.

## Tehnologii

- React;
- Bootstrap;
- Node.js;
- Express;
- MongoDB;
- Mongoose;
- JWT;
- bcrypt.

## Rulare backend

```bash
cd backend
npm install
npm run seed
npm start
```

Backend-ul porneste pe portul `5000`.

Conturi demo dupa seed:

```txt
Admin: admin / admin123
User:  demo / demo123
```

## Rulare frontend

Intr-un terminal separat:

```bash
cd frontend
npm install
npm start
```

Frontend-ul porneste de obicei pe `http://localhost:3000`.

## Variabile de mediu

`backend/.env`:

```txt
PORT=5000
MONGO_URI=mongodb://localhost:27017/e-campaign-ong
JWT_SECRET=supersecretjwtkey
```

`frontend/.env`:

```txt
REACT_APP_API_URL=http://localhost:5000
```

## Flux de demo

1. Pornesti MongoDB.
2. Rulezi seed-ul.
3. Intri pe frontend.
4. Te autentifici cu `demo / demo123`.
5. Semnezi petitia.
6. Trimiti o cerere de voluntariat.
7. Simulezi o donatie.
8. Creezi o discutie in forum.
9. Te autentifici cu `admin / admin123`.
10. Verifici panoul de admin: campanii, semnaturi, donatii, voluntari, forum.

## Note

Folderul vechi `turism-valcea` a ramas neatins. Aceasta copie este proiectul de lucru pentru tema e-campaign.
