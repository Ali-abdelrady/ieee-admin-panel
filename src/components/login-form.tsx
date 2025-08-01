import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { loginFormSchema } from "@/validations/forms";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFieldType } from "@/types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { useLoginMutation } from "@/services/Api/login";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/services/store/features/AuthSlice";
import { useRouter } from "next/navigation";

const fields: FormFieldType[] = [
  {
    name: "email",
    label: "Email",
    type: "text",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
  },
];
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [login, { data: loginData, isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(formData: z.infer<typeof loginFormSchema>) {
    console.log(loginData, "login data");
    console.log(error, "error");
    console.log(formData, "form data");
    login(formData)
      .unwrap()
      .then((res) => {
        console.log("Login success:", res);
        // dispatch(
        //   setCredentials({ user: res.data.user, token: res.data.token })
        // );
        toast.success("Login successful");
        router.push("/");
      })
      .catch((err) => {
        console.log("Login failed:", err);

        // Type-safe check for error with .data
        if ("data" in err && err.data && typeof err.data === "object") {
          toast("Login failed", {
            style: {
              width: "max-content",
              // marginRight: "auto",
            },
            description: (
              <pre className="mt-2 rounded-md bg-slate-950 p-4">
                <code className="text-white">{err.data.error as any}</code>
              </pre>
            ),
          });
        } else {
          toast("Login failed", {
            description: "Something went wrong. Please try again.",
          });
        }
      });
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-muted-foreground text-balance">
                    Login to your IEEE BUB account
                  </p>
                </div>
                {fields.map((fieldItem) => (
                  <div className="grid gap-3" key={fieldItem.name}>
                    <FormField
                      control={form.control}
                      name={fieldItem.name}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{fieldItem.label}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={fieldItem.label}
                              type={fieldItem.type}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            {fieldItem.description}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  isLoading={isLoading}
                >
                  Login
                </Button>
              </div>
            </form>
          </Form>
          <div className="bg-muted relative hidden md:block p-20 ">
            <Image
              src="/images/logo/IEEE.jpg"
              width={400}
              height={400}
              alt="Image"
              className="absolute  bg-white inset-0 h-full w-full  dark:brightness-[0.8] "
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
