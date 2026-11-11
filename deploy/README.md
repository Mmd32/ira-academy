# استقرار روی سرور (VPS)

راهنمای کامل، از سروری که تازه خریده‌اید تا سایتی که بالا است.
هر دستور را دقیقاً به همین ترتیب اجرا کنید.

---

## پیش از شروع

سروری با این مشخصات لازم است:

| | |
|---|---|
| سیستم‌عامل | Ubuntu 24.04 LTS |
| پردازنده | ۲ هسته |
| حافظه | ۴ گیگابایت |
| دیسک | ۴۰ گیگ NVMe یا SSD |
| IP | اختصاصی و ثابت، داخل ایران |

و یک دامنه که رکورد `A` آن به IP همین سرور اشاره کند. **قبل از قدم ۷ این را تنظیم کنید**، چون گرفتن گواهی SSL بدون آن کار نمی‌کند.

> در این راهنما `example.ir` را با دامنه‌ی واقعی خودتان عوض کنید.

---

## ۱. آماده‌سازی سرور

با کاربر `root` وارد شوید:

```bash
apt update && apt upgrade -y
apt install -y curl git nginx ufw
```

دیوار آتش:

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
```

فقط پورت ۲۲، ۸۰ و ۴۴۳ باز می‌مانند. پورت ۳۰۰۰ که برنامه روی آن اجرا می‌شود عمداً بسته است — فقط nginx از داخل سرور به آن دسترسی دارد.

---

## ۲. نصب Node.js

نسخه‌ی ۲۲:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
node -v
```

باید `v22.x` را نشان بدهد.

---

## ۳. ساختن کاربر برنامه

برنامه نباید با `root` اجرا شود:

```bash
adduser --system --group --home /srv/ira ira
mkdir -p /srv/ira/shared/backups
chown -R ira:ira /srv/ira
```

ساختار پوشه‌ها:

```
/srv/ira/
  current/   ← کد برنامه
  shared/    ← دیتابیس، بکاپ و فایل .env (هنگام به‌روزرسانی دست‌نخورده می‌ماند)
```

**دیتابیس عمداً بیرون از پوشه‌ی کد است**، تا به‌روزرسانی کد هرگز آن را پاک نکند.

---

## ۴. گرفتن کد

```bash
cd /srv/ira
sudo -u ira git clone https://github.com/Mmd32/ira-academy.git current
cd current
sudo -u ira npm ci
```

---

## ۵. تنظیمات محیطی

```bash
sudo -u ira nano /srv/ira/shared/.env
```

این را بنویسید:

```
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_SITE_URL=https://example.ir
NEXT_PUBLIC_API_BASE=
DATABASE_PATH=/srv/ira/shared/ira.db
BACKUP_DIR=/srv/ira/shared/backups
```

`NEXT_PUBLIC_API_BASE` را خالی بگذارید — یعنی فرم‌ها به همین سایت فرستاده شوند.

سپس دسترسی فایل را محدود کنید:

```bash
chmod 600 /srv/ira/shared/.env
chown ira:ira /srv/ira/shared/.env
```

---

## ۶. ساخت و پر کردن دیتابیس

```bash
cd /srv/ira/current
sudo -u ira --preserve-env bash -c 'set -a; . /srv/ira/shared/.env; set +a; npm run build'
sudo -u ira --preserve-env bash -c 'set -a; . /srv/ira/shared/.env; set +a; npm run seed'
```

`seed` محتوای اولیه‌ی سایت را وارد دیتابیس می‌کند. اگر دیتابیس از قبل محتوا داشته باشد، کاری نمی‌کند و چیزی را پاک نمی‌کند.

**حساب مدیر بسازید:**

```bash
sudo -u ira --preserve-env bash -c 'set -a; . /srv/ira/shared/.env; set +a; npm run create-admin -- karfarma "یک-رمز-قوی-و-یکتا" "نام کارفرما"'
```

> رمز را همین‌جا یک رمز واقعی بگذارید. برای هر نفری که به پنل دسترسی دارد یک حساب جدا بسازید — این‌طور در فهرست سرنخ‌ها معلوم می‌شود چه کسی با چه کسی تماس گرفته.

---

## ۷. اجرای دائمی برنامه

```bash
cp /srv/ira/current/deploy/ira.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now ira
systemctl status ira
```

باید `active (running)` باشد. تست:

```bash
curl -I http://127.0.0.1:3000
```

باید `200` برگرداند.

برنامه حالا بعد از ری‌استارت سرور و بعد از هر خطا خودکار بالا می‌آید.

---

## ۸. nginx و دامنه

```bash
cp /srv/ira/current/deploy/nginx.conf /etc/nginx/sites-available/ira
sed -i 's/example\.ir/دامنه-واقعی-شما/g' /etc/nginx/sites-available/ira
ln -s /etc/nginx/sites-available/ira /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

حالا سایت با `http://` بالا می‌آید.

---

## ۹. گواهی SSL

