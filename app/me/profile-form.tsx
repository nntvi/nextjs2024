"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import accountApiRequest from "@/apiRequests/account";
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
import { useToast } from "@/components/ui/use-toast";
import { handleErrorApi } from "@/lib/utils";
import {
  AccountResType,
  UpdateMeBody,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";
import { useRouter } from "next/navigation";
import { useState } from "react";
type Profile = AccountResType["data"];
export default function ProfileForm({ profile }: { profile: Profile }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: profile.name,
    },
  });

  async function onSubmit(values: z.infer<typeof UpdateMeBody>) {
    setLoading(true);
    try {
      const result = await accountApiRequest.updateMe(values);
      toast({
        description: result?.payload?.message,
      });
      // ko phải là refresh load lại trang
      // next server refresh để merge data vào
      router.refresh();
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 flex-shrink-0 w-full max-w-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input value={profile.email} readOnly />
          </FormControl>
          <FormMessage />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full !mt-5" disabled={loading}>
            Cập nhật
          </Button>
        </form>
      </Form>
    </div>
  );
}
