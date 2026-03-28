// page.tsx
import { Suspense } from "react";
import EditListingPage from "./EditListingPage"; // move your component to a separate file

export default function Page() {
  return (
    <Suspense fallback={null}>
      <EditListingPage />
    </Suspense>
  );
}

