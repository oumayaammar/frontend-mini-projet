import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function CardSmall() {
  return (
    <Card size="sm" className="mx-auto w-full max-w-full">
      <CardHeader>
        <CardTitle>Répartition des groupes</CardTitle>
        <CardDescription>
          (29/03/2026)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          The card component supports a size prop that can be set to
          &quot;sm&quot; for a more compact appearance.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          View details
        </Button>
      </CardFooter>
    </Card>
  )
}
