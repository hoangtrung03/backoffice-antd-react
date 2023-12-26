interface AuthLayoutProps {
  children?: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <section className='h-screen'>
        <div className='container mx-auto mt-7 flex flex-col items-center justify-center h-full'>{children}</div>
      </section>
    </>
  )
}
