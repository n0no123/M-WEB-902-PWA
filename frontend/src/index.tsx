import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {QueryClient, QueryClientProvider} from "react-query";
import {AuthenticationProvider} from "./utils/AuthenticationContext";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false
        }
    }
});

root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <AuthenticationProvider>
                <App/>
            </AuthenticationProvider>
        </QueryClientProvider>
    </React.StrictMode>
);
