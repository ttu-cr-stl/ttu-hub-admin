import CloseEvent from "@/components/pages/events/CloseEvent";
import DeleteEvent from "@/components/pages/events/DeleteEvent";
import { EditEventModal } from "@/components/pages/events/EditEventModal";
import { EventMessage } from "@/components/pages/events/EventMessage";
import SendEventMessage from "@/components/pages/events/sendEventMessage";
import ShareLink from "@/components/pages/events/ShareLink";
import AvatarCircles from "@/components/ui/AvatarCircles";
import { Badge } from "@/components/ui/shadcn/badge";
import { BackButton } from "@/components/utils/BackButton";
import { getEventById } from "@/db/event";
import { EVENT_CATEGORIES } from "@/lib/utils/consts";
import { Event, User } from "@prisma/client";
import { formatInTimeZone } from "date-fns-tz";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface EventPageProps {
  params: { id: string };
}

const EventPage: FC<EventPageProps> = async ({ params }) => {
  const event = await getEventById(
    params.id
  );

  if (!event) {
    return <div>Event not found</div>;
  }

  const users = event.EventAttendance.map((ea) => ea.User);

  return (
    <div className="flex flex-col w-full">
      <div className="z-50 relative -mt-[20px]">
        <BackButton />
      </div>
      <div className="relative flex flex-col md:flex-row md:mt-4 py-4 px-4 md:px-6 bg-white rounded-xl gap-4">
        <div className="flex flex-col w-full md:w-1/2 gap-2">
          <span className="text-xl md:text-2xl font-bold">{event.name}</span>

          <div className="flex items-center gap-3">
            {event.category && (
              <Badge
                className="text-center whitespace-nowrap max-w-[120px]"
                style={{
                  backgroundColor: EVENT_CATEGORIES.find(
                    (cat) => cat.name === event.category
                  )?.color,
                }}
              >
                <span className="whitespace-nowrap">{event.category}</span>
              </Badge>
            )}
            {event.reward > 0 && (
              <Badge className="text-xs font-normal bg-purple-500 hover:bg-purple-500">
                {event.reward} pts
              </Badge>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <span className="text-sm text-gray-500">
              {formatInTimeZone(
                event.startTime,
                "America/Costa_Rica",
                "EEEE, MMMM d, yyyy"
              )}
            </span>
            <span className="text-sm text-gray-500">
              {formatInTimeZone(event.startTime, "America/Costa_Rica", "h:mm a")}
              {event.endTime &&
                ` - ${formatInTimeZone(event.endTime, "America/Costa_Rica", "h:mm a")}`}
            </span>
          </div>

          <p>{event.description}</p>

          <div className="flex flex-col gap-2 mt-auto">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{users.length} signed up</span>
              {event.userLimit && (
                <>
                  <span>•</span>
                  <span>{event.userLimit} max</span>
                </>
              )}
            </div>
            <div className="flex items-center justify-between gap-2">
              {users && users.length !== 0 && (
                <Link href={`/events/${event.id}/users`} className="w-fit">
                  <div className="flex items-center w-fit p-2 gap-2 hover:bg-black/25 rounded-xl">
                    <AvatarCircles
                      numPeople={users.length}
                      avatarUrls={users
                        .slice(0, 3)
                        .map(
                          (user) => user.profilePic || "users/default.jpg"
                        )}
                    />
                    <span className="text-sm font-medium">View List</span>
                  </div>
                </Link>
              )}
              <CloseEvent
                eventId={event.id}
                initialClosedState={event.closed}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row w-full justify-between mt-4 md:mt-auto gap-4 sm:gap-2">
            <div className="flex items-center gap-2 w-full sm:w-auto justify-start">
              <EditEventModal event={event} />
              <DeleteEvent eventId={event.id} />
            </div>
            <div className="flex justify-start sm:justify-end w-full sm:w-auto">
              <ShareLink text={`https://ttucr-hub.app/event/${event.id}`} />
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full md:w-1/2 mt-4 md:mt-0">
          <div className="relative w-full aspect-[330/176] bg-gray-200 rounded-xl overflow-clip">
            {event.coverImg && (
              <Image
                src={event.coverImg}
                fill
                alt=""
                className="aspect-auto object-cover"
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full md:w-[390px] mx-auto py-4 gap-y-4">
        <SendEventMessage eventId={event.id} />
        {event.messages
          .slice()
          .reverse()
          .map((message, index) => (
            <EventMessage
              key={index}
              message={message}
              index={index}
              eventId={event.id}
            />
          ))}
      </div>
    </div>
  );
};

export default EventPage;