export interface ResponseData {
  /** contains metadata on the request. See Status Codes below. */
  status: Status;
  /**
   * When the top-level status code is other than `OK`, this field contains more detailed information
   * about the reasons behind the given status code.
   */
  error_message: string;
  /** may contain a set of attributions about this listing which must be displayed to the user (some listings may not have attribution). */
  html_attributions?: string[];
  /**
   * contains a token that can be used to return up to 20 additional results.
   * A `next_page_token` will not be returned if there are no additional results to display.
   * The maximum number of results that can be returned is 60.
   * There is a short delay between when a `next_page_token` is issued, and when it will become valid.
   */
  next_page_token?: string;
}

export enum Status {
  /** indicates the response contains a valid result. */
  OK = 'OK',
  /** indicates that the provided request was invalid. */
  INVALID_REQUEST = 'INVALID_REQUEST',
  /**
   * indicates that too many `waypoints` were provided in the request. For applications using the Directions API as a web service,
   * or the [directions service in the Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/directions),
   * the maximum allowed number of `waypoints` is 23, plus the origin and destination.
   */
  MAX_WAYPOINTS_EXCEEDED = 'MAX_WAYPOINTS_EXCEEDED',
  /**
   * indicates the requested route is too long and cannot be processed.
   * This error occurs when more complex directions are returned.
   * Try reducing the number of waypoints, turns, or instructions.
   */
  MAX_ROUTE_LENGTH_EXCEEDED = 'MAX_ROUTE_LENGTH_EXCEEDED',
  /**
   * indicates any of the following:
   *  - The API key is missing or invalid.
   *  - Billing has not been enabled on your account.
   *  - A self-imposed usage cap has been exceeded.
   *  - The provided method of payment is no longer valid (for example, a credit card has expired).
   * See the [Maps FAQ](https://developers.google.com/maps/faq#over-limit-key-error) to learn how to fix this.
   */
  OVER_DAILY_LIMIT = 'OVER_DAILY_LIMIT',
  /** indicates the service has received too many requests from your application within the allowed time period. */
  OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
  /** indicates that the service denied use of the Distance Matrix service by your application. */
  REQUEST_DENIED = 'REQUEST_DENIED',
  /** indicates a Distance Matrix request could not be processed due to a server error. The request may succeed if you try again. */
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  /** indicates that the request was successful but returned no results. */
  ZERO_RESULTS = 'ZERO_RESULTS',
  /** indicates that the referenced location (place_id) was not found in the Places database. */
  NOT_FOUND = 'NOT_FOUND',
}

export interface Distance {
  /** indicates the distance in meters. */
  value: number;
  /**
   * contains a human-readable representation of the distance, displayed in units as used at the origin
   * (or as overridden within the `units` parameter in the request).
   * (For example, miles and feet will be used for any origin within the United States.)
   */
  text: string;
}

export enum Maneuver {
  turn_slight_left = 'turn-slight-left',
  turn_sharp_left = 'turn-sharp-left',
  uturn_left = 'uturn-left',
  turn_left = 'turn-left',
  turn_slight_right = 'turn-slight-right',
  turn_sharp_right = 'turn-sharp-right',
  uturn_right = 'uturn-right',
  turn_right = 'turn-right',
  straight = 'straight',
  ramp_left = 'ramp-left',
  ramp_right = 'ramp-right',
  merge = 'merge',
  fork_left = 'fork-left',
  fork_right = 'fork-right',
  ferry = 'ferry',
  ferry_train = 'ferry-train',
  roundabout_left = 'roundabout-left',
  roundabout_right = 'roundabout-right',
}

export interface TransitStop {
  /** the name of the transit station/stop. eg. "Union Square". */
  name: string;
  /** the location of the transit station/stop, represented as a `lat` and `lng` field. */
  location: LatLngLiteral;
}

export interface Time {
  /** the time specified as a JavaScript `Date` object. */
  value: Date;
  /** the time specified as a string. The time is displayed in the time zone of the transit stop. */
  text: string;
  /**
   * contains the time zone of this station. The value is the name of the time zone as defined in the
   * [IANA Time Zone Database](http://www.iana.org/time-zones), e.g. "America/New_York".
   */
  time_zone: string;
}

