import { includes, split, uniqueId } from 'lodash';

const getSubTitles = (text: string) => {
  const results: (JSX.Element[] | JSX.Element)[] = [];
  const words = split(text, '>');
  const wordBreak = () => {
    return (
      <span className='mx-1' key={uniqueId('day-indexes-')}>
        {' > '}
      </span>
    );
  };
  words.forEach((element, index, arr) => {
    const underlined = (
      <span key={uniqueId('element-')} className='title'>
        {element.trim()}
      </span>
    );
    const isMiddleWord = index > 0 && index % 2 !== 0;
    if (isMiddleWord && index !== arr.length - 1) {
      results.push([wordBreak(), underlined, wordBreak()]);
    } else if (isMiddleWord && index === arr.length - 1) {
      results.push([wordBreak(), underlined]);
    } else {
      results.push(underlined);
    }
  });
  return results;
};

export const ModalTitle = (title: string) => {
  const results = includes(title, '>') ? (
    getSubTitles(title)
  ) : (
    <span className='title'>{title}</span>
  );
  return results;
};
