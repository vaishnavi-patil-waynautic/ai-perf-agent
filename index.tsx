// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';

// import { store, persistor } from './store/store';
// import App from './App';

// const rootElement = document.getElementById('root');
// if (!rootElement) {
//   throw new Error("Could not find root element to mount to");
// }

// // Ensure correct routing for basename
// if (window.location.pathname === "/ai-perf-agent") {
//   window.location.replace("/ai-perf-agent/");
// }

// const root = ReactDOM.createRoot(rootElement);
// root.render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <PersistGate loading={<div>Loading application...</div>} persistor={persistor}>
//         <App />
//       </PersistGate>
//     </Provider>
//   </React.StrictMode>
// );


// // import React from 'react';
// // import ReactDOM from 'react-dom/client';
// // import { Provider } from 'react-redux';
// // import { store } from './store/store';
// // import App from './App';
// // import { PersistGate } from 'redux-persist/integration/react';

// // const rootElement = document.getElementById('root');
// // if (!rootElement) {
// //   throw new Error("Could not find root element to mount to");
// // }

// // if (window.location.pathname === "/ai-perf-agent") {
// //   window.location.replace("/ai-perf-agent/");
// // }


// // const root = ReactDOM.createRoot(rootElement);
// // root.render(
// //   <React.StrictMode>
// //     <Provider store={store}>
// //         <App />
// //     </Provider>
// //   </React.StrictMode>
// // );

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { store, persistor } from './store/store';
import App from './App';

// Create a React Query client
const queryClient = new QueryClient();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Ensure correct routing for basename
if (window.location.pathname === "/ai-perf-agent") {
  window.location.replace("/ai-perf-agent/");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate
          loading={<div>Loading application...</div>}
          persistor={persistor}
        >
          <App />
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);