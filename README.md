# Done & Dusted ✨

> Get it done and dusted!

برنامه‌ی مدیریت وظایف (Todo App) دو‌زبانه (فارسی / انگلیسی) که به‌عنوان پروژه‌ی درس مهندسی نرم‌افزار و با روش **Scrum** توسعه داده می‌شود. این مخزن شامل بک‌اند (Express + Prisma)، فرانت‌اند (Next.js) و مستندات اسپرینت‌هاست.

## امکانات (اسپرینت اول)

- ثبت وظیفه‌ی جدید با عنوان و توضیحات اختیاری
- مشاهده‌ی لیست وظایف (از جدیدترین به قدیمی‌ترین)
- تغییر وضعیت وظیفه با کلیک روی برچسب وضعیت (`TODO → DONE → EXPIRED`)
- اعتبارسنجی ورودی در سمت کلاینت و سرور، با پیام خطای ترجمه‌شده
- ذخیره‌ی پایدار داده‌ها در PostgreSQL
- رابط کاربری فارسی/انگلیسی با تغییر خودکار فونت و جهت متن (RTL/LTR)
- تم روشن و تاریک (انتخاب کاربر ذخیره می‌شود)

## تکنولوژی‌ها

| بخش       | ابزارها                                                                   |
| --------- | ------------------------------------------------------------------------- |
| بک‌اند    | Node.js 20+، Express 5، TypeScript، Prisma 6، Zod 4                       |
| دیتابیس   | PostgreSQL (Neon یا لوکال)                                                |
| فرانت‌اند | Next.js 16، React 19، TypeScript، Tailwind CSS، TanStack Query، next-intl |

## ساختار پروژه

```
.
├── backend/                  # API (Express + Prisma)
│   ├── prisma/               # schema و migration ها
│   └── src/
│       ├── controllers/      # منطق endpoint ها
│       ├── middlewares/      # validate و errorHandler
│       ├── routes/           # تعریف مسیرها
│       ├── validators/       # اسکیماهای Zod
│       ├── app.ts            # تنظیم Express و CORS
│       └── server.ts         # راه‌اندازی سرور
├── frontend/frontend/        # رابط کاربری (Next.js)
│   ├── app/[locale]/         # صفحات (fa / en)
│   ├── components/           # کامپوننت‌ها
│   ├── i18n/                 # تنظیمات next-intl
│   ├── lib/                  # فراخوانی API و تایپ‌ها
│   └── messages/             # ترجمه‌ها (fa.json و en.json)
├── docs/                     # مستندات فنی و اسکرام
└── docker-compose.yml
```

## پیش‌نیازها

- Node.js 20 یا بالاتر
- PostgreSQL 14 یا بالاتر (یا Docker / یک دیتابیس Neon)

## متغیرهای محیطی

فایل `backend/.env` را بسازید:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public"
PORT=4000
FRONTEND_URL=http://localhost:3000
```

| متغیر          | توضیح                                    | پیش‌فرض                 |
| -------------- | ---------------------------------------- | ----------------------- |
| `DATABASE_URL` | آدرس اتصال به PostgreSQL (لوکال یا Neon) | — (الزامی)              |
| `PORT`         | پورت بک‌اند                              | `4000`                  |
| `FRONTEND_URL` | مبدأ مجاز برای CORS                      | `http://localhost:3000` |

> فایل `.env` را هرگز کامیت نکنید.

## اجرا با Docker

```bash
docker compose up
```

این دستور سه سرویس را بالا می‌آورد: دیتابیس PostgreSQL، بک‌اند (پورت `4000`) و فرانت‌اند (پورت `3000`). مایگریشن‌ها هنگام بالا آمدن بک‌اند خودکار اعمال می‌شوند.

برای استفاده از دیتابیس **Neon** به‌جای دیتابیس لوکال، یک فایل `.env` در ریشه‌ی پروژه با مقدار `DATABASE_URL` بسازید و اجرا کنید:

```bash
docker compose up backend frontend --no-deps
```

پاک کردن کانتینرها و داده‌ی دیتابیس لوکال:

```bash
docker compose down -v
```

## اجرای دستی (بدون Docker)

### ۱. بک‌اند

