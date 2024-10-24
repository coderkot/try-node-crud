import {UsersType} from "../types/common-types"
import {db} from "../mock/db.mock"
import {UserRepositoriesType} from "../types/repositories-types/users-repo-types"

export const usersRepo: UserRepositoriesType = {
    findByName(name: string|undefined): UsersType[] {
        let foundUsers: UsersType[] = db.users

        if (name) {
            const queryName: string = name.toLowerCase()
            foundUsers = foundUsers.filter(
                user => user.name.toLowerCase().includes(queryName)
            )
        }

        return foundUsers
    },
    findById(id: number): UsersType | undefined {
        return db.users.find(
            user => user.id === id
        )
    },
    findAll(): Omit<UsersType, 'id'>[] {
        return db.users.map((user: UsersType) => {
            return {
                name: user.name,
                email: user.email,
            }
        })
    },
    createUser(name: string, email: string): UsersType {
        const createdUser: UsersType =  {
            id: +new Date(),
            name: name.trim(),
            email: email.trim(),
        }

        db.users.push(createdUser)
        return createdUser
    },
    updateUser(id: number, name: string, email?: string): boolean {
        const foundUser: UsersType | undefined = this.findById(id)

        if (!foundUser) {
            return false
        }

        foundUser.name = name.trim()
        return true
    },
    deleteUserById(id: number): boolean {
        for (let i = 0; i < db.users.length; i++) {
            if (db.users[i].id === id) {
                db.users.splice(i, 1)
                return true
            }
        }

        return false
    },
    dropAllUsers(): void {
        db.users = []
    }
}