// To parse this data:
//
//   import { Convert, Welcome } from "./file";
//
//   const welcome = Convert.toWelcome(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Welcome {
    tracking_number?:   string;
    type?:              string;
    service?:           string;
    status?:            string;
    custom_attributes?: CustomAttributes;
    tracking_details?:  TrackingDetail[];
    expected_flow?:     any[];
    created_at?:        string;
    updated_at?:        string;
}

export interface CustomAttributes {
    size?:                   string;
    target_machine_id?:      string;
    dropoff_machine_id?:     string;
    target_machine_detail?:  TargetMachineDetail;
    dropoff_machine_detail?: DropoffMachineDetail;
}

export interface DropoffMachineDetail {
}

export interface TargetMachineDetail {
    href?:                 string;
    name?:                 string;
    opening_hours?:        null;
    location_description?: string;
    location?:             Location;
    address?:              Address;
    type?:                 string[];
}

export interface Address {
    line1?: string;
    line2?: string;
}

export interface Location {
    latitude?:  number;
    longitude?: number;
}

export interface TrackingDetail {
    status?:        string;
    origin_status?: string;
    agency?:        null;
    datetime?:      string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export namespace Convert {
    export function toWelcome(json: string): Welcome {
        return cast(JSON.parse(json), r("Welcome"));
    }

    export function welcomeToJson(value: Welcome): string {
        return JSON.stringify(value, null, 2);
    }

    function cast<T>(obj: any, typ: any): T {
        if (!isValid(typ, obj)) {
            throw Error(`Invalid value`);
        }
        return obj;
    }

    function isValid(typ: any, val: any): boolean {
        if (typ === "any") { return true; }
        if (typ === null) { return val === null; }
        if (typ === false) { return false; }
        while (typeof typ === "object" && typ.ref !== undefined) {
            typ = typeMap[typ.ref];
        }
        if (Array.isArray(typ)) { return isValidEnum(typ, val); }
        if (typeof typ === "object") {
            return typ.hasOwnProperty("unionMembers") ? isValidUnion(typ.unionMembers, val)
                : typ.hasOwnProperty("arrayItems")    ? isValidArray(typ.arrayItems, val)
                : typ.hasOwnProperty("props")         ? isValidObject(typ.props, typ.additional, val)
                : false;
        }
        return isValidPrimitive(typ, val);
    }

    function isValidPrimitive(typ: string, val: any) {
        return typeof typ === typeof val;
    }

    function isValidUnion(typs: any[], val: any): boolean {
        // val must validate against one typ in typs
        return typs.some((typ) => isValid(typ, val));
    }

    function isValidEnum(cases: string[], val: any): boolean {
        return cases.indexOf(val) !== -1;
    }

    function isValidArray(typ: any, val: any): boolean {
        // val must be an array with no invalid elements
        return Array.isArray(val) && val.every((element) => {
            return isValid(typ, element);
        });
    }

    function isValidObject(props: { [k: string]: any }, additional: any, val: any): boolean {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return false;
        }
        return Object.getOwnPropertyNames(val).every((key) => {
            const prop = val[key];
            if (Object.prototype.hasOwnProperty.call(props, key)) {
                return isValid(props[key], prop);
            }
            return isValid(additional, prop);
        });
    }

    function a(typ: any) {
        return { arrayItems: typ };
    }

    function u(...typs: any[]) {
        return { unionMembers: typs };
    }

    function o(props: { [k: string]: any }, additional: any) {
        return { props, additional };
    }

    function m(additional: any) {
        return { props: {}, additional };
    }

    function r(name: string) {
        return { ref: name };
    }

    const typeMap: any = {
        "Welcome": o({
            tracking_number: u(undefined, ""),
            type: u(undefined, ""),
            service: u(undefined, ""),
            status: u(undefined, ""),
            custom_attributes: u(undefined, r("CustomAttributes")),
            tracking_details: u(undefined, a(r("TrackingDetail"))),
            expected_flow: u(undefined, a("any")),
            created_at: u(undefined, ""),
            updated_at: u(undefined, ""),
        }, false),
        "CustomAttributes": o({
            size: u(undefined, ""),
            target_machine_id: u(undefined, ""),
            dropoff_machine_id: u(undefined, ""),
            target_machine_detail: u(undefined, r("TargetMachineDetail")),
            dropoff_machine_detail: u(undefined, r("DropoffMachineDetail")),
        }, false),
        "DropoffMachineDetail": o({
        }, false),
        "TargetMachineDetail": o({
            href: u(undefined, ""),
            name: u(undefined, ""),
            opening_hours: u(undefined, null),
            location_description: u(undefined, ""),
            location: u(undefined, r("Location")),
            address: u(undefined, r("Address")),
            type: u(undefined, a("")),
        }, false),
        "Address": o({
            line1: u(undefined, ""),
            line2: u(undefined, ""),
        }, false),
        "Location": o({
            latitude: u(undefined, 3.14),
            longitude: u(undefined, 3.14),
        }, false),
        "TrackingDetail": o({
            status: u(undefined, ""),
            origin_status: u(undefined, ""),
            agency: u(undefined, null),
            datetime: u(undefined, ""),
        }, false),
    };
}
