import { Button, EmptyState } from "@lettuceai/crisp";
import { useNavigate } from "../router";
import { DocPage } from "./Doc";

export function NotFound() {
  const navigate = useNavigate();
  return (
    <DocPage title="Page not found">
      <EmptyState
        title="There is nothing at this address"
        description="The page may have been renamed. The component index lists everything Crisp exports."
        action={<Button variant="primary" onClick={() => navigate("components")}>Browse components</Button>}
      />
    </DocPage>
  );
}
