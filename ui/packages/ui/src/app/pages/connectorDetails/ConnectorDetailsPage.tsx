import { CONNECTOR_DETAILS_TABS } from '../../constants/constants';
import './ConnectorDetailsPage.css';
import { ConnectorOverview } from './ConnectorOverview';
import { EditConnectorComponent } from './EditConnectorComponent';
// import { IncrementalSnapshot } from './incrementalSnapshot/IncrementalSnapshot';
import { Services } from '@debezium/ui-services';
import {
  Stack,
  StackItem,
  PageSection,
  PageSectionVariants,
  Breadcrumb,
  BreadcrumbItem,
  Level,
  LevelItem,
  TextContent,
  Title,
  TitleSizes,
  Tab,
  TabTitleText,
  Tabs,
} from '@patternfly/react-core';
import { AppLayoutContext } from 'layout';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { fetch_retry } from 'shared';

export const ConnectorDetailsPage = () => {
  const { hash, pathname } = useLocation();
  const history = useHistory();
  const actionConnectorName = pathname.replace(/^\/|\/$/g, '');

  const [activeTabKey, setActiveTabKey] = useState<string | number>(
    getTab(hash)
  );
  const [connectorConfig, setConnectorConfig] = React.useState<
    Map<string, string>
  >(new Map<string, string>());

  /**
   * Toggle currently active tab
   * @param _event
   * @param tabIndex
   */
  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
    history.push(`#${tabIndex}`);
  };

  useEffect(() => {
    setActiveTabKey(getTab(hash));
  }, [hash]);

  const connectorService = Services.getConnectorService();
  const appLayoutContext = React.useContext(AppLayoutContext);
  const clusterID = appLayoutContext.clusterId;

  useEffect(() => {
    fetch_retry(connectorService.getConnectorConfig, connectorService, [
      clusterID,
      actionConnectorName,
    ])
      .then((cConnector) => {
        setConnectorConfig(cConnector);
      })
      .catch((err: Error) => console.error('danger', err?.message));
  }, [clusterID, actionConnectorName]);

  return (
    <Stack>
      <StackItem>
        <PageSection
          variant={PageSectionVariants.light}
          className="connector-details-header"
        >
          <Breadcrumb>
            <BreadcrumbItem to="/">Connectors</BreadcrumbItem>
            <BreadcrumbItem isActive={true}>
              {actionConnectorName}
            </BreadcrumbItem>
          </Breadcrumb>
          <Level hasGutter={true}>
            <LevelItem>
              <TextContent>
                <Title headingLevel="h3" size={TitleSizes['2xl']}>
                  {/* {connectorConfig['connector.id'] && (
                    <ConnectorIcon
                      connectorType={
                        connectorConfig['connector.id'] === 'PostgreSQL'
                          ? ConnectorTypeId.POSTGRES
                          : connectorConfig['connector.id']
                      }
                      alt={actionConnectorName}
                      width={30}
                      height={30}
                    />
                  )}
                  {`            ${actionConnectorName}`} */}
                  {actionConnectorName}
                </Title>
              </TextContent>
            </LevelItem>
          </Level>
        </PageSection>
      </StackItem>
      <StackItem isFilled>
        <PageSection
          variant={PageSectionVariants.light}
          className="connector-details-content"
        >
          <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
            <Tab
              key={CONNECTOR_DETAILS_TABS.Overview}
              eventKey={CONNECTOR_DETAILS_TABS.Overview}
              title={<TabTitleText>Overview</TabTitleText>}
            >
              <ConnectorOverview
                connectorConfiguration={connectorConfig}
                connectorName={actionConnectorName}
              />
            </Tab>
            <Tab
              key={CONNECTOR_DETAILS_TABS.Configuration}
              eventKey={CONNECTOR_DETAILS_TABS.Configuration}
              title={<TabTitleText> Edit connector config</TabTitleText>}
            >
              {actionConnectorName && (
                <EditConnectorComponent
                  actionConnectorName={actionConnectorName}
                  connectorConfiguration={connectorConfig}
                />
              )}
            </Tab>
            {/* <Tab
              key={CONNECTOR_DETAILS_TABS.IncrementalSnapshot}
              eventKey={CONNECTOR_DETAILS_TABS.IncrementalSnapshot}
              title={<TabTitleText>Incremental snapshot</TabTitleText>}
            >
              {actionConnectorName && connectorConfig['connector.id'] && (
                // <IncrementalSnapshot
                //   actionConnectorName={actionConnectorName}
                //   connectorConfig={connectorConfig}
                // />
                <PageSection isFilled={true}>
                  <Card>
                    <CardTitle>Coming soon</CardTitle>
                    <CardBody></CardBody>
                  </Card>
                </PageSection>
              )}
            </Tab> */}
          </Tabs>
        </PageSection>
      </StackItem>
    </Stack>
  );
};

/**
 * Extract the tab name out of the document hash
 * @param hash
 * @returns
 */
const getTab = (hash: string): string => {
  const answer = hash.includes('&')
    ? hash.substring(1, hash.indexOf('&'))
    : hash.substring(1);
  return answer !== '' ? answer : CONNECTOR_DETAILS_TABS.Overview;
};