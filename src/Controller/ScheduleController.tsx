import { Event , CalenderEventData} from '../Components/Types/Interfaces';
import FirestoreService from '../Services/FirestoreService';

export const EventToCalenderEventDataConverter = (event: Event): CalenderEventData => {
  return {
    id: event.id,
    EventName: event.eventName,
    EventDescription: event.details,
    StartTime: FirestoreService.createTimestampFromTimeString(event.startTimeStamp, event.date),
    EndTime: FirestoreService.createTimestampFromTimeString(event.endTimeStamp, event.date),
    location: event.location,
  };
}

export const AddEventToPersonalCalendar = async (event: Event, user: any, eventToEdit:boolean) => {
    const eventData = EventToCalenderEventDataConverter(event);
    const timestamp = FirestoreService.createTimestampFromTimeString(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }), event.date);
    await FirestoreService.updateDocField(
        "lastUpdated", 
        timestamp,
        'Events',
        'PersonalEvents', 
        user?.email || "useremail@ucsd.edu", 
        event.date, 
    );
    if (eventToEdit) {
        // Update existing event
        await FirestoreService.updateEventInCollection(
            event.id, 
            eventData, 
            'Events', 
            'PersonalEvents', 
            user?.email || "useremail@ucsd.edu", 
            event.date, 
            'DailyAgenda'
            
        );
    } else {
        await FirestoreService.addEventToCollection(
            eventData, 
                'Events', 
                'PersonalEvents', 
                user?.email || "useremail@ucsd.edu", 
                event.date, 
                'DailyAgenda'
            );
    }
}

export const RemoveEventFromPersonalCalendar = async (event: Event, user: any) => {
    await FirestoreService.deleteEventFromCollection(
        event.id, 
        'Events', 
        'PersonalEvents', 
        user?.email || "useremail@ucsd.edu",
        event.date,
        'DailyAgenda'
    );
}
