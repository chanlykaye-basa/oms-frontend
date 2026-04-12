import { LoginForm } from './_components/LoginForm'

export default function LoginPage() {
  return (
    <main
      style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9FAFB',
      }}
    >
      <LoginForm />
    </main>
  )
}
