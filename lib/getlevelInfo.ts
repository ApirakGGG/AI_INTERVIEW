// ระดับและคำนวณความคืบหน้า
export const getlevelInfo = (c:number) => {
    if (c <= 3) return { label: "Junior", next: 4 - c, color: "text-blue-500" };
    if (c <= 10) return { label: "Intermediate", next: 11 - c, color: "text-green-500" };
    if (c <= 20) return { label: "Senior", next: 21 - c, color: "text-purple-500" };
    return { label: "Expert", next: 0, color: "text-orange-500" };
}