import { admin } from 'routes';
import { config } from './config';
import { Link } from 'react-router-dom';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';

const Breadcrumbs = withBreadcrumbs(config)((props) => {
  const { breadcrumbs } = props;

  return (
    <div className='hidden text-base font-medium text-black xl:block 4xl:text-[1rem]'>
      {breadcrumbs.map(({ match, breadcrumb }, index) => (
        <span key={match.url}>
          <Link to={match.url} className='title'>
            {breadcrumb}
          </Link>
          {index > 0 &&
            index < breadcrumbs.length - 1 &&
            breadcrumbs[index].key !== admin &&
            ' > '}
        </span>
      ))}
    </div>
  );
});

export default Breadcrumbs;
