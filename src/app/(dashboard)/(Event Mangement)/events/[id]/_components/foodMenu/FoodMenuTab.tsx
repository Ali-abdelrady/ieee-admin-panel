import DeleteDialog from "@/components/forms/deleteDialog";
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
                {/* <div className="min-w-18 rounded-lg overflow-hidden bg-muted text-center font-bold text-2xl p-5">
                  <Image
                    src={menu.menuImageUrl ?? ""}
                    alt={menu.menuImageUrl}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                  {menu.name[0]}
                </div> */}
                <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                  {menu.menuImageUrl?.map((imageUrl, index) => (
                    <Avatar key={index}>
                      <AvatarImage src={imageUrl} alt={menu.name} />
                      <AvatarFallback>{menu.name[0]}</AvatarFallback>
                    </Avatar>
                  )) ?? (
                    <Avatar>
                      {/* <AvatarImage src="" alt={menu.name} /> */}
                      <AvatarFallback>{menu.name[0]}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium">{menu.name}</h4>
                  {/* {menu.image && menu.image.length > 1 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {menu.image.length} images available
                      </p>
                    )} */}
                </div>
                <div className="flex space-x-1">
                  <MenuForm
                    operation="edit"
                    defaultValues={menu}
                    eventId={eventId}
                    trigger={
                      <EditButton
                        label="edit speaker"
                        asIcon={true}
                        variant="ghost"
                      />
                    }
                  />
                  <DeleteDialog<
                    FoodMenuType,
                    { eventId: string; menuId: string | number }
                  >
                    rows={menu}
                    deleteFn={({ eventId, menuId }) =>
                      deleteMenu({ eventId, menuId })
                    }
                    getDeleteParams={(menu) => ({
                      eventId: eventId, // Make sure eventId is available in this scope
                      menuId: menu.id, // This will be string | number as per FoodMenuType
                    })}
                    successMessage={(count) => `Deleted ${count} menu(s)`}
                    errorMessage="Failed to delete menus"
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
