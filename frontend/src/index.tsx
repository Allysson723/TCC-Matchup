import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {CustomThemeProvider} from "./contexts/CustomThemeContext";
import ErrorBoundary from "./utils/ErrorBoundary";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <ErrorBoundary>
            <CustomThemeProvider>
                <App/>
            </CustomThemeProvider>
        </ErrorBoundary>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
