import { SignIn } from "@clerk/nextjs";

import { WorkspaceBackdrop } from "@/components/workspace-backdrop";

export default function SignInPage() {
  return (
    <div className="torch-workspace relative isolate flex flex-1 items-center justify-center px-4 py-16">
      <WorkspaceBackdrop />
      <SignIn />
    </div>
  );
}
