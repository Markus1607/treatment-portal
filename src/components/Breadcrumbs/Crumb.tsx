import { AppProvider } from 'AppProvider';

const Crumb = ({ title }: { title: string }) => {
  const { t } = AppProvider.useContainer();
  return title ? <span>{t(title)}</span> : null;
};

export default Crumb;
