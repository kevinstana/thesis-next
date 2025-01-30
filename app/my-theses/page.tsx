import getSession from "@/lib/getSession"

export default async function MyThesesPage() {
    const session = await getSession()

    return (
        <div>
        <p>Hello from my theses page</p>
        <p>Your role is: {session?.user?.role}</p>
        </div>
    )
}