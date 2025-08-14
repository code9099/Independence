import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const { signInWithPassword, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    const { error } = await signInWithPassword(values.email, values.password);
    if (error) {
      toast({ title: "Login failed", description: error, variant: "destructive" });
      return;
    }
    toast({ title: "Welcome back!" });
    navigate("/");
  };

  return (
    <div className="app-container pt-24">
      <div className="max-w-md mx-auto card-premium p-6">
        <h1 className="text-2xl font-bold mb-4">Log in</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm">Email</label>
            <Input type="email" {...register("email")} placeholder="you@example.com" />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-sm">Password</label>
            <Input type="password" {...register("password")} placeholder="••••••••" />
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? "Signing in..." : "Sign in"}</Button>
        </form>
        <div className="my-4 text-center text-sm text-muted-foreground">or</div>
        <Button type="button" variant="outline" className="w-full" onClick={async () => {
          const { error } = await signInWithGoogle();
          if (error) toast({ title: 'Google sign-in failed', description: error, variant: 'destructive' });
        }}>Continue with Google</Button>
        <p className="text-sm text-muted-foreground mt-4">
          Don’t have an account? <Link to="/signup" className="text-primary underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}


