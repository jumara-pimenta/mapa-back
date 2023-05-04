
export class LatLngAndDistrict {
    latLng: Location;
    district: string;
}
    export class AddressComponent {
        long_name: string;
        short_name: string;
        types: string[];
    }

    class Northeast {
        lat: number;
        lng: number;
    }

    class Southwest {
        lat: number;
        lng: number;
    }

    class Bounds {
        northeast: Northeast;
        southwest: Southwest;
    }

    class Location {
        lat: number;
        lng: number;
    }

    class Northeast2 {
        lat: number;
        lng: number;
    }

    class Southwest2 {
        lat: number;
        lng: number;
    }

    class Viewport {
        northeast: Northeast2;
        southwest: Southwest2;
    }

    class Geometry {
        bounds: Bounds;
        location: Location;
        location_type: string;
        viewport: Viewport;
    }

    class Result {
        address_components: AddressComponent[];
        formatted_address: string;
        geometry: Geometry;
        place_id: string;
        types: string[];
    }

   export class RootObject {
        results: Result[];
        status: string;
     routes: any;
    }



