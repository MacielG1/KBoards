import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignUp
      appearance={{
        elements: {
          "internal-180wb5": "hidden",
          "cl-internal-180wb59": "hidden",
        },
      }}
    />
  );
}