**اول مطمئن شوید رکورد `A` دامنه به IP سرور اشاره می‌کند**، وگرنه این مرحله شکست می‌خورد:

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d example.ir -d www.example.ir
```

وقتی پرسید، گزینه‌ی انتقال خودکار به HTTPS را انتخاب کنید.

تمدید خودکار است. برای اطمینان:

```bash
certbot renew --dry-run
```

---

## ۱۰. بکاپ خودکار

```bash
crontab -u ira -e
```

دو خط داخل `deploy/backup.cron` را کپی کنید. مقصد `rsync` را به جایی تغییر دهید که خودتان کنترلش می‌کنید.

**بکاپی که روی همان سرور بماند بکاپ نیست.** اگر سرور از بین برود، هم سایت می‌رود هم بکاپ.

یک بار دستی اجرا کنید تا مطمئن شوید کار می‌کند:

```bash
cd /srv/ira/current
sudo -u ira --preserve-env bash -c 'set -a; . /srv/ira/shared/.env; set +a; npm run backup'
ls -lh /srv/ira/shared/backups/
```

---

## به‌روزرسانی سایت در آینده

```bash
cd /srv/ira/current
sudo -u ira git pull
sudo -u ira npm ci
sudo -u ira --preserve-env bash -c 'set -a; . /srv/ira/shared/.env; set +a; npm run build'
systemctl restart ira
```

دیتابیس دست نمی‌خورد، چون بیرون از پوشه‌ی کد است.

---

## بازگرداندن بکاپ

اگر لازم شد:

```bash
systemctl stop ira
cp /srv/ira/shared/backups/ira-YYYY-MM-DD....db /srv/ira/shared/ira.db
chown ira:ira /srv/ira/shared/ira.db
systemctl start ira
```

**یک بار این کار را تمرین کنید، قبل از اینکه واقعاً لازم شود.** بکاپی که هرگز بازگردانده نشده، فرض است نه ضمانت.

---

## وقتی مشکلی پیش آمد

| علامت | دستور |
|---|---|
| سایت بالا نمی‌آید | `systemctl status ira` |
| دیدن خطاهای برنامه | `journalctl -u ira -n 100 --no-pager` |
| دنبال کردن زنده‌ی خطاها | `journalctl -u ira -f` |
| خطای nginx | `tail -50 /var/log/nginx/error.log` |
| بررسی فضای دیسک | `df -h` |
| ری‌استارت برنامه | `systemctl restart ira` |

---

## چک‌لیست بعد از استقرار

پس از اتمام کار، این‌ها را یک‌به‌یک امتحان کنید:

- [ ] `https://example.ir` با قفل سبز باز می‌شود
- [ ] `http://example.ir` خودکار به `https` می‌رود
- [ ] صفحات خانه، درباره، دوره‌ها، دانشنامه و تماس باز می‌شوند
- [ ] `https://example.ir/admin` صفحه‌ی ورود را نشان می‌دهد
- [ ] با حساب کارفرما وارد می‌شوید
- [ ] `https://example.ir/admin/leads` **بدون ورود** به صفحه‌ی ورود می‌رود
- [ ] یک فرم در سایت پر می‌کنید و در پنل، بخش «فرم‌ها و سرنخ‌ها» ظاهر می‌شود
- [ ] عنوان یک دوره را در پنل عوض می‌کنید و بلافاصله در صفحه‌ی دوره‌ها می‌بینید
- [ ] `https://example.ir/robots.txt` خطوط `Disallow: /admin` را دارد
- [ ] `https://example.ir/sitemap.xml` آدرس مقاله‌ها را دارد
- [ ] سایت را روی موبایل باز می‌کنید
- [ ] `reboot` می‌زنید و بعد از بالا آمدن سرور، سایت خودش بالا آمده
- [ ] یک بار بکاپ می‌گیرید و یک بار بازگرداندن آن را تمرین می‌کنید

---

## نکات امنیتی که نباید فراموش شوند

**حساب آزمایشی `admin` را حذف کنید.** در توسعه ساخته شده و رمزش عمومی است:

```bash
cd /srv/ira/current
sudo -u ira --preserve-env bash -c 'set -a; . /srv/ira/shared/.env; set +a; npx tsx -e "
import {db} from \"./src/server/db\";
db().prepare(\"DELETE FROM users WHERE username = ?\").run(\"admin\");
console.log(\"حذف شد\");
"'
```

**ورود با رمز به سرور را ببندید** و فقط کلید SSH بگذارید. در `/etc/ssh/sshd_config`:

```
PasswordAuthentication no
PermitRootLogin prohibit-password
```

سپس `systemctl restart ssh`.

**به‌روزرسانی امنیتی خودکار:**

```bash
apt install -y unattended-upgrades
dpkg-reconfigure --priority=low unattended-upgrades
```

**دامنه و سرور را به نام خود کسب‌وکار ثبت کنید**، نه به نام شخص. اگر آن شخص برود، دسترسی هم با او می‌رود.
