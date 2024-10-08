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
import { deleteUserByUsername, toggleUserAttendEvent } from "@/db/users";
import { getDegreeByKey } from "@/lib/utils";
import { cn } from "@/lib/utils/cn";
import { User } from "@prisma/client";
import { FC, useState } from "react";
import { Check, Loader, X } from "react-feather";

interface UserItemProps {
  user: User;
  actionButton?: React.ReactNode;
  hideBadges?: boolean;
  signUpDate?: Date;
}

const UserItem: FC<UserItemProps> = ({
  user,
  actionButton,
  hideBadges = false,
  signUpDate,
}) => {
  const major = getDegreeByKey(user.major) || {
    value: "",
    color: "",
    name: "",
  };
  const minor = getDegreeByKey(user.minor!);

  return (
    <div
      className={cn(
        `flex items-start sm:items-center justify-between w-full p-3 sm:p-2 border-2 rounded-xl`
      )}
      style={{ borderColor: major.color }}
    >
      <div
        className={cn("flex items-center gap-2", !hideBadges && "mb-2 sm:mb-0")}
      >
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarImage src={user.profilePic!} alt={user.username} />
          <AvatarFallback className="bg-black/10">
            {(user.firstName[0], user.lastName[0])}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
          <span className="font-semibold truncate max-w-[200px] sm:max-w-none">
            {`${user.firstName} ${user.lastName}`}
          </span>

          {!hideBadges ? (
            <div className="flex flex-wrap gap-1 w-auto pr-1">
              <div className="flex items-center h-6 px-2 rounded-full bg-black/10">
                <span className="text-xs leading-none">@{user.username}</span>
              </div>

              <div
                className="flex items-center h-6 px-2 rounded-full"
                style={{ backgroundColor: major.color }}
              >
                <span className="text-xs leading-none text-white">
                  {major.value}
                </span>
              </div>

              {minor && minor.value !== "NONE" && (
                <div
                  className="flex items-center h-6 px-2 rounded-full"
                  style={{ backgroundColor: minor.color }}
                >
                  <span className="text-xs leading-none text-white">
                    {minor.value}
                  </span>
                </div>
              )}

              <div className="flex items-center h-6 px-2 rounded-full bg-purple-500">
                <span className="text-xs leading-none text-white">
                  {user.points} pts
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center h-6 px-2 rounded-full bg-purple-500">
              <span className="text-xs leading-none text-white">
                {signUpDate?.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {actionButton}
    </div>
  );
};

export default UserItem;

export const DeleteUserButton = ({ username }: { username: string }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = () => {
    setIsDeleting(true);
    deleteUserByUsername(username)
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

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="-mt-10 md:-mt-0 p-2 rounded-lg bg-red-500 text-white cursor-pointer self-end sm:self-auto">
          {isDeleting ? (
            <Loader size={16} className="animate-spin" />
          ) : (
            <X size={16} />
          )}
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure you want to delete <b>@{username}</b>?
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
  );
};

export const AttendEventButton = ({
  username,
  attended,
  eventId,
  reward,
}: {
  username: string;
  attended: boolean;
  eventId: string;
  reward: number;
}) => {
  const [isAttending, setIsAttending] = useState(attended);
  const { toast } = useToast();

  const handleAttend = () => {
    // Optimistically update the UI
    setIsAttending(!isAttending);

    toggleUserAttendEvent(username, eventId, !isAttending, reward).catch(() => {
      // Revert the optimistic update on error
      setIsAttending(attended);
      toast({
        variant: "destructive",
        title: `Failed to update attendance for ${username}`,
        description: "An error occurred. Please try again.",
      });
    });
  };

  return (
    <button
      onClick={handleAttend}
      className={cn(
        "flex items-center justify-center h-full p-2 rounded-lg text-white cursor-pointer sm:self-auto transition-colors duration-200",
        isAttending
          ? "bg-red-500 hover:bg-red-600"
          : "bg-green-500 hover:bg-green-600"
      )}
    >
      {isAttending ? (
        <>
          Remove <X size={16} className="ml-1" />
        </>
      ) : (
        <>
          Confirm <Check size={16} className="ml-1" />
        </>
      )}
    </button>
  );
};