export interface TransitAgency {
  /** contains the name of the transit agency. */
  name: string;
  /** contains the phone number of the transit agency. */
  phone: string;
  /** contains the URL for the transit agency. */
  url: string;
}

export enum VehicleType {
  /** Rail. */
  RAIL = 'RAIL',
  /** Light rail transit. */
  METRO_RAIL = 'METRO_RAIL',
  /** Underground light rail. */
  SUBWAY = 'SUBWAY',
  /** Above ground light rail. */
  TRAM = 'TRAM',
  /** Monorail. */
  MONORAIL = 'MONORAIL',
  /** Heavy rail. */
  HEAVY_RAIL = 'HEAVY_RAIL',
  /** Commuter rail. */
  COMMUTER_TRAIN = 'COMMUTER_TRAIN',
  /** High speed train. */
  HIGH_SPEED_TRAIN = 'HIGH_SPEED_TRAIN',
  /** Bus. */
  BUS = 'BUS',
  /** Intercity bus. */
  INTERCITY_BUS = 'INTERCITY_BUS',
  /** Trolleybus. */
  TROLLEYBUS = 'TROLLEYBUS',
  /** Share taxi is a kind of bus with the ability to drop off and pick up passengers anywhere on its route. */
  SHARE_TAXI = 'SHARE_TAXI',
  /** Ferry. */
  FERRY = 'FERRY',
  /** A vehicle that operates on a cable, usually on the ground. Aerial cable cars may be of the type `GONDOLA_LIFT`. */
  CABLE_CAR = 'CABLE_CAR',
  /** An aerial cable car. */
  GONDOLA_LIFT = 'GONDOLA_LIFT',
  /**
   * A vehicle that is pulled up a steep incline by a cable.
   * A Funicular typically consists of two cars, with each car acting as a counterweight for the other.
   */
  FUNICULAR = 'FUNICULAR',
  /** All other vehicles will return this type. */
  OTHER = 'OTHER',
}

export interface TransitVehicle {
  /** contains the name of the vehicle on this line. eg. "Subway.". */
  name: string;
  /** contains the type of vehicle that runs on this line. */
  type: VehicleType;
  /** contains the URL for an icon associated with this vehicle type. */
  icon: string;
  /** contains the URL for the icon associated with this vehicle type, based on the local transport signage. */
  local_icon: string;
}

export interface TransitLine {
  /** contains the full name of this transit line. eg. "7 Avenue Express". */
  name: string;
  /** contains the short name of this transit line. This will normally be a line number, such as "M7" or "355". */
  short_name: string;
  /** contains the color commonly used in signage for this transit line. The color will be specified as a hex string such as: #FF0033. */
  color: string;
  /**
   * is an array containing a single `TransitAgency` object.
   * The `TransitAgency` object provides information about the operator of the line
   */
  agencies: TransitAgency[];
  /** contains the URL for this transit line as provided by the transit agency. */
  url: string;
  /** contains the URL for the icon associated with this line. */
  icon: string;
  /** contains the color of text commonly used for signage of this line. The color will be specified as a hex string. */
  text_color: string;
  /** contains the type of vehicle used on this line. */
  vehicle: TransitVehicle;
}

export interface TransitDetails {
  /** contains information about the stop for this part of the trip. */
  arrival_stop: TransitStop;
  /** contains information about the station for this part of the trip. */
  departure_stop: TransitStop;
  /** contain the arrival time for this leg of the journey. */
  arrival_time: Time;
  /** contain the departure time for this leg of the journey. */
  departure_time: Time;
  /**
   * specifies the direction in which to travel on this line, as it is marked on the vehicle or at the departure stop.
   * This will often be the terminus station.
   */
  headsign: string;
  /**
   * specifies the expected number of seconds between departures from the same stop at this time.
   * For example, with a `headway` value of 600, you would expect a ten minute wait if you should miss your bus.
   */
  headway: number;
  /**
   * contains the number of stops in this step, counting the arrival stop, but not the departure stop.
   * For example, if your directions involve leaving from Stop A, passing through stops B and C, and arriving at stop D,
   * `num_stops` will return 3.
   */
  num_stops: number;
  /** contains information about the transit line used in this step. */
  line: TransitLine;
}

