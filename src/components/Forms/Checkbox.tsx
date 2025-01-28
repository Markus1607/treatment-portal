import React, { ChangeEventHandler, HTMLInputTypeAttribute } from 'react';

type CheckboxPropType = {
  checked: boolean;
  disabled?: boolean;
  value: string | number;
  type?: HTMLInputTypeAttribute;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxPropType>(
  ({ type = 'radio', value, checked, onChange, disabled, ...props }, ref) => {
    return (
      <input
        ref={(e) => {
          if (ref && 'current' in ref) ref.current = e;
        }}
        {...props}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        checked={checked || false}
      />
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
