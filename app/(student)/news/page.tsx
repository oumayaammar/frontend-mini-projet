import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CardSmall } from "../components/newsCard"

export default function NewsPage(){
    return (
        <div className="p-5">
            <header className="mb-8 flex items-center gap-4">
                <Link
                href="/"
                className="flex size-10 items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-secondary"
                >
                <ArrowLeft className="size-5" />
                </Link>
                <div>
                <h1 className="text-2xl font-bold text-foreground lg:text-3xl">News</h1>
                </div>
            </header>
            <div className="p-2 grid grid-cols-1 gap-3">
                <CardSmall/>
                <CardSmall/>
                <CardSmall/>
                <CardSmall/>
                <CardSmall/>
            </div>
        </div>
    )
}