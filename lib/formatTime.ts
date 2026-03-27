 //format timeแปลงเวลา
export const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      // ถ้าเกิน 1 ชม. ให้แสดงเป็นทศนิยม เช่น 1.5 ชม.
      return `${(seconds / 3600).toFixed(1)} ชม.`;
    }
    return `${minutes} นาที`;
};