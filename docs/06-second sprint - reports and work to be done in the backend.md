# گزارش اسپرینت دوم و نیازمندی‌های بک‌اند

این سند، تحویلی رسمی **اسپرینت دوم** پروژه «Done & Dusted» است و شامل خلاصه‌ی تغییرات، نیازمندی‌های بک‌اند، و ارجاع به سایر مستندات است.

> برای جزئیات فنی هر endpoint به [قرارداد API](./01-api-contract.md) و [کدهای خطا](./02-error-codes.md) مراجعه کنید.

---

## ۱. خلاصه‌ی اجرایی

| موضوع | وضعیت فرانت‌اند | وضعیت بک‌اند |
| :--- | :---: | :---: |
| منوی کشویی وضعیت (`StatusDropdown`) | ✅ انجام شد | 🟢 بدون تغییر (از `PATCH /status` موجود استفاده می‌کند) |
| ویرایش وظیفه (`EditTaskModal`) | ✅ انجام شد | ✅ `PUT /api/tasks/:id` پیاده‌سازی شد |
| حذف دائمی وظیفه (`DeleteTaskModal`) | ✅ انجام شد | ✅ `DELETE /api/tasks/:id` با Hard Delete |
| پایداری داده در PostgreSQL | ✅ آماده | ✅ روی Neon |
| مدیریت سناریوهای نامعتبر (`400`/`404`) | ✅ انجام شد | ✅ با Zod + `AppError` |
| حفظ قابلیت‌های اسپرینت ۱ (Regression) | ✅ کامپایل و بیلد موفق | ✅ مسیرهای قبلی دست‌نخورده |

---

## ۲. فهرست محصول به‌روزرسانی‌شده (Product Backlog)

