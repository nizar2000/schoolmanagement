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
import StudentUpsertForm from "@/components/Admin/Forms/StudentUpsertForm";
import { toast } from "sonner";
import StudentApi from '@/services/Api/Admin/StudentApi';

export default function StudentsList() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const studentColumns = React.useMemo(() => [
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
      accessorKey: "email",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    },
    {
      accessorKey: "formatted_updated_at",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Updated at" />,
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
              <SheetTrigger>
                <Button size="sm">Update</Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[140px]  h-[200px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Update student {firstname} {lastname}</SheetTitle>
                  <SheetDescription>
                    Make changes to your student here. Click save when you're done.
                    <StudentUpsertForm
                      values={row.original}
                      handleSubmit={(values) => {
                        const promise = StudentApi.update(id, values);
                        promise.then((response) => {
                          const { student } = response.data;
                          const elements = data.map((item) => item.id === id ? student : item);
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
                        const { data: deletedStudent, status } = await StudentApi.delete(id);
                        toast.dismiss(deletingLoader);
                        console.log(deletedStudent)
                        if (status === 200) {
                          setData(data.filter((student) => student.id !== id));
                          toast.success('Student deleted', {
                            description: `Student deleted successfully ${deletedStudent.firstname} ${deletedStudent.lastname}`,
                     
                          });
                        }
                      } catch (error) {
                        console.log(error)
                        toast.error('Error deleting student');
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
  ], [data]);

  useEffect(() => {
    StudentApi.all()
      .then(({ data }) => {
        if (Array.isArray(data) && data.length > 0) {
          // Transform the data to include all necessary fields
          const transformedData = data.map(student => ({
            id: student.id,
            firstname: student.firstname || 'N/A', // Default value if firstname is not available
            lastname: student.lastname || 'N/A', // Default value if lastname is not available
            gender: student.gender || 'N/A', // Default value if gender is not available
            blood_type: student.blood_type || 'N/A', // Default value if blood_type is not available
            email: student.email,
            formatted_updated_at: student.updated_at ? new Date(student.updated_at).toLocaleDateString() : 'N/A', // Format the date
          }));
          setData(transformedData);
          setError(null);
        } else {
          console.error("Unexpected data format:", data);
          setError("Failed to fetch student data");
        }
      })
      .catch((err) => {
        console.error("Error fetching student data:", err);
        setError("Failed to fetch student data");
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

  return <DataTable columns={studentColumns} data={data} />;
}
