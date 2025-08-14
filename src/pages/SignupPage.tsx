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

export default function SignupPage() {
  const { signUpWithPassword, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    const { error } = await signUpWithPassword(values.email, values.password);
    if (error) {
      toast({ title: "Signup failed", description: error, variant: "destructive" });
      return;
    }
    toast({ title: "Account created", description: "Check your inbox to confirm your email (if required)." });
    navigate("/");
  };

  return (
    <div className="app-container pt-24">
      <div className="max-w-md mx-auto card-premium p-6">
        <h1 className="text-2xl font-bold mb-4">Create account</h1>
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
          <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? "Creating..." : "Create account"}</Button>
        </form>
        <div className="my-4 text-center text-sm text-muted-foreground">or</div>
        <Button type="button" variant="outline" className="w-full" onClick={async () => {
          const { error } = await signInWithGoogle();
          if (error) toast({ title: 'Google sign-in failed', description: error, variant: 'destructive' });
        }}>Continue with Google</Button>
        <p className="text-sm text-muted-foreground mt-4">
          Already have an account? <Link to="/login" className="text-primary underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}


