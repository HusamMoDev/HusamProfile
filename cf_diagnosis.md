# تشخيص رابط Cloudflare Pages — husam-portfolio.pages.dev

## الملاحظة الأولى (تقرير المستخدم + اختبار من الصندوق الرملي)
- الرابط https://husam-portfolio.pages.dev يعرض الآن صفحة **404 Page Not Found** خاصة بمنصة Cloudflare.
- سابقًا نجح استخراج محتوى الصفحة (200 OK) بعد النشر مباشرة، أي أن المنشور نجح، ثم أصبح 404.

## فرضية السبب
1. عند الرفع المباشر (Direct Upload)، الملفات داخل مجلد رفع فرعي باسم أرشيف zip قد تُنشر داخل مجلد فرعي `/husam-portfolio-cloudflare/` بدل الجذر، وindex.html في الجذر كان موجودًا سابقًا لكن قد يكون حدث إعادة نشر حذفت الجذر.
2. احتمال آخر: النشر توقف أو فشل بعد محاولة ثانية، والـ 404 هي الصفحة الافتراضية عند عدم وجود منشور نشط.

## الخطوات التالية
- فحص آخر عمليات النشر (Deployments) في لوحة Cloudflare للمشروع husam-portfolio.
- التحقق من مسار الملفات في أحدث منشور (هل index.html في الجذر أم في مجلد فرعي).
- إعادة رفع نسخة الإنتاج الصحيحة إلى جذر الرفع (بدون zip، ملفات منفصلة).

## تحديث التشخيص
- صفحة عرض المشروع `/workers-and-pages/view/husam-portfolio` تعرض 404 في اللوحة نفسها، ما يشير إلى أن رابط الصفحة غير صحيح أو أن اسم المشروع مختلف قليلًا.
- الخطوة التالية: فتح قائمة المشاريع `workers-and-pages` والبحث عن المشروع في القائمة ثم الدخول إلى صفحة منشوراته.

## اكتشاف حاسم
- مشروع Pages مربوط بحساب GitHub **HusamMoDev/HusamProfile** (نشر Git وليس Direct Upload النهائي)، وآخر تعديل «قبل 21 ساعة» وRequests = 0.
- المستخدم رفع كودًا إلى HusamProfile لاحقًا؛ إذا كان النشر من فرع غير main أو لم يصل النشر الجديد بعد، قد ينتج 404.
- الملاحظة: النشر المباشر الذي أنجزناه بالأمس يبدو أنه أُستبدل بربط Git، إذ يظهر الآن «Add files via upload» كخيار منفصل أسفل المشروع.
- الخطوة: الدخول إلى صفحة المشروع لعرض قسم Deployments وحالة آخر منشور.

## فحص المنشورات (Deployments)
- بيئة Production على فرع main، المنشور الأحدث a634848 (من رفع مباشر، قبل 21 ساعة) وحالته **ناجح (علامة صح خضراء)** منذ 21 ساعة.
- المنشور السابق dbea88f2 (Git-based، قبل يوم) كان ناجحًا أيضًا.
- أي أن النشر نفسه سليم، والـ 404 التي ظهرت لاحقًا تعود إلى محتوى المنشور الأخير a634848 نفسه: عند الرفع المباشر للملفات، يبدو أن بنية المجلدات جعلت index.html يُخدم من مسار مختلف أو فُقد من الجذر، لذلك الرابط العام يعرض 404 بينما المنشور «ناجح».
- ملاحظة مهمة: رفع المستخدم الأخير كان «Add files via upload» الذي استبدل محتوى الإنتاج السابق، ويبدو أنه رفع نسخة لا تتضمن index.html في الجذر (ربما مجلد husam-portfolio-cloudflare الفرعي فقط).

## خطة الإصلاح
- الدخول إلى تفاصيل المنشور لفحص بنية الملفات.
- إعادة الرفع عبر Direct Upload ببنية صحيحة: index.html + assets + __manus__ في الجذر مباشرة (بدون مجلد zip فرعي).
- التحقق من الرابط العام بعد النشر الجديد.

## نتيجة التحقق بعد الإصلاح
تم التحقق عبر استخراج مباشر من الإنترنت من أن https://husam-portfolio.pages.dev يعود صفحة الموقع الكاملة (العربية): النبذة، الخدمات، مشاريع Sinn وFractureAI، التقنيات، قسم التواصل مع LinkedIn والهاتف وواتساب. المنشور الأحدث على Production حالة ناجح، ما يعني أن المستخدم (أو عملية إعادة الرفع) وضع نسخة الإنتاج الصحيحة في جذر النشر. المتبقي: التحقق النهائي من أزرار التنقل الداخلية (لأن الموقع SPA أحادي الصفحة مع روابط hash) وتسليم الرابط.