export enum TravelMode {
  /** (default) indicates standard driving directions using the road network. */
  driving = 'driving',
  /** requests walking directions via pedestrian paths & sidewalks (where available). */
  walking = 'walking',
  /** requests bicycling directions via bicycle paths & preferred streets (where available). */
  bicycling = 'bicycling',
  /**
   * requests directions via public transit routes (where available).
   * If you set the mode to transit, you can optionally specify either a departure_time or an arrival_time.
   * If neither time is specified, the departure_time defaults to now (that is, the departure time defaults to the current time).
   * You can also optionally include a transit_mode and/or a transit_routing_preference.
   */
  transit = 'transit',
}

export interface DirectionsStep {
  /** contains formatted instructions for this step, presented as an HTML text string. */
  html_instructions: string;
  /**
   * contains the distance covered by this step until the next step. (See the discussion of this field in Directions Legs)
   *
   * This field may be undefined if the distance is unknown.
   */
  distance: Distance;
  /**
   * contains the typical time required to perform the step, until the next step. (See the description in Directions Legs)
   *
   * This field may be undefined if the duration is unknown
   */
  duration: Duration;
  /** contains the location of the starting point of this step, as a single set of `lat` and `lng` fields. */
  start_location: LatLngLiteral;
  /** contains the location of the last point of this step, as a single set of `lat` and `lng` fields. */
  end_location: LatLngLiteral;
  /**
   * contains the action to take for the current step (turn left, merge, straight, etc.).
   * This field is used to determine which icon to display.
   */
  maneuver: Maneuver;
  /**
   * contains a single points object that holds an encoded polyline representation of the step.
   * This polyline is an approximate (smoothed) path of the step.
   */
  polyline: {
    points: string;
  };
  /**
   * contains detailed directions for walking or driving steps in transit directions.
   * Substeps are only available when `travel_mode` is set to "transit".
   * The inner `steps` array is of the same type as `steps`.
   */
  steps: DirectionsStep;
  /** contains transit specific information. This field is only returned with travel_mode is set to "transit". */
  transit_details: TransitDetails;
  /** contains the type of travel mode used. */
  travel_mode: TravelMode;
}

export interface RouteLeg {
  /** contains an array of steps denoting information about each separate step of the leg of the journey. */
  steps: DirectionsStep[];
  /**
   * indicates the total distance covered by this leg, as a field with the following elements.
   *
   * This field may be absent if the distance is unknown.
   */
  distance: Distance;
  /**
   * indicates the total duration of this leg.
   *
   * This field may be absent if the duration is unknown.
   */
  duration: Duration;
  /**
   * indicates the total duration of this leg.
   * This value is an estimate of the time in traffic based on current and historical traffic conditions.
   * See the `traffic_model` request parameter for the options you can use to request that the returned value is optimistic, pessimistic,
   * or a best-guess estimate. The duration in traffic is returned only if all of the following are true:
   *
   *  - The request includes a valid API key, or a valid Google Maps APIs Premium Plan client ID and signature.
   *  - The request does not include stopover waypoints. If the request includes waypoints, they must be prefixed with `via:`
   *    to avoid stopovers.
   *  - The request is specifically for driving directions—the `mode` parameter is set to `driving`.
   *  - The request includes a `departure_time` parameter.
   *  - Traffic conditions are available for the requested route.
   */
  duration_in_traffic?: Duration;
  /** contains the estimated time of arrival for this leg. This property is only returned for transit directions. */
  arrival_time: Time;
  /**
   * contains the estimated time of departure for this leg, specified as a `Time` object.
   * The `departure_time` is only available for transit directions.
   */
  departure_time: Time;
  /**
   * contains the latitude/longitude coordinates of the origin of this leg.
   * Because the Directions API calculates directions between locations by using the nearest transportation option (usually a road)
   * at the start and end points, `start_location` may be different than the provided origin of this leg if, for example,
   * a road is not near the origin.
   */
  start_location: LatLngLiteral;
  /**
   * contains the latitude/longitude coordinates of the given destination of this leg.
   * Because the Directions API calculates directions between locations by using the nearest transportation option (usually a road)
   * at the start and end points, `end_location` may be different than the provided destination of this leg if, for example,
   * a road is not near the destination.
   */
  end_location: LatLngLiteral;
  /** contains the human-readable address (typically a street address) resulting from reverse geocoding the `start_location` of this leg. */
  start_address: string;
  /** contains the human-readable address (typically a street address) from reverse geocoding the `end_location` of this leg. */
  end_address: string;
}

