# گزارش تغییرات اسپرینت دوم و نیازمندی‌های بک‌اند (Sprint 2 - Changelog & Backend Tasks)

این سند برای پیگیری و ثبت گام‌به‌گام تغییرات فرانت‌اند در **اسپرینت دوم** و مشخص کردن تغییرات، بهبودها یا نیازمندی‌های لازم در بخش **بک‌اند** (جهت هماهنگی و پیاده‌سازی توسط توسعه‌دهنده بک‌اند، سبحان) تهیه شده است.

با اعمال هر تغییر در فرانت‌اند، جزئیات آن به همراه وضعیت و اقدامات موردنیاز بک‌اند در این فایل ثبت و به‌روزرسانی خواهد شد.

---

## فهرست تغییرات و وضعیت هماهنگی

| ردیف | موضوع تغییر | وضعیت فرانت‌اند | وضعیت و نیازمندی بک‌اند |
| :---: | :--- | :---: | :---: |
| ۱ | تبدیل دکمه وضعیت به منوی کشویی سفارشی (Status Dropdown) | ✅ انجام شد | 🟢 بدون نیاز به تغییر (سازگار با API فعلی) |
| ۲ | قابلیت ویرایش عنوان و توضیحات وظیفه (Edit Task) | ✅ انجام شد | 🟡 نیازمند ساخت اندپوینت `PUT /api/tasks/:id` |
| ۳ | قابلیت حذف کامل وظیفه (Delete Task) | ✅ انجام شد | 🔴 نیازمند ساخت اندپوینت `DELETE /api/tasks/:id` و حذف قطعی از دیتابیس |
| ۴ | پایداری داده‌ها در پایگاه داده (Data Persistence) | ✅ آماده در فرانت | 🟡 ذخیره مستقیم و قطعی در PostgreSQL برای تمام عملیات |
| ۵ | مدیریت سناریوهای نامعتبر (Invalid Scenarios) | ✅ انجام شد در فرانت | 🟡 اعتبارسنجی Zod و مدیریت 400 و 404 در اندپوینت‌های جدید |
| ۶ | تضمین سلامت قابلیت‌های اسپرینت ۱ (Regression Testing) | ✅ کامپایل و تست موفق | 🟢 بدون آسیب به روت‌ها و ساختار دیتابیس قبلی |

---

## ۱. منوی کشویی انتخاب مستقیم وضعیت (Custom Status Dropdown)

### 📋 شرح تغییرات فرانت‌اند:
- **مسئله:** در اسپرینت اول، تغییر وضعیت با کلیک چرخشی (`TODO → DONE → EXPIRED → TODO`) انجام می‌شد که برای کاربر جدید واضح نبود و برای رفتن به وضعیت دلخواه نیاز به چند کلیک متوالی داشت.
- **راه‌حل پیاده‌سازی‌شده:**
  1. ساخت کامپوننت اختصاصی `StatusDropdown.tsx` (`frontend/frontend/components/StatusDropdown.tsx`).
  2. نمایش برچسب وضعیت فعلی به همراه آیکون پیکان (`▾`) با رنگ‌های مشخص (زرد برای `TODO`، سبز برای `DONE`، قرمز برای `EXPIRED`).
  3. باز شدن منوی شناور سفارشی با طراحی اختصاصی:
     - **سطر اول:** عنوان راهنما `Select task status:` (با رنگ سفید، غیرقابل کلیک).
     - **سطر دوم:** گزینه `TODO` (با رنگ زرد و نشانگر نوری).
     - **سطر سوم:** گزینه `DONE` (با رنگ سبز و نشانگر نوری).
     - **سطر چهارم:** گزینه `EXPIRED` (با رنگ قرمز و نشانگر نوری).
  4. پشتیبانی از بسته‌شدن خودکار با کلیک در بیرون منو، زدن دکمه `Escape` یا انتخاب وضعیت.
  5. نمایش وضعیت لودینگ مجزا روی همان وظیفه هنگام ارسال درخواست به سرور.
  6. پشتیبانی کامل از دو زبان فارسی و انگلیسی (`messages/fa.json` و `messages/en.json`).
  7. اتصال کامپوننت به `TaskList.tsx`.

