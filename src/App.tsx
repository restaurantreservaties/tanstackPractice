import './App.css'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {TanstackQueryBreeds} from './components/TanstackQueryBreeds.tsx'
import { clear } from './fakeDatabase/databaseFaker.ts';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <TanstackQueryBreeds/>
    </QueryClientProvider>
  )
}

export default App
