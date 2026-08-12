/** Renders a JSON-LD <script> tag. `data` must be a plain JSON-serializable object. */
export function StructuredData({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify never emits unescaped "</", but guard anyway since this
      // concatenates directly into HTML.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
