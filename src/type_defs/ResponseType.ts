import { HttpStatus } from "@nestjs/common"

export type ResponseEntity<T> = {
    statusCode: HttpStatus
    message: string
    error?: string
    path: string
    method : 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    timestamp: Date
    data: T
}

export type ResponseListEntity<T> = {
    statusCode: HttpStatus
    message: string
    error?: string
    path: string
    method : 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    timestamp: Date
    data: {
        items: T[]
        total: number
    }
}