(مرجع اصلی: [`05-scrum-reports.md`](./05-scrum-reports.md#اسپرینت-دوم) — بخش «فهرست محصول به‌روزرسانی‌شده»)

---

## ۳. فهرست اسپرینت دوم (Sprint Backlog)

**هدف اسپرینت:** تکمیل چرخه‌ی CRUD وظایف با افزودن ویرایش و حذف، و ارتقای UX تغییر وضعیت با منوی کشویی سفارشی، بدون آسیب به قابلیت‌های اسپرینت ۱.

**آیتم‌های انتخاب‌شده:** ویرایش وظیفه، حذف وظیفه، منوی کشویی وضعیت، مدیریت سناریوهای نامعتبر.

**فعالیت‌های فنی (فرانت‌اند):**
- ساخت `StatusDropdown.tsx` با طراحی اختصاصی و پشتیبانی از دو زبان.
- ساخت `EditTaskModal.tsx` با اعتبارسنجی کلاینت، شمارنده‌ی کاراکتر و به‌روزرسانی درجا بدون جابه‌جایی ردیف.
- ساخت `DeleteTaskModal.tsx` با تأییدیه‌ی حذف و کاهش خودکار شمارنده‌ی لیست.
- افزودن `updateTask` و `deleteTask` به `lib/api.ts`.
- مرتب‌سازی لیست بر اساس `id` نزولی (`b.id - a.id`) در `TaskList.tsx` برای حفظ جایگاه ردیف‌ها پس از ویرایش/رفرش و نمایش شناسه‌های پیوسته‌ی بدون فاصله (`tasks.length - index`).
- به‌روزرسانی درجا و همگام‌سازی `404` در `TanStack Query`.

**فعالیت‌های فنی (بک‌اند):**
- افزودن `updateTaskSchema` به `task.validator.ts`.
- افزودن کنترلرهای `updateTask` و `deleteTask`.
- اتصال روت‌های `PUT /:id` و `DELETE /:id`.
- به‌روزرسانی `createdAt` به زمان ویرایش (`new Date()`) برای ثبت آخرین زمان تغییر.
- Hard Delete با `prisma.task.delete`.

**تقسیم کار:**
- **توسعه‌دهنده بک‌اند (سبحان):** پیاده‌سازی `PUT`/`DELETE`، ویلیدیشن، تست cURL، مستندسازی.
- **توسعه‌دهنده فرانت‌اند:** کامپوننت‌های مودال، منوی کشویی، مدیریت کش و خطا، تست بیلد.

**اقدام اصلاحی از اسپرینت ۱:**
- ✅ استفاده از نسخه‌های پایدار (Prisma 6 قفل شد).
- ✅ نهایی‌سازی قرارداد API پیش از کدنویسی (جلسه ۵).

**معیارهای تکمیل (Definition of Done):**
- کامپایل TypeScript بدون خطا (`npx tsc --noEmit`).
- بیلد موفق Next.js.
- تست cURL برای ۶ سناریوی ویرایش/حذف.
- تست پایداری پس از ری‌استارت.
- عدم تغییر در مسیرهای اسپرینت ۱.

---

## ۴. نیازمندی‌های بک‌اند (تکمیل‌شده)

### ۴.۱. ویرایش وظیفه — `PUT /api/tasks/:id`

| مورد | جزئیات |
| :--- | :--- |
| مسیر و متد | `PUT /api/tasks/:id` |
| هدر | `Content-Type: application/json` |
| پارامتر مسیر | `id` (عدد صحیح مثبت) |
| بدنه | `{ "title": string, "description"?: string }` |
| پاسخ موفق | `200 OK` + شیء `Task` به‌روزشده (با `createdAt` جدید) |
| خطاها | `400 TITLE_REQUIRED`، `400 TITLE_TOO_LONG`، `400 INVALID_INPUT`، `404 TASK_NOT_FOUND`، `500 SERVER_ERROR` |

**نکته‌ی کلیدی:** فیلد `createdAt` در بک‌اند هنگام ویرایش به `new Date()` به‌روزرسانی می‌شود تا زمان آخرین ویرایش در ستون تاریخ ثبت و نمایش داده شود؛ در سمت فرانت‌اند (`EditTaskModal` و `TaskList`) به‌روزرسانی به‌صورت درجا انجام شده و جدول بر اساس `id` نزولی (`b.id - a.id`) مرتب می‌ماند تا وظیفه‌ی ویرایش‌شده در همان ردیف قبلی خود بماند و نظم شناسه‌ها به‌هم نخورد.

### ۴.۲. حذف وظیفه — `DELETE /api/tasks/:id`

| مورد | جزئیات |
| :--- | :--- |
| مسیر و متد | `DELETE /api/tasks/:id` |
| پارامتر مسیر | `id` (عدد صحیح مثبت) |
| بدنه | ندارد |
| پاسخ موفق | `200 OK` + `{ "message": "TASK_DELETED", "id": number }` |
| خطاها | `400 INVALID_INPUT`، `404 TASK_NOT_FOUND`، `500 SERVER_ERROR` |

**نکته‌ی کلیدی:** حذف در بک‌اند باید **قطعی، دائم و کامل (Hard Delete)** باشد و از Soft-Delete استفاده نمی‌شود. در سمت فرانت‌اند، پس از حذف موفق، آیتم از کش حذف می‌شود تا شمارنده‌ی جدول کاهش یابد و شناسه‌های نمایشی در رابط کاربری (`tasks.length - index`) به‌صورت خودکار و پیوسته (`1, 2, 3, ...`) شماره‌گذاری شوند، بدون اینکه کلید اصلی (`id`) در PostgreSQL تغییر کند.

### ۴.۳. پایداری داده

- همه‌ی عملیات (`CREATE`، `UPDATE`، `DELETE`، `UPDATE_STATUS`) مستقیماً روی PostgreSQL (Neon) انجام می‌شوند.
- پس از ری‌استارت سرور یا کانتینر، داده‌ها پایدار می‌مانند.

### ۴.۴. مدیریت سناریوهای نامعتبر

- `id` نامعتبر → `400 INVALID_INPUT` (پیش از بررسی وجود رکورد).
- `body` نامعتبر → `400` با کد مناسب از Zod.
- JSON خراب → `400 INVALID_INPUT` (توسط `errorHandler`).
- رکورد ناموجود → `404 TASK_NOT_FOUND`.

---

## ۵. فایل‌های تغییر یافته

### 🆕 فایل‌های جدید
| مسیر | توضیح |
| :--- | :--- |
| `frontend/frontend/components/StatusDropdown.tsx` | منوی کشویی سفارشی وضعیت |
| `frontend/frontend/components/EditTaskModal.tsx` | مودال ویرایش وظیفه |
| `frontend/frontend/components/DeleteTaskModal.tsx` | مودال تأییدیه حذف |

### ✏️ فایل‌های بک‌اند
| مسیر | تغییر |
| :--- | :--- |
| `backend/src/validators/task.validator.ts` | افزودن `updateTaskSchema` |
| `backend/src/controllers/task.controller.ts` | افزودن `updateTask` و `deleteTask` |
| `backend/src/routes/task.routes.ts` | اتصال `PUT /:id` و `DELETE /:id` |

### ✏️ فایل‌های فرانت‌اند
| مسیر | تغییر |
| :--- | :--- |
| `frontend/frontend/components/TaskList.tsx` | اتصال ستون‌های ویرایش/حذف و مودال‌ها، مرتب‌سازی `b.id - a.id`، شناسه‌ی پیوسته‌ی `tasks.length - index` |
| `frontend/frontend/components/EditTaskModal.tsx` | به‌روزرسانی درجای کش بدون تغییر ترتیب ردیف‌ها |
| `frontend/frontend/app/[locale]/page.tsx` | گسترش عرض به `max-w-5xl` |
| `frontend/frontend/lib/api.ts` | افزودن `updateTask` و `deleteTask` |
| `frontend/frontend/messages/fa.json` و `en.json` | ترجمه‌های جدید |

### 📄 فایل‌های مستندات (`docs/`)
| مسیر | تغییر |
| :--- | :--- |
| `docs/01-api-contract.md` | افزودن `PUT` و `DELETE`، توضیح `StatusDropdown` و قوانین ترتیب/نمایش فرانت‌اند |
| `docs/02-error-codes.md` | تفکیک خطاهای اسپرینت دوم و رفتار همگام‌سازی `404` در فرانت‌اند |
| `docs/03-integration-guide.md` | به‌روزرسانی متدهای `lib/api.ts`، کش اسپرینت ۲ و چک‌لیست تست |
| `docs/04-meetings-log.md` | افزودن جلسات ۵ تا ۸ اسپرینت دوم |
| `docs/05-scrum-reports.md` | گزارش کامل اسکرام اسپرینت دوم (Backlog، Review، Retrospective) |
| `docs/06-second sprint - reports and work to be done in the backend.md` | گزارش جامع اسپرینت دوم و راهنمای پیاده‌سازی |

---

## ۶. گزارش بازبینی اسپرینت (Sprint Review)

(مرجع: [`05-scrum-reports.md`](./05-scrum-reports.md#۴-گزارش-بازبینی-اسپرینت-sprint-review-1))

---

## ۷. گزارش بازنگری عملکرد (Sprint Retrospective)

(مرجع: [`05-scrum-reports.md`](./05-scrum-reports.md#۵-گزارش-بازنگری-عملکرد-sprint-retrospective-1))

---

## ۸. تحویلی‌های اسپرینت دوم

- [x] فهرست محصول به‌روزرسانی‌شده
- [x] فهرست اسپرینت دوم
- [x] گزارش جلسات هماهنگی (۴ جلسه)
- [x] نسخه‌ی قابل اجرا (فرانت + بک)
- [x] کد منبع کامل
- [x] گزارش بازبینی اسپرینت
- [x] گزارش بازنگری عملکرد
- [x] راهنمای اجرا (`README.md`)