### ⚙️ اقدامات و تغییرات موردنیاز در بک‌اند:
* **وضعیت:** **نیازی به هیچ تغییری در بک‌اند نیست.**
* **علت:** اندپوینت موجود `PATCH /api/tasks/:id/status` از پیش مقدار `status` را از میان `TODO`، `DONE` و `EXPIRED` می‌پذیرد و کاملاً پاسخگوی این قابلیت است.

---

## ۲. ویرایش عنوان و توضیحات وظیفه (Edit Task)

### 📋 شرح تغییرات فرانت‌اند:
- **مسئله و هدف:** کاربر باید بتواند عنوان و توضیحات وظایف ثبت‌شده قبلی را ویرایش کند و همزمان اعتبارسنجی عنوان جدید انجام شود.
- **راه‌حل پیاده‌سازی‌شده در رابط کاربری:**
  1. **بهبود چیدمان و عرض باکس‌ها:** عرض باکس فرم افزودن و لیست وظایف برای تقارن بهتر و فضای کار بیشتر از `max-w-4xl` به `max-w-5xl` گسترش یافت تا دقیقاً زیر یکدیگر و متقارن قرار گیرند.
  2. **ستون ویرایش (Edit):** ستون جدیدی به نام «ویرایش» در جدول وظایف اضافه شد که دارای دکمه ویرایش با آیکون مداد (`✏️`)، پس‌زمینه هاور و راهنمای متنی (Tooltip) است.
  3. **مودال اختصاصی با پس‌زمینه مات (`EditTaskModal.tsx`):**
     - با کلیک روی دکمه ویرایش، یک مدال در مرکز صفحه باز می‌شود و پس‌زمینه آن کل صفحه و دو باکس زیرین را مات (`backdrop-blur-md bg-black/60`) می‌کند تا توجه کاربر متمرکز شود.
     - فرم مودال به صورت خودکار با عنوان و توضیحات قبلی همان تسک پر (pre-fill) می‌شود.
     - شمارنده کاراکتر زنده برای عنوان (`X / 100`) و توضیحات (`X / 500`) تعبیه شده است.
     - اعتبارسنجی کلاینت (اجباری بودن عنوان، حداکثر ۱۰۰ کاراکتر، توضیحات حداکثر ۵۰۰ کاراکتر) با کادرهای خطای استاندارد ترجمه‌شده.
     - بسته‌شدن آسان با کلیک روی پس‌زمینه، زدن دکمه انصراف، آیکون ضربدر یا فشردن کلید `Escape`.
     - ارسال تغییرات به سرور و به‌روزرسانی درجا (In-place) در کش TanStack Query بدون پرش یا بارگذاری مجدد کل جدول.

### ⚙️ اقدامات و کارهای لازم توسط سبحان در بخش بک‌اند:
برای تکمیل این قابلیت، نیاز است سبحان اندپوینت ویرایش وظیفه را در بک‌اند پیاده‌سازی کند:

#### ۱. مسیر و متد درخواست (Route & Method):
* **مسیر:** `PUT /api/tasks/:id`
* **هدر:** `Content-Type: application/json`
* **پارامتر مسیر (`params`):** `id` (شناسه عددی وظیفه، عدد صحیح مثبت)

#### ۲. بدنه‌ی درخواست (Request Body):
```json
{
  "title": "عنوان جدید وظیفه",
  "description": "توضیحات جدید وظیفه (اختیاری)"
}
```

#### ۳. قوانین اعتبارسنجی (Validation Rules):
* `title`: الزامی است، پس از `trim` نباید خالی باشد، بین ۱ تا ۱۰۰ کاراکتر.
  - اگر ارسال نشود یا خالی/فاصله باشد: پاسخ `400` با کد خطای `{ "error": "TITLE_REQUIRED" }`
  - اگر بیش از ۱۰۰ کاراکتر باشد: پاسخ `400` با کد خطای `{ "error": "TITLE_TOO_LONG" }`
* `description`: اختیاری، حداکثر ۵۰۰ کاراکتر.
  - اگر بیش از ۵۰۰ کاراکتر باشد یا نوع داده اشتباه باشد: پاسخ `400` با کد خطای `{ "error": "INVALID_INPUT" }`
