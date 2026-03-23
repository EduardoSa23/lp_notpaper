import { organizationStructuredData } from "@/components/seo/structured-data.data";

export default function StructuredData() {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }} />;
}
