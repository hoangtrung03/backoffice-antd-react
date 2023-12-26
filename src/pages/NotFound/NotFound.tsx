import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className='container'>
      <div className='text-center'>
        <Link to='/' className='fs-20 font-semibold hover:text-primary-377DFF'>
          Go Home
        </Link>
      </div>
    </div>
  )
}
