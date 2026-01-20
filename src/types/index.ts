import { Session } from "inspector";

export type EventStatus = 'published' | 'closed';

export type SendEventData = {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  capacity: number;
  status: EventStatus;

};

export type UpdateEventData = {
  id: string,
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  capacity: number;
  status: EventStatus;

};


export type ResetProps = {
  onClick: () => void;
  name: React.ReactNode;
};

export   type FormErrors = {
    title?: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    capacity?: string;
  };

export type EventObject = {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  capacity: string;
  status: EventStatus;
  created_at : string
};

export type OnlyEventsResponse = {
  success: boolean;
  error_message: string | null;
  events: EventObject[] ;

};

export type DeleteEventsResponse = {
  id: string;
  success: boolean;
  error_message: null;
  events: null
};

export type EventFormErrors = {
  title?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  capacity?: string;
};
export type EventData = {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  capacity: string;
  original_start_date: string;
  original_end_date: string;
  status: EventStatus;
  backendId?: string;
  isDirty?: boolean;
};

// typos de schedule
export type TimeRange = {
  start_time: string
  end_time: string
}

export type slotRequest = {
  event_id: string
  time_slots:TimeRange[]
  is_assigned: boolean 
}


export type ScheduleResponse = {
  id:string
  event_id: string
  time_slots:TimeRange[]
  is_assigned: boolean 
}

// Speaker type
export type SpeakerCreate = {
  full_name : string
  email : string
  bio: string
}

export type IdSpeaker = {
  id : string
  created_at: string
}

export type responseSpeaker = {
  id:string
  full_name : string
  email : string
  bio: string
  created_at : string
}

export type speakerResponse = {
  success: boolean
  error_message: string | null
  speaker:IdSpeaker | responseSpeaker[]
}

export type speakerListResponse = {
  success: boolean
  error_message: string | null
  speaker:responseSpeaker[]
}

export type DeleteSpeakerResponse = {
  id: string;
  success: boolean;
  error_message: null;
  speaker: null
};

export type updateRequest = {
  id:string
  full_name : string
  email : string
  bio: string
}

// tipos de session
export type SlotTimeRange = {
  id: string
  start_time: string
  end_time: string
}

export type EventWithSlots = {
  id: string
  title: string
  time_slot: SlotTimeRange[]
}

export type EventSlotListResponse = {
  success: boolean;
  error_message: string | null;
  events: EventWithSlots[]
}

export type SessionResponse = {
  id: string,
  title: string,
  description: string,
  created_at: string,
  event_id: string,
  capacity: number,
  time_slot_id: string
}

export type SessionCompleteResponse = {
  success: boolean,
  error_message: null,
  session: SessionResponse[]
}

export type SessionCreate = 
  {
  title: string
  description: string
  event_id: string
  capacity: number,
  time_slot_id: string
  speaker_id:string
}

export type SessionSimpleResponse = {
  success: boolean,
  error_message: null,
  session: SessionResponse
}

export type DeleteSessionResponse = {
  id: string;
  success: boolean;
  error_message: null;
  session: null
};

export type SessionUpdate = 
  {
  id: string
  title: string
  description: string
  event_id: string
  capacity: number,
  time_slot_id: string
  speaker_id:string
}