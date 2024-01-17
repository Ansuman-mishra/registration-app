export interface PersonalDetails {
    name: string | undefined;
    age: number | undefined;
    sex: "Male" | "Female" | undefined;
    mobile: string | undefined;
    govIdType: "Aadhar" | "PAN" | undefined;
    govIdNumber: string | undefined;
}

export interface AddressDetails {
    address?: string;
    state?: string;
    city?: string;
    country?: string;
    pincode?: number | undefined;
}
export interface Country {
    name: string;
}