export interface LatLngBounds {
  northeast: LatLngLiteral;
  southwest: LatLngLiteral;
}

export interface LatLngLiteral {
  lat: number;
  lng: number;
}

export interface TransitFare {
  /** An [ISO 4217 currency code](https://en.wikipedia.org/wiki/ISO_4217) indicating the currency that the amount is expressed in. */
  currency: string;
  /** The total fare amount, in the currency specified above. */
  value: number;
  /** The total fare amount, formatted in the requested language. */
  text: string;
}

export interface TransitFare {
  /** An [ISO 4217 currency code](https://en.wikipedia.org/wiki/ISO_4217) indicating the currency that the amount is expressed in. */
  currency: string;
  /** The total fare amount, in the currency specified above. */
  value: number;
  /** The total fare amount, formatted in the requested language. */
  text: string;
}

export enum PlaceType1 {
  accounting = 'accounting',
  /** indicates an airport. */
  airport = 'airport',
  amusement_park = 'amusement_park',
  aquarium = 'aquarium',
  art_gallery = 'art_gallery',
  atm = 'atm',
  bakery = 'bakery',
  bank = 'bank',
  bar = 'bar',
  beauty_salon = 'beauty_salon',
  bicycle_store = 'bicycle_store',
  book_store = 'book_store',
  bowling_alley = 'bowling_alley',
  bus_station = 'bus_station',
  cafe = 'cafe',
  campground = 'campground',
  car_dealer = 'car_dealer',
  car_rental = 'car_rental',
  car_repair = 'car_repair',
  car_wash = 'car_wash',
  casino = 'casino',
  cemetery = 'cemetery',
  church = 'church',
  city_hall = 'city_hall',
  clothing_store = 'clothing_store',
  convenience_store = 'convenience_store',
  courthouse = 'courthouse',
  dentist = 'dentist',
  department_store = 'department_store',
  doctor = 'doctor',
  drugstore = 'drugstore',
  electrician = 'electrician',
  electronics_store = 'electronics_store',
  embassy = 'embassy',
  fire_station = 'fire_station',
  florist = 'florist',
  funeral_home = 'funeral_home',
  furniture_store = 'furniture_store',
  gas_station = 'gas_station',
  gym = 'gym',
  hair_care = 'hair_care',
  hardware_store = 'hardware_store',
  hindu_temple = 'hindu_temple',
  home_goods_store = 'home_goods_store',
  hospital = 'hospital',
  insurance_agency = 'insurance_agency',
  jewelry_store = 'jewelry_store',
  laundry = 'laundry',
  lawyer = 'lawyer',
  library = 'library',
  light_rail_station = 'light_rail_station',
  liquor_store = 'liquor_store',
  local_government_office = 'local_government_office',
  locksmith = 'locksmith',
  lodging = 'lodging',
  meal_delivery = 'meal_delivery',
  meal_takeaway = 'meal_takeaway',
  mosque = 'mosque',
  movie_rental = 'movie_rental',
  movie_theater = 'movie_theater',
  moving_company = 'moving_company',
  museum = 'museum',
  night_club = 'night_club',
  painter = 'painter',
  /** indicates a named park. */
  park = 'park',
  parking = 'parking',
  pet_store = 'pet_store',
  pharmacy = 'pharmacy',
  physiotherapist = 'physiotherapist',
  plumber = 'plumber',
  police = 'police',
  post_office = 'post_office',
  real_estate_agency = 'real_estate_agency',
  restaurant = 'restaurant',
  roofing_contractor = 'roofing_contractor',
  rv_park = 'rv_park',
  school = 'school',
  secondary_school = 'secondary_school',
  shoe_store = 'shoe_store',
  shopping_mall = 'shopping_mall',
  spa = 'spa',
  stadium = 'stadium',
  storage = 'storage',
  store = 'store',
  subway_station = 'subway_station',
  supermarket = 'supermarket',
  synagogue = 'synagogue',
  taxi_stand = 'taxi_stand',
  tourist_attraction = 'tourist_attraction',
  train_station = 'train_station',
  transit_station = 'transit_station',
  travel_agency = 'travel_agency',
  university = 'university',
  veterinary_care = 'veterinary_care',
  zoo = 'zoo',
}

