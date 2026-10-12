import { Alert, CrispStringsProvider, Pagination, Stack, useCrispStrings } from "@lettuceai/crisp";

function Locale() {
  const { locale } = useCrispStrings();
  return <p className="text-sm text-fg-3">Active locale: {locale}</p>;
}

export default function CrispStringsProviderExample() {
  return (
    <CrispStringsProvider locale="de" strings={{ alertDismiss: "Schließen", paginationPage: (page) => `Seite ${page}` }}>
      <Stack gap={4} className="w-full max-w-md">
        <Locale />
        <Alert title="Gespeichert" description="Der Schließen-Knopf ist übersetzt." onDismiss={() => {}} />
        <Pagination page={2} pageCount={5} onChange={() => {}} />
      </Stack>
    </CrispStringsProvider>
  );
}
