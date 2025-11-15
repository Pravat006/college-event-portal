'use client'
import * as Clerk from '@clerk/elements/common'
import * as SignIn from '@clerk/elements/sign-in'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { IconBrandGoogle } from '@tabler/icons-react'
import { Loader } from 'lucide-react'
import Link from 'next/link'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"

export function SignInCard() {
    return (
        <SignIn.Root>
            <SignIn.Step name="start">
                <Card className="w-84 md:w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                        <CardDescription>
                            Sign in to your account to continue
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

                        <Clerk.Field name="identifier" className="space-y-2">
                            <Clerk.Label asChild>
                                <Label>Email or username</Label>
                            </Clerk.Label>
                            <Clerk.Input type="text" required asChild>
                                <Input placeholder="name@example.com" className='bg-accent' />
                            </Clerk.Input>
                            <Clerk.FieldError className="text-sm text-destructive" />
                        </Clerk.Field>

                        <SignIn.Action submit asChild>
                            <Button className="w-full" type="submit">
                                <Clerk.Loading>
                                    {(isLoading) => (
                                        isLoading ? (
                                            <>
                                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                                Continuing...
                                            </>
                                        ) : (
                                            'Continue'
                                        )
                                    )}
                                </Clerk.Loading>
                            </Button>
                        </SignIn.Action>

                        <p className="text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{' '}
                            <Link href="/sign-up" className="underline underline-offset-4 hover:text-primary">
                                Sign up
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </SignIn.Step>

            <SignIn.Step name="verifications">
                {/* Password Strategy */}
                <SignIn.Strategy name="password">
                    <Card className="w-84 md:w-md">
                        <CardHeader>
                            <CardTitle>Enter your password</CardTitle>
                            <CardDescription>
                                Welcome back! Please enter your password.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Clerk.Field name="password" className="space-y-2">
                                <Clerk.Label asChild>
                                    <Label>Password</Label>
                                </Clerk.Label>
                                <Clerk.Input type="password" required asChild>
                                    <Input placeholder="••••••••" className='bg-accent' />
                                </Clerk.Input>
                                <Clerk.FieldError className="text-sm text-destructive" />
                            </Clerk.Field>

                            <SignIn.Action submit asChild>
                                <Button className="w-full" type="submit">
                                    <Clerk.Loading>
                                        {(isLoading) => (
                                            isLoading ? (
                                                <>
                                                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                                                    Signing in...
                                                </>
                                            ) : (
                                                'Sign in'
                                            )
                                        )}
                                    </Clerk.Loading>
                                </Button>
                            </SignIn.Action>

                            <div className="flex items-center justify-between text-sm">
                                <SignIn.Action navigate="choose-strategy" asChild>
                                    <Button variant="link" className="p-0 h-auto" type="button">
                                        Use another method
                                    </Button>
                                </SignIn.Action>
                                <SignIn.Action navigate="forgot-password" asChild>
                                    <Button variant="link" className="p-0 h-auto" type="button">
                                        Forgot password?
                                    </Button>
                                </SignIn.Action>
                            </div>
                        </CardContent>
                    </Card>
                </SignIn.Strategy>

                {/* Email Code Strategy */}
                <SignIn.Strategy name="email_code">
                    <Card className="w-84 md:w-md">
                        <CardHeader>
                            <CardTitle>Check your email</CardTitle>
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
                                    <InputOTP maxLength={6} className="flex justify-center">
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                        </InputOTPGroup>
                                        <InputOTPSeparator />
                                        <InputOTPGroup>
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </Clerk.Input>
                                <Clerk.FieldError className="text-sm text-destructive" />
                            </Clerk.Field>

                            <SignIn.Action submit asChild>
                                <Button className="w-full" type="submit">
                                    <Clerk.Loading>
                                        {(isLoading) => (
                                            isLoading ? (
                                                <>
                                                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                                                    Verifying...
                                                </>
                                            ) : (
                                                'Continue'
                                            )
                                        )}
                                    </Clerk.Loading>
                                </Button>
                            </SignIn.Action>

                            <div className="flex items-center justify-between text-sm">
                                <SignIn.Action resend asChild>
                                    <Button variant="link" className="p-0 h-auto" type="button">
                                        Resend code
                                    </Button>
                                </SignIn.Action>
                                <SignIn.Action navigate="choose-strategy" asChild>
                                    <Button variant="link" className="p-0 h-auto" type="button">
                                        Use another method
                                    </Button>
                                </SignIn.Action>
                            </div>
                        </CardContent>
                    </Card>
                </SignIn.Strategy>

                {/* Reset Password Strategy */}
                <SignIn.Strategy name="reset_password_email_code">
                    <Card className="w-84 md:w-md">
                        <CardHeader>
                            <CardTitle>Reset your password</CardTitle>
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
                                    <InputOTP maxLength={6} className="flex justify-center">
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                        </InputOTPGroup>
                                        <InputOTPSeparator />
                                        <InputOTPGroup>
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </Clerk.Input>
                                <Clerk.FieldError className="text-sm text-destructive" />
                            </Clerk.Field>

                            <Clerk.Field name="password" className="space-y-2">
                                <Clerk.Label asChild>
                                    <Label>New Password</Label>
                                </Clerk.Label>
                                <Clerk.Input type="password" required asChild>
                                    <Input placeholder="••••••••" className='bg-accent' />
                                </Clerk.Input>
                                <Clerk.FieldError className="text-sm text-destructive" />
                            </Clerk.Field>

                            <SignIn.Action submit asChild>
                                <Button className="w-full" type="submit">
                                    <Clerk.Loading>
                                        {(isLoading) => (
                                            isLoading ? (
                                                <>
                                                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                                                    Resetting...
                                                </>
                                            ) : (
                                                'Reset password'
                                            )
                                        )}
                                    </Clerk.Loading>
                                </Button>
                            </SignIn.Action>

                            <SignIn.Action resend asChild>
                                <Button variant="link" className="w-full" type="button">
                                    Resend code
                                </Button>
                            </SignIn.Action>
                        </CardContent>
                    </Card>
                </SignIn.Strategy>
            </SignIn.Step>

            {/* Forgot Password Step */}
            <SignIn.Step name="forgot-password">
                <Card className="w-84 md:w-md">
                    <CardHeader>
                        <CardTitle>Forgot your password?</CardTitle>
                        <CardDescription>
                            Enter your email to receive a reset code
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Clerk.Field name="identifier" className="space-y-2">
                            <Clerk.Label asChild>
                                <Label>Email</Label>
                            </Clerk.Label>
                            <Clerk.Input type="email" required asChild>
                                <Input placeholder="name@example.com" className='bg-accent' />
                            </Clerk.Input>
                            <Clerk.FieldError className="text-sm text-destructive" />
                        </Clerk.Field>

                        <SignIn.Action submit asChild>
                            <Button className="w-full" type="submit">
                                <Clerk.Loading>
                                    {(isLoading) => (
                                        isLoading ? (
                                            <>
                                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                                Sending code...
                                            </>
                                        ) : (
                                            'Send reset code'
                                        )
                                    )}
                                </Clerk.Loading>
                            </Button>
                        </SignIn.Action>

                        <SignIn.Action navigate="start" asChild>
                            <Button variant="link" className="w-full" type="button">
                                Back to sign in
                            </Button>
                        </SignIn.Action>
                    </CardContent>
                </Card>
            </SignIn.Step>
        </SignIn.Root>
    )
}