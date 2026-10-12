import { ActionBar, Button, Input, Text, Wizard, useWizard } from "@lettuceai/crisp";

const steps = [
  { id: "basics", label: "Basics" },
  { id: "persona", label: "Persona" },
  { id: "review", label: "Review" },
];

const copy = [
  { title: "Name your character", description: "You can change this later." },
  { title: "Describe the persona", description: "A sentence or two is plenty." },
  { title: "Looks good?", description: "Review and create." },
];

export default function WizardExample() {
  const wizard = useWizard(steps);
  return (
    <div className="w-full max-w-lg space-y-4">
      <Wizard steps={steps} index={wizard.index} onStepClick={wizard.goTo} title={copy[wizard.index].title} description={copy[wizard.index].description}>
        {wizard.index === 2 ? <Text variant="secondary">All set.</Text> : <Input aria-label={wizard.step.label} placeholder={wizard.step.label} />}
      </Wizard>
      <ActionBar
        pinned={false}
        onBack={wizard.first ? undefined : wizard.back}
        primary={<Button variant="primary" onClick={wizard.last ? () => wizard.goTo(0) : wizard.next}>{wizard.last ? "Start over" : "Next"}</Button>}
        secondary={wizard.last ? undefined : <Button variant="ghost">Skip</Button>}
      />
    </div>
  );
}
