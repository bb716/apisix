/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Row, Switch } from 'antd';
import React from 'react';
import { useIntl } from 'umi';

type FormsProps = {
  schema: Record<string, any> | undefined;
};

const FORM_ITEM_WITHOUT_LABEL = {
  wrapperCol: {
    span: 10,
    offset: 7,
  },
};

const removeBtnStyle = {
  marginLeft: 20,
  display: 'flex',
  alignItems: 'center',
};

export const RedisForm: React.FC<FormsProps> = ({ schema }) => {
  const { formatMessage } = useIntl();
  const properties = (schema?.properties || {}) as any;

  return (
    <>
      <Form.Item
        label="redis_host"
        name="redis_host"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 10 }}
        tooltip={formatMessage({ id: 'component.pluginForm.limit-count.redis_host.tooltip' })}
        rules={[
          {
            required: true,
            message: `${formatMessage({ id: 'component.global.pleaseEnter' })} redis_host`,
          },
          {
            min: properties.redis_host?.minLength || 2,
            message: formatMessage({
              id: 'component.pluginForm.limit-count.atLeast2Characters.rule',
            }),
          },
        ]}
        validateTrigger={['onChange', 'onBlur', 'onClick']}
      >
        <Input />
      </Form.Item>
      <Form.Item
        initialValue={properties.redis_port?.default || 6379}
        label="redis_port"
        name="redis_port"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 10 }}
        tooltip={formatMessage({ id: 'component.pluginForm.limit-count.redis_port.tooltip' })}
      >
        <InputNumber
          min={properties.redis_port?.minimum || 1}
          max={properties.redis_port?.maximum || 65535}
        />
      </Form.Item>
      <Form.Item
        label="redis_username"
        name="redis_username"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 10 }}
        tooltip={formatMessage({ id: 'component.pluginForm.limit-count.redis_username.tooltip' })}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="redis_password"
        name="redis_password"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 10 }}
        tooltip={formatMessage({ id: 'component.pluginForm.limit-count.redis_password.tooltip' })}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        initialValue={properties.redis_database?.default || 0}
        label="redis_database"
        name="redis_database"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 10 }}
        tooltip={formatMessage({ id: 'component.pluginForm.limit-count.redis_database.tooltip' })}
      >
        <InputNumber min={properties.redis_database?.minimum || 0} />
      </Form.Item>
      <Form.Item
        initialValue={properties.redis_timeout?.default || 1000}
        label="redis_timeout"
        name="redis_timeout"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 10 }}
        tooltip={formatMessage({ id: 'component.pluginForm.limit-count.redis_timeout.tooltip' })}
      >
        <InputNumber min={properties.redis_timeout?.minimum || 1} />
      </Form.Item>
      <Form.Item
        label="redis_ssl"
        name="redis_ssl"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 10 }}
        valuePropName="checked"
        initialValue={properties.redis_ssl?.default || false}
        tooltip={formatMessage({ id: 'component.pluginForm.limit-count.redis_ssl.tooltip' })}
      >
        <Switch />
      </Form.Item>
      <Form.Item
        label="redis_ssl_verify"
        name="redis_ssl_verify"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 10 }}
        valuePropName="checked"
        initialValue={properties.redis_ssl_verify?.default || false}
        tooltip={formatMessage({ id: 'component.pluginForm.limit-count.redis_ssl_verify.tooltip' })}
      >
        <Switch />
      </Form.Item>
    </>
  );
};

export const RedisClusterForm: React.FC<FormsProps> = ({ schema }) => {
  const { formatMessage } = useIntl();
  const properties = (schema?.properties || {}) as any;
  const nodesPro = (properties.redis_cluster_nodes || { items: {}, minItems: 1 }) as any;
  const { maxLength, minLength } = nodesPro.items;
  const nodesInit = Array(nodesPro.minItems || 1).fill('');

  return (
    <>
      <Form.Item
        label="redis_cluster_name"
        name="redis_cluster_name"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 10 }}
        validateTrigger={['onChange', 'onBlur', 'onClick']}
        rules={[
          {
            required: true,
            message: `${formatMessage({ id: 'component.global.pleaseEnter' })} redis_cluster_name`,
          },
        ]}
        tooltip={formatMessage({
          id: 'component.pluginForm.limit-count.redis_cluster_name.tooltip',
        })}
      >
        <Input />
      </Form.Item>
      <Form.List name="redis_cluster_nodes" initialValue={nodesInit}>
        {(fields: any[], { add, remove }: { add: any, remove: any }) => (
          <>
            {fields.map((field: any, index: number) => (
              <Form.Item
                key={field.key}
                {...field}
                label={index === 0 ? 'redis_cluster_nodes' : ''}
                labelCol={index === 0 ? { span: 7 } : undefined}
                wrapperCol={index === 0 ? { span: 10 } : { span: 17, offset: 7 }}
                validateTrigger={['onChange', 'onBlur', 'onClick']}
                rules={[
                  {
                    required: true,
                    message: `${formatMessage({
                      id: 'component.global.pleaseEnter',
                    })} redis_cluster_node`,
                  },
                ]}
                tooltip={index === 0 ? formatMessage({
                  id: 'component.pluginForm.limit-count.redis_cluster_nodes.tooltip',
                }) : undefined}
                style={{ marginBottom: 10 }}
              >
                <Row gutter={16}>
                  <Col span={18}>
                    <Input placeholder="127.0.0.1:6379" />
                  </Col>
                  <Col style={removeBtnStyle}>
                    {fields.length > (minLength || 1) && (
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        onClick={() => {
                          remove(field.name);
                        }}
                      />
                    )}
                  </Col>
                </Row>
              </Form.Item>
            ))}
            {fields.length === 0 && (
              <Form.Item
                label="redis_cluster_nodes"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 10 }}
                required
                tooltip={formatMessage({
                  id: 'component.pluginForm.limit-count.redis_cluster_nodes.tooltip',
                })}
              >
                <span style={{ color: '#999' }}>
                  {formatMessage({ id: 'component.global.pleaseAdd' }) || 'Please add at least one node'}
                </span>
              </Form.Item>
            )}
            <Form.Item {...FORM_ITEM_WITHOUT_LABEL}>
              {fields.length < (maxLength || 100) && (
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                >
                  <PlusOutlined /> {formatMessage({ id: 'component.global.add' })}
                </Button>
              )}
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item
        label="redis_password"
        name="redis_password"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 10 }}
        tooltip={formatMessage({ id: 'component.pluginForm.limit-count.redis_password.tooltip' })}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        initialValue={properties.redis_timeout?.default || 1000}
        label="redis_timeout"
        name="redis_timeout"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 10 }}
        tooltip={formatMessage({ id: 'component.pluginForm.limit-count.redis_timeout.tooltip' })}
      >
        <InputNumber min={properties.redis_timeout?.minimum || 1} />
      </Form.Item>
    </>
  );
};
