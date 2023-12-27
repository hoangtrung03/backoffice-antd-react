import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className='container'>
      <div className='text-center'>
        <h1 className='font-bold mb-4 text-red-1'>Page Not Found</h1>
        <Link to='/' className='fs-20 font-semibold hover:text-primary-377DFF'>
          Go Home
        </Link>
      </div>
    </div>
  )
}
