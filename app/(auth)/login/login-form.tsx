import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import envConfig from "@/config";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { useToast } from "@/components/ui/use-toast";
import { useAppContext } from "@/app/AppProvider";

export default function LoginForm() {
  const { toast } = useToast();
  const { setSessionToken } = useAppContext();
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof LoginBody>) {
    try {
      const result = await fetch(
        `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      ).then(async (res) => {
        const payload = await res.json();
        const data = {
          status: res.status,
          payload,
        };
        if (!res.ok) {
          throw data;
        }

        return data;
      });

      toast({
        title: "Đăng nhập",
        description: result?.payload?.message ?? "Đăng nhập thành công",
        duration: 3000,
      });
      const resultFromNextServer = await fetch("/api/auth", {
        method: "POST",
        body: JSON.stringify(result),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (res) => {
        const payload = await res.json();
        const data = {
          status: res.status,
          payload,
        };
        if (!res.ok) {
          throw data;
        }

        return data;
      });
      setSessionToken(resultFromNextServer?.payload?.data?.sessionToken);
    } catch (error: any) {
      const errors = error.payload?.errors as {
        field: string;
        message: string;
      }[];
      const status = error.status as number;

      if (status === 422) {
        errors.forEach((err) => {
          form.setError(err.field as "email" | "password", {
            type: "server",
            message: err.message, // Set the specific error message for the field
          });
        });
      } else {
        toast({
          title: "Lỗi",
          description: error?.payload?.message ?? "Lỗi không xác định",
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  }

  return (
    <div className="space-y-4 flex-shrink-0 w-full max-w-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full !mt-5">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
