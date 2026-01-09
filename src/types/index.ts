export type BottunCreateProps={
    name:string

}
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
export type EventStatus = 'published' | 'closed';

  export type FormData = {
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    capacity: string;
    status: EventStatus;
  };