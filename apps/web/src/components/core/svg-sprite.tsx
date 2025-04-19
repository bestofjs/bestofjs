export type SvgSpriteProps = React.SVGProps<SVGSVGElement> & {
  id: string;
  size?: number;
};

export function SvgSprite({ id, ...props }: SvgSpriteProps) {
  const height = getDimension(props, "height");
  const width = getDimension(props, "width");
  return (
    <svg {...props} width={width} height={height}>
      <use href={`/sprite.svg#${id}`} />
    </svg>
  );
}

function getDimension(
  props: Omit<SvgSpriteProps, "id">,
  dimension: "width" | "height"
) {
  const defaultValue = 16;
  if (props[dimension]) {
    return props[dimension];
  }
  if (props.size) {
    return props.size;
  }
  return defaultValue;
}