export enum PlaceType2 {
  /**
   * indicates a first-order civil entity below the country level. Within the United States, these administrative levels are states.
   * Not all nations exhibit these administrative levels. In most cases, `administrative_area_level_1` short names will closely match
   * ISO 3166-2 subdivisions and other widely circulated lists; however this is not guaranteed as our geocoding results are based
   * on a variety of signals and location data.
   */
  administrative_area_level_1 = 'administrative_area_level_1',
  /**
   * indicates a second-order civil entity below the country level. Within the United States, these administrative levels are counties.
   * Not all nations exhibit these administrative levels.
   */
  administrative_area_level_2 = 'administrative_area_level_2',
  /**
   * indicates a third-order civil entity below the country level. This type indicates a minor civil division.
   * Not all nations exhibit these administrative levels.
   */
  administrative_area_level_3 = 'administrative_area_level_3',
  /**
   * indicates a fourth-order civil entity below the country level. This type indicates a minor civil division.
   * Not all nations exhibit these administrative levels.
   */
  administrative_area_level_4 = 'administrative_area_level_4',
  /**
   * indicates a fifth-order civil entity below the country level. This type indicates a minor civil division.
   * Not all nations exhibit these administrative levels.
   */
  administrative_area_level_5 = 'administrative_area_level_5',
  archipelago = 'archipelago',
  /** indicates a commonly-used alternative name for the entity. */
  colloquial_area = 'colloquial_area',
  continent = 'continent',
  /** indicates the national political entity, and is typically the highest order type returned by the Geocoder. */
  country = 'country',
  establishment = 'establishment',
  finance = 'finance',
  floor = 'floor',
  food = 'food',
  general_contractor = 'general_contractor',
  geocode = 'geocode',
  health = 'health',
  /** indicates a major intersection, usually of two major roads. */
  intersection = 'intersection',
  landmark = 'landmark',
  /** indicates an incorporated city or town political entity. */
  locality = 'locality',
  /** indicates a prominent natural feature. */
  natural_feature = 'natural_feature',
  /** indicates a named neighborhood */
  neighborhood = 'neighborhood',
  place_of_worship = 'place_of_worship',
  plus_code = 'plus_code',
  point_of_interest = 'point_of_interest',
  /** indicates a political entity. Usually, this type indicates a polygon of some civil administration. */
  political = 'political',
  post_box = 'post_box',
  /** indicates a postal code as used to address postal mail within the country. */
  postal_code = 'postal_code',
  postal_code_prefix = 'postal_code_prefix',
  postal_code_suffix = 'postal_code_suffix',
  postal_town = 'postal_town',
  /** indicates a named location, usually a building or collection of buildings with a common name */
  premise = 'premise',
  room = 'room',
  /** indicates a named route (such as "US 101"). */
  route = 'route',
  street_address = 'street_address',
  street_number = 'street_number',
  /**
   * indicates a first-order civil entity below a locality. For some locations may receive one of the additional types:
   * `sublocality_level_1` to `sublocality_level_5`. Each sublocality level is a civil entity. Larger numbers indicate a smaller
   * geographic area.
   */
  sublocality = 'sublocality',
  sublocality_level_1 = 'sublocality_level_1',
  sublocality_level_2 = 'sublocality_level_2',
  sublocality_level_3 = 'sublocality_level_3',
  sublocality_level_4 = 'sublocality_level_4',
  sublocality_level_5 = 'sublocality_level_5',
  /**
   * indicates a first-order entity below a named location, usually a singular building within a collection of buildings with a
   * common name.
   */
  subpremise = 'subpremise',
  town_square = 'town_square',
}

export const AddressType = Object.assign({}, PlaceType1, PlaceType2);
export type AddressType = PlaceType1 | PlaceType2;

