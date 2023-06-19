import { getSession } from "next-auth/client";
import { useRouter } from "next/router";

export async function protectedRouteMiddleware(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}