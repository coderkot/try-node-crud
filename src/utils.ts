import {UsersViewModel} from "./models/UsersViewModel"
import {UsersType} from "./types/types";

export const getUserViewModel = (user: UsersType): UsersViewModel => {
    return {
        id: user.id,
        name: user.name,
    }
}