export interface DirectionsRoute {
  /** contains a short textual description for the route, suitable for naming and disambiguating the route from alternatives. */
  summary: string;
  /**
   * contains an array which contains information about a leg of the route, between two locations within the given route.
   * A separate leg will be present for each waypoint or destination specified.
   * (A route with no waypoints will contain exactly one leg within the `legs` array.)
   * Each leg consists of a series of `steps`.
   */
  legs: RouteLeg[];
  /**
   * contains an array indicating the order of any waypoints in the calculated route.
   * This waypoints may be reordered if the request was passed `optimize:true` within its `waypoints` parameter.
   */
  waypoint_order: number[];
  /**
   * contains a single `points` object that holds an encoded polyline representation of the route.
   * This polyline is an approximate (smoothed) path of the resulting directions.
   */
  overview_polyline: {
    points: string;
  };
  /** contains the viewport bounding box of the `overview_polyline`. */
  bounds: LatLngBounds;
  /** contains the copyrights text to be displayed for this route. You must handle and display this information yourself. */
  copyrights: string;
  /** contains an array of warnings to be displayed when showing these directions. You must handle and display these warnings yourself. */
  warnings: string[];
  /**
   * If present, contains the total fare (that is, the total ticket costs) on this route.
   * This property is only returned for transit requests and only for routes where fare information is available for all transit legs.
   *
   * **Note:** The Directions API only returns fare information for requests that contain either an API key or a client ID
   * and digital signature.
   */
  fare: TransitFare;
  /**
   * An array of LatLngs representing the entire course of this route. The path is simplified in order to make
   * it suitable in contexts where a small number of vertices is required (such as Static Maps API URLs).
   */
  overview_path: LatLngLiteral[];
}

export enum GeocodedWaypointStatus {
  /** indicates that no errors occurred; the address was successfully parsed and at least one geocode was returned. */
  OK = 'OK',
  /**
   * indicates that the geocode was successful but returned no results.
   * This may occur if the geocoder was passed a non-existent `address`.
   */
  ZERO_RESULTS = 'ZERO_RESULTS',
}

export interface GeocodedWaypoint {
  /** indicates the status code resulting from the geocoding operation. */
  geocoder_status: GeocodedWaypointStatus;
  /**
   * indicates that the geocoder did not return an exact match for the original request, though it was able to match part of the
   * requested address. You may wish to examine the original request for misspellings and/or an incomplete address.
   *
   * Partial matches most often occur for street addresses that do not exist within the locality you pass in the request.
   * Partial matches may also be returned when a request matches two or more locations in the same locality.
   * For example, "21 Henr St, Bristol, UK" will return a partial match for both Henry Street and Henrietta Street.
   * Note that if a request includes a misspelled address component, the geocoding service may suggest an alternative address.
   * Suggestions triggered in this way will also be marked as a partial match.
   */
  partial_match: boolean;
  /** unique identifier that can be used with other Google APIs. */
  place_id: string;
  /**
   * indicates the *address type* of the geocoding result used for calculating directions.
   *
   * An empty list of types indicates there are no known types for the particular address component, for example, Lieu-dit in France.
   */
  types: AddressType[];
}

export interface DirectionsResponseData extends ResponseData {
  /**
   * contains an array with details about the geocoding of origin, destination and waypoints.
   *
   * These details will not be present for waypoints specified as textual latitude/longitude values if the service returns no results.
   * This is because such waypoints are only reverse geocoded to obtain their representative address after a route has been found.
   * An empty JSON object will occupy the corresponding places in the `geocoded_waypoints` array.
   */
  geocoded_waypoints: GeocodedWaypoint[];
  /**
   * contains an array of routes from the origin to the destination.
   *
   * When the Directions API returns results, it places them within a (JSON) `routes` array. Even if the service returns no results
   * (such as if the origin and/or destination doesn't exist) it still returns an empty `routes` array.
   * (XML responses consist of zero or more `<route>` elements.)
   *
   * Each element of the `routes` array contains a single result from the specified origin and destination.
   * This route may consist of one or more `legs` depending on whether any waypoints were specified.
   * As well, the route also contains copyright and warning information which must be displayed to the user in addition to the
   * routing information.
   */
  routes: DirectionsRoute[];
  /**
   * contains an array of available travel modes. This field is returned when a request specifies a travel `mode` and gets no results.
   * The array contains the available travel modes in the countries of the given set of waypoints.
   * This field is not returned if one or more of the waypoints are `via:` waypoints.
   */
  available_travel_modes: string[];
}
