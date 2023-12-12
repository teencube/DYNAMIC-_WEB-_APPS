// Action types
const ADD = 'ADD';
const SUBTRACT = 'SUBTRACT';
const RESET = 'RESET';

// Reducer function
const tallyReducer = (state = { count: 0 }, action) => {
  switch (action.type) {
    case ADD:
      return { count: state.count + 1 };
    case SUBTRACT:
      return { count: state.count - 1 };
    case RESET:
      return { count: 0 };
    default:
      return state;
  }
};

// Store
const createStore = (reducer) => {
  let state = reducer(undefined, {}); // Initial state
  const subscribers = [];

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
    subscribers.forEach((subscriber) => subscriber());
  };

  const subscribe = (subscriber) => {
    subscribers.push(subscriber);
  };

  return { getState, dispatch, subscribe };
};

// Create store with the tallyReducer
const tallyStore = createStore(tallyReducer);

// Subscription to log state changes
tallyStore.subscribe(() => {
  console.log('Current state:', tallyStore.getState());
});

// Scenarios
console.log('Scenario 1:');
console.log('Initial state:', tallyStore.getState());

console.log('Scenario 2:');
tallyStore.dispatch({ type: ADD });
tallyStore.dispatch({ type: ADD });

console.log('Scenario 3:');
tallyStore.dispatch({ type: SUBTRACT });

console.log('Scenario 4:');
tallyStore.dispatch({ type: RESET });
