import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { verifyWithJose } from './helpers/jwt'
import errorHandler from './helpers/errorHandler'
 
export async function middleware(request: NextRequest) {

    try {
        const cookieStore = await cookies()
        const authorization = cookieStore.get('Authorization')

        if (!authorization) throw {status : 401, message : 'Please login first'}

        const [type, token] = authorization.value.split(" ")

        if (type !== 'Bearer') throw {status : 401, message : 'Invalid Token'}

        // to get payload, verify with jose package. because verify using jwt there's error, not support in next
        const payload = await verifyWithJose<{userId:string,email:string}>(token)

        // set payload to headers
        const requestHeaders = new Headers(request.headers)
        requestHeaders.set('x-user-id', payload.userId)
        const response = NextResponse.next({
            request: {
            headers: requestHeaders,
            },
        })

        return response

    } catch (error) {
        return errorHandler(error)
    }

}
 
// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/api/wishlist/:path*',
        '/wishlist/:path*',
        '/api/cart/:path*',
        '/cart/:path*',
        '/api/payment/:path*',
        '/api/order/:path*',
    ],
}