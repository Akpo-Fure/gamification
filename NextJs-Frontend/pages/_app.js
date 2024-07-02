import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { SocketProvider } from "@/context/Socket.context";
import { SkeletonTheme } from "react-loading-skeleton";

export default function App({ Component, pageProps }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: true,
            cacheTime: 1000 * 60 * 20,
            staleTime: Infinity,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <SkeletonTheme baseColor={"#E6E6E6"} highlightColor={"#C7C7C7"}>
          <Component {...pageProps} />;
        </SkeletonTheme>
        <ToastContainer />
      </SocketProvider>
    </QueryClientProvider>
  );
}
