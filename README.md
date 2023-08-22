# Full Stack Expenditure Tracking App(MERN and MySQL)

Under this repository, both the frontend(next.js) and backend(both using MySQL and MongoDB) are stored collectively.

## For the development server

To start the backend on development mode run the following command in `shell`:

```bash
npm start
```

Similarly, to start the frontend in development mode, run:

```bash
npm run dev
```

## `.env` files

Frontend folder when deployed will use `JWT_SECRET` environment variable. In development environment it should be created in the `env.local` file and it should be same as that used in the backend.

Similarly, backend using MySQL or MongoDB databases may have all or some of the following variables in `.env` file.

```bash
RZP_KEY_ID
RZP_SECRET_KEY
SMTP_KEY
SIB_API
BUCKET_NAME
IAM_USER_KEY
IAM_USER_SECRET
DB_NAME
DB_USER
DB_PASS
DB_HOST
DB_DIALECT
JWT_SECRET
MY_EMAIL
RESET_PASS_LINK
LOGIN_LINK
MONGO_PASS
MONGO_USER
```
