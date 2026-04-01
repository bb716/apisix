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
import { Form, Input, InputNumber, Select, Switch } from 'antd';
import type { FormInstance } from 'antd/es/form';
import React, { useState } from 'react';
import { useIntl } from 'umi';

import { RedisClusterForm, RedisForm } from './CommonRedisForm';

type Props = {
  form: FormInstance;
  schema: Record<string, any> | undefined;
  ref?: any;
};

type PolicyProps = 'local' | 'redis' | 'redis-cluster';

export const FORM_ITEM_LAYOUT = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 10,
  },
};

const LimitReq: React.FC<Props> = ({ form, schema }) => {
  const { formatMessage } = useIntl();
  const properties = schema?.properties || {};
  const [policy, setPolicy] = useState<PolicyProps>(properties.policy?.default || 'local');

  const redisSchema = schema?.then;
  const redisClusterSchema = schema?.else?.then;

  return (
    <Form form={form} {...FORM_ITEM_LAYOUT}>
      <Form.Item
        label="rate"
        name="rate"
        rules={[
          {
            required: true,
            message: `${formatMessage({ id: 'component.global.pleaseEnter' })} rate`,
          },
        ]}
        tooltip={formatMessage({ id: 'component.pluginForm.limit-req.rate.tooltip' })}
        validateTrigger={['onChange', 'onBlur', 'onClick']}
      >
        <InputNumber min={properties.rate?.exclusiveMinimum || 0} required />
      </Form.Item>
      <Form.Item
        label="burst"
        name="burst"
        rules={[
          {
            required: true,
            message: `${formatMessage({ id: 'component.global.pleaseEnter' })} burst`,
          },
        ]}
        tooltip={formatMessage({ id: 'component.pluginForm.limit-req.burst.tooltip' })}
        validateTrigger={['onChange', 'onBlur', 'onClick']}
      >
        <InputNumber min={properties.burst?.minimum || 0} required />
      </Form.Item>
      <Form.Item
        label="key_type"
        name="key_type"
        tooltip={formatMessage({ id: 'component.pluginForm.limit-req.key_type.tooltip' })}
        initialValue={properties.key_type?.default || 'var'}
      >
        <Select>
          {(properties.key_type?.enum || []).map((item: string) => {
            return (
              <Select.Option value={item} key={item}>
                {item}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item
        label="key"
        name="key"
        required
        tooltip={formatMessage({ id: 'component.pluginForm.limit-req.key.tooltip' })}
      >
        <Input min={1} />
      </Form.Item>
      <Form.Item
        label="rejected_code"
        name="rejected_code"
        initialValue={properties.rejected_code?.default || 503}
        tooltip={formatMessage({ id: 'component.pluginForm.limit-req.rejected_code.tooltip' })}
      >
        <InputNumber
          min={properties.rejected_code?.minimum || 200}
          max={properties.rejected_code?.maximum || 599}
        />
      </Form.Item>
      <Form.Item
        label="rejected_msg"
        name="rejected_msg"
        tooltip={formatMessage({ id: 'component.pluginForm.limit-req.rejected_msg.tooltip' })}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="nodelay"
        name="nodelay"
        valuePropName="checked"
        initialValue={properties.nodelay?.default || false}
        tooltip={formatMessage({ id: 'component.pluginForm.limit-req.nodelay.tooltip' })}
      >
        <Switch />
      </Form.Item>
      <Form.Item
        label="allow_degradation"
        name="allow_degradation"
        valuePropName="checked"
        initialValue={properties.allow_degradation?.default || false}
        tooltip={formatMessage({ id: 'component.pluginForm.limit-count.allow_degradation.tooltip' })}
      >
        <Switch />
      </Form.Item>
      <Form.Item
        initialValue={policy}
        label="policy"
        name="policy"
        tooltip={formatMessage({ id: 'component.pluginForm.limit-count.policy.tooltip' })}
      >
        <Select
          onChange={(e: PolicyProps) => {
            setPolicy(e);
          }}
        >
          {(properties.policy?.enum || ['local', 'redis', 'redis-cluster']).map((item: string) => (
            <Select.Option value={item} key={item}>
              {item}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {policy === 'redis' && <RedisForm schema={redisSchema} />}
      {policy === 'redis-cluster' && <RedisClusterForm schema={redisClusterSchema} />}
    </Form>
  );
};

export default LimitReq;
