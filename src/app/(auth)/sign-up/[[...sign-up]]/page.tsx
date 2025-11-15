import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
    return (
        <div className="flex flex-col items-center space-y-6">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-custom-green font-made-avenue">Join Us</h1>
                <p className=" mt-2">Create your account to get started</p>
            </div>
            <SignUp
                appearance={{
                    elements: {
                        formButtonPrimary: {
                            fontSize: 14,
                            textTransform: 'none',
                            backgroundColor: '#1c9cf0',
                            '&:hover, &:focus, &:active': {
                                backgroundColor: '#87e64b',
                            },
                        },
                        input: 'bg-blue-500',
                        rootBox: "w-full",
                        card: "bg-background shadow-lg rounded-lg border border-border/50",
                    },
                }}
                redirectUrl="/auth-redirect"
            />
        </div>
    )
}
