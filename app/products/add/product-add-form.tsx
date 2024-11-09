"use client";
import productApiRequest from "@/apiRequests/product";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { handleErrorApi } from "@/lib/utils";
import {
  CreateProductBody,
  CreateProductBodyType,
} from "@/schemaValidations/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import Image from "next/image";

const ProductAddForm = () => {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<CreateProductBodyType>({
    resolver: zodResolver(CreateProductBody),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      image: "",
    },
  });

  async function onSubmit(values: z.infer<typeof CreateProductBody>) {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file as Blob);
      const uploadImageResult = await productApiRequest.uploadImage(formData);
      values.image = uploadImageResult.payload.data;
      const result = await productApiRequest.create(values);

      toast({
        description: result.payload.message,
      });
      router.push("/products");
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    } finally {
      setLoading(false);
    }
  }

  function deleteImage() {
    setFile(null);
    form.setValue("image", "");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }
  return (
    <div className="space-y-4 flex-shrink-0 w-full max-w-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên</FormLabel>
                <FormControl>
                  <Input placeholder="Tên sản phẩm" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá</FormLabel>
                <FormControl>
                  <Input placeholder="Giá sản phẩm" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Textarea placeholder="Giá sản phẩm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hình ảnh</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    ref={inputRef}
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFile(file);
                        field.onChange(
                          "http://localhost:3000/static/" + file.name
                        );
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {file && (
            <div className="">
              <Image
                src={URL.createObjectURL(file)} // cú pháp chuyển từ file ảnh sang url
                width={120}
                height={120}
                alt="image"
                className="w-24 h-24 object-contain"
              />
              <Button
                type="button"
                variant={"destructive"}
                onClick={deleteImage}
              >
                Xoá ảnh
              </Button>
            </div>
          )}
          <Button type="submit" className="w-full !mt-5" disabled={loading}>
            Thêm sản phẩm
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProductAddForm;
