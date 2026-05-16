# Checklist pentru prezentare

## Ce trebuie sa existe in aplicatie

- [ ] pagina publica de prezentare ONG/campanie;
- [ ] autentificare si inregistrare;
- [ ] rol de administrator;
- [ ] lista campanii;
- [ ] petitie online;
- [ ] contor semnaturi;
- [ ] formular voluntariat/adeziune;
- [ ] donatie online simulata;
- [ ] forum comunitar;
- [ ] panou admin pentru gestionarea datelor.

## Ce trebuie sa existe in baza de date

- [ ] colectie `users`;
- [ ] colectie `campaigns`;
- [ ] colectie `petitionsignatures`;
- [ ] colectie `donations`;
- [ ] colectie `volunteerapplications`;
- [ ] colectie `forumtopics`;
- [ ] colectie `forumreplies`.

## Ce trebuie sa arati in demo

- [ ] creare cont utilizator;
- [ ] login utilizator;
- [ ] semnare petitie;
- [ ] trimitere cerere voluntariat;
- [ ] simulare donatie;
- [ ] creare topic forum;
- [ ] login admin;
- [ ] verificare semnaturi;
- [ ] verificare donatii;
- [ ] aprobare voluntar;
- [ ] moderare forum.

## Ce trebuie sa ai in documentatie

- [ ] tema si obiectivul aplicatiei;
- [ ] public tinta;
- [ ] actori sistem;
- [ ] cerinte functionale;
- [ ] cerinte nefunctionale;
- [ ] arhitectura aplicatiei;
- [ ] model baza de date;
- [ ] descriere API;
- [ ] capturi de ecran;
- [ ] instructiuni de instalare si rulare;
- [ ] concluzii.

## Tehnologii de mentionat

- React pentru frontend;
- Bootstrap pentru interfata;
- Node.js si Express pentru backend;
- MongoDB si Mongoose pentru baza de date;
- JWT pentru autentificare;
- bcrypt pentru hash parole;
- Axios pentru request-uri frontend-backend.

## Instructiuni de rulare

Backend:

```bash
cd backend
npm install
npm start
```

Frontend:

```bash
cd frontend
npm install
npm start
```

Setari necesare in `backend/.env`:

```txt
MONGO_URI=mongodb://127.0.0.1:27017/e-campaign
JWT_SECRET=secret-local
PORT=5000
```

Setari necesare in `frontend/.env`:

```txt
REACT_APP_API_URL=http://localhost:5000
```
