export default function generateOrderId(userId: string) {
  const now = new Date();
  const datePart = now.toISOString().slice(0,10).replace(/-/g, '');
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  const userPart = userId.slice(-4).toUpperCase();

  return `TRX-${datePart}-${userPart}-${randomPart}`;
}
