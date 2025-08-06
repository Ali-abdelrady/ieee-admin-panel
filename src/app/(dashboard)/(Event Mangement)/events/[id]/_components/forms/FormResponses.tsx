// import React, { useState } from "react";
// import {
//   Download,
//   Filter,
//   Search,
//   Check,
//   X,
//   QrCode,
//   Mail,
//   ArrowLeft,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Badge } from "@/components/ui/badge";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Textarea } from "@/components/ui/textarea";
// import { FormResponse, FormType as Form } from "@/types/forms";
// import { toast } from "sonner";

// interface FormResponsesProps {
//   form?: Form;
//   formName: string;
//   responses: FormResponse[];
//   onUpdateStatus: (
//     responseId: string,
//     status: "PENDING" | "CONFIRMED" | "DECLINED"
//   ) => void;
//   onSendConfirmation: (responseIds: string[], message?: string) => void;
//   onBackToForms: () => void;
// }

// const FormResponses: React.FC<FormResponsesProps> = ({
//   form,
//   formName,
//   responses,
//   onUpdateStatus,
//   onSendConfirmation,
//   onBackToForms,
// }) => {
//   const [filter, setFilter] = useState({
//     status: "all",
//     search: "",
//   });
//   const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(null);
//   const [showQRCode, setShowQRCode] = useState(false);
//   const [selectedResponseIds, setSelectedResponseIds] = useState<string[]>([]);
//   const [showEmailDialog, setShowEmailDialog] = useState(false);
//   const [emailMessage, setEmailMessage] = useState("");
//   const [allSelected, setAllSelected] = useState(false);

//   const getStatusBadgeClasses = (status: string) => {
//     switch (status) {
//       case "CONFIRMED":
//         return "bg-green-100 text-green-800 border-green-200";
//       case "DECLINED":
//         return "bg-red-100 text-red-800 border-red-200";
//       default:
//         return "bg-yellow-100 text-yellow-800 border-yellow-200";
//     }
//   };

//   const filteredResponses = responses.filter((response) => {
//     const matchesStatus =
//       filter.status === "all" ? true : response.status === filter.status;
//     const matchesSearch = filter.search
//       ? Object.values(response.data).some(
//           (value) =>
//             typeof value === "string" &&
//             value.toLowerCase().includes(filter.search.toLowerCase())
//         )
//       : true;

//     return matchesStatus && matchesSearch;
//   });

//   const handleExport = () => {
//     toast.success("Exporting Responses", {
//       description: "Responses are being exported to CSV.",
//     });

//     // In a real app, this would handle actual export logic
//     setTimeout(() => {
//       toast.success("Export Complete", {
//         description: "Responses have been exported successfully.",
//       });
//     }, 1000);
//   };

//   const handleViewResponse = (response: FormResponse) => {
//     setSelectedResponse(response);
//   };

//   const generateQRCode = (responseId: string) => {
//     setSelectedResponse(responses.find((r) => r.id === responseId) || null);
//     setShowQRCode(true);
//   };

//   const handleSelectAll = (checked: boolean) => {
//     setAllSelected(checked);
//     if (checked) {
//       setSelectedResponseIds(filteredResponses.map((response) => response.id));
//     } else {
//       setSelectedResponseIds([]);
//     }
//   };

//   const handleSelectResponse = (responseId: string, checked: boolean) => {
//     if (checked) {
//       setSelectedResponseIds([...selectedResponseIds, responseId]);
//     } else {
//       setSelectedResponseIds(selectedResponseIds.filter((id) => id !== responseId));
//     }
//   };

//   const handleBulkStatusUpdate = (status: "PENDING" | "CONFIRMED" | "DECLINED") => {
//     selectedResponseIds.forEach((id) => {
//       onUpdateStatus(id, status);
//     });

//     toast.success(`${selectedResponseIds.length} Responses Updated`, {
//       description: `Status changed to ${status.toLowerCase()}.`,
//     });

//     setSelectedResponseIds([]);
//     setAllSelected(false);
//   };

