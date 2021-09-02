import * as React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { CardStatus } from "./card-status";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CardStatus />
    </QueryClientProvider>
  );
}
