# Photo Sharing Frontend

## Moi truong can co

- Node.js va npm
- Backend cua project dang chay
- MongoDB Atlas cho backend

Backend can cai cac package bang:

```bash
npm install
```

## Cai dat frontend

Trong thu muc frontend, chay:

```bash
npm install
```

Tao file `.env` trong frontend:

```env
PORT=3001
REACT_APP_API_URL=http://localhost:8081
```

Neu chay tren CodeSandbox, thay `REACT_APP_API_URL` bang URL backend public:

```env
PORT=3001
REACT_APP_API_URL=https://your-backend-8081.csb.app
```

## Chay frontend

```bash
npm start
```

Frontend se chay o port 3001:

```text
http://localhost:3001
```

Tren CodeSandbox URL se co dang:

```text
https://your-frontend-3001.csb.app
```

## Cau hinh backend can khop voi frontend

Backend `.env` can co:

```env
DB_URL=mongodb+srv://<user>:<password>@<cluster>/<database>?appName=<appName>
SESSION_SECRET=photo-sharing-app-session-secret
FRONTEND_ORIGIN=https://your-frontend-3001.csb.app
COOKIE_SAMESITE=none
COOKIE_SECURE=true
```

Khi chay local co the dung:

```env
FRONTEND_ORIGIN=http://localhost:3001
COOKIE_SAMESITE=lax
COOKIE_SECURE=false
```

## MongoDB Atlas

Trong MongoDB Atlas, can mo Network Access de backend ket noi duoc. Khi dung CodeSandbox, co the allow:

```text
0.0.0.0/0
```

Sau khi sua `.env`, can restart lai frontend/backend.