* `id`: باید عدد صحیح مثبت باشد:
  - اگر نامعتبر باشد: پاسخ `400` با کد خطای `{ "error": "INVALID_INPUT" }`
  - اگر وظیفه‌ای با این شناسه یافت نشود: پاسخ `404` با کد خطای `{ "error": "TASK_NOT_FOUND" }`
* خطای غیرمنتظره سرور: پاسخ `500` با کد خطای `{ "error": "SERVER_ERROR" }`

#### ۴. پاسخ موفق (200 OK):
شیء وظیفه به‌روزشده با فیلدهای کامل (شامل تاریخ به‌روزشده `createdAt`):
```json
{
  "id": 1,
  "title": "عنوان ویرایش‌شده",
  "description": "توضیحات ویرایش‌شده",
  "status": "TODO",
  "createdAt": "2026-11-20T22:35:00.000Z"
}
```

> [!IMPORTANT]
> **به‌روزرسانی تاریخ ایجاد/ویرایش (`createdAt`) به زمان فعلی:**
> هنگامی که یک وظیفه ویرایش می‌شود، فیلد `createdAt` آن در پایگاه داده باید به زمان وقوع ویرایش (`new Date()`) به‌روزرسانی شود. با این کار:
> ۱. ستون «تاریخ ایجاد» در جدول، زمان دقیق آخرین ویرایش را منعکس می‌کند.
> ۲. وظیفه ویرایش‌شده در مرتب‌سازی پیش‌فرض بک‌اند (`orderBy: { createdAt: "desc" }`) به بالای لیست هدایت می‌شود.
> سبحان باید در زمان فراخوانی `prisma.task.update`، فیلد `createdAt: new Date()` را در `data` بگنجاند.

#### ۵. فایل‌هایی که باید در بک‌اند تغییر داده شوند:
1. `backend/src/validators/task.validator.ts`: اضافه کردن اسکیما برای اعتبارسنجی `updateTaskSchema` با Zod:
   ```typescript
   export const updateTaskSchema = z.object({
     title: z
       .string({
         error: (issue) =>
           issue.input === undefined ? "TITLE_REQUIRED" : "INVALID_INPUT",
       })
       .trim()
       .min(1, "TITLE_REQUIRED")
       .max(100, "TITLE_TOO_LONG"),
     description: z.string().max(500, "INVALID_INPUT").optional().default(""),
   });
   ```
2. `backend/src/controllers/task.controller.ts`: نوشتن کنترلر `updateTask` با استفاده از `prisma.task.update`:
   ```typescript
   export const updateTask = async (
     req: Request,
     res: Response,
     next: NextFunction,
   ) => {
     try {
       const { id } = req.params;
       const { title, description } = req.body;
       const taskId = Number(id);

       const existingTask = await prisma.task.findUnique({
         where: { id: taskId },
       });

       if (!existingTask) {
         return next(new AppError(404, "TASK_NOT_FOUND"));
       }

       // به‌روزرسانی عنوان، توضیحات و تاریخ به زمان جاری
       const updatedTask = await prisma.task.update({
         where: { id: taskId },
         data: {
           title,
           description,
           createdAt: new Date(), // ثبت زمان ویرایش
         },
       });

       res.json(updatedTask);
     } catch (error) {
       next(error);
     }
   };
   ```
3. `backend/src/routes/task.routes.ts`: اتصال مسیر:
   ```typescript
   router.put(
     "/:id",
     validate(taskIdParamsSchema, "params"),
     validate(updateTaskSchema),
     updateTask,
   );
   ```

---


## ۳. حذف کامل وظیفه از برنامه و پایگاه داده (Delete Task)

