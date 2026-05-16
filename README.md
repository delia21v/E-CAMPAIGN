# Vocea pentru Copii - aplicație e-campaign

Proiect pentru tema 12:
**Sisteme de tip e-activities: e-campaign, inclusiv soluții mobile**.

Aplicația este o platformă ONG demonstrativă, inspirată ca structură de platforme precum Salvați Copiii, dar cu date fictive și identitate proprie.

## Funcționalități implementate

1. Petiție online cu semnături salvate în MongoDB.
2. Adeziuni/voluntariat cu aprobare din panoul de admin.
3. Donații online simulate, fără date reale de card.
4. Forum comunitar cu topicuri și răspunsuri.

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

Backend-ul pornește pe portul `5000`.

Conturi demo după seed:

```txt
Admin: admin / admin123
User:  demo / demo123
```

## Rulare frontend

Într-un terminal separat:

```bash
cd frontend
npm install
npm start
```

Frontend-ul pornește de obicei pe `http://localhost:3000`.

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

1. Pornești MongoDB.
2. Rulezi seed-ul.
3. Intri pe frontend.
4. Te autentifici cu `demo / demo123`.
5. Semnezi petiția.
6. Trimiți o cerere de voluntariat.
7. Simulezi o donație.
8. Creezi o discuție în forum.
9. Te autentifici cu `admin / admin123`.
10. Verifici panoul de admin: campanii, semnături, donații, voluntari, forum.

## Note

Repository-ul conține proiectul de lucru pentru tema e-campaign.
