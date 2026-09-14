export default function OrderStatus({
  status,
}: {
  status: string;
}) {
  const statusStyles: Record<string, string> = {
    placed:
      "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    processing:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
    shipped:
      "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
    delivered:
      "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
    cancelled:
      "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  };

  return (
    <span
      className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
        statusStyles[status] ??
        "bg-zinc-100 text-zinc-700"
      }`}
    >
      {status}
    </span>
  );
}