//   const handleOpenEmailDialog = () => {
//     if (selectedResponseIds.length === 0) {
//       toast.error("No Selections", {
//         description: "Please select at least one response to send confirmation.",
//       });
//       return;
//     }

//     const confirmedCount = selectedResponseIds.filter((id) => {
//       const response = responses.find((r) => r.id === id);
//       return response && response.status === "CONFIRMED";
//     }).length;

//     if (confirmedCount !== selectedResponseIds.length) {
//       toast.error("Status Check", {
//         description: "Only confirmed responses can receive confirmation emails.",
//       });
//       return;
//     }

//     setShowEmailDialog(true);
//   };

//   const handleSendBulkConfirmation = () => {
//     onSendConfirmation(selectedResponseIds, emailMessage);
//     setShowEmailDialog(false);
//     setEmailMessage("");
//     setSelectedResponseIds([]);
//     setAllSelected(false);
//   };

//   const handleExportSelected = () => {
//     if (selectedResponseIds.length === 0) {
//       toast.success("No Selections", {
//         description: "Please select at least one response to export.",
//       });
//       return;
//     }

//     toast.success("Exporting Selected Responses", {
//       description: `${selectedResponseIds.length} responses being exported.`,
//     });

//     // In a real app, this would handle actual export logic
//     setTimeout(() => {
//       toast.success("Export Complete", {
//         description: `${selectedResponseIds.length} responses have been exported successfully.`,
//       });
//       setSelectedResponseIds([]);
//       setAllSelected(false);
//     }, 1000);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//         <div className="flex items-center gap-2">
//           <Button variant="outline" size="sm" onClick={onBackToForms}>
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to Forms
//           </Button>
//           <div>
//             <h2 className="text-2xl font-bold">{formName} Responses</h2>
//             <p className="text-muted-foreground">
//               View and manage registration responses
//             </p>
//           </div>
//         </div>
//         <Button variant="outline" onClick={handleExport}>
//           <Download className="mr-2 h-4 w-4" />
//           Export All
//         </Button>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Filters</CardTitle>
//           <CardDescription>
//             Filter responses by status or search for specific content.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid gap-4 md:grid-cols-2">
//             <div>
//               <Select
//                 value={filter.status}
//                 onValueChange={(value) => setFilter({ ...filter, status: value })}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Filter by Status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Statuses</SelectItem>
//                   <SelectItem value="PENDING">Pending</SelectItem>
//                   <SelectItem value="CONFIRMED">Confirmed</SelectItem>
//                   <SelectItem value="DECLINED">Declined</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="relative">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input
//                 type="search"
//                 placeholder="Search responses..."
//                 className="pl-8 w-full"
//                 value={filter.search}
//                 onChange={(e) => setFilter({ ...filter, search: e.target.value })}
//               />
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {selectedResponseIds.length > 0 && (
//         <Card className="bg-muted/50">
//           <CardContent className="p-4">
//             <div className="flex items-center justify-between">
//               <div className="font-medium">
//                 {selectedResponseIds.length}{" "}
//                 {selectedResponseIds.length === 1 ? "response" : "responses"} selected
//               </div>
//               <div className="flex gap-2">
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="outline" size="sm">
//                       Bulk Actions
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end">
//                     <DropdownMenuItem onClick={() => handleBulkStatusUpdate("CONFIRMED")}>
//                       <Check className="h-4 w-4 mr-2 text-green-500" />
//                       Mark as Confirmed
//                     </DropdownMenuItem>
//                     <DropdownMenuItem onClick={() => handleBulkStatusUpdate("PENDING")}>
//                       <span className="h-4 w-4 mr-2 flex items-center justify-center text-yellow-500">
//                         ⏱
//                       </span>
//                       Mark as Pending
//                     </DropdownMenuItem>
//                     <DropdownMenuItem onClick={() => handleBulkStatusUpdate("DECLINED")}>
//                       <X className="h-4 w-4 mr-2 text-red-500" />
//                       Mark as Declined
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//                 <Button variant="outline" size="sm" onClick={handleOpenEmailDialog}>
//                   <Mail className="h-4 w-4 mr-2" />
//                   Send Confirmation
//                 </Button>
//                 <Button variant="outline" size="sm" onClick={handleExportSelected}>
//                   <Download className="h-4 w-4 mr-2" />
//                   Export Selected
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => {
//                     setSelectedResponseIds([]);
//                     setAllSelected(false);
//                   }}
//                 >
//                   Clear selection
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       <Card>
//         <CardHeader>
//           <CardTitle>Responses</CardTitle>
//           <CardDescription>{filteredResponses.length} responses found</CardDescription>
//         </CardHeader>
//         <CardContent className="p-0">
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="w-[50px]">
//                     <Checkbox checked={allSelected} onCheckedChange={handleSelectAll} />
//                   </TableHead>
//                   <TableHead className="w-[120px]">ID</TableHead>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Email</TableHead>
//                   <TableHead>Submission Date</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredResponses.length > 0 ? (
//                   filteredResponses.map((response) => (
//                     <TableRow key={response.id}>
//                       <TableCell>
//                         <Checkbox
//                           checked={selectedResponseIds.includes(response.id)}
//                           onCheckedChange={(checked) =>
//                             handleSelectResponse(response.id, !!checked)
//                           }
//                         />
//                       </TableCell>
//                       <TableCell className="font-mono text-xs">
//                         {response.id.substring(0, 8)}...
//                       </TableCell>
//                       <TableCell>{response.data.name || "N/A"}</TableCell>
//                       <TableCell>{response.data.email || "N/A"}</TableCell>
//                       <TableCell>
//                         {new Date(response.createdAt).toLocaleString()}
//                       </TableCell>
//                       <TableCell>
//                         <Badge className={getStatusBadgeClasses(response.status)}>
//                           {response.status}
//                         </Badge>
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <div className="flex justify-end gap-1">
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             onClick={() => handleViewResponse(response)}
//                             title="View Details"
//                           >
//                             <Search className="h-4 w-4" />
//                           </Button>
//                           {response.status !== "CONFIRMED" && (
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               onClick={() => onUpdateStatus(response.id, "CONFIRMED")}
//                               title="Confirm"
//                             >
//                               <Check className="h-4 w-4 text-green-600" />
//                             </Button>
//                           )}
//                           {response.status !== "DECLINED" && (
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               onClick={() => onUpdateStatus(response.id, "DECLINED")}
//                               title="Decline"
//                             >
//                               <X className="h-4 w-4 text-red-600" />
//                             </Button>
//                           )}
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             onClick={() => generateQRCode(response.id)}
//                             title="Generate QR Code"
//                           >
//                             <QrCode className="h-4 w-4" />
//                           </Button>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => onSendConfirmation([response.id])}
//                             disabled={response.status !== "CONFIRMED"}
//                           >
//                             <Mail className="h-4 w-4 mr-1" />
//                             Send
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={7} className="h-32 text-center">
//                       No responses found matching your criteria
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//         <CardFooter className="flex justify-between py-4">
//           <div className="text-sm text-muted-foreground">
//             Showing {filteredResponses.length} of {responses.length} responses
//           </div>
//           <Button variant="outline" onClick={handleExport}>
//             <Download className="mr-2 h-4 w-4" />
//             Export Data
//           </Button>
//         </CardFooter>
//       </Card>

//       {/* Response details dialog */}
//       <Dialog
//         open={!!selectedResponse && !showQRCode}
//         onOpenChange={() => setSelectedResponse(null)}
//       >
//         <DialogContent className="sm:max-w-[600px]">
//           <DialogHeader>
//             <DialogTitle>Response Details</DialogTitle>
//             <DialogDescription>
//               Submission from {selectedResponse?.data.name || "Anonymous"} on{" "}
//               {selectedResponse && new Date(selectedResponse.createdAt).toLocaleString()}
//             </DialogDescription>
//           </DialogHeader>

//           <div className="grid gap-4 py-4">
//             {selectedResponse &&
//               Object.entries(selectedResponse.data).map(([key, value]) => (
//                 <div key={key} className="grid grid-cols-3 items-center gap-4">
//                   <div className="font-medium capitalize">{key}:</div>
//                   <div className="col-span-2">{value?.toString() || "N/A"}</div>
//                 </div>
//               ))}

//             <div className="grid grid-cols-3 items-center gap-4">
//               <div className="font-medium">Status:</div>
//               <div className="col-span-2">
//                 <Badge
//                   className={
//                     selectedResponse ? getStatusBadgeClasses(selectedResponse.status) : ""
//                   }
//                 >
//                   {selectedResponse?.status}
//                 </Badge>
//               </div>
//             </div>
//           </div>

//           <DialogFooter className="flex justify-between">
//             <div className="flex gap-2">
//               {selectedResponse && selectedResponse.status !== "CONFIRMED" && (
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     if (selectedResponse) {
//                       onUpdateStatus(selectedResponse.id, "CONFIRMED");
//                       setSelectedResponse({ ...selectedResponse, status: "CONFIRMED" });
//                     }
//                   }}
//                 >
//                   <Check className="h-4 w-4 mr-2" />
//                   Confirm
//                 </Button>
//               )}
//               {selectedResponse && selectedResponse.status !== "DECLINED" && (
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     if (selectedResponse) {
//                       onUpdateStatus(selectedResponse.id, "DECLINED");
//                       setSelectedResponse({ ...selectedResponse, status: "DECLINED" });
//                     }
//                   }}
//                 >
//                   <X className="h-4 w-4 mr-2" />
//                   Decline
//                 </Button>
//               )}
//             </div>
//             <Button variant="secondary" onClick={() => setSelectedResponse(null)}>
//               Close
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* QR code dialog */}
//       <Dialog
//         open={!!selectedResponse && showQRCode}
//         onOpenChange={() => {
//           setSelectedResponse(null);
//           setShowQRCode(false);
//         }}
//       >
//         <DialogContent className="sm:max-w-[400px]">
//           <DialogHeader>
//             <DialogTitle>Attendee QR Code</DialogTitle>
//             <DialogDescription>
//               {selectedResponse?.data.name} - {selectedResponse?.status}
//             </DialogDescription>
//           </DialogHeader>

//           <div className="flex flex-col items-center justify-center p-4">
//             <div className="w-[200px] h-[200px] bg-gray-100 rounded-md flex items-center justify-center">
//               <QrCode size={100} className="text-gray-400" />
//             </div>
//             <p className="mt-4 text-center text-muted-foreground">
//               Scan this QR code at the event for check-in.
//             </p>
//           </div>

//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setSelectedResponse(null);
//                 setShowQRCode(false);
//               }}
//             >
//               Close
//             </Button>
//             <Button
//               onClick={() => {
//                 if (selectedResponse) {
//                   onSendConfirmation([selectedResponse.id]);
//                   setSelectedResponse(null);
//                   setShowQRCode(false);
//                 }
//               }}
//               disabled={selectedResponse?.status !== "CONFIRMED"}
//             >
//               <Mail className="h-4 w-4 mr-2" />
//               Send to Attendee
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Email confirmation dialog */}
//       <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
//         <DialogContent className="sm:max-w-[500px]">
//           <DialogHeader>
//             <DialogTitle>Send Confirmation Emails</DialogTitle>
//             <DialogDescription>
//               Send confirmation emails with QR codes to {selectedResponseIds.length}{" "}
//               attendees.
//             </DialogDescription>
//           </DialogHeader>

//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <div className="font-medium col-span-4">
//                 Add a custom message (optional):
//               </div>
//               <Textarea
//                 className="col-span-4"
//                 placeholder="Your custom message to attendees..."
//                 value={emailMessage}
//                 onChange={(e) => setEmailMessage(e.target.value)}
//               />
//             </div>
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleSendBulkConfirmation}>
//               <Mail className="h-4 w-4 mr-2" />
//               Send {selectedResponseIds.length}{" "}
//               {selectedResponseIds.length === 1 ? "Email" : "Emails"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default FormResponses;
