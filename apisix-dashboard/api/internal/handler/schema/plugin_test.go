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

package schema

import (
	"encoding/json"
	"os"
	"testing"

	"github.com/shiningrush/droplet"
	"github.com/stretchr/testify/assert"

	"github.com/apisix/manager-api/internal/conf"
)

func init() {
	// Set up environment for test
	if os.Getenv("APISIX_API_WORKDIR") == "" {
		// Get the API root directory by going up from this test file
		os.Setenv("APISIX_API_WORKDIR", "../../../")
	}
}

func TestPlugin(t *testing.T) {
	// Initialize configuration
	conf.InitConf()

	// init
	handler := &Handler{}
	assert.NotNil(t, handler)

	// plugin list(old api, return name only)
	listInput := &ListInput{}
	ctx := droplet.NewContext()
	ctx.SetInput(listInput)
	list, err := handler.Plugins(ctx)
	assert.Nil(t, err)
	assert.Contains(t, list.([]string), "limit-count")

	// plugin list(return all fields of plugin)
	listInput = &ListInput{
		All: true,
	}
	ctx = droplet.NewContext()
	ctx.SetInput(listInput)
	list, err = handler.Plugins(ctx)
	assert.Nil(t, err)
	plugins := list.([]map[string]interface{})
	var authPlugins []string
	var basicAuthConsumerSchema string
	for _, plugin := range plugins {
		if plugin["type"] == "auth" {
			authPlugins = append(authPlugins, plugin["name"].(string))
		}
		if plugin["name"] == "basic-auth" {
			consumerSchemaByte, err := json.Marshal(plugin["consumer_schema"])
			basicAuthConsumerSchema = string(consumerSchemaByte)
			assert.Nil(t, err)
		}
	}
	// plugin type
	assert.ElementsMatch(t, []string{"basic-auth", "jwt-auth", "hmac-auth", "key-auth", "wolf-rbac", "ldap-auth"}, authPlugins)
	// consumer schema
	assert.Equal(t, `{"properties":{"password":{"type":"string"},"username":{"type":"string"}},"required":["password","username"],"title":"work with consumer object","type":"object"}`, basicAuthConsumerSchema)
}
