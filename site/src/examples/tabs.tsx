import { useState } from "react";
import { Tab, TabList, TabPanel, Tabs, Text } from "@lettuceai/crisp";

export default function TabsExample() {
  const [value, setValue] = useState("details");
  return (
    <Tabs value={value} onChange={setValue} className="w-full max-w-md">
      <TabList aria-label="Character">
        <Tab value="details">Details</Tab>
        <Tab value="scenes" count={3}>Scenes</Tab>
        <Tab value="memory">Memory</Tab>
      </TabList>
      <TabPanel value="details" className="pt-4"><Text variant="secondary">Name, avatar and description.</Text></TabPanel>
      <TabPanel value="scenes" className="pt-4"><Text variant="secondary">Starting scenes for the chat.</Text></TabPanel>
      <TabPanel value="memory" className="pt-4"><Text variant="secondary">What the character remembers.</Text></TabPanel>
    </Tabs>
  );
}
