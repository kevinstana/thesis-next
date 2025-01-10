import { test } from "./actions";

export default async function Page() {

    const lol = await test()

    return (
        <div>hello</div>
    )
}