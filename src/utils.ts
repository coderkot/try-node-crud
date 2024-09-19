import {UsersViewModel} from "./models/UsersViewModel"
import {UsersType} from "./types/common-types";

export const getUserViewModel = (user: UsersType): UsersViewModel => {
    return {
        id: user.id,
        name: user.name,
    }
}