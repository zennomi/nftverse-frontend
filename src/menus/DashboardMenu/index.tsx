import { Container, Text } from "@react-three/uikit";
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Card } from "../../components/default/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/default/tabs";
import { Label } from "../../components/default/label";
import { Button } from "../../components/default/button";
import OwnedTab from "./OwnedTab";
import OnsaleTab from "./OnsaleTab";

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
                </TabsList>
                <TabsContent value="owned" width="100%">
                    <OwnedTab />
                </TabsContent>
                <TabsContent value="onsale" width="100%">
                    <OnsaleTab />
                </TabsContent>
            </Tabs>
        </Container>
    )
}