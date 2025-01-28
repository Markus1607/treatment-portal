import MultiToggle, { ReactMultiToggleOption } from 'react-multi-toggle';

type Option = {
  label: string;
  value: number;
  isDisabled: boolean;
};

type ToggleButtonsPropType = {
  width: number;
  className: string;
  options: Option[];
  selectedOption: () => void;
  handleToggle: (value: any) => any;
};

export function ToggleButtons({
  width,
  options,
  className,
  handleToggle,
  selectedOption,
}: ToggleButtonsPropType) {
  const getToggleOptions = () => {
    const results: ReactMultiToggleOption<number>[] = [];
    options.forEach((item) =>
      results.push({
        value: item.value,
        displayName: item.label,
        isDisabled: item.isDisabled,
      })
    );
    return results;
  };

  return (
    <div className='toggleWrapper'>
      <div className='container' style={{ width: `${width}em` }}>
        <MultiToggle
          options={getToggleOptions()}
          onSelectOption={handleToggle}
          selectedOption={selectedOption}
          className={className ? className : 'regularToggle'}
        />
      </div>
    </div>
  );
}
