import { CategoryView } from "components/babanuj/category-view";

export const metadata = {
  title: "Search the pantry",
  description: "Browse every brand and line in the Babanuj pantry.",
};

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = (await props.searchParams) ?? {};
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;

  return <CategoryView categoryId="all" searchValue={q} />;
}