## تناقض مهم
- أداة استخراج الصفحات ترى محتوى الموقع كاملًا من https://husam-portfolio.pages.dev/، لكن curl من sandbox يعيد 404 لكل مسار (حتى /assets/index-Dt7qMsc_.css).
- هذا يشير إلى أن النشر الجديد (a634848) يعمل فعليًا على Cloudflare، لكن انتشار DNS/الحافة (TTL) إلى مركز الدخول DAC (دبي) لم يكتمل بعد، أو أن منشور الإنتاج ما زال في طور الاستبدال.
- رابط المنشور الفرعي https://754a0601.husam-portfolio.pages.dev/ فشل في الاستخراج، أي قد يكون المنشور غير مكتمل الانتشار.
- الخطوة التالية: فحص تفاصيل المنشور الأحدث في لوحة Cloudflare للتحقق من حالة النشر وبنية الملفات المنشورة.

## تفاصيل المنشور الأحدث (حتى الآن)
صفحة تفاصيل المنشور: https://dash.cloudflare.com/8b4d24596819b5446e57060e8ddc9234/pages/view/husam-portfolio/754a0601-f7d2-420c-86aa-3925b917e06b
المستودع HusamMoDev/HusamProfile، الفرع main، commit a634848 (Add files via upload)، الحالة success، الساعة 1:45AM 17 أغسطس 2026، المدة 14 ثانية. التبويبات: Build log / Assets uploaded / Functions / Redirects / Headers. فحصت تبويب Functions (لا توجد دوال). المتبقي: فحص تبويب **Assets uploaded** لمعرفة مسارات الملفات المنشورة، خاصة هل index.html في الجذر أم داخل مجلد فرعي.

## السبب الجذري المؤكد
تبويب Assets uploaded في المنشور الأحدث (754a0601) يعرض **14 ملفًا كلها ملفات مصدر**: .gitignore، .prettierrc، components.json، ideas.md، package.json، pnpm-lock.yaml، template.json، todo.md، vite.config.ts... إلخ. لا يوجد index.html ولا مجلد assets. أي أن ما تم رفعه إلى المستودع HusamProfile هو **كود المصدر الكامل للموقع وليس مجلد dist/public**. بسبب أن المشروع مربوط بـGit، أعادت Cloudflare نشر الفرع main من المستودع، فنُشرت ملفات المصدر بدل الإنتاج، وبالتالي الرابط يعيد 404 لأن لا يوجد index.html في الجذر. يفسر هذا أيضًا لماذا أداة الاستخراج كانت قد رأت المحتوى: ربما من نسخة سابقة أو ذاكرة مخبأ.

## خطة الإصلاح
المنشور الصحيح يجب أن يحتوي index.html وassets/ في الجذر. الحل الأسلم: إعداد إعدادات البناء (Build settings) للمشروع ليقرأ من المستودع مع مسار نشر `dist/public` وأمر بناء `npm install && npm run build`، أو استخدام Direct Upload بملف zip من dist/public داخل مجلد husam-portfolio-cloudflare/ بدون هيكل فرعي خاطئ.

## إعداد Build settings الجديد (في لوحة Cloudflare)
محرر Build configuration في Settings → Build يحتوي الآن: Build command = `npm install && npm run build`، Build output directory = `dist/public`، Framework preset = None، Root directory غير مفعّل. زر Save (رقم 17) ظاهر في أسفل اليمين. بعد الحفظ، لأن النشر التلقائي مفعّل والفرع production هو main، سيُعاد النشر تلقائيًا من مستودع HusamMoDev/HusamProfile. ملاحظة مهمة: المشروع مربوط بـGit (HusamMoDev/HusamProfile) وليس Direct Upload.

## الحفظ مؤكد
صفحة Settings → Build تعرض الآن: Build command = `npm install && npm run build`، Build output = `dist/public`. المحرر أُغلق والحفظ تم. لكن النشر التلقائي يعمل على دفعات جديدة فقط، والمشروع مربوط بـGit، لذا نحتاج إلى دفعة جديدة على main. الخطوة التالية: رفع دفعة Git (commit push) على HusamMoDev/HusamProfile من بيئة مشروع husam-portfolio في الساندبوكس (remote remote origin يشير للمستودع)، ليعيد Cloudflare البناء تلقائيًا.

