import { BrowserRouter as Router } from 'react-router-dom'
import MainRoutes from './routes/MainRoutes'

function App(): React.JSX.Element {
  return (
    <>
      <Router>
        <MainRoutes />
      </Router>
    </>
  )
}

export default App