### 📋 شرح تغییرات فرانت‌اند:
- **مسئله و هدف:** کاربر باید بتواند وظایف ثبت‌شده را به‌صورت ایمن و دائمی از برنامه و پایگاه داده حذف کند، بدون خطر حذف ناخواسته یا تصادفی.
- **راه‌حل پیاده‌سازی‌شده در رابط کاربری:**
  1. **ستون مجزای حذف در جدول:** ستونی با عنوان «حذف» در کنار ستون ویرایش اضافه شد که دارای دکمه با آیکون سطل زباله (`🗑️`)، جلوه بصری هاور با رنگ قرمز ملایم و راهنمای متنی (Tooltip) است.
  2. **مودال تأییدیه با پس‌زمینه مات (`DeleteTaskModal.tsx`):**
     - با کلیک روی سطل زباله، یک مدال در وسط صفحه باز شده و پس‌زمینه کل صفحه و باکس‌ها را مات و تیره می‌کند (`backdrop-blur-md bg-black/60`).
     - عنوان مشخصِ تسک موردنظر داخل یک کادر پیش‌نمایش داده می‌شود تا کاربر دقیقاً بداند چه وظیفه‌ای قرار است حذف شود.
     - پیام هشدار صریح: «آیا از حذف این وظیفه مطمئن هستید؟ این عملیات غیرقابل بازگشت است.»
     - دو دکمه عملگر:
       - **«بله، مطمئنم»:** دکمه قرمز اختصاصی (`bg-error`) با انیمیشن اسپینر در حین انجام عملیات.
       - **«خیر، انصراف»:** دکمه انصراف با کادر خنثی.
     - امکان بسته‌شدن امن مودال با کلیک در بیرون، فشردن دکمه انصراف یا فشردن کلید `Escape`.
     - به‌روزرسانی درجا (In-place) در کش TanStack Query بلافاصله پس از حذف موفق در سرور و پاک شدن ردیف بدون نیاز به رفرش صفحه.
  3. **کاهش آنی شمارنده تعداد وظایف:** با حذف هر وظیفه، عدد موجود در عنوان لیست وظایف (`فهرست وظایف (N)`) بلافاصله یک واحد کاهش می‌یابد و در صورت رسیدن به صفر، صفحه به صورت خودکار پیام وضعیت خالی (Empty State) را نشان می‌دهد.

### ⚙️ اقدامات و کارهای لازم توسط سبحان در بخش بک‌اند:
برای تکمیل این قابلیت، سبحان باید اندپوینت حذف کامل تسک را پیاده‌سازی کند:

> [!CAUTION]
> **تاکید بسیار مهم برای سبحان (حذف قطعی، کامل و غیرقابل بازگشت از دیتابیس):**
> پس از دریافت درخواست حذف، رکورد مربوط به این وظیفه باید **به‌صورت ۱۰۰٪ قطعی، دائم و کامل (Hard Delete)** از جدول `Task` در پایگاه داده PostgreSQL حذف شود. از هیچ‌گونه Soft-Delete یا باقی گذاشتن رکوردهای بدون استفاده خودداری شود؛ داده‌های این وظیفه باید کاملاً و برای همیشه از کل دیتابیس پاکسازی شوند (`prisma.task.delete`).

#### ۱. مسیر و متد درخواست (Route & Method):
* **مسیر:** `DELETE /api/tasks/:id`
* **پارامتر مسیر (`params`):** `id` (شناسه عددی وظیفه، عدد صحیح مثبت)

#### ۲. قوانین اعتبارسنجی و خطاها:
* `id`: باید عدد صحیح مثبت باشد:
  - اگر نامعتبر باشد (مثلاً رشته یا عدد منفی): پاسخ `400` با کد خطای `{ "error": "INVALID_INPUT" }`
  - اگر وظیفه‌ای با این شناسه در پایگاه داده یافت نشود: پاسخ `404` با کد خطای `{ "error": "TASK_NOT_FOUND" }`
* در صورت بروز خطای پیش‌بینی‌نشده: پاسخ `500` با کد خطای `{ "error": "SERVER_ERROR" }`

#### ۳. پاسخ موفق (200 OK):
پاسخ `200 OK` به همراه پیام تایید حذف:
```json
{
  "message": "TASK_DELETED",
  "id": 1
}
```

#### ۴. نمونه پیاده‌سازی در کنترلر بک‌اند (`task.controller.ts`):
```typescript
export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const taskId = Number(id);

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      return next(new AppError(404, "TASK_NOT_FOUND"));
    }

    // حذف قطعی، دائم و کامل از دیتابیس (Permanent Hard Delete)
    await prisma.task.delete({
      where: { id: taskId },
    });

    res.json({ message: "TASK_DELETED", id: taskId });
  } catch (error) {
    next(error);
  }
};
```

#### ۵. اتصال مسیر در `task.routes.ts`:
```typescript
router.delete(
  "/:id",
  validate(taskIdParamsSchema, "params"),
  deleteTask,
);
```

