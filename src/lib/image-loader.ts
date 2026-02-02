export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // You can transform the URL here or proxy it through your API
  return `${src}?w=${width}&q=${quality || 75}`;
}
