import moment from 'moment';

export const TODAY = () => moment().startOf('day').toDate();