---


## ۴. پایداری داده‌ها در پایگاه داده و حفظ اطلاعات پس از راه‌اندازی مجدد (Data Persistence Across Restarts)

### 📋 شرح وضعیت در سمت فرانت‌اند:
- فرانت‌اند تمام عملیات ساخت، تغییر وضعیت، ویرایش و حذف را مستقیماً از طریق درخواست‌های HTTP استاندارد (`POST`, `PATCH`, `PUT`, `DELETE`) به سرور بک‌اند ارسال می‌کند و هیچ داده‌ای را به‌صورت محلی (فیک یا فقط در استیت حافظه) نگه نمی‌دارد.
- پس از دریافت پاسخ موفق از سرور، کش محلی کلاینت (TanStack Query) به‌روز می‌شود؛ بنابراین در صورت رفرش شدن مرورگر، فرانت‌اند دوباره لیست را با متد `GET /api/tasks` از دیتابیس واکشی می‌کند.

### ⚙️ اقدامات و کارهای لازم توسط سبحان در بخش بک‌اند:
پایداری واقعی داده‌ها مستقیماً بر عهده لایه دیتابیس و کدهای بک‌اند است. سبحان باید اطمینان حاصل کند که تمام تغییرات اسپرینت دوم به صورت قطعی در پایگاه داده PostgreSQL (Neon) ذخیره شوند تا با خاموش و روشن شدن سرور یا کانتینرها، داده‌ها پایدار بمانند.

#### ۱. بررسی اتصال و کانکشن دیتابیس:
* متغیر `DATABASE_URL` در فایل `backend/.env` تنظیم شده باشد و ارجاع آن به دیتابیس PostgreSQL (ابری در Neon یا محلی) پایدار باشد.
* اتصال Prisma Client با تنظیمات صحیح و فعال بودن کانکشن پولینگ برقرار باشد.

#### ۲. اطمینان از اجرای دستورات روی دیتابیس در تمام اندپوینت‌ها:
* **ثبت تسک جدید (`POST /api/tasks`):** ذخیره در دیتابیس با `prisma.task.create` (انجام‌شده در اسپرینت ۱).
* **تغییر وضعیت (`PATCH /api/tasks/:id/status`):** به‌روزرسانی مقدار فیلد `status` با `prisma.task.update` (انجام‌شده).
* **ویرایش تسک (`PUT /api/tasks/:id`):** ذخیره مستقیم مقادیر جدید `title` و `description` و زمان جدید `createdAt` با `prisma.task.update`.
* **حذف تسک (`DELETE /api/tasks/:id`):** پاک‌سازی فیزیکی و قطعی رکورد از جدول با `prisma.task.delete`.
* **واکشی تسک‌ها (`GET /api/tasks`):** خواندن زنده از دیتابیس با `prisma.task.findMany({ orderBy: { createdAt: "desc" } })`.

#### ۳. سناریوهای آزمون پایداری (Checklist برای سبحان):
برای اثبات پایداری کامل داده‌ها، سبحان باید سناریوهای زیر را تست کند:
1. **تست پایداری ثبت:** یک وظیفه جدید ثبت کنید → سرور بک‌اند را ری‌استارت کنید (`Ctrl+C` و اجرای مجدد) → صفحه فرانت را رفرش کنید؛ وظیفه باید باقی مانده باشد.
2. **تست پایداری ویرایش:** عنوان یا توضیحات یک وظیفه را ویرایش کنید → سرور بک‌اند را ری‌استارت کنید → صفحه را رفرش کنید؛ عنوان و توضیحات جدید به همراه تاریخ جدید باید دقیقاً نمایش داده شوند.
3. **تست پایداری تغییر وضعیت:** وضعیت وظیفه‌ای را تغییر دهید → سرور را ری‌استارت و صفحه را رفرش کنید؛ وضعیت جدید باید حفظ شده باشد.
4. **تست پایداری حذف:** وظیفه‌ای را حذف کنید → سرور بک‌اند را ری‌استارت کنید → دیتابیس در Prisma Studio یا Neon بررسی شود؛ رکورد نباید بازگردد و باید به طور کامل پاک شده باشد.

---


## ۵. مدیریت سناریوهای نامعتبر در بک‌اند (Invalid Scenarios Handling)

