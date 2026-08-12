"use client";

export function DeleteButton({
  action,
  label,
}: {
  action: () => Promise<void>;
  label: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`Delete "${label}"? This can't be undone.`)) e.preventDefault();
      }}
    >
      <button type="submit" className="font-mono text-xs text-amber hover:text-text">
        Delete
      </button>
    </form>
  );
}
