import { Page } from "@/components/layout/Page"

export default async function TransactionDetails({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <Page>
      <h1>TransactionDetails</h1>
      <p>{id}</p>
    </Page>
  )
}
