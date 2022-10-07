import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import React, { SyntheticEvent, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Grid, Tab, Image, Header, TabProps } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";

export default observer(function ProfileActivities() {
    const {profileStore} = useStore();
    const {userActivities, loadingActivities, loadUserActivities, profile} = profileStore;

    useEffect(() => {
        loadUserActivities(profile!.username);
    }, [loadUserActivities, profile])

    const panes = [
        {menuItem: 'Future Events', pane: { key: "future" }},
        {menuItem: 'Past Events', pane: { key: "past" }},
        {menuItem: 'Hosting', pane: { key: "hosting" }}
    ];

    function handleTabChange(e: SyntheticEvent, data: TabProps) {
        return (
            loadUserActivities(profile!.username, panes[data.activeIndex as number].pane.key)
        );
    }

    return (
        <Tab.Pane loading={loadingActivities}>
            <Grid>
                <Grid.Column width={16}>
                    <Header 
                        floated='left'
                        icon='calendar'
                        content='Activities'
                    />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Tab
                        menu={{ fluid: true, secondary: true, pointing: true }}
                        menuPosition='left'
                        panes={panes}
                        onTabChange={(e, data) => handleTabChange(e, data)}
                    />
                    <br />
                    <Card.Group itemsPerRow={4}>
                        {userActivities.map(userActivity => (
                            <Card key={userActivity.id} as={Link} to={`/activities/${userActivity.id}`}>
                                <Image
                                    src={`/assets/categoryImages/${userActivity.category}.jpg`}
                                    style={{minHeight: 100, objectFit: 'cover'}}
                                />
                                <Card.Content textAlign="center">
                                    <Card.Header>{userActivity.title}</Card.Header>
                                    <Card.Meta>{format(new Date(userActivity.date!), 'do MMM')}</Card.Meta>
                                    <Card.Meta>{format(new Date(userActivity.date!), 'h:mm aa')}</Card.Meta>
                                </Card.Content>
                            </Card>
                        ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})