
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

export type FormErrors = {
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
  created_at: string
};

export type OnlyEventsResponse = {
  success: boolean;
  error_message: string | null;
  events: EventObject[];

};
export type EventName = {
  event_id: string;
  title: string;

};

export type ListEventsNameResponse = {
  success: boolean;
  error_message: string | null;
  events: EventName[];

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



export type TimeRange = {
  id?: string
  start_time: string
  end_time: string
}

export type slotRequest = {
  event_id: string
  time_slots: TimeRange[]
  is_assigned: boolean
}


export type ScheduleResponse = {
  id?: string
  event_id: string
  time_slots: TimeRange[]
  is_assigned: boolean
}

// Speaker type
export type SpeakerCreate = {
  full_name: string
  email: string
  bio: string
}

export type IdSpeaker = {
  id: string
  created_at: string
}

export type responseSpeaker = {
  id: string
  full_name: string
  email: string
  bio: string
  created_at: string
}

export type speakerResponse = {
  success: boolean
  error_message: string | null
  speaker: IdSpeaker | responseSpeaker[]
}

export type speakerListResponse = {
  success: boolean
  error_message: string | null
  speaker: responseSpeaker[]
}

export type DeleteSpeakerResponse = {
  id: string;
  success: boolean;
  error_message: null;
  speaker: null
};

export type updateRequest = {
  id: string
  full_name: string
  email: string
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
  time_slot?: SlotTimeRange[]
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

export type SessionSpeakerResponse = {
  id: string,
  title: string,
  description: string,
  created_at: string,
  event_id: string,
  capacity: number,
  speaker_id: string,
  time_slot_id: string
}

export type SessionCompleteResponse = {
  success: boolean,
  error_message: null,
  session: SessionSpeakerResponse[]
}

export type SessionCreate =
  {
    title: string
    description: string
    event_id: string
    capacity: number,
    time_slot_id: string
    speaker_id: string
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
    speaker_id: string
  }

export type slotReference = {
  event_id: string;
  is_assigned: boolean;
  created_at: string;
  slots: SlotTimeRange[];
}

export type SlotResponse = {
  success: boolean,
  error_message: null,
  slot: slotReference
}

export type Speaker = {
  id: string;
  full_name: string;
  email: string;
  bio: string;
  created_at: string;
}

export type TimeSlot = {
  id: string;
  start_time: string;
  end_time: string;
  event_id: string;
  is_assigned: boolean;
  created_at: string;
}

export type Session = {
  session: {
    id: string;
    title: string;
    description: string;
    created_at: string;
    event_id: string;
    capacity: number;
    registrations_count: number;
    user_registration_id: string;
    time_slot_id: string;
  };
  time_slot: TimeSlot;
  speakers: Speaker[];
}

export type Event = {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  capacity: number;
  status: string;
  registrations_count: number;
  created_at: string;
}

export type EventItem = {
  event: Event;
  sessions: Session[];
}
export type EventDiscoveryResponse = {
  success: boolean;
  error_message: string | null,
  total: number,
  page: number,
  page_size: number,
  total_pages: number,
  events: EventItem[];
}

export type UserCreate = {
  email: string
  password: string
  role: string
}
export type UserUpdate = {
  id: string
  email: string
  password: string
  role: string
}

// tipos de registro de sesion
export type SessionRegister = {
  event_id: string
  session_id: string
}

export type SessionDetailRegister = {
  id: string
  event_id: string
  session_id: string
  number_registered: number
}

export type SessionRegisterResponse = {
  success: boolean,
  error_message: string | null,
  session_detail: SessionDetailRegister
}

export type LogoutResponse = {
  success: boolean,
  message: string | null
}

export const Role = {
  ADMIN: 'admin',
  ASSISTANT: 'assistant',
} as const;

export type RoleType = typeof Role[keyof typeof Role];

export type User = {
  id: string;
  email: string;
  password: string;
  role: RoleType;
}

export type UserAuthResponse = {
  id: string;
  email: string;
  role: RoleType;
}

export type UserListResponse = {
  success: boolean,
  error_message: string | null,
  users: User[]
}

export type DeleteUserResponse = {
  id: string;
  success: boolean;
  error_message: string | null;
};