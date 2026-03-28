"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function RecentInterviewsTable({ data }: { data: any[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ตำแหน่ง</TableHead>
          <TableHead>วันที่</TableHead>
          <TableHead>คะแนน</TableHead>
          <TableHead className="text-right">สถานะ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* เช็กก่อนว่ามีข้อมูลไหม ถ้าไม่มีให้โชว์ว่าว่างเปล่า */}
        {data.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={4}
              className="text-center py-10 text-muted-foreground"
            >
              ยังไม่มีประวัติการสัมภาษณ์
            </TableCell>
          </TableRow>
        ) : (
          // ใช้ .map() เพื่อสร้างแถวตารางจากข้อมูลจริง
          data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.position}</TableCell>
              <TableCell>
                {new Date(item.createdAt).toLocaleDateString("th-TH")}
              </TableCell>
              <TableCell>
                <span className="font-bold text-indigo-600">
                  {/* สมมติว่าเก็บคะแนนเฉลี่ยไว้ใน score.total */}
                  {item.averageScore || 0}/100
                </span>
              </TableCell>
              <TableCell className="text-right">
                {item.status}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
