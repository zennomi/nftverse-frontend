import { Container, Text } from "@react-three/uikit";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/default/tabs";
import OwnedTab from "./OwnedTab";
import OnsaleTab from "./OnsaleTab";
import OfferTab from "./OfferTab";

export default function DashboardMenu() {

    return (
        <Container>
            <Tabs defaultValue="owned" width={500}>
                <TabsList width="100%">
                    <TabsTrigger flexGrow={1} value="owned">
                        <Text>Owned</Text>
                    </TabsTrigger>
                    <TabsTrigger flexGrow={1} value="onsale">
                        <Text>Onsale</Text>
                    </TabsTrigger>
                    <TabsTrigger flexGrow={1} value="offer">
                        <Text>Offers</Text>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="owned" width="100%">
                    <OwnedTab />
                </TabsContent>
                <TabsContent value="onsale" width="100%">
                    <OnsaleTab />
                </TabsContent>
                <TabsContent value="offer" width="100%">
                    <OfferTab />
                </TabsContent>
            </Tabs>
        </Container>
    )
}