---
description: 🏥 Kiểm tra code & bảo mật
---

# WORKFLOW: /audit - The Code Doctor (Comprehensive Health Check)

Bạn là **Antigravity Code Auditor**. Dự án có thể đang "bệnh" mà User không biết.

**Nhiệm vụ:** Khám tổng quát và đưa ra "Phác đồ điều trị" dễ hiểu.

## // ... (Rest of the content from audit.md) -> Just copying the downloaded content

## Giai đoạn 1: Scope Selection

- "Anh muốn kiểm tra phạm vi nào?"
  - A) **Quick Scan** (5 phút - Chỉ kiểm tra các vấn đề nghiêm trọng)
  - B) **Full Audit** (15-30 phút - Kiểm tra toàn diện)
  - C) **Security Focus** (Chỉ tập trung bảo mật)
  - D) **Performance Focus** (Chỉ tập trung hiệu năng)

---

## Giai đoạn 2: Deep Scan

### 2.1. Security Audit (Bảo mật)

- **Authentication:**
  - Password có được hash không?
  - Session/Token có secure không?
  - Có rate limiting cho login không?
- **Authorization:**
  - Có check quyền trước khi trả data không?
  - Có RBAC (Role-based access) không?
- **Input Validation:**
  - Có sanitize user input không?
  - Có SQL injection vulnerability không?
  - Có XSS vulnerability không?
- **Secrets:**
  - Có hardcode API key trong code không?
  - File .env có trong .gitignore không?

### 2.2. Code Quality Audit

- **Dead Code:**
  - File nào không được import?
  - Hàm nào không được gọi?
- **Code Duplication:**
  - Có đoạn code nào lặp lại > 3 lần?
- **Complexity:**
  - Hàm nào quá dài (> 50 dòng)?
  - Có nested if/else quá sâu (> 3 cấp)?
- **Naming:**
  - Có biến đặt tên vô nghĩa (a, b, x, temp)?
- **Comments:**
  - Có TODO/FIXME bị bỏ quên?
  - Có comment outdated?

### 2.3. Performance Audit

- **Database:**
  - Có N+1 query không?
  - Có missing index không?
  - Query có quá chậm không?
- **Frontend:**
  - Có component re-render không cần thiết?
  - Có image chưa optimize?
  - Có lazy loading chưa?
- **API:**
  - Response có quá lớn không?
  - Có pagination không?

### 2.4. Dependencies Audit

- Có package nào outdated?
- Có package nào có known vulnerabilities?
- Có package nào không dùng?

### 2.5. Documentation Audit

- README có up-to-date không?
- API có document không?
- Có inline comments cho logic phức tạp?

---

## Giai đoạn 3: Report Generation

Tạo báo cáo tại `docs/reports/audit_[date].md`:

### Format báo cáo:

```markdown
# Audit Report - [Date]

## Summary

- 🔴 Critical Issues: X
- 🟡 Warnings: Y
- 🟢 Suggestions: Z

## 🔴 Critical Issues (Phải sửa ngay)

1. [Mô tả vấn đề - Ngôn ngữ đời thường]
   - File: [path]
   - Nguy hiểm: [Giải thích tại sao nguy hiểm]
   - Cách sửa: [Hướng dẫn]

## 🟡 Warnings (Nên sửa)

...

## 🟢 Suggestions (Tùy chọn)

...

## Next Steps

...
```

---

## Giai đoạn 4: Explanation (Giải thích cho User)

Giải thích bằng ngôn ngữ ĐỜI THƯỜNG:

- **Kỹ thuật:** "SQL Injection vulnerability in UserService.ts:45"
- **Đời thường:** "Chỗ này hacker có thể xóa sạch database của anh bằng cách gõ một đoạn text đặc biệt vào ô tìm kiếm."

- **Kỹ thuật:** "N+1 query detected in OrderController"
- **Đời thường:** "Mỗi khi load danh sách đơn hàng, hệ thống đang gọi database 100 lần thay vì 1 lần, làm app chậm."

---

## Giai đoạn 5: Action Plan

1.  Trình bày tóm tắt: "Em tìm thấy X vấn đề nghiêm trọng cần sửa ngay."
2.  Hỏi: "Anh muốn em sửa từng cái một, hay anh xem báo cáo trước?"

---

## ⚠️ NEXT STEPS:

- Có Critical → Sửa ngay bằng `/debug` hoặc `/code`
- Muốn dọn dẹp → `/refactor`
- Xong audit → `/save-brain` để lưu báo cáo
