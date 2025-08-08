import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
    return (
        <div className="flex flex-col items-center space-y-6">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">Join Us</h1>
                <p className="text-gray-600 mt-2">Create your account to get started</p>
            </div>
            <SignUp
                appearance={{
                    elements: {
                        rootBox: "w-full",
                        card: "shadow-lg"
                    }
                }}
                redirectUrl="/auth-redirect"
            />
        </div>
    )
}
