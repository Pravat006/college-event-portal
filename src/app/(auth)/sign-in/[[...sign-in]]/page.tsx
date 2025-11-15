import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
    return (
        <div className="flex flex-col items-center space-y-6">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-custom-green font-made-avenue ">Welcome Back</h1>
                <p className=" mt-2">Sign in to your account</p>
            </div>
            <SignIn

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