import { EventItem } from "@/components/pages/events/EventItem";
import { BackButton } from "@/components/utils/BackButton";
import { getAllEvents } from "@/db/event";

export default async function PastEvents() {
  const events = await getAllEvents(true);

  return (
    <div className="relative flex flex-col h-full gap-6">
      <div className="z-50 relative -mt-[20px]">
        <BackButton />
      </div>
      <span className="text-3xl">
        {" "}
        <b>Past</b> Events @ TTUCR
      </span>

      <div className="relative flex w-full h-full gap-4 p-4 pt-0 flex-wrap">
        {events.length !== 0 ? (
          events
            .sort(
              (a, b) =>
                new Date(a.startTime).getTime() -
                new Date(b.startTime).getTime()
            )
            .map((event) => <EventItem event={event} key={event.id} />)
        ) : (
          <span>No events</span>
        )}
      </div>
    </div>
  );
}
