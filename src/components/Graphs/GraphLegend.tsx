type GraphLegendPropType = {
  title: string;
  subtitle: string;
  colour?: string;
  whitespace?: string;
  height?: string | 'h-10';
};

export default function GraphLegend({
  title,
  subtitle,
  colour,
  whitespace,
  height = 'h-10',
}: GraphLegendPropType) {
  return (
    <div className={'w-full flex ' + whitespace}>
      <div
        className={height + ' mr-2 w-2 bg-clip-border rounded-lg ' + colour}
      />
      <div className='flex flex-col w-full text-left text-xxs space-y-0.5 xl:text-sm'>
        <h2 className='font-medium'>{title}</h2>
        <p className='font-light text-black-lighter xl:text-xs'>{subtitle}</p>
      </div>
    </div>
  );
}