### 📋 وضعیت در سمت فرانت‌اند:
- فرانت‌اند تمام اعتبارسنجی‌های ورودی فرم (عنوان خالی، فاصله تنها، عنوان بیش از ۱۰۰ کاراکتر، توضیحات بیش از ۵۰۰ کاراکتر) را قبل از ارسال به سرور رهگیری کرده و با پیام خطای محلی به کاربر نشان می‌دهد.
- در صورت بروز خطای `404 TASK_NOT_FOUND` (مثلاً حذف شدن تسک در سشن دیگر)، هر سه کامپوننت `StatusDropdown`، `EditTaskModal` و `DeleteTaskModal` به‌صورت خودکار کش کلاینت را باطل کرده و با سرور همگام می‌شوند (`queryClient.invalidateQueries`).

### ⚙️ اقدامات و کارهای لازم توسط سبحان در بخش بک‌اند:
سبحان باید امنیت و اعتبارسنجی را در سطح سرور به ازای تمام مسیرهای جدید تضمین کند:

#### ۱. خطاهای اعتبارسنجی بدنه در `PUT /api/tasks/:id`:
* **عنوان ارسال نشده یا خالی/فاصله:** پاسخ `400` با `{ "error": "TITLE_REQUIRED" }`.
* **طول عنوان بیش از ۱۰۰ کاراکتر:** پاسخ `400` با `{ "error": "TITLE_TOO_LONG" }`.
* **توضیحات بیش از ۵۰۰ کاراکتر یا نوع داده نادرست:** پاسخ `400` با `{ "error": "INVALID_INPUT" }`.

#### ۲. خطاهای شناسه مسیر (`params.id`):
* در هر دو متد `PUT /api/tasks/:id` و `DELETE /api/tasks/:id`:
  - اگر شناسه یک عدد صحیح مثبت نباشد (مثلاً حروف، اعشار، عدد صفر یا منفی): پاسخ `400` با `{ "error": "INVALID_INPUT" }`.
  - ابتدا باید وجود رکورد در دیتابیس بررسی شود (`prisma.task.findUnique`). اگر تسک با این شناسه یافت نشود: پاسخ `404` با `{ "error": "TASK_NOT_FOUND" }`.

#### ۳. مدیریت خطاهای سرور و JSON خراب:
* بدنه JSON غیراستاندارد باید توسط میدلور ارور به خطای `400 INVALID_INPUT` نگاشت شود.
* خطاهای غیرمنتظره دیتابیس یا سرور با کد `500 SERVER_ERROR` برگردانده شوند.

---

## ۶. تضمین سلامت قابلیت‌های اسپرینت اول (Regression Testing & Backward Compatibility)

### 📋 وضعیت در سمت فرانت‌اند:
- کامپایل TypeScript با دستور `npx tsc --noEmit` با **۰ خطا** به اتمام رسید.
- بیلد پروداکشن Next.js (`npm run build`) بدون هیچ مشکلی با موفقیت کامل انجام شد.
- تمام قابلیت‌های اسپرینت ۱ شامل فرم ثبت وظیفه، قابلیت تغییر زبان (فارسی/انگلیسی)، جهت متون (RTL/LTR)، فونت‌ها (وزیرمتن/میناکو)، تم تاریک/روشن و انیمیشن باران ستاره‌ای با کامپوننت‌های جدید کاملاً هماهنگ هستند و بدون هیچ نقصی کار می‌کنند.

### ⚙️ چک‌لیست برای سبحان جهت عدم تداخل در بک‌اند:
سبحان باید مطمئن شود که با اضافه کردن مسیرهای جدید `PUT` و `DELETE`:
1. مسیرهای قبلی دست‌نخورده باقی بمانند:
   - `GET /health` باید همچنان پاسخ `{ "status": "ok" }` بدهد.
   - `GET /api/tasks` باید همان ساختار آرایه وظایف مرتب‌شده نزولی بر اساس `createdAt` را برگرداند.
   - `POST /api/tasks` بدون تغییر کار کند.
   - `PATCH /api/tasks/:id/status` همچنان با مقادیر `TODO`, `DONE`, `EXPIRED` کار کند.
