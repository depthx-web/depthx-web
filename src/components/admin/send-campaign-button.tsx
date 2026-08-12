"use client";

export function SendCampaignButton({
  action,
  recipientCount,
}: {
  action: () => Promise<void>;
  recipientCount: number;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        const confirmed = confirm(
          `Send this campaign to ${recipientCount} subscriber${recipientCount === 1 ? "" : "s"}? This can't be undone.`,
        );
        if (!confirmed) e.preventDefault();
      }}
    >
      <button
        type="submit"
        className="rounded-md bg-green px-4 py-2 text-xs font-semibold text-[#06140F] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#5EE6B4] active:translate-y-0 active:scale-[0.97]"
      >
        Send now
      </button>
    </form>
  );
}
