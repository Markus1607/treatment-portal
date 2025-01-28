import CustomSlider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { colors } from 'utils/constants';
import { Control, Controller, FieldValues } from 'react-hook-form';

type SliderPropType = {
  name: string;
  label: string;
  text1: string;
  text2: string;
  containerStyle: string;
  control: Control<FieldValues>;
};

export default function Slider(props: SliderPropType) {
  const { label, containerStyle, control, name, text1, text2 } = props;

  return (
    <div className={`slideContainer ${containerStyle}`}>
      {label && <div className='label'>{label}</div>}
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, ref } }) => (
          <CustomSlider
            min={1}
            max={10}
            ref={ref}
            value={value}
            onChange={onChange}
            activeDotStyle={{ border: `1px solid ${colors.blue.DEFAULT}` }}
          />
        )}
      />
      <div className='slider-range-text'>
        <p>{text1}</p>
        <p>{text2}</p>
      </div>
    </div>
  );
}
