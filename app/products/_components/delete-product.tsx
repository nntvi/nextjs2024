"use client";

import { Button } from "@/components/ui/button";
import { ProductResType } from "@/schemaValidations/product.schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import productApiRequest from "@/apiRequests/product";
import { handleErrorApi } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
export default function DeleteProduct({
  product,
}: {
  product: ProductResType["data"];
}) {
  const { toast } = useToast();
  const router = useRouter();
  const deleteProduct = async () => {
    try {
      const result = await productApiRequest.delete(product.id);
      toast({
        description: result.payload.message,
      });
      router.refresh();
    } catch (error) {
      handleErrorApi({ error });
    }
  };
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger>
          <Button variant="destructive" className="px-4 py-2">
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Bạn chắc chắn muốn xoá sản phẩm này?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Sản phẩm &rdquo;{product.name}&rdquo; sẽ bị xóa khỏi hệ thống!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteProduct}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
