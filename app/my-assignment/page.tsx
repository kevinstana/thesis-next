import getSession from "@/lib/getSession"

export default async function MyAssignmentPage() {
    const session = await getSession()

    return (
        <div>
        <p>Hello from my assignment page</p>
        <p>Your role is: {session?.user?.role}</p>
        </div>
    )
}