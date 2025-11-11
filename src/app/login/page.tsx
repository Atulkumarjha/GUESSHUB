"use client";

import { signIn } from "next-auth/react";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { FloatingCard } from "@/components/ui/FloatingCard";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { TypewriterEffect } from "@/components/ui/TypewriterEffect";
import { Meteors } from "@/components/ui/Meteors";
import { NumberTicker } from "@/components/ui/NumberTicker";

export default function LoginPage() {
  const words = [
    { text: "Welcome", className: "text-white" },
    { text: "to", className: "text-gray-300" },
    { text: "GuessHub", className: "text-white" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <AnimatedBackground />
      <Meteors number={40} />
      
      <Container size="sm" className="relative z-10 py-12">
        <FloatingCard delay={0}>
          <div className="text-center mb-10 space-y-4">
            <TypewriterEffect words={words} />
            <p className="text-gray-400 text-lg">Sign in to enter the arena</p>
          </div>
        </FloatingCard>

        <FloatingCard delay={0.2}>
          <Card>
            <CardHeader className="space-y-6">
              <Button
                onClick={() => signIn("google", { callbackUrl: "/" })}
                size="lg"
                className="w-full flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </Button>
              
              <CardDescription className="text-center text-sm">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </CardDescription>
            </CardHeader>
          </Card>
        </FloatingCard>

        <div className="mt-10 grid grid-cols-3 gap-4">
          <FloatingCard delay={0.4}>
            <Card>
              <CardContent className="p-4 text-center space-y-2">
                <div className="text-3xl font-bold text-white">
                  $<NumberTicker value={2000000} />+
                </div>
                <p className="text-xs text-gray-400 font-medium">Volume</p>
              </CardContent>
            </Card>
          </FloatingCard>
          
          <FloatingCard delay={0.5}>
            <Card>
              <CardContent className="p-4 text-center space-y-2">
                <div className="text-3xl font-bold text-white">
                  <NumberTicker value={500} />+
                </div>
                <p className="text-xs text-gray-400 font-medium">Markets</p>
              </CardContent>
            </Card>
          </FloatingCard>
          
          <FloatingCard delay={0.6}>
            <Card>
              <CardContent className="p-4 text-center space-y-2">
                <div className="text-3xl font-bold text-white">
                  <NumberTicker value={10000} />+
                </div>
                <p className="text-xs text-gray-400 font-medium">Traders</p>
              </CardContent>
            </Card>
          </FloatingCard>
        </div>
      </Container>
    </div>
  );
}