```bash
cd backend
npm install
npx prisma migrate dev      # ساخت جداول
npm run dev                 # http://localhost:4000
```

اسکریپت‌های موجود:

| دستور                | کار                        |
| -------------------- | -------------------------- |
| `npm run dev`        | اجرای سرور با watch        |
| `npm start`          | اجرای سرور                 |
| `npm run build`      | کامپایل TypeScript         |
| `npm run db:migrate` | اجرای `prisma migrate dev` |
| `npm run db:studio`  | باز کردن Prisma Studio     |

### ۲. فرانت‌اند

```bash
cd frontend/frontend
npm install
npm run dev                 # http://localhost:3000
```

زبان پیش‌فرض فارسی است؛ آدرس‌ها به‌صورت `/fa` و `/en` هستند.

> فرانت‌اند به‌صورت پیش‌فرض به `http://localhost:4000` متصل می‌شود. برای تغییر آدرس بک‌اند، فایل `frontend/frontend/.env.local` را (روی نمونه‌ی `.env.example`) بسازید و `NEXT_PUBLIC_API_URL` را تنظیم کنید؛ سپس سرور فرانت‌اند را ری‌استارت کنید.

## API

آدرس پایه: `http://localhost:4000`

| متد     | مسیر                    | توضیح                                        |
| ------- | ----------------------- | -------------------------------------------- |
| `GET`   | `/health`               | بررسی سلامت سرور، پاسخ: `{ "status": "ok" }` |
| `GET`   | `/api/tasks`            | دریافت همه‌ی وظایف (جدیدترین اول)            |
| `POST`  | `/api/tasks`            | ساخت وظیفه‌ی جدید                            |
| `PATCH` | `/api/tasks/:id/status` | تغییر وضعیت وظیفه                            |

نمونه‌ی ساخت وظیفه:

```http
POST /api/tasks
Content-Type: application/json

{ "title": "خرید نان", "description": "نان سنگک" }
```

پاسخ موفق (`201 Created`):

```json
{
  "id": 1,
  "title": "خرید نان",
  "description": "نان سنگک",
  "status": "TODO",
  "createdAt": "2026-11-06T12:00:00.000Z"
}
```

نمونه‌ی تغییر وضعیت:

```http
PATCH /api/tasks/1/status
Content-Type: application/json

{ "status": "DONE" }
```

مقادیر وضعیت: `TODO`، `DONE`، `EXPIRED`

### قوانین ورودی

- `title`: الزامی، پس از `trim` بین ۱ تا ۱۰۰ کاراکتر
- `description`: اختیاری، حداکثر ۵۰۰ کاراکتر

### کدهای خطا

سرور مستقل از زبان است و فقط کد خطا برمی‌گرداند (`{ "error": "CODE" }`)؛ ترجمه در فرانت‌اند انجام می‌شود.

| کد HTTP | کد خطا           | شرایط                                                     |
| ------- | ---------------- | --------------------------------------------------------- |
| 400     | `TITLE_REQUIRED` | عنوان ارسال نشده، خالی یا فقط فاصله است                   |
| 400     | `TITLE_TOO_LONG` | عنوان بیش از ۱۰۰ کاراکتر است                              |
| 400     | `INVALID_INPUT`  | نوع داده نادرست، توضیحات بیش از ۵۰۰ کاراکتر، یا JSON خراب |
| 404     | `TASK_NOT_FOUND` | وظیفه‌ای با این شناسه وجود ندارد                          |
| 500     | `SERVER_ERROR`   | خطای غیرمنتظره‌ی سرور                                     |

## مستندات

- [قرارداد API](./docs/01-api-contract.md)
- [کدهای خطا](./docs/02-error-codes.md)
- [راهنمای اتصال فرانت و بک](./docs/03-integration-guide.md)
- [گزارش جلسات](./docs/04-meetings-log.md)
- [گزارش‌ها و مستندات اسکرام](./docs/05-scrum-reports.md)

## نقشه‌ی راه

- [x] اسپرینت اول: ثبت و مشاهده‌ی وظایف، اعتبارسنجی، پایداری داده، i18n و تم
- [ ] اسپرینت دوم: بهبود مدیریت وضعیت وظایف و ادامه‌ی قابلیت‌ها
