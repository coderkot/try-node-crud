import {UsersType} from "../common-types";

export type UserRepositoriesType = {
    findById: (id: number) => UsersType | undefined,
    findByName: (name: string | undefined) => UsersType[],
    findAll: () => Omit<UsersType, 'id'>[],
    createUser: (name: string, email: string) => UsersType,
    updateUser: (id: number, name: string, email?: string) => boolean,
    deleteUserById: (id: number) => boolean,
    dropAllUsers: () => void,
}