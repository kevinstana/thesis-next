'use server'

import { redirect } from "next/navigation"

export async function test() {

    console.log(111111)
    redirect('/logout')
}