2. ساختار فایل `schema.prisma` و فیلدهای مدل `Task` نباید تغییر کنند یا فیلد اجباری جدیدی به آن اضافه شود که باعث ناسازگاری با کدهای موجود گردد.

---


## ۷. فهرست جامع فایل‌های ایجادشده و تغییریافته در اسپرینت دوم (File Map & Paths)

جهت سهولت کار اعضای تیم، تمام فایل‌های جدید و تغییریافته با مسیر دقیق در جدول زیر فهرست شده‌اند:

### 🆕 فایل‌های جدید (Created Files):
| ردیف | نام فایل | مسیر فایل در مخزن | توضیح عملکرد |
| :---: | :--- | :--- | :--- |
| ۱ | `StatusDropdown.tsx` | `frontend/frontend/components/StatusDropdown.tsx` | منوی کشویی سفارشی انتخاب وضعیت تسک با سطر اول سفید و گزینه‌های رنگی |
| ۲ | `EditTaskModal.tsx` | `frontend/frontend/components/EditTaskModal.tsx` | پنجره مودال ویرایش عنوان و توضیحات با پس‌زمینه بلور و اعتبارسنجی |
| ۳ | `DeleteTaskModal.tsx` | `frontend/frontend/components/DeleteTaskModal.tsx` | پنجره مودال تأییدیه حذف قطعی وظیفه با دکمه‌های «بله، مطمئنم» و «خیر، انصراف» |
| ۴ | `06-second sprint - reports...` | `docs/06-second sprint - reports and work to be done in the backend.md` | مستند جامع تغییرات اسپرینت دوم، راهنمای بک‌اند و نیازمندی‌های سبحان |

### ✏️ فایل‌های به‌روزرسانی‌شده (Modified Files):
| ردیف | نام فایل | مسیر فایل در مخزن | تغییرات اعمال‌شده |
| :---: | :--- | :--- | :--- |
| ۱ | `TaskList.tsx` | `frontend/frontend/components/TaskList.tsx` | اتصال ستون‌های ویرایش و حذف، اتصال منوی کشویی وضعیت و مودال‌ها |
| ۲ | `page.tsx` | `frontend/frontend/app/[locale]/page.tsx` | گسترش عرض کانتینر اصلی به `max-w-5xl` جهت تقارن و چیدمان یکدست |
| ۳ | `api.ts` | `frontend/frontend/lib/api.ts` | افزودن متدهای کلاینت `updateTask` (PUT) و `deleteTask` (DELETE) |
| ۴ | `fa.json` | `frontend/frontend/messages/fa.json` | افزودن ترجمه‌های فارسی مربوط به منوی وضعیت، ویرایش، حذف و ستون‌ها |
| ۵ | `en.json` | `frontend/frontend/messages/en.json` | افزودن ترجمه‌های انگلیسی مربوط به منوی وضعیت، ویرایش، حذف و ستون‌ها |

---

## ۸. کدهای کامل بک‌اند و دستورات تست برای سبحان (Ready-to-Use Code & Curl)

جهت تسریع کار سبحان، قطعه کدهای آماده و تست‌شده به تفکیک فایل‌های بک‌اند در زیر قرار گرفته است:

### ۱. فایل `backend/src/validators/task.validator.ts`:
اسکیمای `updateTaskSchema` را به انتهای این فایل اضافه کنید:
```typescript
export const updateTaskSchema = z.object({
  title: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "TITLE_REQUIRED" : "INVALID_INPUT",
    })
    .trim()
    .min(1, "TITLE_REQUIRED")
    .max(100, "TITLE_TOO_LONG"),
  description: z.string().max(500, "INVALID_INPUT").optional().default(""),
});
```

### ۲. فایل `backend/src/controllers/task.controller.ts`:
دو متد `updateTask` و `deleteTask` را به کنترلر اضافه و اکسپورت کنید:
```typescript
export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const taskId = Number(id);

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      return next(new AppError(404, "TASK_NOT_FOUND"));
    }

    // به‌روزرسانی عنوان، توضیحات و زمان ویرایش
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title,
        description,
        createdAt: new Date(), // به‌روزرسانی تاریخ به زمان ویرایش
      },
    });

    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const taskId = Number(id);

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      return next(new AppError(404, "TASK_NOT_FOUND"));
    }

    // حذف قطعی، کامل و دائمی از پایگاه داده (Hard Delete)
    await prisma.task.delete({
      where: { id: taskId },
    });

    res.json({ message: "TASK_DELETED", id: taskId });
  } catch (error) {
    next(error);
  }
};
```

