import { Suspense, useContext, useEffect } from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import { AppContext } from './contexts/app.context'
import useRouteElements from './useRouteElements'
import { localStorageEventTarget } from './utils/auth'

function App() {
  const routeElements = useRouteElements()
  const { reset } = useContext(AppContext)

  useEffect(() => {
    localStorageEventTarget.addEventListener('clearLS', () => {
      reset
    })
    return () => {
      localStorageEventTarget.removeEventListener('clearLS', reset)
    }
  }, [reset])
  return (
    <>
      <ErrorBoundary>
        <Suspense fallback={<div />}>{routeElements}</Suspense>
      </ErrorBoundary>
    </>
  )
}

export default App
