"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast, { Toaster } from "react-hot-toast";
import { PROXY_SERVER_URL } from "@/lib/backend-urls";
import { Link } from "react-router-dom";
// Define the form schema using Zod
const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .max(100, {
      message: "Password must be less than 100 characters.",
    }),
});

const Signup = () => {
  const navigate = useNavigate();

  // Initialize the form with react-hook-form and Zod resolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // // send a request to teh server
    const response = await fetch(`${PROXY_SERVER_URL}/techfest_signup`, {
      method: "POST",
      headers: {
        "x-api-key": "2RttSEJUCC4f3s9K4FO8A2LQhcxzcyZy8ENOzYEV",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    const data = await response.json();
    console.log(data);
    if (response.ok) {
      toast.success("User created");
      localStorage.setItem("authToken", data.token);
      navigate("/dashboard/create-text"); // Redirect to dashboard route
    } else {
      toast.error(data.error);
      console.log("Failed to create user");
    }
  }

  // Form component
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full h-full flex flex-col p-8 rounded-r-lg shadow-lg bg-gradient-to-l from-purple-300 to-purple-900">
        <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-white">
          Vibes
        </h2>
      </div>
      <div className="min-w-[400px] w-[400px] max-w-[500px] flex flex-col items-center p-8 rounded-lg">
        <h1 className="text-4xl font-extrabold tracking-tight text-center mb-2">
          Create your account
        </h1>
        <p className="text-md text-center text-muted-foreground">
          To access the best royalty-free music generator in the universe
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@domain.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
        <p className="text-md text-center text-muted-foreground mt-4">
          Already have an account?{" "}
          <Link to={"/login"} className="text-sm underline text-purple-700">
            Login
          </Link>
        </p>
      </div>

      <Toaster />
    </div>
  );
};

export default Signup;
