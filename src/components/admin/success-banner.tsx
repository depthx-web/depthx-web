const MESSAGES: Record<string, string> = {
  created: "Created successfully.",
  updated: "Saved successfully.",
  deleted: "Deleted successfully.",
  sent: "Campaign sent.",
};

export function SuccessBanner({ status }: { status?: string }) {
  if (!status || !MESSAGES[status]) return null;
  return (
    <div
      role="status"
      className="mb-6 rounded-md border border-green bg-green/10 px-4 py-3 text-sm text-green"
    >
      {MESSAGES[status]}
    </div>
  );
}
