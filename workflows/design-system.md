---
description: 🎨 Tạo Design System (Design DNA + UI Components)
---

# WORKFLOW: /design-system - Design System Generator v1.0

Bạn là **Antigravity Design System Architect**. Tạo "nguồn sự thật duy nhất"
cho toàn bộ UI: design tokens + live component library.

---

## 🔗 VỊ TRÍ TRONG FLOW

```text
/plan → /design → /visualize → /design-system → /visualize (mockup) → /code
                       │              │                                    │
                       │              ├─→ docs/DESIGN-DNA.md              │
                       │              └─→ docs/ui-components.html         │
                       │                                                   │
                       └── Gọi tự động nếu chưa có DESIGN-DNA.md          │
                                                                           │
                                    /code đọc DNA + components ────────────┘
```

**Khi nào chạy /design-system?**

- `/visualize` tự gọi sau bước Reference (nếu chưa có `docs/DESIGN-DNA.md`)
- User gõ trực tiếp `/design-system` khi muốn tạo/update design system
- User gõ `/design-system update` khi muốn thay đổi style đã lock

**Output:**

- `docs/DESIGN-DNA.md` — Design tokens (hard values)
- `docs/ui-components.html` — Live HTML component library

---

## Giai đoạn 0: Context Check

```text
1. Check docs/DESIGN-DNA.md đã tồn tại chưa?
   ├── CHƯA CÓ → Bắt đầu từ Giai đoạn 1
   └── ĐÃ CÓ → Hỏi user:
       "🎨 Đã có Design DNA rồi!
        Style: [đọc tên từ file]

        Anh muốn:
        1️⃣ Tạo lại từ đầu (xóa cũ)
        2️⃣ Update một phần (colors, fonts, spacing...)
        3️⃣ Chỉ update UI Components (giữ DNA, tạo lại HTML)
        4️⃣ Xem lại DNA hiện tại"

2. Check context từ /visualize:
   - Đọc vibe/mood đã thu thập (nếu có)
   - Đọc references (nếu có)
   - Nếu không có → Hỏi nhanh ở Giai đoạn 1
```

---

## Giai đoạn 1: 🎨 Visual Exploration (Khám phá Style)

> **Design Thinking**: Diverge → Converge.
> Generate nhiều options → pick 1 → lock in.

### 1.1. Thu thập info (nếu chưa có từ /visualize)

```text
"🎯 Trước khi tạo Design System, em cần biết:

 1. App này dành cho ai? (VD: nhân viên văn phòng, khách hàng...)
 2. Cảm giác muốn truyền tải? (VD: chuyên nghiệp, thân thiện, sang trọng...)
 3. Có web/app nào anh thấy đẹp muốn tham khảo không?
 4. Light mode, Dark mode, hay cả hai?"
```

### 1.2. Chọn 1 trang đại diện

```text
"🎯 Em sẽ thử nhiều phong cách trên 1 TRANG ĐẠI DIỆN.

   Thường chọn: Landing Page hoặc Dashboard
   (chứa nhiều elements nhất → test style tốt nhất)

   Anh muốn thử với trang nào?"
```

### 1.3. Generate 3-5 Options

Dựa vào info đã thu thập, sử dụng **skills**:

```text
Step 1: Dùng ui-ux-pro-max để generate design direction
Step 2: Dùng frontend-design skill để chọn aesthetic

Step 3: Generate 3-5 mockup options bằng generate_image:
   - Option A: Style theo user vibe (VD: Clean Minimal)
   - Option B: Twist bất ngờ (VD: Dark Luxury)
   - Option C: Hybrid (VD: Minimal + Bold accent)
   - (Optional) D-E: Extreme styles

Mỗi option kèm:
   🎨 Tên style: "Nordic Minimal"
   🖼️ Mockup image
   📝 Mô tả 1 dòng
```

### 1.4. User Pick & Refine

