"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DeleteButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm("คุณต้องการลบประวัติการสัมภาษณ์นี้ใช่หรือไม่? (ไม่สามารถกู้คืนได้)")) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/deleteInterview/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("ลบประวัติการสัมภาษณ์เรียบร้อยแล้ว");
        router.refresh(); // รีเฟรชหน้าเว็บเพื่อซ่อน Log ที่โดนลบไปแล้ว
      } else {
        toast.error("เกิดข้อผิดพลาดในการลบ กรุณาลองใหม่อีกครั้ง");
      }
    } catch(err) {
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleDelete} 
      disabled={isDeleting}
      className="text-red-500 hover:text-red-700 hover:bg-red-50"
    >
      {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
    </Button>
  );
}
