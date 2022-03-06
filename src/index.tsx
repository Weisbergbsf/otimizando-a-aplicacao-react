import { render } from 'react-dom'
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import { App } from './App'
import { queryClient } from './queryClient';

render(
    <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools />
    </QueryClientProvider>,
    document.getElementById('root')
)