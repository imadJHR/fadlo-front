import CarDetailsClient from "./client-page"

// ✔ Next.js 16 → params is a Promise, must be awaited
export default async function CarDetailsPage(props) {
  const { slug } = await props.params

  // ✔ Pass only the slug to the client component
  //   The client will fetch the car data itself
  return <CarDetailsClient slug={slug} />
}
