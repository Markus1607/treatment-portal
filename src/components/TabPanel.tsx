import { uniqueId, isArray } from 'lodash';
import { Suspense, useEffect, Dispatch, SetStateAction } from 'react';
import { ClipLoader } from './Loader';
import { AppProvider } from '~/AppProvider';

type PanelPropType = {
  title: string;
  children: React.ReactNode;
};

export const Panel = ({ children }: PanelPropType) => (
  <div className='h-full min-h-full overflow-y-auto'>{children}</div>
);

type TabsPropType = {
  selected: number;
  showPulse?: boolean;
  onChange?: () => void;
  mainContainer?: string;
  tabsContainer?: string;
  panelContainer?: string;
  lastUpdatedTime?: string;
  selectedTabClass?: string;
  children: JSX.Element[] | JSX.Element;
  setSelected: Dispatch<SetStateAction<number>>;
};

export function Tabs({
  onChange,
  showPulse,
  selected,
  children,
  setSelected,
  mainContainer,
  tabsContainer,
  panelContainer,
  lastUpdatedTime,
  selectedTabClass,
}: TabsPropType) {
  const { t } = AppProvider.useContainer();
  useEffect(() => setSelected(selected), [selected, setSelected]);

  const handleChange = (index: number) => {
    setSelected(index);
    onChange && onChange();
  };

  return (
    <main className={`flex flex-col h-full ${mainContainer}`}>
      <ul
        className={`m-0 px-4 list-none bg-white flex text-left max-w-full 2xl:max-w-lg 4xl:max-w-full ${tabsContainer}`}
      >
        <ul className='flex flex-1 gap-6'>
          {isArray(children) ? (
            children.map((elem, index) => {
              return (
                <li
                  key={uniqueId('tabs-')}
                  onClick={() => handleChange(index)}
                  className={`transition-all font-medium duration-200 hover:text-black ease-in inline-block cursor-pointer px-4 py-3  border-b-4 border-transparent text-black-light xl:text-left text-center text-cxs 4xl:text-[0.9rem]
                ${index === selected ? `${selectedTabClass}` : ''}`}
                >
                  {elem?.props?.title}
                </li>
              );
            })
          ) : (
            <li
              key={uniqueId('tabs-')}
              onClick={() => handleChange(0)}
              className={`transition-all font-medium duration-200 hover:text-black ease-in inline-block cursor-pointer px-4 py-3  border-b-4 border-transparent text-black-light xl:text-left text-center text-cxs 4xl:text-[0.9rem]
            ${0 === selected ? `${selectedTabClass}` : ''}`}
            >
              {children?.props?.title}
            </li>
          )}
        </ul>
        {showPulse && (
          <li className='text-[0.9rem] flex gap-2 items-center self-center'>
            <div className='w-3 h-3 bg-red-500 rounded-full pulse' />
            {lastUpdatedTime
              ? `${t('last_updated_time')}${lastUpdatedTime}`
              : null}
          </li>
        )}
      </ul>
      <Suspense
        fallback={
          <div className='flex items-center justify-center w-full h-screen mx-auto bg-white'>
            <ClipLoader color='#1e477f' size={1.5} />
          </div>
        }
      >
        <div
          className={`flex flex-col h-full w-full max-w-full overflow-x-auto ${panelContainer}`}
        >
          {isArray(children) ? children[selected] : children}
        </div>
      </Suspense>
    </main>
  );
}
