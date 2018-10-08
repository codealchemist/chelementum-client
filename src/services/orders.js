import axios from 'axios';
import moment from 'moment';
import { get, isPlainObject, range, last } from 'lodash';

import localStorageSvc from './local-storage';
import { TODAY } from './constants';

const DEFAULT_RANGE = {
  dateFrom: moment(TODAY()).startOf('month').toDate(),
  dateTo: moment(TODAY()).endOf('month').toDate()
};

const dateToParam = (date) => moment(date).format('YYYY-MM-DD');

const onError = (response) => {
  if (response.status >= 500) {
    return Promise.reject('Data not available. Try again in a few minutes.');
  } else {
    return Promise.reject(get(response, 'response.data.message') || 'Unknow Error');
  }
}

const me = {};

me.buildCalendar = (initFilters = {}, initRange = {}) => {
  const api = {};
  const filters = {};
  const range = {};
  const state = {
    results: [],
    isLoading: false,
    isLoaded: false,
  };

  const setFilters = (newFilters) => {
    if (isPlainObject(newFilters)) {
      Object.assign(filters, { ...newFilters });
    }
  };
  const setRange = (newRange) => {
    if (isPlainObject(newRange)) {
      Object.assign(range, { ...DEFAULT_RANGE }, { ...newRange });
    }
  };
  const load = () => {
    state.isLoading = true;
    const params = Object.assign(filters, range);

    const dateFrom = moment(params.dateFrom).subtract(5, 'days');
    const dateTo = moment(params.dateTo).add(5, 'days');

    return me.getCalendar({
      // dateFrom: params.dateFrom,
      // dateTo: params.dateTo
      dateFrom,
      dateTo
    }).then((response) => {
      state.isLoading = false;

      response.results = response.results.map(order => Object.assign(order, {
        date: moment(order.date).startOf('day').toDate()
      }));

      /* set offset of calendar */
      const weekStart = moment(params.dateFrom).startOf('week');
      function isBeforeWeekStart (date) {
        return moment(date).isBefore(weekStart.format());
      }
      response.results = response.results.filter(item => !isBeforeWeekStart(item.date));

      return response;
    }).catch(error => {
      state.isLoading = false;
      return Promise.reject(error)
    });
  };

  api.getState = () => ({ ...state });

  api.load = (newFilters, newRange) => {
    state.isLoaded = false;

    setFilters(newFilters || initFilters);
    setRange(newRange || initRange);

    return load().then(({results}) => {
      state.isLoaded = true;
      state.results = results;
      return results;
    });
  };

  api.nextMonth = () => {
    const nextMonthFrom = moment(range.dateFrom).add(1, 'months').toDate();
    const nextMonthTo = moment(range.dateTo).add(1, 'months').toDate();
    const newRange = {dateFrom: nextMonthFrom, dateTo: nextMonthTo};
    // setRange(newRange);
    return api.load(filters, newRange);
  };

  api.prevMonth = () => {
    const prevMonthFrom = moment(range.dateFrom).subtract(1, 'months');
    const prevMonthTo = moment(range.dateTo).subtract(1, 'months');
    const newRange = {dateFrom: prevMonthFrom, dateTo: prevMonthTo};
    // setRange(newRange);
    return api.load(filters, newRange);
  };

  setFilters(initFilters);
  setRange(initRange);

  return api;
};

me.buildEntity = (order_id, initData = {}) => {
  const api = {};
  const state = {
    data: {
      ...initData,
      order_id: initData.order_id || order_id
    },
    isLoading: false
  };

  api.getState = () => ({ ...state });

  api.setData = (newData = {}) => {
    Object.assign(state.data, { ...newData });
  };

  api.save = () => {
    state.isLoading = true;
    return me.save(state.data).then(data => {
      state.isLoading = false;
      api.setData({
        order_id: data.id
      });
    });
  };

  return api;
};

me.getList = ({dateFrom, dateTo}) =>
  axios.get('/rest/orders', {
    params:{
      date_from: dateToParam(dateFrom),
      date_to: dateToParam(dateTo)
    }
  }).then(response => response.data).catch(onError);

me.getCalendar = ({dateFrom, dateTo}) =>
  axios.get('/rest/orders/calendar', {
    params:{
      date_from: dateToParam(dateFrom),
      date_to: dateToParam(dateTo)
    }
  }).then(response => response.data).catch(onError)

me.getMenu = ({date, menuId}) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.get('/rest/orders/menus/' + menuId, {
    params:{
      date: dateToParam(date)
    },
    cancelToken: source.token
  }).then(response => response.data).catch(onError);

  promise.cancel = () => {
    source.cancel('Operation canceled by the user.');
    return promise;
  };

  return promise;
};

me.save = (data) => {
  return axios
    .post('/rest/orders/' + (data.order_id ? data.order_id : ''), {
      menu_id: data.menu_id,
      date: dateToParam(data.date),
      absent: data.absent,
      plato_principal_id: data.plato_principal_id,
      postre_id: data.postre_id
    })
    .then(response => response.data).catch(onError);
};

export default me;
