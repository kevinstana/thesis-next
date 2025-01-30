import getSession from "@/lib/getSession"

export default async function ThesesPage() {
    const session = await getSession()

    return (
        <div>
        <p>Hello from theses page</p>
        <p>Your role is: {session?.user?.role}</p>
        </div>
    )
}