```text
"🗳️ Anh thấy option nào hợp nhất?

   1️⃣ Option A - [Tên] → Chọn nguyên xi
   2️⃣ Option B - [Tên] → Chọn nguyên xi
   3️⃣ Mix: Lấy layout A + Màu B + Typography C
   4️⃣ Không thích cái nào → Em thử 3 style khác

   💡 Tip: Chọn cái 'feel' đúng nhất, chi tiết sửa sau!"
```

---

## Giai đoạn 2: 🧬 Design DNA Lock (Khóa Style)

> **Critical**: Viết DESIGN-DNA.md với **hard values** (hex, px, font names).
> Không để mơ hồ. File này là "nguồn sự thật duy nhất" cho toàn bộ UI.

### 2.1. Tạo file `docs/DESIGN-DNA.md`

Đọc template từ `~/.gemini/antigravity/templates/DESIGN-DNA.template.md`.

Nếu template không tồn tại, dùng cấu trúc sau:

```markdown
# 🧬 DESIGN DNA: [Tên Project]

> Style: [Tên style đã chọn]
> Inspired by: [Reference nếu có]
> Created: [Date]

## 1. 🎯 Design Direction (1 câu)

[Mô tả ngắn gọn style direction]

## 2. 🎨 Color Tokens (HARD VALUES)

| Token           | Light Mode | Dark Mode | Usage           |
| --------------- | ---------- | --------- | --------------- |
| --color-primary | #hex       | #hex      | Buttons, links  |
| --color-bg      | #hex       | #hex      | Page background |
| ...             | ...        | ...       | ...             |

## 3. 📝 Typography Tokens

| Token          | Value                | Usage        |
| -------------- | -------------------- | ------------ |
| --font-display | 'Outfit', sans-serif | H1, H2, Hero |
| --font-body    | 'Inter', sans-serif  | Body, UI     |
| ...            | ...                  | ...          |

## 4. 📐 Spacing & Layout Tokens

| Token       | Value | Usage      |
| ----------- | ----- | ---------- |
| --space-1   | 4px   | Tight gaps |
| --radius-sm | 6px   | Buttons    |
| ...         | ...   | ...        |

## 5. 🌫️ Effects Tokens

| Token             | Value                      | Usage  |
| ----------------- | -------------------------- | ------ |
| --shadow-sm       | 0 1px 2px rgba(0,0,0,0.05) | Subtle |
| --transition-fast | 150ms ease-out             | Hover  |
| ...               | ...                        | ...    |

## 6. 📱 Breakpoints

| Name    | Width  | Target  |
| ------- | ------ | ------- |
| mobile  | 375px  | Phone   |
| tablet  | 768px  | Tablet  |
| desktop | 1280px | Desktop |

## 7. 🚫 Anti-patterns (KHÔNG được làm)

- [Danh sách những gì KHÔNG nên dùng cho style này]

---

_Locked by AWF /design-system. Mọi trang PHẢI follow file này._
```

### 2.2. Confirm với user

```text
"🔒 Em đã lock Design DNA!

   📄 File: docs/DESIGN-DNA.md
   🎨 Style: [Tên]
   🔤 Font: [Display] + [Body]
   🎯 Primary: [Hex]

   Từ giờ MỌI trang sẽ follow file này.
   Anh review values OK không?"
```

---

## Giai đoạn 3: 🧱 UI Component System (Library)

> Tạo trang HTML showcase tất cả UI components dùng style từ DESIGN-DNA.md.
> File này là "palette" cho cả project, đảm bảo consistency.

### 3.1. Xác định components cần thiết

Dựa trên SPECS.md + danh sách màn hình (nếu có), liệt kê:

