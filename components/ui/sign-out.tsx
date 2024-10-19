import { signOut } from "@/app/auth";
import { Button } from "./button";

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <Button type="submit">Sign Out</Button>
    </form>
  );
}
