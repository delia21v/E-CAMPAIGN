# Modelare si baza de date

## Actori

1. **Vizitator**
   - vede campaniile;
   - vede petitia si numarul de semnaturi;
   - vede forumul;
   - se poate inregistra.

2. **Utilizator autentificat**
   - semneaza petitia;
   - face o donatie simulata;
   - depune cerere de voluntariat;
   - scrie subiecte si raspunsuri in forum.

3. **Administrator**
   - gestioneaza campanii;
   - vede semnaturile;
   - verifica donatiile;
   - aproba/respinge voluntari;
   - modereaza forumul;
   - gestioneaza utilizatori.

## Colectii MongoDB

### User

Modelul existent poate fi extins:

```js
{
  username: String,
  email: String,
  password: String,
  isAdmin: Boolean,
  createdAt: Date
}
```

### Campaign

```js
{
  title: String,
  slug: String,
  summary: String,
  description: String,
  category: String,
  goal: String,
  imageUrl: String,
  status: "active" | "closed",
  createdBy: ObjectId,
  createdAt: Date
}
```

Rol:

- pagina publica de campanii;
- continut administrabil de catre admin.

### PetitionSignature

```js
{
  campaignId: ObjectId,
  fullName: String,
  email: String,
  city: String,
  message: String,
  userId: ObjectId,
  createdAt: Date
}
```

Regula:

- combinatia `campaignId + email` trebuie sa fie unica.

### Donation

```js
{
  campaignId: ObjectId,
  userId: ObjectId,
  donorName: String,
  email: String,
  amount: Number,
  currency: String,
  paymentMethod: "simulated",
  status: "confirmed" | "pending" | "cancelled",
  createdAt: Date
}
```

Regula:

- nu se stocheaza date de card;
- statusul poate fi confirmat imediat pentru demo.

### VolunteerApplication

```js
{
  userId: ObjectId,
  fullName: String,
  email: String,
  phone: String,
  city: String,
  age: Number,
  motivation: String,
  status: "pending" | "approved" | "rejected",
  createdAt: Date,
  reviewedAt: Date
}
```

Regula:

- varsta minima poate fi 15 ani, inspirat de modelul ONG;
- adminul modifica statusul.

### ForumTopic

```js
{
  title: String,
  body: String,
  authorId: ObjectId,
  campaignId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### ForumReply

```js
{
  topicId: ObjectId,
  body: String,
  authorId: ObjectId,
  createdAt: Date
}
```

## Relatii principale

- un `User` poate avea mai multe `Donation`;
- un `User` poate avea mai multe `ForumTopic`;
- un `User` poate avea mai multe `ForumReply`;
- o `Campaign` poate avea mai multe `PetitionSignature`;
- o `Campaign` poate avea mai multe `Donation`;
- o `Campaign` poate avea mai multe discutii in forum;
- o `VolunteerApplication` apartine unui user sau unui email.

## Rute API recomandate

### Campanii

```txt
GET    /api/campaigns
GET    /api/campaigns/:id
POST   /api/campaigns           admin
PUT    /api/campaigns/:id       admin
DELETE /api/campaigns/:id       admin
```

### Petitie

```txt
POST /api/petition/sign
GET  /api/petition/count/:campaignId
GET  /api/petition/signatures/:campaignId admin
```

### Donatii

```txt
POST /api/donations
GET  /api/donations/my              user
GET  /api/donations                 admin
GET  /api/donations/stats           admin
```

### Voluntariat

```txt
POST  /api/volunteers/apply
GET   /api/volunteers               admin
PATCH /api/volunteers/:id/status    admin
```

### Forum

```txt
GET    /api/forum/topics
POST   /api/forum/topics             user
GET    /api/forum/topics/:id
POST   /api/forum/topics/:id/replies user
DELETE /api/forum/topics/:id         admin
DELETE /api/forum/replies/:id        admin
```

## Pagini React recomandate

```txt
Home.js
Campaigns.js
CampaignDetails.js
Petition.js
Donate.js
Volunteer.js
Forum.js
ForumTopic.js
AdminPanel.js
Login.js
Register.js
Navbar.js
```

## Diagrame de inclus in proiect

Pentru documentatia finala, poti desena:

- diagrama cazurilor de utilizare;
- diagrama entitate-relatie;
- diagrama arhitecturala React - Express - MongoDB;
- fluxul "semnare petitie";
- fluxul "donatie simulata";
- fluxul "aprobare voluntar".
