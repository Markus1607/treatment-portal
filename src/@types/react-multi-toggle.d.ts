declare module 'react-multi-toggle' {
  import * as React from 'react';

  export interface ReactMultiToggleOption<T> {
    value: T;
    displayName?: string;
    optionClass?: string;
    isDisabled?: boolean;
  }

  interface ReactMultiToggleProps<T> {
    options: ReactMultiToggleOption<T>[];
    selectedOption: () => void;
    onSelectOption: (value: T) => any;
    label?: string;
    className?: string;
  }

  export default class MultiToggle<T> extends React.Component<
    ReactMultiToggleProps<T>
  > {}
}
