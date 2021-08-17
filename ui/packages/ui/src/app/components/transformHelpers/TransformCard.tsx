import {
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  ExpandableSection,
  Form,
  Grid,
  GridItem,
  SelectGroup,
  SelectOption,
  Split,
  SplitItem,
  Title,
  Tooltip
} from '@patternfly/react-core';
import { CheckCircleIcon, GripVerticalIcon, TrashIcon } from '@patternfly/react-icons';
import React from 'react';
import { FormInputField, TypeSelectorComponent, TransformConfig } from 'components';
import './TransformCard.css';
import _ from 'lodash';
import { getFormattedConfig } from 'shared';

export interface ITransformCardProps {
  transformNo: number;
  transformName: string;
  transformType: string;
  transformConfig?: any;
  isTop: boolean;
  isBottom: boolean;
  deleteTransform: (order: number) => void;
  moveTransformOrder: (order: number, position: string) => void;
  updateTransform: (key: number, field: string, value: any) => void;
  transformsData: any;
}

const getOptions = response => {
  const TransformData: any[] = [];
  response.forEach(data => {
    data.transform.includes('io.debezium') ? TransformData.unshift(data) : TransformData.push(data);
  });
  const dbzTransform: JSX.Element[] = [];
  const apacheTransform: JSX.Element[] = [];
  TransformData.forEach((data, index) => {
    data.transform.includes('io.debezium')
      ? dbzTransform.push(<SelectOption key={index} value={`${data.transform}`} isDisabled={!data.enabled} />)
      : apacheTransform.push(<SelectOption key={index} value={`${data.transform}`} isDisabled={!data.enabled} />);
  });

  return [
    <SelectGroup label="Debezium" key="group1">
      {dbzTransform}
    </SelectGroup>,
    <Divider key="divider" />,
    <SelectGroup label="Apache kafka" key="group2">
      {apacheTransform}
    </SelectGroup>
  ];
};

export const TransformCard: React.FunctionComponent<any> = React.forwardRef((props, ref) => {
  const [name, setName] = React.useState<string>('');
  const [type, setType] = React.useState<string>('');

  const [val, setVal] = React.useState([]);

  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const [isExpanded, setIsExpanded] = React.useState<boolean>(true);

  const tooltipRef = React.useRef();

  const onToggle = (isExpandedVal: boolean) => {
    setIsExpanded(isExpandedVal);
  };

  const deleteCard = () => {
    props.deleteTransform(props.transformNo);
  };

  // tslint:disable-next-line: no-shadowed-variable
  const onPositionToggle = isOpenVal => {
    setIsOpen(isOpenVal);
  };
  const onPositionSelect = event => {
    setIsOpen(!isOpen);
    props.moveTransformOrder(props.transformNo, event.currentTarget.id);
    onFocus();
  };
  const onFocus = () => {
    const element = document.getElementById('transform-order-toggle');
    element?.focus();
  };

  const dropdownItems = [
    <DropdownItem key="move_top" component="button" id="top" isDisabled={props.isTop}>
      Move top
    </DropdownItem>,
    <DropdownItem key="move_up" component="button" id="up" isDisabled={props.isTop || (props.isTop && props.isBottom)}>
      Move up
    </DropdownItem>,
    <DropdownItem
      key="move_down"
      component="button"
      id="down"
      isDisabled={(props.isTop && props.isBottom) || props.isBottom}
    >
      Move down
    </DropdownItem>,
    <DropdownItem key="move_bottom" component="button" id="bottom" isDisabled={props.isBottom}>
      Move bottom
    </DropdownItem>
  ];

  React.useEffect(() => {
    props.updateTransform(props.transformNo, 'name', name);
  }, [name]);
  React.useEffect(() => {
    props.updateTransform(props.transformNo, 'type', type);
    type && setVal(getFormattedConfig(props.transformsData, type));
  }, [type]);

  return (
    <Grid>
      <GridItem span={9}>
        <div className={'transform-block pf-u-mt-lg pf-u-p-sm pf-u-pb-lg'} id="transform-parent">
          <Split>
            <SplitItem className={'pf-u-pr-sm'}>
              <Tooltip content={<div>Reorder transform</div>}>
                <Dropdown
                  className={'position_toggle'}
                  onSelect={onPositionSelect}
                  isOpen={isOpen}
                  isPlain={true}
                  dropdownItems={dropdownItems}
                  toggle={
                    <DropdownToggle
                      toggleIndicator={null}
                      onToggle={onPositionToggle}
                      aria-label="Applications"
                      id="transform-order-toggle"
                    >
                      <GripVerticalIcon />
                    </DropdownToggle>
                  }
                />
              </Tooltip>
            </SplitItem>
            <SplitItem isFilled={true}>
              <Title headingLevel="h2">
                Transformation # {props.transformNo} &nbsp;
                {name && type && <CheckCircleIcon style={{ color: '#3E8635' }} />}
                {/* <ExclamationCircleIcon style={{color: '#C9190B'}}/> */}
              </Title>
              <Form>
                <Grid hasGutter={true}>
                  <GridItem span={4}>
                    <FormInputField
                      label="Name"
                      description=""
                      fieldId="transform_name"
                      isRequired={true}
                      name="transform_name"
                      placeholder="Name"
                      inputType="text"
                      value={name}
                      setFieldValue={setName}
                    />
                  </GridItem>

                  <GridItem span={8}>
                    <TypeSelectorComponent
                      label="Type"
                      description=""
                      fieldId="transform_type"
                      isRequired={true}
                      isDisabled={name === ''}
                      options={getOptions(props.transformsData)}
                      value={type}
                      setFieldValue={setType}
                    />
                  </GridItem>
                </Grid>
              </Form>
              {type && (
                <ExpandableSection
                  toggleText={isExpanded ? 'Hide config' : 'Show config'}
                  onToggle={onToggle}
                  isExpanded={isExpanded}
                >
                  <TransformConfig ref={ref} transformConfiguration={val} transformConfig={props.transformConfig} />
                </ExpandableSection>
              )}
            </SplitItem>
            <SplitItem>
              <Tooltip content={<div>Delete transform</div>} reference={tooltipRef} />
              <Button variant="link" icon={<TrashIcon />} onClick={deleteCard} ref={tooltipRef} />
            </SplitItem>
          </Split>
        </div>
      </GridItem>
    </Grid>
  );
});
