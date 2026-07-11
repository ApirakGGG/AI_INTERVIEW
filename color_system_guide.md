# คู่มือระบบสีสำหรับเว็บไซต์ (Website Color System Guide)

เอกสารฉบับนี้รวบรวมรหัสสี (Color Codes) และแนวทางการใช้งานองค์ประกอบต่างๆ (UI Components) เพื่อให้การออกแบบและพัฒนาระบบเป็นไปในทิศทางเดียวกันอย่างมีประสิทธิภาพ

---

## 🎨 ตารางรหัสสี (Color Code Table)

| การใช้งาน | รายละเอียดสี | Hex Code | ตัวอย่างสี |
| :--- | :--- | :--- | :--- |
| 🟢 **Primary Green** | เขียวหลัก | `#16A34A` | ![](https://via.placeholder.com/15/16A34A/000000?text=+) |
| 🟢 **Green Hover** | เขียวเข้ม (เมื่อเอาเมาส์ชี้) | `#15803D` | ![](https://via.placeholder.com/15/15803D/000000?text=+) |
| 🔵 **Primary Blue** | ฟ้าหลัก | `#0EA5E9` | ![](https://via.placeholder.com/15/0EA5E9/000000?text=+) |
| 🔵 **Blue Hover** | ฟ้าเข้ม (เมื่อเอาเมาส์ชี้) | `#0284C7` | ![](https://via.placeholder.com/15/0284C7/000000?text=+) |
| 🟠 **Accent / CTA** | ส้มเน้นย้ำ / ปุ่มแอคชัน | `#F97316` | ![](https://via.placeholder.com/15/F97316/000000?text=+) |
| 🟠 **CTA Hover** | ส้มเข้ม (เมื่อเอาเมาส์ชี้) | `#EA580C` | ![](https://via.placeholder.com/15/EA580C/000000?text=+) |
| ⚪ **Background** | เทาอ่อน (พื้นหลังเว็บ) | `#F8FAFC` | ![](https://via.placeholder.com/15/F8FAFC/000000?text=+) |
| ⚪ **Card** | ขาว (พื้นหลังกล่องข้อความ) | `#FFFFFF` | ![](https://via.placeholder.com/15/FFFFFF/000000?text=+) |
| ⚫ **Heading** | สีข้อความหลัก (หัวข้อ) | `#0F172A` | ![](https://via.placeholder.com/15/0F172A/000000?text=+) |
| ⚫ **Body Text** | สีข้อความรอง (เนื้อหา) | `#475569` | ![](https://via.placeholder.com/15/475569/000000?text=+) |
| ⚫ **Muted Text** | สีข้อความอ่อน (รายละเอียด) | `#64748B` | ![](https://via.placeholder.com/15/64748B/000000?text=+) |
| 🟢 **Badge Background**| เขียวอ่อน (พื้นหลังป้ายสถานะ) | `#ECFDF5` | ![](https://via.placeholder.com/15/ECFDF5/000000?text=+) |
| 🟢 **Badge Border** | ขอบ Badge | `#BBF7D0` | ![](https://via.placeholder.com/15/BBF7D0/000000?text=+) |

> **Gradient เพิ่มเติมสำหรับการตกแต่ง:**  
> `linear-gradient(135deg, #0284C7 0%, #0EA5E9 40%, #16A34A 100%)`

---

## 🔘 แนวทางการใช้สีกับปุ่ม (Buttons Style)

### 1. Primary Button (ปุ่มหลัก)
ใช้สำหรับแอคชันหลักที่ต้องการให้ผู้ใช้งานคลิกมากที่สุด เช่น "สมัครสมาชิก", "บันทึกข้อมูล", "ซื้อเลย"
* **Background:** `#F97316` (ส้ม)
* **Text Color:** `#FFFFFF` (ขาว)

**เมื่อเมาส์ชี้ (Hover State):**
* **Background:** `#EA580C` (ส้มเข้ม)

---

## 🏷️ แนวทางการใช้สีกับป้ายสถานะ (Badge Style)

ใช้สำหรับการแสดงสถานะที่ถูกต้อง หรือเปิดใช้งานอยู่ (Active / Success)
* **Background:** `#ECFDF5` (เขียวอ่อน)
* **Text Color:** `#15803D` (เขียวเข้ม)
* **Border:** `1px solid #BBF7D0` (ขอบเขียวอ่อน)

---

## 🔲 แนวทางการใช้สีกับกล่องข้อมูล (Card Style)

ใช้สำหรับแบ่งสัดส่วนเนื้อหา คอนเทนต์ หรือสินค้าบนหน้าเว็บไซต์
* **Background:** `#FFFFFF` (ขาว)
* **Border:** `1px solid #E2E8F0` (ขอบเทาอ่อน)
* **Box Shadow:** `0 8px 24px rgba(15, 23, 42, 0.08)` (เงาสีข้อความหลักจางๆ เพื่อสร้างมิติ)