## حالة الإصلاح (17 أغسطس)
- السبب الجذري: المنشور الأحدث (754a0601) رفع 14 ملف مصدر بدل dist/public → 404 على https://husam-portfolio.pages.dev
- الحل المطبق في لوحة Cloudflare (Settings → Build): Build command = `npm install && npm run build`، Build output = `dist/public`، المشروع مربوط بـGit إلى HusamMoDev/HusamProfile والفرع الإنتاجي main والنشر التلقائي مفعّل.
- الحاجة: دفعة git جديدة على main لتشغيل البناء تلقائيًا.
- GH_TOKEN في البيئة (ghu_...) هو user-to-server token: يقرأ المستودع (push:true في permissions API) لكن git push يعيد 403 وgit ref API يعيد 403 — يبدو أن وكيل الشفافية يعيد كتابة token لطلبات git.
- PAT من المستخدم (github_pat_11BJ6LBZQ...) يعمل في REST API (push:true، ref read يعمل) لكن git push عبره أيضًا 403 — نفس ظاهرة الوكيل على https://github.com.
- الحل قيد التنفيذ: سكربت /home/ubuntu/commit_via_api.mjs ينشئ commit عبر REST API مباشرة (يضيف TODO.md) ثم يحدّث main. إذا نجح سيُشغّل بناء Cloudflare تلقائيًا.
- رابط رابط نشر Cloudflare: https://754a0601.husam-portfolio.pages.dev (منشور سابق)، الإنتاج: https://husam-portfolio.pages.dev
- رابط Manus الحالي: https://husamfolio-isy2jzz9.manus.space (يعمل)

## فحص التوكنات
GH_TOKEN في الجلسة (ghu_...) هو user-to-server token بلا نطاقات OAuth مكتوبة، يقرأ الملفات لكنه يرفض الكتابة (403) في Git Data API وContents API. PAT المستخدم github_pat_11BJ6... يحمل permissions:push عبر REST لكنه يُرفض أيضًا ("not accessible by personal access token")، والسبب المرجح: هذا PAT من نوع fine-grained بلا نطاق git blob write أو أن المستودع مربوط بتكامل لا يقبل PAT للكتابة، أو أن وكيل Manus الشفاف يعيد كتابة الطلبات إلى github.com لـgit فقط. git push عبر كلا الطريقتين يعيد 403 أيضًا.

الخلاصة: لا توجد حاليًا طريقة للكتابة إلى HusamMoDev/HusamProfile من الساندبوكس. الخيارات المتبقية: (1) المستخدم يغيّر إعداد PAT بحيث يشمل صلاحيات Contents كاملة Read and write لمستودع HusamProfile (PAT الحالي fine-grained: تحقق مما إذا كان Contents Read and write مفعلًا أم لا)، أو (2) المستخدم يشغّل "Retry deploy" يدويًا من صفحة Deployments في Cloudflare بعد أن أصبحت إعدادات البناء صحيحة.

## حالة التوكنات (بعد الرمز الكلاسيكي ghp_IRur...)
الرمز يقرأ ويُظهر push:true في REST، لكن كل عمليات الكتابة تُرفض: git push → 403، contents PUT → 404 (ref not found على endpoint ref creation، و403 من sanderbox على git blobs)، ref POST → 404. يبدو أن وكيل Manus الشفاف يعترض كتابة git عبر https://github.com (يعيد كتابة الطلب بـghu_ token)، وأن REST writes من الساندبوكس تُرفض أيضًا لأسباب غير واضحة. البديل الحاسم المتبقي: المستخدم يشغّل **Retry deployment** يدويًا من لوحة Cloudflare (Deployments → آخر منشور → Retry)، لأن إعدادات البناء أصبحت صحيحة الآن. إذا كان النشر مربوطًا بـGit يحتاج repo write لإعادة البناء؟ لا — Retry يعيد تشغيل نفس pipeline الذي قد يفشل إذا لم يستطع Cloudflare سحب repo. الحل الآخر: فصل Git وربط Direct Upload، أو أن يسحب المستخدم repo نفسه ويتحقق من Cloudflare repo permissions (ربما يتطلب GitHub App authorization في صفحة Cloudflare Manage).

## خط البناء الفعلي (d56aeff0)
Cloudflare ينسّخ المستودع بنجاح (clone repo ✓)، لكن `pnpm install` يفشل: ENOENT no such file or directory, open '/opt/buildhome/repo/patches/wouter@3.7.1.patch'. السبب: مستودع HusamProfile لا يحتوي على patches/ (الملفات لم تُرفع أصلًا لأن push كان يُرفض) بينما package.json يشير إلى patchedDependencies. الحل: يجب أن يُرفع المستودع كاملًا على GitHub أولًا (بما فيه patches)، ثم retry سيعمل لأن build settings صحيحة.

## النتيجة النهائية لكل محاولات الكتابة
git push = 403، Contents API PUT = 403، ref POST = 404، Git Data blobs = 404. كلها من الساندبوكس. لا يمكن رفع المستودع من هذه البيئة. يجب على المستخدم رفع المشروع بنفسه: إما عبر GitHub CLI/سطر الأوامر على جهازه، أو رفع zip عبر واجهة GitHub (Add file ← Upload files). سأجهز له تعليمات واضحة مع أرشيف جاهز.
