class pin {
    id: string;
    title: string;
    local: string;
    details: string;
    lat: number;
    lng: number;
}
class employees {
  id: string;
    name: string;
    registration: string;
    distance: string;
     pins : pin[]
}
export class SuggestionExtra {

    employee : employees[]
    distance: string
    totalDurationTime: number
}