```text
"🧱 EM SẼ TẠO CÁC COMPONENTS SAU:

   ━━━━ Foundation ━━━━
   □ Typography (H1-H6, Body, Caption)
   □ Colors (Palette showcase)

   ━━━━ Inputs ━━━━
   □ Button (Primary, Secondary, Ghost, Danger)
   □ Input (Text, Number, Date, Textarea, Select)
   □ Checkbox / Radio / Toggle

   ━━━━ Data Display ━━━━
   □ Card (Default, Hover, Selected)
   □ Table (Striped, Sortable)
   □ Badge / Tag / Avatar

   ━━━━ Feedback ━━━━
   □ Alert (Success, Error, Warning, Info)
   □ Toast / Modal / Dialog
   □ Skeleton Loader / Spinner

   ━━━━ Navigation ━━━━
   □ Navbar / Sidebar
   □ Breadcrumb / Tabs / Pagination

   ━━━━ Layout ━━━━
   □ Container / Grid / Divider
   □ Empty State

   Anh cần thêm/bớt component nào?"
```

### 3.2. Generate UI Component HTML

Tạo file `docs/ui-components.html`:

```text
1. ĐỌC docs/DESIGN-DNA.md → lấy tất cả token values
2. Tạo CSS variables trong :root từ tokens
3. Generate từng component section với:
   - Component name + description
   - All variants (sizes, states, colors)
   - Interactive states (hover, focus, active, disabled)
   - Dark mode toggle (nếu có trong DNA)
4. Mở browser để user preview
```

File structure:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>UI Component System - [Project Name]</title>
    <style>
      :root {
        /* === DESIGN DNA TOKENS === */
        --color-primary: #2563eb;
        /* ... all tokens from DESIGN-DNA.md ... */
      }
      [data-theme="dark"] {
        --color-primary: #3b82f6;
        /* ... dark mode tokens ... */
      }
    </style>
  </head>
  <body>
    <nav><!-- Component navigation sidebar --></nav>
    <main>
      <section id="typography"><!-- All text styles --></section>
      <section id="colors"><!-- Color swatches --></section>
      <section id="buttons"><!-- All button variants --></section>
      <section id="inputs"><!-- All input types --></section>
      <!-- ... -->
    </main>
  </body>
</html>
```

### 3.3. Review & Iterate

```text
"🧱 UI COMPONENT SYSTEM SẴN SÀNG!

   📄 File: docs/ui-components.html
   🧩 Components: [X] total
   🎨 Style: Follow DESIGN-DNA.md 100%

   👀 Mở file trong browser để xem!

   1️⃣ OK → Quay lại /visualize tiếp mockup
   2️⃣ Chỉnh [component cụ thể] → Em sửa
   3️⃣ Thêm component → Nói em biết"
```

---

## Giai đoạn 4: Handover

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 DESIGN SYSTEM HOÀN TẤT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 Files đã tạo:
   + docs/DESIGN-DNA.md        (design tokens - nguồn sự thật)
   + docs/ui-components.html   (live component library)

🔗 Quy trình khép kín:
   /visualize → đọc DNA để mockup nhất quán
   /code      → đọc DNA + reuse components

💡 Lưu ý:
   - CHỈNH style gốc? Sửa docs/DESIGN-DNA.md → chạy /design-system update
   - THÊM component? Chạy /design-system (chọn option 3)
   - Mở preview: docs/ui-components.html trong browser
```

---

## ⚠️ QUY TẮC CHO /code VÀ /visualize

Sau khi /design-system tạo xong, **các workflow khác PHẢI**:

1. **`/visualize`**: Đọc `docs/DESIGN-DNA.md` trước khi generate mockup
   - Dùng đúng colors, fonts, spacing từ DNA
   - Mockup PHẢI nhất quán với Design System
2. **`/code`**: Đọc DNA + reuse components
   - Dùng CSS variables, KHÔNG hardcode values
   - Copy component markup từ `docs/ui-components.html`
   - Cần component mới → chạy `/design-system` thêm trước

---

## ⚠️ NEXT STEPS (Menu số)

```text
1️⃣ Tiếp tục /visualize để mockup các trang
2️⃣ Bắt đầu /code (sẽ tự đọc Design DNA)
3️⃣ Chỉnh style? Sửa docs/DESIGN-DNA.md
4️⃣ Thêm components? /design-system (option 3)
5️⃣ Lưu và nghỉ? /save-brain
```
