import React, { useEffect, useState } from 'react';
import { DataTable } from './DataTable';
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { MoreHorizontal, Trash2Icon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import ParentCreateForm from "@/components/Admin/Forms/ParentCreateForm";
import { toast } from "sonner";
import ParentApi from '@/services/Api/Admin/ParentApi';

export default function AdminParentList() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const AdminParentColumns = [
    {
      accessorKey: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="#ID" />,
    },
    {
      accessorKey: "firstname",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Firstname" />,
    },
    {
      accessorKey: "lastname",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Lastname" />,
    },
    {
      accessorKey: "date_of_birth",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date of Birth" />,
    },
    {
      accessorKey: "gender",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Gender" />,
      cell: ({ row }) => {
        const value = row.getValue("gender");
        const gender = value === 'm' ? 'Male' : 'Female';
        return <>{gender}</>;
      },
    },
    {
      accessorKey: "blood_type",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Blood Type" />,
    },
    {
      accessorKey: "address",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Address" />,
    },
    {
      accessorKey: "phone",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
      cell: ({ row }) => {
        const phone = row.getValue("phone");
        return <div className="text-right font-medium">+212-{phone}</div>;
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    },
    {
      accessorKey: "formatted_updated_at",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Updated At" />,
      cell: ({ row }) => {
        const date = row.getValue("formatted_updated_at");
        return <div className="text-right font-medium">{date}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const { id, firstname, lastname } = row.original;
        const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

        return (
          <div className="flex gap-x-1">
            <Sheet open={openUpdateDialog} onOpenChange={setOpenUpdateDialog}>
              <SheetTrigger asChild>
                <Button variant="outline">Update</Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[140px] h-[200px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Update Parent {firstname} {lastname}</SheetTitle>
                  <SheetDescription>
                    Make changes to your parent here. Click save when you're done.
                    <ParentCreateForm
                      values={row.original}
                      handleSubmit={(values) => {
                        const promise = ParentApi.update(id, values);
                        promise.then((response) => {
                          const { parent } = response.data;
                          const elements = data.map((item) => item.id === id ? parent : item);
                          setData(elements);
                          setOpenUpdateDialog(false);
                        });
                        return promise;
                      }}
                    />
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you absolutely sure to delete
                    <span className="font-bold"> {firstname} {lastname}</span>?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      const deletingLoader = toast.loading('Deleting in progress.');
                      try {
                        const { data: deletedParent, status } = await ParentApi.delete(id);
                        toast.dismiss(deletingLoader);
                        if (status === 200) {
                          setData(data.filter((parent) => parent.id !== id));
                          toast.success('Parent deleted', {
                            description: `Parent deleted successfully ${deletedParent.data.firstname} ${deletedParent.data.lastname}`,
                          });
                        }
                      } catch (error) {
                        toast.error('Error deleting parent');
                      }
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    ParentApi.all()
      .then(({ data }) => {
        if (data && Array.isArray(data.data)) {
          const transformedData = data.data.map(parent => ({
            id: parent.id,
            firstname: parent.firstname || 'N/A',
            lastname: parent.lastname || 'N/A',
            date_of_birth: parent.date_of_birth || 'N/A',
            gender: parent.gender || 'N/A',
            blood_type: parent.blood_type || 'N/A',
            address: parent.address || 'N/A',
            phone: parent.phone || 'N/A',
            email: parent.email,
            formatted_updated_at: parent.updated_at ? new Date(parent.updated_at).toLocaleDateString() : 'N/A',
          }));
          setData(transformedData);
          setError(null);
        } else {
          console.error("Unexpected data format:", data);
          setError("Failed to fetch parent data");
        }
      })
      .catch((err) => {
        console.error("Error fetching parent data:", err);
        setError("Failed to fetch parent data");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <DataTable columns={AdminParentColumns} data={data} />;
}
