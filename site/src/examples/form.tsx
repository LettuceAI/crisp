import { Field, Form, FormActions, Input, useForm } from "@lettuceai/crisp";

function Fields() {
  const { values, set, errors } = useForm<{ name: string }>();
  return (
    <Field label="Name" error={errors.name}>
      <Input value={values.name} onChange={(event) => set("name", event.target.value)} />
    </Field>
  );
}

export default function FormExample() {
  return (
    <Form
      initial={{ name: "Ada" }}
      guardUnload={false}
      validate={(values) => (values.name.trim() ? {} : { name: "A name is required." })}
      onSubmit={() => {}}
      className="w-full max-w-sm space-y-4"
    >
      <Fields />
      <FormActions onCancel={() => {}} />
    </Form>
  );
}
