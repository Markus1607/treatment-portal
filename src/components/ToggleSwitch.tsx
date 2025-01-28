import Switch from 'react-switch';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';

type ToggleSwitchPropType = {
  colours: {
    BgOn: string;
    BgOff: string;
    handleOn: string;
  };
  size: {
    width: number;
    height: number;
    diameter: number;
  };
  initialState: boolean;
  toggleClassName?: string;
  containerClassName?: string;
  handleFunc: Dispatch<SetStateAction<boolean>>;
};

function ToggleSwitch(props: ToggleSwitchPropType) {
  const {
    size,
    colours,
    handleFunc,
    initialState,
    toggleClassName,
    containerClassName,
  } = props;
  const [checked, setChecked] = useState<boolean>(initialState);

  useEffect(() => {
    handleFunc(checked);
  }, [handleFunc, checked]);

  return (
    <label className={containerClassName}>
      <Switch
        checked={checked}
        width={size.width}
        checkedIcon={false}
        height={size.height}
        uncheckedIcon={false}
        onColor={colours.BgOn}
        offColor={colours.BgOff}
        className={toggleClassName}
        handleDiameter={size.diameter}
        onHandleColor={colours.handleOn}
        onChange={() => setChecked(!checked)}
      />
    </label>
  );
}

export default ToggleSwitch;
