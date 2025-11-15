'use client'
import * as Clerk from '@clerk/elements/common'
import * as SignUp from '@clerk/elements/sign-up'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { IconBrandGoogle } from '@tabler/icons-react'
import { Loader } from 'lucide-react'
import Link from 'next/link'

export function SignUpCard() {
    return (
        <SignUp.Root>
            <SignUp.Step name="start">
                <Card className="w-84 md:w-md ">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                        <CardDescription>
                            Enter your information to get started
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">

                        <Clerk.Connection name="google" asChild>
                            <Button variant="outline" type="button" className='w-full'>
                                <IconBrandGoogle className="mr-2 h-4 w-4" />
                                Google
                            </Button>
                        </Clerk.Connection>



                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        {/* Email/Password Form */}
                        <Clerk.Field name="emailAddress" className="space-y-2">
                            <Clerk.Label asChild>
                                <Label>Email</Label>
                            </Clerk.Label>
                            <Clerk.Input type="email" required asChild>
                                <Input placeholder="name@example.com"
                                    className='bg-accent'
                                />
                            </Clerk.Input>
                            <Clerk.FieldError className="text-sm text-destructive" />
                        </Clerk.Field>

                        <Clerk.Field name="password" className="space-y-2">
                            <Clerk.Label asChild>
                                <Label>Password</Label>
                            </Clerk.Label>
                            <Clerk.Input type="password" required asChild>
                                <Input placeholder="••••••••" className='bg-accent' />
                            </Clerk.Input>
                            <Clerk.FieldError className="text-sm text-destructive" />
                        </Clerk.Field>

                        <SignUp.Captcha className="empty:hidden" />

                        <SignUp.Action submit asChild>
                            <Button className="w-full" type="submit">
                                <Clerk.Loading>
                                    {(isLoading) => (
                                        isLoading ? (
                                            <>
                                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                                Creating account...
                                            </>
                                        ) : (
                                            'Sign up'
                                        )
                                    )}
                                </Clerk.Loading>
                            </Button>
                        </SignUp.Action>

                        <p className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link href="/sign-in" className="underline underline-offset-4 hover:text-primary">
                                Sign in
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </SignUp.Step>

            <SignUp.Step name="verifications">
                <SignUp.Strategy name="email_code">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle>Verify your email</CardTitle>
                            <CardDescription>
                                Enter the verification code sent to your email
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Clerk.Field name="code" className="space-y-2">
                                <Clerk.Label asChild>
                                    <Label>Verification Code</Label>
                                </Clerk.Label>
                                <Clerk.Input type="otp" required asChild>
                                    <Input placeholder="000000" />
                                </Clerk.Input>
                                <Clerk.FieldError className="text-sm text-destructive" />
                            </Clerk.Field>

                            <SignUp.Action submit asChild>
                                <Button className="w-full" type="submit">
                                    <Clerk.Loading>
                                        {(isLoading) => (
                                            isLoading ? 'Verifying...' : 'Verify'
                                        )}
                                    </Clerk.Loading>
                                </Button>
                            </SignUp.Action>

                            <SignUp.Action resend asChild>
                                <Button variant="link" className="w-full" type="button">
                                    Resend code
                                </Button>
                            </SignUp.Action>
                        </CardContent>
                    </Card>
                </SignUp.Strategy>
            </SignUp.Step>

            <SignUp.Step name="continue">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Complete your profile</CardTitle>
                        <CardDescription>
                            Add additional information to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Clerk.Field name="username" className="space-y-2">
                            <Clerk.Label asChild>
                                <Label>Username</Label>
                            </Clerk.Label>
                            <Clerk.Input type="text" required asChild>
                                <Input placeholder="username" />
                            </Clerk.Input>
                            <Clerk.FieldError className="text-sm text-destructive" />
                        </Clerk.Field>

                        <SignUp.Action submit asChild>
                            <Button className="w-full" type="submit">
                                <Clerk.Loading>
                                    {(isLoading) => (
                                        isLoading ? 'Continuing...' : 'Continue'
                                    )}
                                </Clerk.Loading>
                            </Button>
                        </SignUp.Action>
                    </CardContent>
                </Card>
            </SignUp.Step>
        </SignUp.Root>
    )
}