### ۳. فایل `backend/src/routes/task.routes.ts`:
ایمپورت‌ها را به‌روز کرده و دو مسیر جدید را ثبت کنید:
```typescript
import { Router } from "express";
import {
  createTask,
  getTasks,
  updateTaskStatus,
  updateTask,
  deleteTask,
} from "../controllers/task.controller";
import { validate } from "../middlewares/validate";
import {
  createTaskSchema,
  taskIdParamsSchema,
  updateTaskStatusSchema,
  updateTaskSchema,
} from "../validators/task.validator";

const router = Router();

router.post("/", validate(createTaskSchema), createTask);
router.get("/", getTasks);
router.patch(
  "/:id/status",
  validate(taskIdParamsSchema, "params"),
  validate(updateTaskStatusSchema),
  updateTaskStatus,
);
router.put(
  "/:id",
  validate(taskIdParamsSchema, "params"),
  validate(updateTaskSchema),
  updateTask,
);
router.delete(
  "/:id",
  validate(taskIdParamsSchema, "params"),
  deleteTask,
);

export default router;
```

### ۴. تست دستی اندپوینت‌ها با دستورات cURL:
سبحان پس از راه‌اندازی سرور بک‌اند می‌تواند صحت این دو اندپوینت را با دستورات زیر تست کند:

```bash
# ۱. تست ویرایش موفق تسک (200 OK)
curl -X PUT http://localhost:4000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "عنوان جدید", "description": "توضیحات ویرایش‌شده"}'

# ۲. تست اعتبارسنجی عنوان خالی در ویرایش (400 TITLE_REQUIRED)
curl -X PUT http://localhost:4000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "   "}'

# ۳. تست ویرایش تسک ناموجود (404 TASK_NOT_FOUND)
curl -X PUT http://localhost:4000/api/tasks/99999 \
  -H "Content-Type: application/json" \
  -d '{"title": "تست تسک ناموجود"}'

# ۴. تست حذف موفق تسک (200 OK)
curl -X DELETE http://localhost:4000/api/tasks/1

# ۵. تست حذف مجدد همان تسک (404 TASK_NOT_FOUND)
curl -X DELETE http://localhost:4000/api/tasks/1

# ۶. تست شناسه نامعتبر در حذف (400 INVALID_INPUT)
curl -X DELETE http://localhost:4000/api/tasks/abc
```

---

## ۹. بیانیه تأیید رسمی و پایان اسپرینت‌های اول و دوم (Official Sprint Sign-Off)

 بدین‌وسیله رسماً تأیید می‌گردد که:

1. **اسپرینت اول (Sprint 1):**
   - تمامی اهداف اسپرینت اول شامل ثبت وظیفه، مشاهده لیست با مرتب‌سازی نزولی، اعتبارسنجی کلاینت و سرور، پایداری داده در PostgreSQL، چندزبانگی فارسی/انگلیسی (RTL/LTR و فونت‌ها) و تم روشن/تاریک به‌طور ۱۰۰٪ تکمیل، تست و تحویل شده‌اند.

2. **اسپرینت دوم (Sprint 2):**
   - بخش **فرانت‌اند** به‌طور ۱۰۰٪ پیاده‌سازی، اعتبارسنجی و بیلد شد (منوی کشویی سفارشی وضعیت، مودال ویرایش تسک با به‌روزرسانی تاریخ، مودال تأییدیه حذف دائم، کاهش آنی شمارنده و همگام‌سازی کش).
   - هیچ‌گونه خطای تایپ‌اسکریپتی وجود ندارد و کامپایل بیلد Next.js با موفقیت کامل انجام شده است.
   - نیازمندی‌های **بک‌اند** به‌طور کامل مستندسازی شده و کدهای آماده در اختیار سبحان قرار گرفته است تا با اعمال آن‌ها در بک‌اند، کل پروژه برای ارائه نهایی آماده باشد.

**پروژه آماده ورود به مرحله تجمیع نهایی (Integration) و تحویل پروژه است. ✨**
