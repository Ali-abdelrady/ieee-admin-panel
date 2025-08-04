import { FoodMenuType } from "@/types/foodMenu";
import { useState } from "react";
import { Plus, User, Edit, Trash2, Pizza } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import Image from "next/image";
import { ImageCell } from "@/components/table/imageCell";
import MenuForm from "./MenuForm";
import {
  useDeleteMenuMutation,
  useGetMenusQuery,
} from "@/services/Api/foodMenu";
import Loader from "@/components/Loader";
import EditButton from "@/components/button/editButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import DeleteDialog from "@/components/forms/deleteDialog";
import { ImageSwiper } from "@/components/dialogs/ImageSwiper";

export function FoodMenuTab({ eventId }: { eventId: string }) {
  const { data, isLoading, isError } = useGetMenusQuery(eventId);
  const [deleteMenu, { isLoading: isDeleting }] = useDeleteMenuMutation();
  const menus = data?.data?.menus ?? [];
  if (isLoading) {
    return <Loader error={isError} />;
  }
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Food menus</h3>
        <MenuForm operation="add" eventId={eventId} />
      </div>

      {menus.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {menus.map((menu) => (
            <Card key={menu.id} className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-center space-x-4">
                <Dialog>
                  <DialogTrigger className="relative cursor-pointer group">
                    <div className="relative min-w-18 rounded-xl overflow-hidden bg-muted">
                      <Image
                        src={menu.coverImage ?? ""}
                        alt={menu.coverImage}
                        width={100}
                        height={100}
                        className="h-full w-full object-cover group-hover:brightness-75 transition"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/40 text-white text-sm font-medium">
                        View Food Menu
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-1">
                      Click to view all Food Menu
                    </p>
                  </DialogTrigger>

                  <DialogContent className="max-w-2xl w-full p-0 bg-white dark:bg-zinc-900 rounded-xl overflow-hidden">
                    <ImageSwiper images={menu.menuImages} />
                  </DialogContent>
                </Dialog>

                <div className="flex-grow">
                  <h4 className="font-medium">{menu.name}</h4>
                </div>
                <div className="flex space-x-1">
                  <MenuForm
                    operation="edit"
                    defaultValues={menu}
                    eventId={eventId}
                    trigger={
                      <EditButton
                        label="edit menu"
                        asIcon={true}
                        variant="ghost"
                      />
                    }
                    menuId={menu.id as string}
                  />

                  <DeleteDialog
                    rows={menu}
                    deleteFn={deleteMenu}
                    getDeleteParams={(menu) => ({
                      eventId: eventId, // Make sure eventId is available in this scope
                      menuId: menu.id, // This will be string | number as per FoodMenuType
                    })}
                    isLoading={isDeleting}
                    trigger={
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    }
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Pizza className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No menus Yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Add menus to your event to showcase who will be presenting.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <MenuForm operation="add" eventId={eventId} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
