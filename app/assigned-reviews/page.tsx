import getSession from "@/lib/getSession"

export default async function AssignedReviewsPage() {
    const session = await getSession()

    return (
        <div>
        <p>Hello from assigned reviews page</p>
        <p>Your role is: {session?.user?.role}</p>
        </div>
    )
}