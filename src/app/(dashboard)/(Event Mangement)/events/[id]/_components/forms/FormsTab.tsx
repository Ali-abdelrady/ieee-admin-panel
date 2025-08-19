import React, { useState } from "react";
import { Plus, Search, Eye, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FormType as EventForm } from "@/types/forms";

import FormBuilder from "./FormBuilder";
import { toast } from "sonner";
import {
  useAddEventFormMutation,
  useDeleteEventFormMutation,
  useGetEventFormsQuery,
  useUpdateEventFormMutation,
} from "@/services/Api/eventForms";
import Loader from "@/components/Loader";
import FormResponses from "./FormResponses";

interface FromsTabProps {
  eventId: string;
  // forms: EventForm[];
  // onFormCreate: (form: EventForm) => void;
  // onFormUpdate: (form: EventForm) => void;
  // onFormDelete: (formId: string) => void;
  // onViewResponses: (formId: string) => void;
}

const FromsTab: React.FC<FromsTabProps> = ({
  eventId,
  // forms,
  // onFormCreate,
  // onFormUpdate,
  // onFormDelete,
  // onViewResponses,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState<EventForm | null>(null);

  const [formResponsesId, setFormResponsesId] = useState<string | null>(null);

  const { data, isLoading: isFormsLoading, isError } = useGetEventFormsQuery(eventId);
  const [addEventForm, { isLoading: isCreating, isSuccess }] = useAddEventFormMutation();
  const [updateEventForm, { isLoading: isUpdating, isSuccess: isUpdateSuccess }] =
    useUpdateEventFormMutation();

  const [deleteEventForm, { isLoading: isDeleting }] = useDeleteEventFormMutation();

  const onFormDelete = async (id: string) => {
    try {
      await deleteEventForm({ formId: id, eventId }).unwrap();
      setCurrentForm(null);
      setIsDeleteConfirmOpen(false);
      toast.success("Form deleted successfully", {
        description: `"${id}" has been deleted.`,
      });
    } catch (error: any) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete form", {
        description: error?.data?.message || "Something went wrong.",
      });
    }
  };

  const onViewResponses = (id: string) => {
    setFormResponsesId(id);
  };

  if (isFormsLoading) {
    return <Loader error={isError} />;
  }

  // Filter forms based on search term
  const filteredForms = data?.data?.forms.filter((form) =>
    form.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateForm = () => {
    setCurrentForm(null);
    setIsCreateFormOpen(true);
  };

  const handleEditForm = (form: EventForm) => {
    setCurrentForm(form);
    setIsEditFormOpen(true);
  };

  const handleDeleteForm = (form: EventForm) => {
    setCurrentForm(form);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteForm = () => {
    if (currentForm) {
      onFormDelete(currentForm.id);
    }
  };
  const handleSaveForm = async (form: FormData) => {
    try {
      if (isCreateFormOpen) {
        await addEventForm({ eventId, data: form }).unwrap();
        toast.success("Form created successfully");
      } else if (isEditFormOpen) {
        await updateEventForm({ data: form, formId: form.get("id"), eventId }).unwrap();
        toast.success("Form updated successfully");
      }
    } catch (error: any) {
      toast.error("Failed to save form", {
        description: error?.data?.message || "An error occurred.",
      });
    } finally {
      setIsCreateFormOpen(false);
      setIsEditFormOpen(false);
      setCurrentForm(null);
    }
  };

  const getResponseCount = (formId: string) => {
    // In a real app, this would fetch the actual count from the API
    // For now, let's return a random number for demonstration
    return Math.floor(Math.random() * 50);
  };

  return (
    <div className="space-y-6">
      {!formResponsesId && (
        <>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Event Forms</h2>
              <p className="text-muted-foreground">
                Manage registration and feedback forms for your event
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateForm}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Form
              </Button>
            </div>
          </div>

          {!formResponsesId && (
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search forms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          )}
          {!filteredForms || filteredForms.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No forms yet</h3>
                <p className="text-muted-foreground text-center max-w-md mt-1">
                  Create your first form to start collecting registrations or feedback
                </p>
                <Button onClick={handleCreateForm} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Form
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredForms.map((form) => {
                const responseCount = form.responsesCount;

                return (
                  <Card key={form.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{form.name}</CardTitle>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <span className="sr-only">Open menu</span>
                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                                  fill="currentColor"
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditForm(form)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteForm(form)}
                              className="text-red-600"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardDescription className="truncate">
                        {form.description || "No description provided"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={form.isPublished ? "default" : "outline"}>
                          {form.isPublished ? "Published" : "Draft"}
                        </Badge>
                        <Badge variant="secondary">
                          {form.fields?.length || 0} fields
                        </Badge>
                        <Badge variant="secondary">{responseCount} responses</Badge>
                        {form.isRegistrationForm && (
                          <Badge variant="destructive" className="self-center">
                            Registration Form
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                    <Separator />
                    <CardFooter className="pt-4 flex justify-between">
                      <div className="text-sm text-muted-foreground">
                        Created {new Date(form.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewResponses(form.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Responses
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Create Form Dialog */}
          <Dialog open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen}>
            <DialogContent className="max-w-6xl lg:min-w-6xl h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Form</DialogTitle>
                <DialogDescription>Design a custom form for your event</DialogDescription>
              </DialogHeader>

              <div className="my-4">
                <FormBuilder onSave={handleSaveForm} />
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Form Dialog */}
          <Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
            <DialogContent className="max-w-6xl lg:min-w-6xl h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Form</DialogTitle>
                <DialogDescription>Make changes to {currentForm?.name}</DialogDescription>
              </DialogHeader>

              <div className="my-4">
                <FormBuilder form={currentForm || undefined} onSave={handleSaveForm} />
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Form</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete &quot;{currentForm?.name}&quot;? This
                  action cannot be undone.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDeleteForm}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
      {formResponsesId && (
        <FormResponses
          formId={formResponsesId}
          // onUpdateStatus={handleUpdateStatus}
          // onSendConfirmation={handleSendConfirmation}
          onBackToForms={() => setFormResponsesId(null)}
        />
      )}
    </div>
  );
};

export default FromsTab;
