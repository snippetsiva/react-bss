import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';

import reducers from 'reducers';

const persistConfig = {
  key: 'redux_persist_dmld',
  storage
}

const pReducer = persistReducer(persistConfig, reducers)


export const store = createStore(
  pReducer,
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__() : f => f
  )
);

export const persistor = persistStore(store);