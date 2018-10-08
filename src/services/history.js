import createHistory from 'history/createBrowserHistory';

import routesSvc from './routes';

const me = createHistory();

me.getCurrentRoute = () => routesSvc.getByPath(me.location.pathname);

export default me;
