import { useState, useEffect } from 'react';
import { btnIcons } from 'utils/icons';

type FlagPropType = {
  state: boolean;
  value: string;
  duration?: number;
  containerClass?: string;
};

export const Success = ({
  state,
  value,
  duration,
  containerClass,
}: FlagPropType) => {
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(state);
    const timeout = setTimeout(() => setVisible(false), duration || 3000);
    return () => clearTimeout(timeout);
  }, [state, duration]);

  return isVisible ? (
    <div
      className={`flex gap-2 items-center font-light text-black-light text-sm ${containerClass}`}
    >
      <img className='w-5 h-5' src={btnIcons.tick_blue} alt='success-icon' />
      <p className='flex-shrink-0'>{value}</p>
    </div>
  ) : null;
};

export const Error = ({
  state,
  value,
  duration,
  containerClass,
}: FlagPropType) => {
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(state);
    const timeout = setTimeout(() => setVisible(state), duration || 3000);
    return () => clearTimeout(timeout);
  }, [state, duration]);

  return isVisible ? (
    <div
      className={`flex gap-2 items-center text-warning text-sm ${containerClass}`}
    >
      <img className='w-5 h-5' src={btnIcons.cross_red} alt='error-icon' />
      <p className='flex-shrink-0'>{value}</p>
    </div>
  ) : null;
};
