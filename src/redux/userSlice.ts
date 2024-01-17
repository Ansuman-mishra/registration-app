import { createSlice } from "@reduxjs/toolkit";
import { AddressDetails, PersonalDetails } from "../types/types";

interface UserState {
    users: { personal: PersonalDetails; address?: AddressDetails }[];
}

const initialState: UserState = {
    users: [],
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addUser: (state, action) => {
            state.users.push(action.payload);
        },
    },
});

export const { addUser } = userSlice.actions;
export default userSlice.reducer;
