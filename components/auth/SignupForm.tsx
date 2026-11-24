"use client";

import { signUpSchema, SignUpValues } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormInputField, PasswordField } from "./LoginSignupField";
import { Form } from "../ui/form";
import { Mail, User } from "lucide-react";
import { StatusBanner, SubmitButton } from "@/lib/helper";
import { useSignup } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export function SignUpForm() {
  const router = useRouter();
  const { signUpFun, status, error } = useSignup();
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "" },
  });

  async function onSubmit(values: SignUpValues) {
    signUpFun(values,{
      onSuccess:()=>{
            form.reset();
        router.push(`/auth/verify-otp?email=${values.email}`);
      }
    })

  }


  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="mt-8 space-y-5"
      >
        <div className="flex sm:items-center justify-between sm:flex-row flex-col gap-5">
          <FormInputField
            control={form.control}
            name="firstName"
            label="First name"
            icon={User}
            placeholder="First Name"
            autoComplete="name"
          />
          <FormInputField
            control={form.control}
            name="lastName"
            label="Last name"
            icon={User}
            placeholder="Last Name"
            autoComplete="name"
          />
        </div>
        <FormInputField
          control={form.control}
          name="email"
          label="Email address"
          icon={Mail}
          type="email"
          placeholder="Email Address"
          autoComplete="email"
        />
        <PasswordField
          control={form.control}
          name="password"
          label="Password"
          autoComplete="new-password"
        />
        <StatusBanner banner={error?.message} />
        <SubmitButton loading={status === "pending"}>
          Create Account
        </SubmitButton>
      </form>
    </Form>
  );
}
