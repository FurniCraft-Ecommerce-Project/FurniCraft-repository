'use server'
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const getRole = async () : Promise<string> => {
    const cookieRole = await cookies()
    const userRole = cookieRole.get('Role')?.value || ""
    return userRole
}

export const handleOnClickLogout = async () => {
    (await cookies()).delete('Authorization');
    (await cookies()).delete('Role');
    redirect('/login');
}