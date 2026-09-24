import { useEffect } from 'react'
import Routes from './services/Routes'
import {RouterProvider} from 'react-router-dom'
import { useStore } from './zustand/store'

function App() {
  const fetchUser = useStore((state) => state.fetchUser)

  useEffect(() => {
    fetchUser()
  } , [])

  return (
    <>
      <RouterProvider router={Routes} />
    </>
  )
}

export default App
