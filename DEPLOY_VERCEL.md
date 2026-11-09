# 🌐 Yurak Frontend'ni Vercel.com ga Deploy Qilish Qo'llanmasi

Ushbu qo'llanma orqali `frontend` (React + Vite + Tailwind CSS) veb-ilovasini Vercel platformasiga bepul va oson deploy qilishingiz mumkin.

---

## 📋 1. Talab qilinadigan ma'lumotlar
1. **Render'dagi Backend API manzili**:
   `https://yurak-backend.onrender.com`
2. **GitHub Repository**:
   Frontend alohida repo (`yurak-app/frontend`) yoki asosiy repozitoriy (`ismaaiiyl/yurak`).

---

## 🛠 2. Vercel.com da Deploy Qilish Qadamlari

### 1-qadam: Vercel.com ga kirish
1. [vercel.com](https://vercel.com) saytiga kiring.
2. **Continue with GitHub** orqali tizimga kiring.

### 2-qadam: Yangi Loyiha Qo'shish
1. Bosh sahifada **"Add New..."** ➔ **"Project"** tugmasini bosing.
2. GitHub repozitoriyangizni ro'yxatdan topib, **"Import"** tugmasini bosing.

### 3-qadam: Sozlamalarni tekshirish
- **Framework Preset**: `Vite` (Vercel avtomatik aniqlaydi).
- **Root Directory**:
  - Agar frontend alohida repozitoriy bo'lsa: **bo'sh** (default `./`).
  - Agar umumiy (monorepo) bo'lsa: `frontend` papkasini tanlang.
- **Build Command**: `npm run build` (yoki `vite build`).
- **Output Directory**: `dist`.

### 4-qadam: Environment Variables (Muhit O'zgaruvchisi)
**"Environment Variables"** bo'limini oching va quyidagini qo'shing:

| Name | Value |
|---|---|
| `VITE_API_BASE_URL` | `https://yurak-backend.onrender.com` |

### 5-qadam: Deploy!
**"Deploy"** tugmasini bosing. 
1 daqiqada Vercel loyihani build qilib, sizga jonli domen (masalan: `https://yurak-web.vercel.app`) beradi! 🎉

---

## ⚡ Qayta yuklash (404 Page Not Found) Muammosi
Loyihaga `vercel.json` fayli qo'shilgan:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```
Bu React Router yo'llari (`/traffic`, `/devices`, `/profile`, `/login`) sahifani yangilaganda (Refresh/F5) 404 xatosi bermasdan to'g'ri ishlashini ta'minlaydi.

