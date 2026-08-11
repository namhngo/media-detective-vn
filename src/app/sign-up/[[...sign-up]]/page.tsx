import { SignUp } from "@clerk/nextjs";

import { WorkspaceBackdrop } from "@/components/workspace-backdrop";

export default function SignUpPage() {
  return (
    <div className="relative isolate flex flex-1 items-center justify-center px-4 py-16">
      <WorkspaceBackdrop />
      <SignUp />
    </div>
  );
}
