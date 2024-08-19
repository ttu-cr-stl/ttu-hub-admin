"use client";
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
} from "@/components/ui/shadcn/alert-dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/shadcn/avatar";
import { useToast } from "@/components/ui/shadcn/use-toast";
import { deleteUserByUsername } from "@/db/users";
import { getDegreeByKey } from "@/lib/utils";
import { cn } from "@/lib/utils/cn";
import { User } from "@prisma/client";
import { FC, useState } from "react";
import { Delete, Loader } from "react-feather";

interface UserItemProps {
  user: User;
}

const UserItem: FC<UserItemProps> = ({ user }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = () => {
    setIsDeleting(true);
    deleteUserByUsername(user.username)
      .then(() => {
        setIsDeleting(false);
      })
      .catch(() => {
        setIsDeleting(false);
        toast({
          variant: "destructive",
          title: "Failed to delete user",
          description: "An error occurred while deleting the user. Try again.",
        });
      });
  };

  const major = getDegreeByKey(user.major) || {
    value: "",
    color: "",
    name: "",
  };
  const minor = getDegreeByKey(user.minor!);

  return (
    <div
      className={cn(
        `flex flex-col sm:flex-row items-start sm:items-center justify-between w-full p-3 sm:p-2 border-2 rounded-xl`
      )}
      style={{ borderColor: major.color }}
    >
      <div className="flex items-center gap-2 mb-2 sm:mb-0">
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarImage src={user.profilePic!} alt={user.username} />
          <AvatarFallback className="bg-black/10">
            {(user.firstName[0], user.lastName[0])}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <span className="font-semibold">{`${user.firstName} ${user.lastName}`}</span>

          <div className="flex flex-wrap gap-1 w-[200px] md:w-auto">
            <div className="w-min px-2 pb-0.5 rounded-full bg-black/10">
              <span className="text-xs leading-none">@{user.username}</span>
            </div>

            <div
              className="w-min px-2 pb-0.5 rounded-full bg-black/10"
              style={{ backgroundColor: major.color }}
            >
              <span className="text-xs leading-none text-white">
                {major.value}
              </span>
            </div>

            {minor && minor.value !== "NONE" && (
              <div
                className="w-min px-2 pb-0.5 rounded-full bg-black/10"
                style={{ backgroundColor: minor.color }}
              >
                <span className="text-xs leading-none text-white">
                  {minor.value}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div className="-mt-10 md:-mt-0 p-2 rounded-lg bg-red-500 text-white cursor-pointer self-end sm:self-auto">
            {isDeleting ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <Delete size={16} />
            )}
          </div>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you absolutely sure you want to delete <b>@{user.username}</b>
              ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete their
              account and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-800"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserItem;